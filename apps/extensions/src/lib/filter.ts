const PROCESSED = "data-wnc-processed";

export function hideElement(el: HTMLElement) {
  el.style.setProperty("opacity", "0.01", "important");
  el.style.setProperty("pointer-events", "none", "important");
}

export function resetProcessed(root: Document | HTMLElement = document) {
  const processedEls = root.querySelectorAll<HTMLElement>(`[${PROCESSED}]`);
  processedEls.forEach((el) => {
    el.removeAttribute(PROCESSED);
    el.style.removeProperty("opacity");
    el.style.removeProperty("pointer-events");
  });
}

export function processNode(
  node: Node,
  elementSelectors: readonly string[],
  keywordContainer: string,
  keywords: string[]
) {
  if (!(node instanceof HTMLElement)) return;

  const candidates: HTMLElement[] = [
    node,
    ...node.querySelectorAll<HTMLElement>("*"),
  ];

  for (const el of candidates) {
    if (el.hasAttribute(PROCESSED)) continue;
    el.setAttribute(PROCESSED, "true");

    // -----------------------------
    // 要素フィルター
    // -----------------------------
    if (elementSelectors.length > 0) {
      if (elementSelectors.some((selector) => el.matches(selector))) {
        hideElement(el);
        continue;
      }
    }

    // -----------------------------
    // キーワードフィルター
    // -----------------------------
    if (keywordContainer && el.matches(keywordContainer)) {
      const labels = Array.from(el.querySelectorAll("[aria-label]"))
        .map((x) => x.getAttribute("aria-label"))
        .filter(Boolean);

      const text = `${el.textContent ?? ""} ${labels.join(" ")}`;

      if (keywords.some((k) => text.includes(k))) {
        hideElement(el);
      }
    }
  }
}
