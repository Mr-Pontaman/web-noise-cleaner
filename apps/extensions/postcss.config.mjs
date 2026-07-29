import remToPx from "postcss-rem-to-responsive-pixel";

// このファイルが無いとShadowDOMのfont-sizeがかなり小さくなる
export default {
  plugins: [
    remToPx({
      rootValue: 16,
      propList: ["*"],
      transformUnit: "px",
    }),
  ],
};
