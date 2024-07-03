import { createAnswerForm, sendAnswer } from './answerService.js';

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/api/taxonomy')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('tree-container');
            displayNode(data, container);
        })
        .catch(error => console.error('Error fetching taxonomy:', error));
});



function displayNode(node, container) {
    if (!node) return;

    const div = document.createElement('div');
    div.className = 'node';

    const button = document.createElement('button');
    button.className = 'btn btn-outline-primary btn-sm';
    
    if (node.children && node.children.length > 0) {
        button.onclick = () => toggleNode(div);
        const arrow = document.createElement('i');
        arrow.className = 'fas fa-plus arrow-icon'; // Use Font Awesome plus icon
        button.appendChild(arrow);
    } else {
        button.disabled = true;
        button.innerHTML = '&mdash; '; // Use mdash for leaf nodes without children
    }

    const topicLabel = document.createElement('span');
    topicLabel.className = 'topic-label';
    topicLabel.textContent = node.topic;

    const labelSpan = document.createElement('span');
    labelSpan.textContent = node.label;

    button.appendChild(topicLabel);
    button.appendChild(document.createTextNode(' '));
    button.appendChild(labelSpan);

    div.appendChild(button);
    container.appendChild(div);

    if (node.children && node.children.length > 0) {
        const childContainer = document.createElement('div');
        childContainer.className = 'child-container';
        node.children.forEach(child => {
            displayNode(child, childContainer);
        });
        div.appendChild(childContainer);
    } else {
        const answerForm = createAnswerForm(node.topic, node.label);

        // Create a Bootstrap styled submit button (outlined)
        const submitButton = document.createElement('button');
        submitButton.type = 'button'; // Change to type button since it's not a form submission button anymore
        submitButton.className = 'btn btn-outline-primary'; // Bootstrap classes for styling and alignment
        submitButton.textContent = 'Submit';
        submitButton.addEventListener('click', () => {
            const textarea = answerForm.querySelector('textarea');
            const answer = textarea.value.trim();
            if (answer) {
                const data = {
                    topic: node.topic,
                    label: node.label,
                    answer: answer
                };
                sendPostRequest(data, node.label, div); // Pass 'div' reference to sendPostRequest
                textarea.value = '';
            } else {
                const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-warning mt-3';
        alertDiv.textContent = `Please write an answer before submitting`;
        div.appendChild(alertDiv);
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
            }
        });

        div.appendChild(answerForm);
        div.appendChild(submitButton);
    }
}

function sendPostRequest(data, label, targetDiv) {
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




function toggleNode(nodeElement) {
    const arrow = nodeElement.querySelector('.arrow-icon');
    const childContainer = nodeElement.querySelector('.child-container');

    if (childContainer) {
        childContainer.classList.toggle('show');
    }

    arrow.classList.toggle('fa-plus');
    arrow.classList.toggle('fa-minus');
}

