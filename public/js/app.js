(function() {
  // Подсветка активного пункта меню
  const footerLinks = document.querySelectorAll('.header-links a'); // Все ссылки в подвале
  const currentPage = document.location.pathname.split('/').pop() || "Falcon.html"; // Имя текущей страницы или 'index.html' по умолчанию

  footerLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active'); // Добавляем класс 'active' к текущей странице
    }
  });

  // Отображение времени загрузки страницы
  window.addEventListener('load', () => {
    const loadTime = window.performance.now(); // Время загрузки страницы в миллисекундах
    const footer = document.querySelector('footer');
    const loadTimeInfo = document.createElement('p');
    loadTimeInfo.textContent = `Время загрузки страницы: ${loadTime.toFixed(2)} мс`;
    footer.appendChild(loadTimeInfo);
  });
})();
