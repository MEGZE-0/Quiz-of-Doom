// Redirect to exam page if the user is already logged in
if (localStorage.getItem("isLoggedIn") === "true") {
  window.location.href = "exam.html";
}

// Form submission handling
document.querySelector("#signup").addEventListener("submit", function (event) {
  event.preventDefault();

  const password1 = document.querySelector("#password").value;
  const password2 = document.querySelector("#confirmpassword").value;

  if (password1 === password2) {
    const firstname = document.querySelector("#firstname").value;
    const lastname = document.querySelector("#lastname").value;
    const username = firstname + " " + lastname;
    const email = document.querySelector("#email").value;
    const picture = document.querySelector("#profilepicture").files[0];

    // Validate input fields
    if (username && password1 && email && picture) {
      const reader = new FileReader();
      reader.onloadend = function () {
        const profilePicBase64 = reader.result;

        // Save user data in localStorage
        localStorage.setItem("username", username);
        localStorage.setItem("password", password1);
        localStorage.setItem("email", email);
        localStorage.setItem("picture", profilePicBase64);

        alert("Sign up successful! You can now log in.");
        window.location.href = "index.html"; 
      };

      reader.readAsDataURL(picture); 
    } else {
      alert("Please fill out all fields and select a profile picture.");
    }
  } else {
    alert("The two passwords do not match!");
  }
});
