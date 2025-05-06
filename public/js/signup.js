document.addEventListener('DOMContentLoaded', () => {
  console.log('Скрипт регистрации загружен');
  // Запускаем инициализацию только на странице регистрации
  if (window.location.pathname.includes('/signup')) {
    initializeSignup();
  } else {
    console.log('Скрипт регистрации не запущен, так как это не страница /signup');
  }
});

function initializeSignup() {
  console.log('Инициализация формы регистрации');
  const signupForm = document.getElementById('signup-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('error-message');

  // Проверка наличия формы и других элементов
  if (!signupForm) {
    console.error('Форма регистрации (#signup-form) не найдена в DOM');
    return;
  }
  if (!emailInput) {
    console.error('Поле email (#email) не найдено в DOM');
    return;
  }
  if (!passwordInput) {
    console.error('Поле password (#password) не найдено в DOM');
    return;
  }
  if (!errorMessage) {
    console.error('Элемент для ошибки (#error-message) не найден в DOM');
    return;
  }

  signupForm.addEventListener('submit', handleSignup);

  async function handleSignup(event) {
    console.log('Обработка события регистрации');
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
      // Отправка запроса на регистрацию
      const response = await submitSignupRequest(formData);
      // Если регистрация успешна, продолжаем
      console.log('Успешная регистрация:', response);
      // Редирект на страницу входа
      window.location.href = '/login';
    } catch (error) {
      // При любой ошибке останавливаем выполнение
      console.error('Ошибка регистрации:', error);
      showError(error.message || 'Ошибка регистрации. Проверьте данные или сервер.');
      return; // Прерываем выполнение
    }
  }

  function createFormData(email, password) {
    console.log('Создание данных формы регистрации');
    // Формат данных для SuperTokens
    return {
      formFields: [
        { id: 'email', value: email },
        { id: 'password', value: password },
      ],
    };
  }

  async function submitSignupRequest(formData) {
    console.log('Отправка данных на сервер:', formData);
    const response = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      credentials: 'include', // Для отправки cookies (SuperTokens сессии)
    });

    // Парсим тело ответа
    const data = await response.json();
    console.log('Ответ сервера:', data); // Для отладки

    // Проверяем статус ответа от SuperTokens
    if (!response.ok || data.status !== 'OK') {
      console.error('Ошибка сервера:', data);
      // Обрабатываем возможные ошибки
      if (data.status === 'EMAIL_ALREADY_EXISTS_ERROR') {
        throw new Error('Этот email уже зарегистрирован');
      } else if (data.status === 'FIELD_ERROR') {
        throw new Error(data.formFields?.[0]?.error || 'Ошибка в данных формы');
      } else {
        throw new Error(data.message || 'Ошибка регистрации');
      }
    }

    // Возвращаем данные при успешном ответе
    return data;
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  }
}