import { readFile } from "node:fs/promises";
import { execFile, spawn } from "node:child_process";
import { createRequire } from "node:module";
import { promisify } from "node:util";

const require = createRequire(import.meta.url);
const ghPages = require("gh-pages");
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

function publishGhPages(basePath, options) {
  return new Promise((resolve, reject) => {
    ghPages.publish(basePath, options, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
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
  console.log("Cleaning gh-pages cache...");
  ghPages.clean();

  console.log("Publishing docs/dist to gh-pages branch...");
  await publishGhPages("docs/dist", {
    branch: "gh-pages",
    dotfiles: true,
    message: "deploy: update GitHub Pages",
    nojekyll: true,
    repo: process.env.GH_PAGES_REPO,
    user: process.env.GH_PAGES_USER,
  });
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
