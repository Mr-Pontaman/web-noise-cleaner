// 要素を隠す汎用関数
export const applyElementFilter = (
  root: HTMLElement | Document,
  selectors: readonly string[]
) => {
  if (!selectors || selectors.length === 0) return;

  selectors.forEach((selector) => {
    const elements = Array.from(root.querySelectorAll(selector));
    elements.forEach((el) => {
      const target = el as HTMLElement;
      if (target.style.display !== "none") {
        target.style.display = "none";
      }
    });
  });
};

export const applyKeywordFilter = (
  root: HTMLElement | Document,
  containerSelector: string,
  keywords: string[]
) => {
  if (!containerSelector) return;

  const containers = Array.from(root.querySelectorAll(containerSelector));
  containers.forEach((container) => {
    const target = container as HTMLElement;
    if (target.style.display === "none") return;

    const textContent = target.textContent || "";
    // aria-labelも含めてテキスト判定
    const labels = Array.from(target.querySelectorAll("[aria-label]"))
      .map((el) => el.getAttribute("aria-label"))
      .filter(Boolean);

    const combinedText = `${textContent} ${labels.join(" ")}`;

    if (keywords.some((keyword) => combinedText.includes(keyword))) {
      target.style.display = "none";
    }
  });
};
