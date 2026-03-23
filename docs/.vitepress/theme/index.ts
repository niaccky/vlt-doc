import DefaultTheme from "vitepress/theme";
import PreviewImageCard from "./components/PreviewImageCard.vue";

import "./custom.css";

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component("PreviewImageCard", PreviewImageCard);
  },
};
