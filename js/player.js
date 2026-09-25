/* ==========================================================================
   ZERU NATION - HTML5 AUDIO PLAYER ENGINE (js/player.js)
   ========================================================================== */

// 1. Track Playlist Data Source
 const playlist = [
  
  {
    id: 1,
    title: "Samehe ili mungu akusamehe",
    artist: "Zeru Nation",
    album: "Samehe ili mungu akusamehe",
    src: "audio/samehe-ili-mungu-akusamehe.mp3", // <-- Path to your MP3 file
    cover: "images/samehe ili mungu.jpeg"
  },
  {
    id: 2,
    title: "Uweponi Mwako",
    artist: "Zeru Nation",
    album: "Uweponi Mwako Live",
    src: "audio/uweponi-mwako.mp3", // <-- Path to your MP3 file
    cover: "images/cover-placeholder.jpg"
  },
  {
    id: 3,
    title: "Sifa Za Yesu Zivume",
    artist: "Zeru Nation",
    album: "Mungu Uliahidi EP",
    src: "audio/sifa-za-yesu-zivume.mp3", // <-- Path to your MP3 file
    cover: "images/cover-placeholder.jpg"
  },

  {
    id: 4,
    title: "Nijapodharauliwa Sitajidharau",
    artist: "Zeru Nation",
    album: "Samehe Sabini",
    src: "audio/nijapodharauliwa-sitajidharau.mp3",
    cover: "images/cover-placeholder.jpg"
  }
];
// 2. Global Player State Variables
let currentTrackIndex = 0;
let isPlaying = false;
let isMuted = false;
const audio = new Audio(); // HTML5 Audio Instance

// 3. DOM Element References
let playPauseBtn, prevBtn, nextBtn, volumeSlider, volumeIcon;
let trackTitle, trackArtist, cdIcon, trackTimeCurrent, trackTimeDuration, trackProgressBar;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI Element Selectors
  playPauseBtn = document.getElementById('main-play-btn');
  prevBtn = document.getElementById('prev-btn');
  nextBtn = document.getElementById('next-btn');
  volumeSlider = document.querySelector('.volume-slider');
  volumeIcon = document.getElementById('volume-icon');
  
  trackTitle = document.getElementById('current-title');
  trackArtist = document.getElementById('current-artist');
  cdIcon = document.querySelector('.spin-animation');
  
  trackTimeCurrent = document.getElementById('track-current-time');
  trackTimeDuration = document.getElementById('track-duration');
  trackProgressBar = document.getElementById('track-progress');

  // Load Initial Track Configuration
  loadTrack(currentTrackIndex);

  // Set Up Player Event Listeners
  if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
  if (prevBtn) prevBtn.addEventListener('click', playPreviousTrack);
  if (nextBtn) nextBtn.addEventListener('click', playNextTrack);
  
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      audio.volume = e.target.value / 100;
      updateVolumeIcon(audio.volume);
    });
  }

  if (volumeIcon) {
    volumeIcon.addEventListener('click', toggleMute);
  }

  if (trackProgressBar) {
    trackProgressBar.addEventListener('input', (e) => {
      if (audio.duration) {
        const seekTime = (e.target.value / 100) * audio.duration;
        audio.currentTime = seekTime;
      }
    });
  }

  // Audio Engine Event Handlers
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('ended', playNextTrack);
  audio.addEventListener('loadedmetadata', () => {
    if (trackTimeDuration) {
      trackTimeDuration.innerText = formatTime(audio.duration);
    }
  });
});

/* ==========================================================================
   PLAYER CORE FUNCTIONS
   ========================================================================== */

// Load track metadata and sound source
function loadTrack(index) {
  currentTrackIndex = index;
  const track = playlist[currentTrackIndex];

  audio.src = track.src;
  
  if (trackTitle) trackTitle.innerText = track.title;
  if (trackArtist) trackArtist.innerText = track.artist;
  
  // Reset progress bar displays
  if (trackProgressBar) trackProgressBar.value = 0;
  if (trackTimeCurrent) trackTimeCurrent.innerText = "0:00";
}

// Toggle Play / Pause state
function togglePlayPause() {
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
}

function playTrack() {
  isPlaying = true;
  audio.play().then(() => {
    updatePlayStateUI(true);
  }).catch(error => {
    console.warn("Audio playback interrupted or file missing: ", error);
  });
}

function pauseTrack() {
  isPlaying = false;
  audio.pause();
  updatePlayStateUI(false);
}

// Specific track selection handler triggered from album/lyrics play buttons
function playSong(songTitle, artistName) {
  const foundIndex = playlist.findIndex(
    t => t.title.toLowerCase().trim() === songTitle.toLowerCase().trim()
  );

  if (foundIndex !== -1) {
    loadTrack(foundIndex);
  } else {
    // Dynamic fallback if song isn't in main playlist array
    if (trackTitle) trackTitle.innerText = songTitle;
    if (trackArtist) trackArtist.innerText = artistName;
  }
  
  playTrack();
}

function playNextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  loadTrack(currentTrackIndex);
  playTrack();
}

function playPreviousTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrackIndex);
  playTrack();
}

/* ==========================================================================
   UI HELPER & FORMATTING FUNCTIONS
   ========================================================================== */

function updatePlayStateUI(playing) {
  if (playPauseBtn) {
    playPauseBtn.innerHTML = playing ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
  }
  
  if (cdIcon) {
    if (playing) {
      cdIcon.style.animationPlayState = 'running';
    } else {
      cdIcon.style.animationPlayState = 'paused';
    }
  }
}

function updateProgress() {
  if (!isNaN(audio.duration) && audio.duration > 0) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    
    if (trackProgressBar) {
      trackProgressBar.value = progressPercent;
    }
    if (trackTimeCurrent) {
      trackTimeCurrent.innerText = formatTime(audio.currentTime);
    }
    if (trackTimeDuration) {
      trackTimeDuration.innerText = formatTime(audio.duration);
    }
  }
}

function toggleMute() {
  isMuted = !isMuted;
  audio.muted = isMuted;
  if (volumeIcon) {
    volumeIcon.className = isMuted 
      ? "fa-solid fa-volume-xmark text-danger cursor-pointer" 
      : "fa-solid fa-volume-high text-emerald cursor-pointer";
  }
}

function updateVolumeIcon(vol) {
  if (!volumeIcon) return;
  if (vol === 0) {
    volumeIcon.className = "fa-solid fa-volume-xmark text-muted cursor-pointer";
  } else if (vol < 0.5) {
    volumeIcon.className = "fa-solid fa-volume-low text-emerald cursor-pointer";
  } else {
    volumeIcon.className = "fa-solid fa-volume-high text-emerald cursor-pointer";
  }
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}