document.addEventListener("DOMContentLoaded", () => {
  // Get query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const score = urlParams.get("score");
  const darkHumorMessage = urlParams.get("message");

  // Display the score
  document.getElementById("score").textContent = `Your score is ${score}`;

  // Display dark humor message
  document.getElementById("darkHumorMessage").textContent =
    decodeURIComponent(darkHumorMessage);

  // Retrieve the detailed results from localStorage
  const resultDetails = JSON.parse(localStorage.getItem("resultDetails"));

  // Display the questions, submitted answers, and correct answers
  const resultsList = document.getElementById("resultsList");

  resultDetails.forEach((result, index) => {
    const resultItem = document.createElement("div");
    resultItem.classList.add("result-item");

    resultItem.innerHTML = `
          <h3>Question ${index + 1}</h3>
          <p><strong>Question:</strong> ${result.question}</p>
          <p><strong>Your Answer:</strong> ${result.submittedAnswer}</p>
          <p><strong>Correct Answer:</strong> ${result.correctAnswer}</p>
          <p class="${result.isCorrect ? "correct" : "incorrect"}">${
      result.isCorrect ? "Correct" : "Incorrect"
    }</p>
        `;

    resultsList.appendChild(resultItem);
  });
});
