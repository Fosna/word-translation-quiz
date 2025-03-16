let answers = {};
let statsDocName = 'statistics';
let statistics = {};

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);

  fetch('dictionary.json')
    .then(response => response.json())
    .then(data => {
      const fromLang = urlParams.get('fromLang') || 'eng'; // Default to 'eng' if not specified
      const isSpelling = urlParams.get('spelling') === 'true'; // Default to false if not specified
      statsDocName = isSpelling ? 'spellingStatistics' : 'statistics';
      statistics = JSON.parse(localStorage.getItem(statsDocName)) || {};

      const maybeInvertDictionary = fromLang === 'cro' ? invertDictionary(data.dictionary) : data.dictionary;
      const randomWords = getRandomWords(maybeInvertDictionary, 10);

      const questions = isSpelling ? prepareSpellingQuestions(randomWords) : prepareTranslationQuestions(randomWords, maybeInvertDictionary);

      questions.forEach(({ text, correctAnswer, options }, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.innerHTML = `
          <p>${index + 1}. ${text}</p>
          ${options.map(option => `
        <label class="answer"><input type="radio" name="q${index + 1}" value="${option}" class="mobile-friendly-radio"> ${option}</input></label><br>
          `).join('')}
        `;

        const quizForm = document.getElementById('quizForm');
        quizForm.appendChild(questionDiv); // Append the question div to the form

        answers[`q${index + 1}`] = correctAnswer;
      });

    function prepareTranslationQuestions(words, dictionary) {
      return words.map(text => {
        const correctAnswer = dictionary[text];
        const options = shuffleArray(getOptions(dictionary, correctAnswer));
        return { text, correctAnswer, options };
      });
    }

    function prepareSpellingQuestions(words) {
      return words.map(word => {
        const options = generateSpellingMistakes(word, 4);
        options.push(word);
        const sortedOptions = options.sort((a, b) => a.localeCompare(b));

        return { text: '', correctAnswer: word, options: sortedOptions };
      });
    }
    });
});

function getRandomWords(dictionary, num) {
  const words = Object.keys(dictionary);
  const shuffled = words.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

function getOptions(dictionary, correctAnswer) {
  const allAnswers = Object.values(dictionary);
  const wrongAnswers = allAnswers.filter(answer => answer !== correctAnswer);
  const randomWrongAnswers = shuffleArray(wrongAnswers).slice(0, 3);
  return [correctAnswer, ...randomWrongAnswers];
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Inverts the keys and values of a given dictionary.
 * @param {Object} dictionary - The dictionary to invert.
 * @returns {Object} - The inverted dictionary.
 * @example
 * const dict = { 'hello': 'hola', 'world': 'mundo' };
 * const inverted = invertDictionary(dict);
 * c....e.log(inverted); // { 'hola': 'hello', 'mundo': 'world' }
 */
function invertDictionary(dictionary) {
  const inverted = {};
  for (const [key, value] of Object.entries(dictionary)) {
    inverted[value] = key;
  }
  return inverted;
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
      updateStatistics(value, true);
    } else {
      resultP.textContent = `❌ Wrong (Correct answer ➡️ ${value})`;
      resultP.classList.add('wrong');
      updateStatistics(value, false);
    }

    const stats = statistics[value];
    const statsP = document.createElement('p');
    statsP.textContent = `Statistics: Correct: ${stats.correct}, Incorrect: ${stats.wrong}`;
    statsP.classList.add('stats');

    questionDiv.appendChild(resultP);
    questionDiv.appendChild(statsP);
  }

  const totalQuestions = Object.keys(answers).length;
  const percentage = (score / totalQuestions) * 100;
  resultDiv.textContent = `You scored ${score} out of ${totalQuestions} (${percentage.toFixed(2)}%)`;

  document.getElementById('btn-reload').removeAttribute('hidden');
  document.getElementById('btn-back').removeAttribute('hidden');
  document.getElementById('btn-review-stats').hidden = false;

  localStorage.setItem(statsDocName, JSON.stringify(statistics));
}

function updateStatistics(word, isCorrect) {
  if (!statistics[word]) {
    statistics[word] = { correct: 0, wrong: 0 };
  }
  if (isCorrect) {
    statistics[word].correct++;
  } else {
    statistics[word].wrong++;
  }
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
