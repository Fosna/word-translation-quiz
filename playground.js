function generateMistakes() {
    const word = document.getElementById('wordInput').value;
    const mistakes = generateSpellingMistakes(word);
    const mistakesList = document.getElementById('mistakesList');
    mistakesList.innerHTML = '';
    
    // Add the correct spelling to the mistakes array
    mistakes.push(word);
    
    // Shuffle the array to randomize the order
    mistakes.sort(() => Math.random() - 0.5);
    
    mistakes.forEach(mistake => {
        const listItem = document.createElement('li');
        listItem.textContent = mistake;
        mistakesList.appendChild(listItem);
    });
}

// Function to fetch dictionary data
async function fetchDictionary() {
    const response = await fetch('dictionary.json');
    const data = await response.json();
    return data.dictionary;
}

// Modify displayQuickPicks to use fetched dictionary data
async function displayQuickPicks() {
    const dictionary = await fetchDictionary();
    const quickPicks = getRandomWords(dictionary); 
    const quickPicksContainer = document.getElementById('quickPicks');
    quickPicksContainer.innerHTML = '';
    quickPicks.forEach(word => {
        const button = document.createElement('button');
        button.textContent = word;
        button.onclick = () => {
            document.getElementById('wordInput').value = word;
            generateMistakes();
        };
        quickPicksContainer.appendChild(button);
    });
}

// Function to get 5 random words from the dictionary
function getRandomWords(dictionary, count = 5) {
    const words = Object.keys(dictionary);
    const randomWords = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        randomWords.push(words[randomIndex]);
    }
    return randomWords;
}

// Call displayQuickPicks on page load
window.onload = displayQuickPicks;


