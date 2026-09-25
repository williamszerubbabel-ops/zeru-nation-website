// Initialize AOS Animations
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 1000,
    once: true,
    easing: 'ease-in-out'
  });
});

// Basic Music Player Interaction
function playSong(title, artist) {
  const currentTitle = document.getElementById('current-title');
  const currentArtist = document.getElementById('current-artist');
  const playBtnIcon = document.querySelector('#main-play-btn i');

  if (currentTitle && currentArtist) {
    currentTitle.textContent = title;
    currentArtist.textContent = artist;
  }

  if (playBtnIcon) {
    playBtnIcon.className = 'fa-solid fa-pause';
  }
}

// Main Play/Pause Toggle
const mainPlayBtn = document.getElementById('main-play-btn');
if (mainPlayBtn) {
  mainPlayBtn.addEventListener('click', function() {
    const icon = this.querySelector('i');
    if (icon.classList.contains('fa-play')) {
      icon.className = 'fa-solid fa-pause';
    } else {
      icon.className = 'fa-solid fa-play';
    }
  });
}