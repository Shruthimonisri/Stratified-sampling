let topics = {};

function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const csv = e.target.result;
        topics = parseCSV(csv);
        populateTopicSelect();
    };

    reader.readAsText(file);
}

function parseCSV(csv) {
    const lines = csv.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',');
    const data = lines.slice(1).map(line => line.split(','));

    const topics = {};

    headers.forEach((header, index) => {
        topics[header] = {
            easy: [],
            medium: [],
            hard: []
        };
        data.forEach(row => {
            const questionNumbers = row[index].split(',').map(num => parseInt(num.trim()));
            if (header === 'Topic') {
                topics[row[index]] = {
                    easy: [],
                    medium: [],
                    hard: []
                };
            } else {
                topics[header][row[0].toLowerCase()].push(...questionNumbers);
            }
        });
    });

    return topics;
}

function populateTopicSelect() {
    const topicSelect = document.getElementById('topicSelect');
    topicSelect.innerHTML = '<option value="">Select a Topic</option>';
    Object.keys(topics).forEach(topic => {
        const option = document.createElement('option');
        option.value = topic;
        option.textContent = topic;
        topicSelect.appendChild(option);
    });
}

function updateQuestions() {
    const topicSelect = document.getElementById('topicSelect');
    const selectedTopic = topicSelect.value;

    if (!selectedTopic) {
        clearQuestions();
        return;
    }

    const easyQuestions = topics[selectedTopic].easy.map(num => `Easy Q${num}`).join(', ');
    const mediumQuestions = topics[selectedTopic].medium.map(num => `Medium Q${num}`).join(', ');
    const hardQuestions = topics[selectedTopic].hard.map(num => `Hard Q${num}`).join(', ');

    document.getElementById('easyQuestions').innerHTML = `<p>Easy: ${easyQuestions}</p>`;
    document.getElementById('mediumQuestions').innerHTML = `<p>Medium: ${mediumQuestions}</p>`;
    document.getElementById('hardQuestions').innerHTML = `<p>Hard: ${hardQuestions}</p>`;
}

function clearQuestions() {
    document.getElementById('easyQuestions').innerHTML = '';
    document.getElementById('mediumQuestions').innerHTML = '';
    document.getElementById('hardQuestions').innerHTML = '';
}

// Initial call to set up the page
populateTopicSelect();
