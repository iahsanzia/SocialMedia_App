const BASE_URL = "https://jsonplaceholder.typicode.com/";
const postsContainer = document.getElementById("posts-container");
const writePostTrigger = document.getElementById("write-post-trigger");
const modal = document.getElementById("post-modal");
const closeModalBtn = document.querySelector(".close-modal");
const cancelPostBtn = document.getElementById("cancel-post");
const submitPostBtn = document.getElementById("submit-post");
const postTitle = document.getElementById("post-title");
const postBody = document.getElementById("post-body");

const logo = document.getElementById("logo");
logo.addEventListener("click", async () => {
  goToPage("feed");
  //   const response = await fetch(BASE_URL + "posts");
  //   const posts = await response.json();
  //   console.log("Response: ", response);
  //   console.log("posts: ", posts);
});

const rightSideHeader = document.querySelectorAll(".bar-right svg");
rightSideHeader.forEach((svgs) => {
  const svgId = svgs.getAttribute("id").trim();

  svgs.addEventListener("click", (e) => {
    e.preventDefault();

    if (svgId === "home-icon") {
      goToPage("feed");
    } else if (svgId === "users-icon") {
      goToPage("users");
    } else if (svgId === "logout-icon") {
      goToPage("logout");
    }
  });
});

const sidebarLinks = document.querySelectorAll(".sidebar-links a");
sidebarLinks.forEach((link) => {
  const text = link.textContent.trim();

  link.addEventListener("click", (e) => {
    e.preventDefault();
    if (text === "ALBUMS") {
      goToPage("albums");
    } else if (text === "USERS") {
      goToPage("users");
    } else if (text === "POST") {
      openModal();
    } else if (text === "LOGOUT") {
      goToPage("logout");
    }
  });
});

function goToPage(page) {
  if (page === "feed") {
    window.location.href = "feed.html";
  } else if (page === "users") {
    window.location.href = "users.html";
  } else if (page === "albums") {
    window.location.href = "albums.html";
  } else if (page === "logout") {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  }
}

function checkAuth() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "login.html";
    return null;
  }
  const currentUserName = document.getElementById("current-user-name");
  const modalUserName = document.getElementById("modal-user-name");
  if (currentUserName) {
    currentUserName.textContent = currentUser.name;
  }
  if (modalUserName) {
    modalUserName.textContent = currentUser.name;
  }
  return currentUser;
}

async function getPosts() {
  try {
    const [postsResponse, usersResponse] = await Promise.all([
      fetch(BASE_URL + "posts"),
      fetch(BASE_URL + "users"),
    ]);

    const posts = await postsResponse.json();
    const users = await usersResponse.json();

    console.log("Posts fetched:", posts);
    console.log("Users fetched:", users);

    const userLookup = users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    displayPosts(posts.slice(0, 10), userLookup);
  } catch (error) {
    console.error("Error Fetching Posts:", error);
    if (postsContainer) {
      postsContainer.innerHTML = `<p style="color: red; text-align: center;">Failed to Load Posts</p>`;
    }
  }
}

function displayPosts(posts, userLookup) {
  const postsHTML = posts
    .map((post) => {
      const user = userLookup[post.userId] || {
        name: "Unknown User",
        username: "unknown",
      };

      return `
    <div class="post-container">
      <div class="user-profile">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="54px"
          viewBox="0 -960 960 960"
          width="54px"
          fill="#3486eb"
        >
          <path
            d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"
          />
        </svg>
        <div>
          <p class="post-container-paragraph">${user.name}</p>
          <span>@${user.username} • ${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}</span>
        </div>
      </div>
      
      <h3 style="margin: 15px 0; color: #333; font-size: 1.2rem;">${
        post.title
      }</h3>
      
      <p class="post-text">${post.body}</p>
      
      <img 
        src="https://picsum.photos/600/400?random=${post.id}" 
        alt="${post.title}"
        class="post-image"
        loading="lazy"
        onerror="this.style.display='none'"
      />
      
      <div class="post-row">
        <div class="activity-icons">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="44px"
              viewBox="0 -960 960 960"
              width="44px"
              fill="#3486eb"
              style="cursor: pointer;"
              onclick="likePost(event,${post.id})"
            >
              <path
                d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="44px"
              viewBox="0 -960 960 960"
              width="44px"
              fill="#3486eb"
              style="cursor: pointer;"
              onclick="showComments(${post.id})"
            >
              <path
                d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80Zm-80 400q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720L720-240H160Z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="44px"
              viewBox="0 -960 960 960"
              width="44px"
              fill="#3486eb"
              style="cursor: pointer;"
              onclick="sharePost(${post.id})"
            >
              <path d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  `;
    })
    .join("");

  if (writePostTrigger) {
    writePostTrigger.insertAdjacentHTML("afterend", postsHTML);
  }
}

function likePost(event, postId) {
  const heartIcon = event.target.closest("svg");
  const currentFill = heartIcon.getAttribute("fill");
  if (currentFill !== "#ff0000") {
    heartIcon.setAttribute("fill", "#ff0000");
  } else {
    heartIcon.setAttribute("fill", "#3486eb");
  }
}

async function showComments(postId) {
  try {
    const response = await fetch(BASE_URL + `comments?postId=${postId}`);
    const comments = await response.json();

    const commentsList = comments
      .map((comment) => `• ${comment.name} (${comment.email}): ${comment.body}`)
      .join("\n\n");
    alert(
      `Comments for Post ${postId}:\n\n${commentsList.substring(0, 500)}${
        comments.length > 3 ? "\n\n...and more" : ""
      }`
    );
  } catch (error) {
    console.log("Error fetching comments");
  }
}
async function sharePost(postId) {
  const postUrl = `${BASE_URL}posts/${postId}`;
  try {
    await navigator.clipboard.writeText(postUrl);
    alert("Post Link copied to Clipboard");
  } catch (error) {
    alert("Failed to copy Link to the clipboard");
  }
}
function openModal() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    document.getElementById("modal-user-name").textContent = currentUser.name;
  }
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  modal.classList.remove("show");
  document.body.style.overflow = "auto";
  postTitle.value = "";
  postBody.value = "";
}

writePostTrigger.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
cancelPostBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

submitPostBtn.addEventListener("click", async () => {
  const title = postTitle.value.trim();
  const body = postBody.value.trim();

  if (!title || !body) {
    alert("Please Fill in Both Title and Body");
    return;
  }
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Please Login First!");
    return;
  }
  submitPostBtn.disabled = true;
  submitPostBtn.textContent = "Posting...";

  try {
    const response = await fetch(BASE_URL + "posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        body: body,
        userId: 1,
      }),
    });

    const newPost = await response.json();
    console.log("Post created:", newPost);

    const newPostHTML = `
      <div class="post-container" style="animation: fadeIn 0.5s ease;">
        <div class="user-profile">
          <svg xmlns="http://www.w3.org/2000/svg" height="54px" viewBox="0 -960 960 960" width="54px" fill="#3486eb">
            <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/>
          </svg>
          <div>
            <p class="post-container-paragraph">${currentUser.name}</p>
            <span>Just now</span>
          </div>
        </div>
        <h3 style="margin: 15px 0; color: #333; font-size: 1.2rem;">${title}</h3>
        <p class="post-text">${body}</p>
        
        <img 
          src="https://picsum.photos/600/400?random=${Date.now()}" 
          alt="${title}"
          class="post-image"
          loading="lazy"
        />
        
        <div class="post-row">
          <div class="activity-icons">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" height="44px" viewBox="0 -960 960 960" width="44px" fill="#3486eb" style="cursor: pointer;">
                <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" height="44px" viewBox="0 -960 960 960" width="44px" fill="#3486eb" style="cursor: pointer;">
                <path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80Zm-80 400q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720L720-240H160Z"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" height="44px" viewBox="0 -960 960 960" width="44px" fill="#3486eb" style="cursor: pointer;">
                <path d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    `;

    writePostTrigger.insertAdjacentHTML("afterend", newPostHTML);
    closeModal();
    alert("Post created successfully!");
  } catch (error) {
    console.error("Error creating post:", error);
    alert("Failed to create post. Please try again.");
  } finally {
    submitPostBtn.disabled = false;
    submitPostBtn.textContent = "Post";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  getPosts();
});
