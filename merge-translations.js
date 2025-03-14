function readFile(file, callback) {
    const reader = new FileReader();
    reader.onload = function(event) {
        callback(event.target.result);
    };
    reader.readAsText(file);
}

function generateDictionary() {
    const englishFile = document.getElementById('englishFile').files[0];
    const croatianFile = document.getElementById('croatianFile').files[0];

    if (!englishFile || !croatianFile) {
        alert('Please select both English and Croatian files.');
        return;
    }

    readFile(englishFile, function(englishContent) {
        readFile(croatianFile, function(croatianContent) {
            const englishLines = englishContent.split('\n').map(line => line.trim());
            const croatianLines = croatianContent.split('\n').map(line => line.trim());

            const dictionary = {};
            for (let i = 0; i < englishLines.length; i++) {
                dictionary[englishLines[i]] = croatianLines[i];
            }

            const output = {
                dictionary: dictionary
            };

            document.getElementById('output').textContent = JSON.stringify(output, null, 4);
        });
    });
}

function copyToClipboard() {
    const output = document.getElementById('output').textContent;
    navigator.clipboard.writeText(output).then(function() {
        alert('Copied to clipboard!');
    }, function(err) {
        alert('Failed to copy text: ', err);
    });
}

// Add event listener to the copy button
document.getElementById('copyButton').addEventListener('click', copyToClipboard);