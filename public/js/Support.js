document
  .getElementById('contactForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    const newMessage = {
      name,
      email,
      message,
      file: file ? URL.createObjectURL(file) : null,
    };
    messages.push(newMessage);
    localStorage.setItem('messages', JSON.stringify(messages));

    showToast('Сообщение отправлено!');
    displayMessages();
    this.reset();
  });

function displayMessages() {
  const messages = JSON.parse(localStorage.getItem('messages')) || [];
  const messagesDiv = document.getElementById('messages');
  messagesDiv.innerHTML = '';

  messages.forEach((msg) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `
            <strong>${msg.name} (${msg.email})</strong>
            <p>${msg.message}</p>
            ${msg.file ? `<img src="${msg.file}" alt="Прикрепленное фото" style="max-width: 100%;">` : ''}
        `;
    messagesDiv.appendChild(messageElement);
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.innerText = message;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

window.onload = displayMessages;
