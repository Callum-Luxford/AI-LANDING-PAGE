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
    const playButtonOverlay = document.getElementById("playButtonOverlay");

    videoPlayer.src = data.videoUrl;
    videoPlayer.load();

    // Play video only after user clicks the play button overlay
    playButtonOverlay.addEventListener("click", () => {
      videoPlayer
        .play()
        .then(() => {
          playButtonOverlay.classList.add("hidden");

          // ✅ Show chat button 2 seconds after video starts playing
          setTimeout(() => {
            chatButton.classList.remove("hidden");
            chatButton.classList.add("show", "pulse");
          }, 2000);
        })
        .catch((err) => {
          console.error("Playback failed after user click:", err);
          document.getElementById("errorMessage").style.display = "block";
          document.getElementById("errorMessage").textContent =
            "Video playback failed. Please reload the page.";
        });
    });

    const chatButton = document.getElementById("chatButton");
    const overlay = document.getElementById("overlay");

    // Removed the old setTimeout for showing chatButton here

    chatButton.addEventListener("click", () => {
      overlay.classList.add("show");
      chatButton.classList.add("hidden");
      videoPlayer.pause(); // Pause video
    });

    closeOverlayButton.addEventListener("click", () => {
      overlay.classList.remove("show");
      chatButton.classList.remove("hidden");
      videoPlayer.play(); // Resume video
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
      playButtonOverlay.classList.add("hidden");
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

// Existing: Redirect to dynamic 404 route
function redirectTo404() {
  window.location.href = "/404";
}
