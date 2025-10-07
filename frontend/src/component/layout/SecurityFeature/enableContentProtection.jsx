// src/utils/contentProtection.js
const enableContentProtection = () => {
  // Disable text selection
  const style = document.createElement("style");
  style.id = "no-select-style";
  style.innerHTML = `
    html, body, #root {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
    }
    img, video, canvas { user-select: none !important; }
  `;
  document.head.appendChild(style);

  // Disable right click
  document.addEventListener("contextmenu", (e) => e.preventDefault());

  // Disable common copy/print shortcuts
  document.addEventListener(
    "keydown",
    (e) => {
      // F12
      if (e.keyCode === 123) e.preventDefault();
      // Ctrl+Shift+I / Ctrl+Shift+J
      if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J"))
        e.preventDefault();
      // Ctrl+U view-source
      if (e.ctrlKey && e.key === "u") e.preventDefault();
      // Ctrl+S (save), Ctrl+P (print), Ctrl+C (copy) — be careful with accessibility
      if (e.ctrlKey && (e.key === "s" || e.key === "p")) e.preventDefault();
      // Ctrl+C disabling can be annoying for users — use with caution
      if (e.ctrlKey && e.key === "c") e.preventDefault();
    },
    true
  );

  // Prevent copy via event
  document.addEventListener("copy", (e) => e.preventDefault());
  document.addEventListener("cut", (e) => e.preventDefault());
  document.addEventListener("paste", (e) => e.preventDefault());

  // Prevent drag of images
  document.addEventListener("dragstart", (e) => e.preventDefault());

  // Optional: mute selection via selectstart
  document.addEventListener("selectstart", (e) => e.preventDefault());
};
export default enableContentProtection;
