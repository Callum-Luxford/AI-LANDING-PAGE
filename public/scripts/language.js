document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (!id) {
    alert("Missing video ID.");
    return;
  }

  // Check if a language was already chosen
  // const savedLang = localStorage.getItem("preferredLang");
  // if (savedLang) {
  //   window.location.href = `/index.html?id=${id}&lang=${savedLang}`;
  //   return;
  // }

  // Attach event listeners to all language buttons
  document.querySelectorAll(".language-card").forEach((card) => {
    card.addEventListener("click", () => {
      const lang = card.getAttribute("data-lang");
      localStorage.setItem("preferredLang", lang);
      window.location.href = `/index.html?id=${id}&lang=${lang}`;
    });
  });
});
