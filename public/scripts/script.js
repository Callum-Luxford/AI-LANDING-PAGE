document.addEventListener("DOMContentLoaded", async () => {
  const videoId = getVideoIdFromURL();
  const lang = new URLSearchParams(window.location.search).get("lang") || "en";

  if (!videoId) {
    redirectTo404();
    return;
  }

  const data = await loadVideoData(videoId);
  if (!data) return;

  applyBranding(data);
  applyTranslations(lang); // Call new function
  initializeVideoPlayer(data);
  handleOverlayEvents(data);
});

function getVideoIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

async function loadVideoData(videoId) {
  try {
    const lang =
      new URLSearchParams(window.location.search).get("lang") || "en";
    const response = await fetch(`/api/video/${videoId}?lang=${lang}`);
    const data = await response.json();

    if (data.error) {
      console.error("Error fetching video data:", data.error);
      redirectTo404();
      return null;
    }

    const videoPlayer = document.getElementById("videoPlayer");
    videoPlayer.src = data.videoUrl;
    videoPlayer.load();

    return data;
  } catch (error) {
    console.error("Failed to fetch video data:", error);
    redirectTo404();
    return null;
  }
}

function initializeVideoPlayer(data) {
  const videoPlayer = document.getElementById("videoPlayer");
  const playButtonOverlay = document.getElementById("playButtonOverlay");
  const chatButton = document.getElementById("chatButton");

  playButtonOverlay.addEventListener("click", () => {
    videoPlayer
      .play()
      .then(() => {
        playButtonOverlay.classList.add("hidden");
        setTimeout(() => {
          requestAnimationFrame(() => {
            chatButton.classList.remove("hidden");
            chatButton.classList.add("show", "pulse");
          });
        }, 2000);
      })
      .catch((err) => {
        console.error("Playback failed after user click:", err);
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.style.display = "block";
        errorMessage.textContent =
          "Video playback failed. Please reload the page.";
      });
  });

  videoPlayer.addEventListener("ended", () => {
    document.getElementById("overlay").classList.add("show");

    // Fix: Ensure it disappears properly
    chatButton.classList.remove("show", "pulse");
    void chatButton.offsetWidth;
    chatButton.classList.add("hidden");
  });
}

function handleOverlayEvents(data) {
  const videoPlayer = document.getElementById("videoPlayer");
  const overlay = document.getElementById("overlay");
  const chatButton = document.getElementById("chatButton");
  const closeOverlayButton = document.getElementById("closeOverlayButton");

  chatButton.addEventListener("click", () => {
    overlay.classList.add("show");

    // Hide chat button
    chatButton.classList.remove("show", "pulse");
    void chatButton.offsetWidth; // force reflow
    chatButton.classList.add("hidden");

    videoPlayer.pause();
  });

  closeOverlayButton.addEventListener("click", () => {
    overlay.classList.remove("show");
    videoPlayer.play();

    // Show chat button again
    chatButton.classList.remove("hidden");
    void chatButton.offsetWidth;
    chatButton.classList.add("show", "pulse");
  });

  const currentLang =
    new URLSearchParams(window.location.search).get("lang") || "en";

  document.getElementById("chatOverlayButton").addEventListener("click", () => {
    window.location.href = `${data.chatLink}?lang=${currentLang}`;
  });

  document.getElementById("teamOverlayButton").addEventListener("click", () => {
    window.location.href = `${data.teamLink}?lang=${currentLang}`;
  });

  document.getElementById("replayButton").addEventListener("click", () => {
    overlay.classList.remove("show");
    videoPlayer.currentTime = 0;
    videoPlayer.play();
    document.getElementById("playButtonOverlay").classList.add("hidden");
    setTimeout(() => {
      chatButton.classList.remove("hidden");
      chatButton.classList.add("show", "pulse");
    }, 2000);
  });
}

function applyBranding(data) {
  const root = document.documentElement;

  const logoElement = document.querySelector(".overlay-logo");
  logoElement.src = data.logo || "/assets/images/logo.png";

  if (data.themeColor) root.style.setProperty("--overlay-clr", data.themeColor);
  if (data.buttonColor)
    root.style.setProperty("--button-clr", data.buttonColor);
  if (data.buttonHoverFontColor)
    root.style.setProperty(
      "--button-hover-font-clr",
      data.buttonHoverFontColor
    );
  if (data.buttonBorderColor)
    root.style.setProperty("--button-border-clr", data.buttonBorderColor);
  if (data.buttonHoverBg)
    root.style.setProperty("--button-hover-bg", data.buttonHoverBg);
  if (data.buttonHoverBorder)
    root.style.setProperty("--button-hover-border", data.buttonHoverBorder);
  if (data.fontPrimaryColor)
    root.style.setProperty("--font-primary-theme", data.fontPrimaryColor);
  if (data.fontSecondaryColor)
    root.style.setProperty("--font-secondary-theme", data.fontSecondaryColor);
  if (data.iconFilter) root.style.setProperty("--icon-clr-1", data.iconFilter);
  if (data.logoSize) root.style.setProperty("--logo-size", data.logoSize);

  // Set favicon with fallback to default
  const faviconUrl = data.favicon || "/assets/icons/onew3rld-favicon.png";

  let faviconLink = document.querySelector("link[rel~='icon']");
  if (!faviconLink) {
    faviconLink = document.createElement("link");
    faviconLink.rel = "icon";
    document.head.appendChild(faviconLink);
  }
  faviconLink.href = faviconUrl;
}

function redirectTo404() {
  window.location.href = "/404";
}

console.log(
  "Font secondary theme:",
  getComputedStyle(document.documentElement).getPropertyValue(
    "--font-secondary-theme"
  )
);

async function applyTranslations(lang = "en") {
  try {
    const response = await fetch("/api/translations");
    const translations = await response.json();
    const t = translations[lang] || translations["en"];

    // Update UI text content
    document.getElementById("chatButtonText").textContent = t.popUpChat;
    document.querySelector(".overlay-text-content h2").textContent = t.title;
    document.querySelector(".overlay-text-content p").textContent = t.subtitle;
    document.getElementById("chatOverlayButton").textContent = t.chat;
    document.getElementById("teamOverlayButton").textContent = t.team;
    document.getElementById("replayButton").textContent = t.replay;
    document.querySelector(".footer-text").textContent = t.footer;
  } catch (err) {
    console.error("Translation load error:", err);
  }
}
