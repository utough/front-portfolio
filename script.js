document.addEventListener("DOMContentLoaded", () => {
  const COLLAPSED_HEIGHT = 150;

  document.querySelectorAll(".open-btn").forEach((btn) => {
    const wrap = btn.closest(".-w-btn-wrap");
    const target = wrap && wrap.previousElementSibling;

    if (!target || !target.classList.contains("collapsible")) return;

    const label = btn.querySelector("span");

    // 150px以下：折りたたまない。何もクラスを付けず、ボタンだけ隠す
    if (target.scrollHeight <= COLLAPSED_HEIGHT) {
      wrap.style.display = "none";
      return;
    }

    // 200px超：ここで初めて折りたたみ状態にする
    target.classList.add("is-collapsed");
    target.style.maxHeight = COLLAPSED_HEIGHT + "px";
    btn.setAttribute("aria-expanded", "false");

    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const isOpen = target.classList.contains("is-open");

      if (!isOpen) {
        target.classList.add("is-open");
        target.classList.remove("is-collapsed");
        target.style.maxHeight = target.scrollHeight + "px";
        target.addEventListener("transitionend", function onEnd() {
          if (target.classList.contains("is-open")) {
            target.style.maxHeight = "none";
          }
          target.removeEventListener("transitionend", onEnd);
        });
      } else {
        target.style.maxHeight = target.scrollHeight + "px";
        target.offsetHeight; // 強制リフロー
        target.classList.remove("is-open");
        target.classList.add("is-collapsed");
        target.style.maxHeight = COLLAPSED_HEIGHT + "px";
      }

      btn.setAttribute("aria-expanded", String(!isOpen));
      btn.classList.toggle("is-active", !isOpen);
      if (label) label.textContent = !isOpen ? "閉じる" : "詳細";
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll(".fade-up");
  if (!targets.length) return;

  // IntersectionObserver非対応なら、そのまま表示
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target); // 一度表示したら監視を止める
      });
    },
    {
      threshold: 0.15, // 要素が15%見えたら発火
      rootMargin: "0px 0px -40px 0px", // 画面下端から少し入ってから発火
    },
  );

  targets.forEach((el) => observer.observe(el));
});

document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll(".typewriter");
  if (!targets.length) return;

  // 要素内のテキストを1文字ずつ <span> に分ける（タグ構造は維持）
  let index;
  const split = (node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        Array.from(child.textContent).forEach((ch) => {
          // 改行・インデントだけの空白は無視
          if (/^\s$/.test(ch) && /\n/.test(child.textContent)) return;
          const s = document.createElement("span");
          s.className = "tw-char";
          s.setAttribute("aria-hidden", "true");
          s.style.setProperty("--i", index++);
          s.textContent = ch;
          frag.appendChild(s);
        });
        child.replaceWith(frag);
      } else if (
        child.nodeType === Node.ELEMENT_NODE &&
        child.tagName !== "BR"
      ) {
        split(child);
      }
    });
  };

  targets.forEach((el) => {
    // 読み上げ用に元の文章を保持
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    index = 0;
    split(el);
  });

  const show = (el) => el.classList.add("is-typing");

  if (!("IntersectionObserver" in window)) {
    targets.forEach(show);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        show(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.3, rootMargin: "0px 0px -40px 0px" },
  );

  targets.forEach((el) => observer.observe(el));
});
