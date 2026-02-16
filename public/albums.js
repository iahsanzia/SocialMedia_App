const BASE_URL = "https://jsonplaceholder.typicode.com";
const imageGrid = document.getElementById("image-grid");

const homeIcon = document.getElementById("home-icon");
const usersIcon = document.getElementById("users-icon");
const logoutIcon = document.getElementById("logout-icon");
const logo = document.getElementById("logo");

homeIcon.addEventListener("click", () => {
  window.location.href = "feed.html";
});

usersIcon.addEventListener("click", () => {
  window.location.href = "users.html";
});

logoutIcon.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
});

logo.addEventListener("click", () => {
  window.location.href = "feed.html";
});

function checkAuth() {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    window.location.href = "login.html";
  }
}

checkAuth();

async function getPhotos() {
  try {
    const response = await fetch(`${BASE_URL}/photos?_limit=50`);
    const photos = await response.json();
    displayPhotos(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    imageGrid.innerHTML =
      '<p style="text-align: center; color: red;">Failed to load photos</p>';
  }
}

function displayPhotos(photos) {
  imageGrid.innerHTML = photos
    .map(
      (photo) => `
    <div class="image-card">
      <img src="https://picsum.photos/600/400?random=${photo.id}" alt="${photo.title}" loading="lazy">
      <div class="image-overlay">
        <p class="image-title">${photo.title}</p>
      </div>
    </div>
  `
    )
    .join("");
}

getPhotos();
