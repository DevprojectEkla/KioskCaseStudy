
function createAnswerForm(topic, label) {
    const form = document.createElement('form');
    form.className = 'answer-form';
    form.setAttribute('data-topic', topic);
    form.setAttribute('data-label', label);

    const textarea = document.createElement('textarea');
    textarea.className = 'form-control mb-2';
    textarea.placeholder = 'Enter your answer...';

    form.appendChild(textarea);

    return form;
}

function sendAnswer(data) {
    fetch('http://localhost:3000/api/answer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to submit answer');
        }
        return response.json();
    })
    .then(responseData => {
        console.log('Answer submitted successfully:', responseData);
        // Optionally show a success message or update UI
    })
    .catch(error => {
        console.error('Error submitting answer:', error);
        // Handle error scenarios (e.g., show error message)
    });
}

export { createAnswerForm, sendAnswer };

