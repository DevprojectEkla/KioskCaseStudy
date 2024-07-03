
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

function sendAnswer(data, label, targetDiv) {
    fetch('http://localhost:3000/api/answer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(responseData => {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success mt-3';
        alertDiv.textContent = `Answer submitted successfully for "${label}"`;
        targetDiv.appendChild(alertDiv);
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);

        console.log('Submit successful:', responseData);
    })
    .catch(error => {
        console.error('Error submitting answer:', error);
    const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-failure mt-3';
        alertDiv.textContent = `Failed to submit answer for "${label}". Please try again.`;
        targetDiv.appendChild(alertDiv);
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);

    });
}

export { createAnswerForm, sendAnswer };

