const API_PROXY_BASE = '/.netlify/functions/proxy';

async function searchAnime() {
  const query = document.getElementById('search').value.trim();
  if (!query) return alert('Please enter an anime name.');

  try {
    const res = await fetch(`${API_PROXY_BASE}/${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Failed to fetch search results.');

    const data = await res.json();

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (!data || !data.length) {
      resultsDiv.innerHTML = '<p>No results found.</p>';
      return;
    }

    data.forEach(anime => {
      const img = document.createElement('img');
      img.src = anime.image;
      img.alt = anime.title;
      img.title = anime.title;
      img.onclick = () => getAnimeInfo(anime.id);
      resultsDiv.appendChild(img);
    });
  } catch (e) {
    alert('Error fetching data: ' + e.message);
  }
}

async function getAnimeInfo(id) {
  try {
    const res = await fetch(`${API_PROXY_BASE}/info/${id}`);
    if (!res.ok) throw new Error('Failed to fetch anime info.');

    const data = await res.json();

    const episodesDiv = document.getElementById('episodes');
    episodesDiv.innerHTML = `<h2>${data.title}</h2><p>Select episode:</p>`;

    data.episodes.reverse().forEach(ep => {
      const btn = document.createElement('button');
      btn.textContent = `Episode ${ep.number}`;
      btn.onclick = () => playEpisode(ep.id);
      episodesDiv.appendChild(btn);
    });
  } catch (e) {
    alert('Error fetching anime info: ' + e.message);
  }
}

async function playEpisode(epId) {
  try {
    const res = await fetch(`${API_PROXY_BASE}/watch/${epId}`);
    if (!res.ok) throw new Error('Failed to fetch episode streams.');

    const data = await res.json();

    const video = document.getElementById('videoPlayer');
    // Find first mp4 source
    const mp4Source = data.sources.find(s => s.url && s.url.endsWith('.mp4'));
    
    if (mp4Source) {
      video.src = mp4Source.url;
      video.play();
    } else {
      alert('No compatible video source found.');
    }
  } catch (e) {
    alert('Error playing episode: ' + e.message);
  }
}
