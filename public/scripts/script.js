document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get("id");

  if (!videoId) {
    redirectTo404();
    return;
  }

  try {
    const response = await fetch(`/api/video/${videoId}`);
    const data = await response.json();

    if (data.error) {
      console.error("Error fetching video data:", data.error);
      redirectTo404();
      return;
    }

    const videoPlayer = document.getElementById("videoPlayer");
    videoPlayer.src = data.videoUrl;
    videoPlayer.load();
    videoPlayer.play();

    const chatButton = document.getElementById("chatButton");
    const overlay = document.getElementById("overlay");

    setTimeout(() => {
      chatButton.classList.add("show", "pulse");
    }, 2000);

    chatButton.addEventListener("click", () => {
      overlay.classList.add("show");
      chatButton.classList.add("hidden");
    });

    videoPlayer.addEventListener("ended", () => {
      overlay.classList.add("show");
      chatButton.classList.add("hidden");
    });

    document
      .getElementById("chatOverlayButton")
      .addEventListener("click", () => {
        window.location.href = data.chatLink;
      });

    document
      .getElementById("teamOverlayButton")
      .addEventListener("click", () => {
        window.location.href = data.teamLink;
      });

    document.getElementById("replayButton").addEventListener("click", () => {
      overlay.classList.remove("show");
      videoPlayer.currentTime = 0;
      videoPlayer.play();
      setTimeout(() => {
        chatButton.classList.remove("hidden");
        chatButton.classList.add("show", "pulse");
      }, 2000);
    });
  } catch (error) {
    console.error("Failed to fetch video data:", error);
    redirectTo404();
  }
});

// New: Redirect to dynamic 404 route
function redirectTo404() {
  window.location.href = "/404";
}
