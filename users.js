const BASE_URL = "https://jsonplaceholder.typicode.com";
const usersTbody = document.getElementById("users-tbody");
const todosSection = document.getElementById("todos-section");
const todosTitle = document.getElementById("todos-title");
const todosTbody = document.getElementById("todos-tbody");
const closeTodosBtn = document.getElementById("close-todos");
const todosCompleted = document.getElementById("todos-completed");
const todosPending = document.getElementById("todos-pending");
const todosTotal = document.getElementById("todos-total");

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

let usersData = [];
let todosData = [];

async function fetchData() {
  try {
    const [usersResponse, todosResponse] = await Promise.all([
      fetch(`${BASE_URL}/users`),
      fetch(`${BASE_URL}/todos`),
    ]);

    usersData = await usersResponse.json();
    todosData = await todosResponse.json();

    displayUsers(usersData);
  } catch (error) {
    console.error("Error fetching data:", error);
    usersTbody.innerHTML =
      '<tr><td colspan="9" style="text-align: center; color: red;">Failed to load users</td></tr>';
  }
}

function displayUsers(users) {
  usersTbody.innerHTML = users
    .map(
      (user) => `
    <tr>
      <td>${user.id}</td>
      <td><strong>${user.name}</strong></td>
      <td>@${user.username}</td>
      <td><a href="mailto:${user.email}">${user.email}</a></td>
      <td>${user.phone}</td>
      <td>${user.address.city}</td>
      <td>${user.company.name}</td>
      <td><a href="http://${user.website}" target="_blank">${user.website}</a></td>
      <td>
        <button class="view-todos-btn" onclick="showUserTodos(${user.id}, '${user.name}')">
          View Todos
        </button>
      </td>
    </tr>
  `
    )
    .join("");
}

function showUserTodos(userId, userName) {
  const userTodos = todosData.filter((todo) => todo.userId === userId);

  todosTitle.textContent = `Todos for ${userName}`;

  const completed = userTodos.filter((todo) => todo.completed).length;
  const pending = userTodos.length - completed;

  todosCompleted.textContent = `Completed: ${completed}`;
  todosPending.textContent = `Pending: ${pending}`;
  todosTotal.textContent = `Total: ${userTodos.length}`;

  todosTbody.innerHTML = userTodos
    .map(
      (todo) => `
    <tr class="${todo.completed ? "completed-row" : ""}">
      <td>${todo.id}</td>
      <td>${todo.title}</td>
      <td>
        <span class="status-badge ${todo.completed ? "completed" : "pending"}">
          ${todo.completed ? "✓ Completed" : "⏳ Pending"}
        </span>
      </td>
    </tr>
  `
    )
    .join("");

  todosSection.style.display = "block";
  todosSection.scrollIntoView({ behavior: "smooth" });
}

closeTodosBtn.addEventListener("click", () => {
  todosSection.style.display = "none";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

fetchData();
