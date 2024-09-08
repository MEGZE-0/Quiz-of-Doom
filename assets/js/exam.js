// Example JavaScript to update the progress bar width
function setProgressBarWidth(percentage) {
  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = percentage + "%";
}

// Simulate progress bar update (e.g., for demonstration purposes)
setTimeout(() => setProgressBarWidth(1), 100);

document.addEventListener("DOMContentLoaded", function () {
  // Check if user is logged in, if not redirect to login page
  if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "index.html";
  }

  // Update username and profile picture from localStorage
  document.querySelector("#username").textContent =
    localStorage.getItem("username") || "Nameless Wonder";
  document.querySelector("#profilePicSmall").src =
    localStorage.getItem("picture") || "default-avatar.png";

  // Logout function with dark humor
  document
    .getElementById("logoutButton")
    .addEventListener("click", function () {
      if (
        confirm(
          "You sure you want to log out? Trust me, it's not much better out there."
        )
      ) {
        localStorage.removeItem("isLoggedIn");
        // localStorage.removeItem('username');
        // localStorage.removeItem('password');
        // localStorage.removeItem('email');
        alert("You have logged out. Back to the cold, harsh reality.");
        window.location.href = "index.html";
      }
    });

  let timerInterval;
  let timeLeft = 30;
  let currentQuestionIndex = 0;
  let bookmarkedQuestions = new Set();
  let selectedAnswers = {};
  let questions;
  function handleTimeOut() {
    // Stop the timer
    stopTimer();

    // Collect all answers and calculate the score
    let score = 0;
    let resultDetails = [];

    questions.forEach((question, index) => {
      const isCorrect = selectedAnswers[index] === question.answer;
      if (isCorrect) score++;
      resultDetails.push({
        question: question.question,
        submittedAnswer: selectedAnswers[index] || "No answer",
        correctAnswer: question.answer,
        isCorrect,
      });
    });

    // Store the result details in localStorage
    localStorage.setItem("resultDetails", JSON.stringify(resultDetails));

    // Prepare the dark humor message
    const difficulties = ["high", "medium", "low"];
    const difficulty =
      difficulties[Math.floor(Math.random() * difficulties.length)];
    const darkHumorMessage = getDarkHumorMessage(difficulty);

    // Notify the user that time is up and redirect
    alert(`Time is up! Your answers have been submitted. ${darkHumorMessage}`);
    window.location.href = `scorepage.html?score=${score}&message=${encodeURIComponent(
      darkHumorMessage
    )}`;
  }
  // Start the quiz timer with dark humor when time is running out
  function startTimer() {
    timerInterval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        handleTimeOut();
      } else if (timeLeft === 60) {
        alert("Only 1 minute left! It’s all downhill from here.");
      } else if (timeLeft === 10) {
        alert("10 seconds remaining... Time to panic!");
      }
      document.getElementById("time-left").textContent = timeLeft--;
    }, 1000);
  }

  function getDarkHumorMessage(difficulty) {
    const quotes = {
      high: [
        "High difficulty? Great, let's see if your self-esteem survives this.",
        "High difficulty level: Because who doesn't love a challenge... or self-loathing?",
        "If you survive this, you might just be a masochist. Good luck!",
        "High difficulty means you'll either conquer it or question your life choices.",
        "This is high difficulty: The universe is testing your resolve... or just enjoying your suffering.",
        "Surviving this might make you question why you ever left your comfort zone.",
        "High difficulty: The universe is giving you a masterclass in perseverance... or despair.",
        "The higher the difficulty, the closer you get to questioning all your life choices.",
      ],
      medium: [
        "Medium difficulty. Not too hard, not too easy – just like life.",
        "Medium level: It’s like the universe is giving you a gentle nudge.",
        "Ah, the medium level. The universe is giving you a participation trophy.",
        "Medium difficulty? Consider it the universe's way of keeping you entertained.",
        "This is medium difficulty: Just enough to keep you on your toes without breaking your spirit.",
        "Medium level: The universe wants to see you sweat but not break.",
        "Not too hard, not too easy – just like your average day of existential dread.",
        "Medium difficulty: The universe's way of balancing your sense of accomplishment and frustration.",
      ],
      low: [
        "Low difficulty? The universe is being generous today.",
        "Low difficulty level: Because sometimes even the universe is in a good mood.",
        "This is the low difficulty? Is the universe trying to make up for something?",
        "Low difficulty: The universe has decided to give you a break. Enjoy it while it lasts.",
        "Low difficulty: The universe is in a benevolent mood, or it’s just messing with you.",
        "A low difficulty question? The universe is clearly in a forgiving mood today.",
        "This level of difficulty is like a pat on the back from the universe.",
        "Low difficulty? The universe is giving you an easy pass. Don’t get used to it.",
      ],
    };

    // Randomly select a quote based on difficulty
    const selectedQuotes = quotes[difficulty] || quotes.low;
    const randomIndex = Math.floor(Math.random() * selectedQuotes.length);
    return selectedQuotes[randomIndex];
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  // Fetch questions and handle the quiz logic
  fetch("questions.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      questions = data.sort(() => 0.5 - Math.random()).slice(0, 10);
      let correctAnswers = questions.reduce((acc, question, index) => {
        acc[index] = question.answer;
        return acc;
      }, {});

      // Show the current question with possible answers
      function showQuestion(index) {
        const question = questions[index];
        document.getElementById("question").textContent = question.question;
        const rowAnswer = document.getElementById("rowAnswer");
        rowAnswer.innerHTML = "";

        question.options.forEach((option) => {
          const optionHtml = `
                        <div class="answer-option">
                            <input type="radio" name="answer" value="${option}" id="option-${index}-${option}"
                            ${
                              selectedAnswers[index] === option ? "checked" : ""
                            }>
                            <label for="option-${index}-${option}">${option}</label>
                        </div>
                    `;
          rowAnswer.innerHTML += optionHtml;
        });

        document.getElementById("currentQuestion").textContent = index + 1;
        document.getElementById("totalNumberOfQuestions").textContent =
          questions.length;
        document.getElementById("alert").style.display = "none";

        // Display dark humor based on question difficulty
        const difficulty = question.difficulty || "low";
        const darkHumorMessage = getDarkHumorMessage(difficulty);
        document.getElementById("darkHumor").textContent = darkHumorMessage;

        // Manage bookmark display
        const bookmarkBtn = document.getElementById("bookmark");
        if (bookmarkedQuestions.has(index)) {
          bookmarkBtn.classList.add("bookmarked");
          bookmarkBtn.textContent = "Unbookmark";
        } else {
          bookmarkBtn.classList.remove("bookmarked");
          bookmarkBtn.textContent = "Bookmark";
        }

        // Update progress bar
        const progress = ((index + 1) / questions.length) * 100;
        document.getElementById("progress-bar").style.width = `${progress}%`;

        document.getElementById("back").disabled = index === 0;
        document.getElementById("next").disabled =
          index === questions.length - 1 && allQuestionsAnswered();
        document.getElementById("submit").style.display =
          currentQuestionIndex === questions.length - 1 &&
          allQuestionsAnswered()
            ? "inline-block"
            : "none";
      }

      function allQuestionsAnswered() {
        return Object.keys(selectedAnswers).length === questions.length;
      }

      function handleNextQuestion() {
        const selectedOption = document.querySelector(
          'input[name="answer"]:checked'
        );

        if (selectedOption) {
          const answer = selectedOption.value;
          selectedAnswers[currentQuestionIndex] = answer;
          bookmarkedQuestions.delete(currentQuestionIndex);
          updateBookmarkedQuestions();
        } else {
          bookmarkedQuestions.add(currentQuestionIndex);
          updateBookmarkedQuestions();
        }

        if (currentQuestionIndex === questions.length - 1) {
          let unansweredBookmark = [...bookmarkedQuestions].find(
            (index) => !selectedAnswers[index]
          );
          if (unansweredBookmark !== undefined) {
            currentQuestionIndex = unansweredBookmark;
            showQuestion(currentQuestionIndex);
          } else if (allQuestionsAnswered()) {
            showResult();
          }
        } else {
          currentQuestionIndex++;
          showQuestion(currentQuestionIndex);
        }
      }

      function handleBackQuestion() {
        if (currentQuestionIndex > 0) {
          currentQuestionIndex--;
          showQuestion(currentQuestionIndex);
        }
      }

      function updateBookmarkedQuestions() {
        const bookmarksContainer = document.getElementById(
          "bookmarks-container"
        );
        bookmarksContainer.innerHTML = "";

        bookmarkedQuestions.forEach((index) => {
          const question = questions[index];
          const bookmarkItem = document.createElement("div");
          bookmarkItem.className = "bookmark-item";
          bookmarkItem.innerHTML = `
                        <span>Q${index + 1}: ${question.question}</span>
                        <button class="remove-bookmark" data-index="${index}">Remove</button>
                    `;
          bookmarksContainer.appendChild(bookmarkItem);
        });

        document.querySelectorAll(".remove-bookmark").forEach((button) => {
          button.addEventListener("click", function () {
            const index = parseInt(this.getAttribute("data-index"));
            bookmarkedQuestions.delete(index);
            updateBookmarkedQuestions();
            if (currentQuestionIndex === index) {
              handleNextQuestion();
            }
          });
        });
      }

      function showResult() {
        // Calculate the score
        let score = 0;
        let resultDetails = [];

        questions.forEach((question, index) => {
          const isCorrect = selectedAnswers[index] === question.answer;
          if (isCorrect) score++;

          resultDetails.push({
            question: question.question,
            submittedAnswer: selectedAnswers[index] || "No answer",
            correctAnswer: question.answer,
            isCorrect,
          });
        });

        // Prepare the dark humor message
        const difficulties = ["high", "medium", "low"];
        const difficulty =
          difficulties[Math.floor(Math.random() * difficulties.length)];
        const darkHumorMessage = getDarkHumorMessage(difficulty);

        // Store the result details in localStorage
        console.log(resultDetails);
        localStorage.setItem("resultDetails", JSON.stringify(resultDetails));

        // Redirect to scorepage.html with score and dark humor message
        const scorePageUrl = `scorepage.html?score=${score}&message=${encodeURIComponent(
          darkHumorMessage
        )}`;
        window.location.href = scorePageUrl;
      }

      function calculateScore() {
        let score = 0;
        questions.forEach((question, index) => {
          if (selectedAnswers[index] === question.answer) {
            score++;
          }
        });

        document.getElementById(
          "score"
        ).textContent = `Your score is ${score} out of ${questions.length}`;
      }

      // Initialize the quiz
      startTimer();
      showQuestion(currentQuestionIndex);

      // Event listeners for navigation buttons
      document
        .getElementById("next")
        .addEventListener("click", handleNextQuestion);
      document
        .getElementById("back")
        .addEventListener("click", handleBackQuestion);

      // Bookmark button event listener
      document
        .getElementById("bookmark")
        .addEventListener("click", function () {
          if (bookmarkedQuestions.has(currentQuestionIndex)) {
            bookmarkedQuestions.delete(currentQuestionIndex);
            this.classList.remove("bookmarked");
            this.textContent = "Bookmark";
          } else {
            bookmarkedQuestions.add(currentQuestionIndex);
            this.classList.add("bookmarked");
            this.textContent = "Unbookmark";
          }
          updateBookmarkedQuestions();
        });

      // Submit button event listener
      document.getElementById("submit").addEventListener("click", showResult);

      // Initial bookmarks display
      updateBookmarkedQuestions();
    })
    .catch((error) => {
      console.error("Error loading questions:", error);
    });
});
