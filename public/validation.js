const form = document.getElementById("form");
const nameInput = document.getElementById("name-input");

const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const confirmPasswordInput = document.getElementById("confirm-password-input");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let errors = [];

  if (nameInput) {
    errors = getSignupFormErrors(
      nameInput.value,
      emailInput.value,
      passwordInput.value,
      confirmPasswordInput.value,
    );

    if (errors.length === 0) {
      const name =
        nameInput.value.charAt(0).toUpperCase() + nameInput.value.slice(1);
      const saved = await saveUser(name, emailInput.value, passwordInput.value);
      if (saved) {
        alert("Registration successful! Please login.");
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
      const loggedIn = await loginUser(emailInput.value, passwordInput.value);
      if (loggedIn) {
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
    alert(errors.join("\n"));
  }
});

function getSignupFormErrors(name, email, password, confirmPassword) {
  let errors = [];

  [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(
    (input) => {
      input.parentElement.classList.remove("incorrect");
    },
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

async function saveUser(name, email, password) {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (data.success) {
      return true;
    } else {
      alert(data.message);
      return false;
    }
  } catch (error) {
    console.error("Registration error:", error);
    alert("Server error during registration");
    return false;
  }
}

async function loginUser(email, password) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      // Store user info in localStorage
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      return true;
    } else {
      alert(data.message);
      return false;
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Server error during login");
    return false;
  }
}
