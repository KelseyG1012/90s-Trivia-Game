


// Fetch random episodes from TVmaze API for Friends (ID 431)
async function getRandomEpisodes() {
  const friendsUrl = 'https://api.tvmaze.com/shows/431/episodes';  // Friends
  const seinfeldUrl = 'https://api.tvmaze.com/shows/530/episodes'; // Seinfeld
  const xfilesUrl = 'https://api.tvmaze.com/shows/92/episodes';    // The X-Files

  // Fetch episodes from multiple shows in parallel
  const responses = await Promise.all([
      fetch(friendsUrl),
      fetch(seinfeldUrl),
      fetch(xfilesUrl)
  ]);

  // Parse the responses
  const episodes = await Promise.all(responses.map(response => response.json()));

  // Combine episodes from all shows
  const combinedEpisodes = [...episodes[0], ...episodes[1], ...episodes[2]];

  return combinedEpisodes;
}

async function createTriviaFromAPI() {
  const episodes = await getRandomEpisodes();
  episodes.forEach((episode) => {
      const question = {
          question: `Which show has this episode titled "${episode.name}" that aired on ${episode.airdate}?`,
          options: ["Friends", "Seinfeld", "The X-Files", "Buffy the Vampire Slayer"], // Replace with dynamic options if needed
          correctAnswer: "Friends"
      };
      triviaQuestions.push(question); // Push dynamic questions into triviaQuestions array
  });
}

// Initial static questions
const triviaQuestions = [
  {
      question: "In which year did *Friends* first premiere?",
      options: ["1992", "1994", "1996", "1998"],
      correctAnswer: "1994"
  },
  {
      question: "Which character famously said: 'We were on a break!'?",
      options: ["Chandler", "Ross", "Joey", "Rachel"],
      correctAnswer: "Ross"
  },
  // More static questions can be added here...
];

let currentQuestionIndex = 0;
let score = 0;

function displayQuestion() {
  const currentQuestion = triviaQuestions[currentQuestionIndex];
  document.getElementById('question').textContent = currentQuestion.question;

  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = ''; // Clear previous options

  currentQuestion.options.forEach(option => {
      const button = document.createElement('button');
      button.textContent = option;
      button.onclick = () => checkAnswer(option);
      optionsDiv.appendChild(button);
  });
}

function checkAnswer(selectedAnswer) {
  const currentQuestion = triviaQuestions[currentQuestionIndex];

  if (selectedAnswer === currentQuestion.correctAnswer) {
      alert('Correct!');
      score++;
      document.getElementById('score').textContent = `Score: ${score}`;
  } else {
      alert('Incorrect!');
  }

  document.getElementById('next').style.display = 'block';
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < triviaQuestions.length) {
      displayQuestion();
      document.getElementById('next').style.display = 'none';
  } else {
      alert('Game Over! Your final score is ' + score);
  }
}

document.getElementById('next').onclick = nextQuestion;

// Start the game
async function startGame() {
  await createTriviaFromAPI(); // Wait until API questions are fetched
  displayQuestion();           // Then start displaying questions
}

startGame(); // Start the game after everything is ready