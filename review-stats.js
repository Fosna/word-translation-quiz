document.addEventListener('DOMContentLoaded', () => {
    const statsContainer = document.getElementById('statsContainer');
    const urlParams = new URLSearchParams(window.location.search); // Define urlParams
    const isSpelling = urlParams.get('spelling') === 'true'; // Default to false if not specified

    const statsItemName = isSpelling ? 'spellingStatistics' : 'statistics';
    
    const stats = JSON.parse(localStorage.getItem(statsItemName)) || {};

    // Create table element
    const table = document.createElement('table');
    table.classList.add('stats-table'); // Add class for styling

    // Create table header
    const header = table.createTHead();
    const headerRow = header.insertRow(0);
    const cell1 = headerRow.insertCell(0);
    const cell2 = headerRow.insertCell(1);
    const cell3 = headerRow.insertCell(2);
    cell1.innerHTML = "<b></b>";
    cell2.innerHTML = "<b>✅</b>";
    cell3.innerHTML = "<b>❌</b>";

    // Create table body
    const tbody = table.createTBody();

    const sortedKeys = Object.keys(stats).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    sortedKeys.forEach(key => {
        const stat = stats[key];
        const row = tbody.insertRow();
        const wordCell = row.insertCell(0);
        const correctCell = row.insertCell(1);
        const wrongCell = row.insertCell(2);
        wordCell.textContent = key;
        correctCell.textContent = stat.correct;
        wrongCell.textContent = stat.wrong;
    });

    statsContainer.appendChild(table);
});
