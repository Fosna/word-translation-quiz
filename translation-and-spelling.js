let tasks = {};

async function generateRandomCroatianWords() {
    const response = await fetch('./dictionary.json');
    const data = await response.json();

    const dictionary = data.dictionary;
    const keys = Object.keys(dictionary);
    const randomKeys = keys.sort(() => 0.5 - Math.random()).slice(0, 10);
    const randomWords = randomKeys.map(key => ({ text: dictionary[key], correctAnswer: key }));
    return randomWords;
}

document.addEventListener("DOMContentLoaded", async function () {
    tasks = await generateRandomCroatianWords();

    const quizForm = document.getElementById("quizForm");
    quizForm.innerHTML = "";
    tasks.forEach((task, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.className = "question";

        const wordP = document.createElement("p");
        wordP.textContent = `${index + 1}. ${task.text}`;

        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.name = task.text;
        inputField.setAttribute('data-correct-answer', task.correctAnswer);

        questionDiv.appendChild(wordP);
        questionDiv.appendChild(inputField);

        quizForm.appendChild(questionDiv);
    });
});

function submitQuiz() {
    let score = 0;
    const form = document.getElementById('quizForm');
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous results

    const inputs = form.getElementsByTagName('input');
    Array.from(inputs).forEach(textInput => {
        const correctAnswer = textInput.getAttribute('data-correct-answer');

        const questionDiv = textInput.parentElement;
        const resultP = document.createElement('p');

        if (textInput && textInput.value === correctAnswer) {
            score++;
            resultP.textContent = `✅ Correct`;
            resultP.classList.add('correct');
        } else {
            resultP.textContent = `❌ Wrong (Correct answer ➡️ ${correctAnswer})`;
            resultP.classList.add('wrong');
        }

        questionDiv.appendChild(resultP);
    });

    const totalQuestions = inputs.length;
    const percentage = (score / totalQuestions) * 100;
    resultDiv.textContent = `You scored ${score} out of ${totalQuestions} (${percentage.toFixed(2)}%)`;

    document.getElementById('btn-reload').removeAttribute('hidden');
    document.getElementById('btn-back').removeAttribute('hidden');
}

