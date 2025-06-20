const API_BASE = "/.netlify/functions/proxy";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");
const episodesDiv = document.getElementById("episodes");
const playerSection = document.getElementById("player-section");
const playerTitle = document.getElementById("playerTitle");
const videoPlayer = document.getElementById("videoPlayer");

searchBtn.addEventListener("click", searchAnime);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchAnime();
});

async function searchAnime() {
  const query = searchInput.value.trim();
  if (!query) {
    alert("Please enter an anime name.");
    return;
  }

  resultsDiv.innerHTML = "Loading...";
  episodesDiv.innerHTML = "";
  playerSection.style.display = "none";
  videoPlayer.pause();
  videoPlayer.src = "";

  try {
    const res = await fetch(`${API_BASE}/search?query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("Failed to fetch search results");

    const data = await res.json();

    if (!data || data.length === 0) {
      resultsDiv.innerHTML = "No results found.";
      return;
    }

    resultsDiv.innerHTML = "";
    data.forEach((anime) => {
      const img = document.createElement("img");
      img.src = anime.image;
      img.alt = anime.title;
      img.title = anime.title;
      img.onclick = () => getAnimeInfo(anime.id);
      resultsDiv.appendChild(img);
    });
  } catch (err) {
    resultsDiv.innerHTML = "Error fetching data.";
    console.error(err);
  }
}

async function getAnimeInfo(id) {
  episodesDiv.innerHTML = "Loading episodes...";
  playerSection.style.display = "none";
  videoPlayer.pause();
  videoPlayer.src = "";

  try {
    const res = await fetch(`${API_BASE}/info/${id}`);
    if (!res.ok) throw new Error("Failed to fetch anime info");

    const data = await res.json();

    episodesDiv.innerHTML = `<h2>${data.title}</h2><p>Select an episode:</p>`;
    if (!data.episodes || data.episodes.length === 0) {
      episodesDiv.innerHTML += "<p>No episodes found.</p>";
      return;
    }

    // Episodes often in order, reverse if needed
    data.episodes.forEach((ep) => {
      const btn = document.createElement("button");
      btn.textContent = `Episode ${ep.number}`;
      btn.onclick = () => playEpisode(ep.id, ep.number);
      episodesDiv.appendChild(btn);
    });
  } catch (err) {
    episodesDiv.innerHTML = "Error fetching episodes.";
    console.error(err);
  }
}

async function playEpisode(epId, epNumber) {
  playerSection.style.display = "block";
  playerTitle.textContent = `Episode ${epNumber}`;
  videoPlayer.pause();
  videoPlayer.src = "";
  videoPlayer.load();

  try {
    const res = await fetch(`${API_BASE}/watch/${epId}`);
    if (!res.ok) throw new Error("Failed to fetch episode stream");

    const data = await res.json();

    if (!data.sources || data.sources.length === 0) {
      alert("No video sources available for this episode.");
      return;
    }

    // Prefer mp4 source if available
    let source = data.sources.find((s) => s.url.endsWith(".mp4")) || data.sources[0];

    videoPlayer.src = source.url;
    videoPlayer.load();
    videoPlayer.play();
  } catch (err) {
    alert("Error loading episode video.");
    console.error(err);
  }
}
