const form = document.getElementById("form");
const nameInput = document.getElementById("name-input");

const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const confirmPasswordInput = document.getElementById("confirm-password-input");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let errors = [];

  if (nameInput) {
    errors = getSignupFormErrors(
      nameInput.value,
      emailInput.value,
      passwordInput.value,
      confirmPasswordInput.value
    );

    if (errors.length === 0) {
      const user = new User(
        nameInput.value.charAt(0).toUpperCase() + nameInput.value.slice(1),
        emailInput.value,
        passwordInput.value
      );
      const saved = saveUser(user);
      if (saved) {
        window.location.href = "login.html";
        return;
      } else {
        errors.push("Email is already registered");
        emailInput.parentElement.classList.add("incorrect");
      }
    }
  } else {
    errors = getLoginFormErrors(emailInput.value, passwordInput.value);

    if (errors.length === 0) {
      if (loginUser(emailInput.value, passwordInput.value)) {
        console.log("Login Successfully");
        window.location.href = "feed.html";
      } else {
        errors.push("Invalid Email or Password");
        emailInput.parentElement.classList.add("incorrect");
        passwordInput.parentElement.classList.add("incorrect");
      }
    }
  }

  if (errors.length > 0) {
    console.log(errors);
  }
});

function getSignupFormErrors(name, email, password, confirmPassword) {
  let errors = [];

  [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(
    (input) => {
      input.parentElement.classList.remove("incorrect");
    }
  );

  if (!name || name.trim().length < 2) {
    errors.push("Full Name is Required (minimum 2 characters)");
    nameInput.parentElement.classList.add("incorrect");
  }

  if (!email || email.trim() === "") {
    errors.push("Email is Required");
    emailInput.parentElement.classList.add("incorrect");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Please enter a valid email address");
    emailInput.parentElement.classList.add("incorrect");
  }

  if (!password || password.length < 8) {
    errors.push("Password should be at least 8 characters");
    passwordInput.parentElement.classList.add("incorrect");
  }

  if (password && confirmPassword && password !== confirmPassword) {
    errors.push("Password and confirm password do not match");
    passwordInput.parentElement.classList.add("incorrect");
    confirmPasswordInput.parentElement.classList.add("incorrect");
  }

  return errors;
}

function getLoginFormErrors(email, password) {
  let errors = [];

  [emailInput, passwordInput].forEach((input) => {
    input.parentElement.classList.remove("incorrect");
  });

  if (!email || email.trim() === "") {
    errors.push("Email is Required");
    emailInput.parentElement.classList.add("incorrect");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Please enter a valid email address");
    emailInput.parentElement.classList.add("incorrect");
  }

  if (!password || password.length < 8) {
    errors.push("Password should be at least 8 characters");
    passwordInput.parentElement.classList.add("incorrect");
  }

  return errors;
}

function saveUser(user) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.some((u) => u.email === user.email)) {
    alert("Email is already registered");
    return false;
  }
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
  //   console.log("Starting fetch...");
  //   try {
  //     const response = await fetch(
  //       "https://jsonplaceholder.typicode.com/todos/1"
  //     );
  //     const json = await response.json();
  //     console.log("Fetched data:", json);
  //   } catch (error) {
  //     console.error("Fetch failed:", error);
  //   }

  return true;
}

function loginUser(email, password) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    return true;
  }
  return false;
}

class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
}
