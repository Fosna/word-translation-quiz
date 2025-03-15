function generateSpellingMistakes(word, numberOfMistakes = 10) {
    const phoneticMistakes = new Set();
    const typographicalMistakes = new Set();
    const doubleLetterMistakes = new Set();
    const prioritizedMistakes = [];

    // Phonetic Mistakes
    const phoneticReplacements = {
        'a': ['e', 'i'],
        'e': ['a', 'i'],
        'i': ['e', 'a'],
        'o': ['u'],
        'u': ['o'],
        'c': ['k', 's'],
        'k': ['c'],
        's': ['c'],
        'g': ['j'],
        'j': ['g']
    };
    for (let i = 0; i < word.length; i++) {
        const char = word[i];
        if (phoneticReplacements[char]) {
            phoneticReplacements[char].forEach(replacement => {
                phoneticMistakes.add(word.slice(0, i) + replacement + word.slice(i + 1));
            });
        }
    }

    // Typographical Errors
    if (word.length > 1) {
        for (let i = 0; i < word.length - 1; i++) {
            // Swap adjacent letters
            typographicalMistakes.add(word.slice(0, i) + word[i + 1] + word[i] + word.slice(i + 2));
        }
        for (let i = 0; i < word.length; i++) {
            // Double a letter
            doubleLetterMistakes.add(word.slice(0, i) + word[i] + word[i] + word.slice(i + 1));
            // Omit a letter
            typographicalMistakes.add(word.slice(0, i) + word.slice(i + 1));
        }
    }

    // Homophones (example list, can be expanded)
    const homophones = {
        'there': 'their',
        'their': 'there',
        'to': 'too',
        'too': 'to',
        'two': 'too',
        'your': 'you\'re',
        'you\'re': 'your'
    };
    if (homophones[word]) {
        prioritizedMistakes.push(homophones[word]);
    }

    // Common Misspellings (example list, can be expanded)
    const commonMisspellings = {
        'accommodate': 'acommodate',
        'definitely': 'definately',
        'separate': 'seperate',
        'occurrence': 'occurence'
    };
    if (commonMisspellings[word]) {
        prioritizedMistakes.push(commonMisspellings[word]);
    }

    // Shuffle phonetic mistakes
    function shuffleArray(array) {
        const newArray = array.slice();
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // Add remaining mistakes based on specified distribution:
    // - 40% double letter mistakes
    // - 40% phonetic replacements
    // - 20% other typographical errors
    const phoneticArray = shuffleArray(Array.from(phoneticMistakes));
    const typographicalArray = shuffleArray(Array.from(typographicalMistakes));
    const doubleLetterArray = shuffleArray(Array.from(doubleLetterMistakes));

    let remainingSlots = numberOfMistakes - prioritizedMistakes.length;
    if (remainingSlots < 0) {
        remainingSlots = 0;
    }
    const doubleLetterSlots = Math.floor(remainingSlots * 0.4);
    const phoneticSlots = Math.floor(remainingSlots * 0.4);
    const otherTypographicalSlots = remainingSlots - doubleLetterSlots - phoneticSlots;

    for (let i = 0; i < doubleLetterSlots && i < doubleLetterArray.length; i++) {
        prioritizedMistakes.push(doubleLetterArray[i]);
    }
    for (let i = 0; i < phoneticSlots && i < phoneticArray.length; i++) {
        prioritizedMistakes.push(phoneticArray[i]);
    }
    for (let i = 0; i < otherTypographicalSlots && i < typographicalArray.length; i++) {
        prioritizedMistakes.push(typographicalArray[i]);
    }

    return prioritizedMistakes.slice(0, numberOfMistakes); // Return only the specified number of mistakes
}
