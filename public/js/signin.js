document.addEventListener('DOMContentLoaded', initializeSignin);
console.log('в скрипт зашел');
function initializeSignin() {
  const signinForm = document.getElementById('signin-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('error-message');

  if (!signinForm) return;

  signinForm.addEventListener('submit', handleSignin);

  async function handleSignin(event) {
    console.log('Обработка события входа');
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (email === '' || password === '') {
      showError('Пожалуйста, заполните все поля.');
      return;
    }

    const formData = createFormData(email, password);

    try {
      await submitSigninRequest(formData);
    } catch (error) {
      console.error('Ошибка запроса:', error);
      showError('Ошибка соединения с сервером.');
    }
  }

  function createFormData(email, password) {
    console.log('Создание данных формы');
    return {
      formFields: [
        {
          id: 'email',
          value: email,
        },
        {
          id: 'password',
          value: password,
        },
      ],
    };
  }

  async function submitSigninRequest(formData) {
    console.log('Отправка данных формы на сервер');
    const response = await fetch('http://localhost:3000/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      credentials: 'include',
    });

    if (response.ok) {
      console.log(response.body);
      const data = await response.json();
      console.log('Успешный вход:', data);



      // window.location.href = 'cars';
    } else {
      const error = await response.json();
      console.error('Ошибка входа:', error);
      showError('Ошибка входа. Проверьте введенные данные.');
    }
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';


  }

  function loadSavedEmail() {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      emailInput.value = savedEmail;
    }
  }

  loadSavedEmail();
}
