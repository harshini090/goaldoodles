let entries = [
    { date: '2024-09-01', sleep: 7, moods: ['energetic', 'focused'], journal: 'Had a productive day!' },
    { date: '2024-09-02', sleep: 6.5, moods: ['tired', 'calm'], journal: 'Feeling a bit tired today.' },
    { date: '2024-09-03', sleep: 8, moods: ['happy', 'energetic'], journal: 'Great day overall!' }
];

const currentDate = new Date();
const dateString = currentDate.toISOString().split('T')[0];

let todayEntry = entries.find(entry => entry.date === dateString);
if (!todayEntry) {
    todayEntry = { date: dateString, sleep: 0, moods: [], journal: '' };
    entries.push(todayEntry);
}

document.getElementById('current-date').textContent = currentDate.toLocaleDateString();

document.getElementById('sleep-hours').addEventListener('input', function(e) {
    todayEntry.sleep = parseFloat(e.target.value) || 0;
    updateSummary();
    updateSleepScore();
});

document.getElementById('mood-checkboxes').addEventListener('change', function(e) {
    if (e.target.type === 'checkbox') {
        if (e.target.checked) {
            todayEntry.moods.push(e.target.value);
        } else {
            const index = todayEntry.moods.indexOf(e.target.value);
            if (index > -1) {
                todayEntry.moods.splice(index, 1);
            }
        }
        updateSummary();
    }
});

document.getElementById('journal-entry').addEventListener('input', function(e) {
    todayEntry.journal = e.target.value;
});

function updateSummary() {
    const totalSleep = entries.reduce((sum, entry) => sum + entry.sleep, 0);
    const avgSleep = totalSleep / entries.length;
    document.getElementById('avg-sleep').textContent = avgSleep.toFixed(1);

    const moodCounts = {};
    entries.forEach(entry => {
        entry.moods.forEach(mood => {
            moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        });
    });

    const moodSummary = document.getElementById('mood-summary');
    moodSummary.innerHTML = '';
    for (const [mood, count] of Object.entries(moodCounts)) {
        moodSummary.innerHTML += `<p>${mood}: ${count} day${count !== 1 ? 's' : ''}</p>`;
    }
}

function updateSleepScore() {
    const sleepScore = Math.min(todayEntry.sleep / 8 * 100, 100);
    const scoreArc = document.getElementById('sleep-score-arc');
    const scoreText = document.getElementById('sleep-score-text');
    
    const angle = sleepScore / 100 * 180;
    const x = 50 + 45 * Math.sin(angle * Math.PI / 180);
    const y = 50 - 45 * Math.cos(angle * Math.PI / 180);
    scoreArc.setAttribute('d', `M50 5 A45 45 0 ${angle > 180 ? 1 : 0} 1 ${x} ${y}`);
    scoreText.textContent = `${Math.round(sleepScore)}%`;
}

updateSummary();
updateSleepScore();

document.getElementById('sleep-hours').value = todayEntry.sleep;
document.getElementById('journal-entry').value = todayEntry.journal;
todayEntry.moods.forEach(mood => {
    const checkbox = document.querySelector(`input[type="checkbox"][value="${mood}"]`);
    if (checkbox) checkbox.checked = true;
});