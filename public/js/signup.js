document.addEventListener('DOMContentLoaded', initializeSignup);

function initializeSignup() {
  const signupForm = document.getElementById('signup-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('error-message');

  if (!signupForm) return;

  signupForm.addEventListener('submit', handleSignup);

  async function handleSignup(event) {
    console.log('Обработка события регистрации');
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (email === '' || password === '') {
      showError('Пожалуйста, заполните все поля.');
      return;
    }

    const formData = createFormData(email, password);

    try {
      await submitSignupRequest(formData);
    } catch (error) {
      console.error('Ошибка запроса:', error);
      showError('Ошибка соединения с сервером.');
    }
  }

  function createFormData(email, password) {
    console.log('Создание данных формы регистрации');
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

  async function submitSignupRequest(formData) {
    console.log('Отправка данных формы на сервер');
    const response = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Успешная регистрация:', data);


      window.location.href = '/login';
    } else {
      const error = await response.json();
      console.error('Ошибка регистрации:', error);
      showError('Ошибка регистрации. Возможно, такой email уже существует.');
    }
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';

  }
}
