document.addEventListener('DOMContentLoaded', initializeSignin);
console.log('Скрипт загружен');

function initializeSignin() {
  const signinForm = document.getElementById('signin-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('error-message');

  // Проверка наличия формы
  if (!signinForm) {
    console.error('Форма входа не найдена');
    return;
  }

  signinForm.addEventListener('submit', handleSignin);

  async function handleSignin(event) {
    console.log('Обработка события входа');
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Проверка заполненности полей
    if (email === '' || password === '') {
      showError('Пожалуйста, заполните все поля.');
      return;
    }

    const formData = createFormData(email, password);

    try {
      // Отправка запроса на авторизацию
      const response = await submitSigninRequest(formData);
      // Если авторизация успешна, продолжаем
      console.log('Успешный вход:', response);
      // Сохраняем email в localStorage
      localStorage.setItem('userEmail', email);
      // Перенаправление только при успешной авторизации
      window.location.href = '/cars';
    } catch (error) {
      // При любой ошибке (сеть, сервер, неверные данные) останавливаем выполнение
      console.error('Ошибка авторизации:', error);
      showError(error.message || 'Ошибка входа. Проверьте данные или сервер.');
      return; // Прерываем выполнение
    }
  }

  function createFormData(email, password) {
    console.log('Создание данных формы');
    // Формат данных для SuperTokens
    return {
      formFields: [
        { id: 'email', value: email },
        { id: 'password', value: password },
      ],
    };
  }

  async function submitSigninRequest(formData) {
    console.log('Отправка данных на сервер');
    const response = await fetch('http://localhost:3000/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      credentials: 'include', // Для отправки cookies (SuperTokens сессии)
    });

    // Парсим тело ответа
    const data = await response.json();

    // Проверяем статус ответа от SuperTokens
    if (!response.ok || data.status !== 'OK') {
      console.error('Ошибка сервера:', data);
      // Обрабатываем WRONG_CREDENTIALS_ERROR и другие ошибки
      if (data.status === 'WRONG_CREDENTIALS_ERROR') {
        throw new Error('Неверный email или пароль');
      } else if (data.status === 'FIELD_ERROR') {
        throw new Error(data.formFields?.[0]?.error || 'Ошибка в данных формы');
      } else {
        throw new Error(data.message || 'Ошибка авторизации');
      }
    }

    // Возвращаем данные при успешном ответе
    return data;
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

  // Загрузка сохраненного email
  loadSavedEmail();
}