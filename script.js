let answers = {};

document.addEventListener('DOMContentLoaded', () => {
  fetch('questions.json')
    .then(response => response.json())
    .then(data => {
      const quizForm = document.getElementById('quizForm');
      const randomQuestions = getRandomQuestions(data.questions, 2);
      console.log(randomQuestions);

      randomQuestions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        const shuffledOptions = shuffleArray(question.options);
        questionDiv.innerHTML = `
          <p>${index + 1}. ${question.text}</p>
          ${shuffledOptions.map(option => `
            <label><input type="radio" name="q${index + 1}" value="${option.value}"> ${option.text}</label><br>
          `).join('')}
        `;

        console.log(questionDiv);

        quizForm.appendChild(questionDiv); // Append the question div to the form
        answers[`q${index + 1}`] = question.answer;
      });
    });
});

function getRandomQuestions(questions, num) {
  const shuffled = questions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function submitQuiz() {
  let score = 0;
  const form = document.getElementById('quizForm');
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = ''; // Clear previous results

  for (let [key, value] of Object.entries(answers)) {
    const selected = form.querySelector(`input[name="${key}"]:checked`);
    const questionDiv = form.querySelector(`input[name="${key}"]`).closest('.question');
    const resultP = document.createElement('p');

    if (selected && selected.value === value) {
      score++;
      resultP.textContent = `✅ Correct`;
      resultP.classList.add('correct');
    } else {
      resultP.textContent = `❌ Wrong (➡️ Correct answer: ${value})`;
      resultP.classList.add('wrong');
    }

    questionDiv.appendChild(resultP);
  }

  const totalQuestions = Object.keys(answers).length;
  const percentage = (score / totalQuestions) * 100;
  resultDiv.textContent = `You scored ${score} out of ${totalQuestions} (${percentage.toFixed(2)}%)`;
}

function devTest() {
  const form = document.getElementById('quizForm');
  const firstQuestionKey = Object.keys(answers)[0];
  const secondQuestionKey = Object.keys(answers)[1];

  const correctAnswer = answers[firstQuestionKey];
  const wrongAnswer = form.querySelector(`input[name="${secondQuestionKey}"]:not([value="${answers[secondQuestionKey]}"])`).value;

  form.querySelector(`input[name="${firstQuestionKey}"][value="${correctAnswer}"]`).checked = true;
  form.querySelector(`input[name="${secondQuestionKey}"][value="${wrongAnswer}"]`).checked = true;
}
