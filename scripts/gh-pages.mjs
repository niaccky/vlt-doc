import { readFile } from "node:fs/promises";
import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const packageJsonUrl = new URL("../package.json", import.meta.url);
const packageJson = JSON.parse(await readFile(packageJsonUrl, "utf8"));

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

function normalizeBase(value) {
  if (!value || value === "/") {
    return "/";
  }

  const trimmed = value.replace(/^\/+|\/+$/g, "");
  return `/${trimmed}/`;
}

async function getRepositorySlug() {
  if (process.env.GITHUB_REPOSITORY) {
    return process.env.GITHUB_REPOSITORY;
  }

  try {
    const { stdout } = await execFileAsync("git", ["remote", "get-url", "origin"]);
    const remote = stdout.trim();
    const match = remote.match(/github\.com[:/]([^/]+\/[^/]+?)(?:\.git)?$/);
    return match?.[1];
  } catch {
    return undefined;
  }
}

async function getPagesBase() {
  if (process.env.VITEPRESS_BASE) {
    return normalizeBase(process.env.VITEPRESS_BASE);
  }

  const repositorySlug = await getRepositorySlug();
  const repositoryName =
    repositorySlug?.split("/")[1] || (typeof packageJson.name === "string" ? packageJson.name : "");

  if (!repositoryName || repositoryName.endsWith(".github.io")) {
    return "/";
  }

  return `/${repositoryName}/`;
}

function run(command, args, env = process.env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} exited with code ${code ?? "unknown"}`));
    });
  });
}

async function buildForPages(base) {
  console.log(`Building VitePress site for GitHub Pages with base: ${base}`);
  await run(npmCommand, ["exec", "--", "vitepress", "build", "docs"], {
    ...process.env,
    VITEPRESS_BASE: base,
  });
}

async function deployToGhPages(base) {
  await buildForPages(base);

  const args = [
    "exec",
    "--",
    "gh-pages",
    "-d",
    "docs/dist",
    "-b",
    "gh-pages",
    "--dotfiles",
    "-m",
    "deploy: update GitHub Pages",
  ];

  if (process.env.GH_PAGES_REPO) {
    args.push("-r", process.env.GH_PAGES_REPO);
  }

  if (process.env.GH_PAGES_USER) {
    args.push("-u", process.env.GH_PAGES_USER);
  }

  console.log("Publishing docs/dist to gh-pages branch...");
  await run(npmCommand, args);
}

const action = process.argv[2] ?? "deploy";
const base = await getPagesBase();

if (action === "build") {
  await buildForPages(base);
} else if (action === "deploy") {
  await deployToGhPages(base);
} else {
  console.error("Usage: node scripts/gh-pages.mjs [build|deploy]");
  process.exit(1);
}
