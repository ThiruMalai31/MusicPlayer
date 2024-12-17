const playButton = document.getElementById("play");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const songUpload = document.getElementById("song-upload");
const songList = document.getElementById("song-list");
const favoritesList = document.getElementById("favorites-list");
const playlists = document.getElementById("playlists");
const favoritesBtn = document.getElementById("favorites-btn");
const playlistsBtn = document.getElementById("playlists-btn");
const currentTrack = document.getElementById("current-track");
const createPlaylistBtn = document.getElementById("create-playlist");
const playlistNameInput = document.getElementById("playlist-name");
const playlistList = document.getElementById("playlist-list");

let songs = [];
let favorites = [];
let playlistsData = {};
let currentSongIndex = 0;
let isPlaying = false;
let audio = new Audio();

function renderSongs() {
  songList.innerHTML = "";
  songs.forEach((song, index) => {
    const songCard = document.createElement("div");
    songCard.classList.add("song-card");
    songCard.innerHTML = `
      <span>${song.name}</span>
      <div>
        <button onclick="playSong(${index})">▶️</button>
        <button onclick="toggleFavorite(${index})">${favorites.includes(index) ? "★" : "☆"}</button>
      </div>
    `;
    songList.appendChild(songCard);
  });
}

function renderFavorites() {
  favoritesList.innerHTML = "";
  favorites.forEach((index) => {
    const song = songs[index];
    const songCard = document.createElement("div");
    songCard.classList.add("song-card");
    songCard.innerHTML = `
      <span>${song.name}</span>
      <div>
        <button onclick="playSong(${index})">▶️</button>
        <button onclick="toggleFavorite(${index})">★</button>
      </div>
    `;
    favoritesList.appendChild(songCard);
  });
}

function renderPlaylists() {
  playlistList.innerHTML = "";
  Object.keys(playlistsData).forEach((playlist) => {
    const playlistCard = document.createElement("div");
    playlistCard.classList.add("song-card");
    playlistCard.innerHTML = `
      <span>${playlist}</span>
      <button onclick="viewPlaylist('${playlist}')">View</button>
    `;
    playlistList.appendChild(playlistCard);
  });
}

function playSong(index) {
  currentSongIndex = index;
  audio.src = songs[index].url;
  currentTrack.textContent = songs[index].name;
  audio.play();
  isPlaying = true;
  playButton.textContent = "⏸️";
}

function toggleFavorite(index) {
  if (favorites.includes(index)) {
    favorites = favorites.filter((fav) => fav !== index);
  } else {
    favorites.push(index);
  }
  renderSongs();
  renderFavorites();
}

function togglePlay() {
  if (isPlaying) {
    audio.pause();
    playButton.textContent = "▶️";
  } else {
    audio.play();
    playButton.textContent = "⏸️";
  }
  isPlaying = !isPlaying;
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  playSong(currentSongIndex);
}

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  playSong(currentSongIndex);
}

function viewPlaylist(name) {
  const playlistSongs = playlistsData[name];
  alert(`Playlist: ${name}\nSongs: ${playlistSongs.map((i) => songs[i].name).join(", ")}`);
}

function createPlaylist() {
  const name = playlistNameInput.value.trim();
  if (name && !playlistsData[name]) {
    playlistsData[name] = [];
    renderPlaylists();
    playlistNameInput.value = "";
  }
}

songUpload.addEventListener("change", (event) => {
  const files = Array.from(event.target.files);
  files.forEach((file) => {
    songs.push({ name: file.name, url: URL.createObjectURL(file) });
  });
  renderSongs();
});

playButton.addEventListener("click", togglePlay);
prevButton.addEventListener("click", prevSong);
nextButton.addEventListener("click", nextSong);
favoritesBtn.addEventListener("click", () => {
  favoritesList.classList.toggle("hidden");
});
playlistsBtn.addEventListener("click", () => {
  playlists.classList.toggle("hidden");
});
createPlaylistBtn.addEventListener("click", createPlaylist);

audio.addEventListener("ended", nextSong);
