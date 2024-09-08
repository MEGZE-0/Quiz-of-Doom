if (localStorage.getItem("isLoggedIn") === "true") {
  window.location.href = "exam.html";
}

document
  .querySelector("#login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const enteredUsername = document.querySelector("#username").value;
    const enteredPassword = document.querySelector("#password").value;

    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");
    const storedEmail = localStorage.getItem("email");

    if (
      (enteredUsername === storedUsername || enteredUsername === storedEmail) &&
      enteredPassword === storedPassword
    ) {
      localStorage.setItem("isLoggedIn", "true");
      alert("Login successful!");
      window.location.href = "exam.html";
    } else {
      alert("Invalid username or password.");
    }
  });
