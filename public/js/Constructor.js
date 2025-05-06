const cars = [
  {
    model: 'Koenigsegg Jesko Attack Odin',
    price: '5 500 000 $',
    engine: '3.8L V8',
    power: '1284 л.с.',
    drive: 'Задний привод',
  },
  {
    model: 'Mercedes-Benz AMG GT Black Series',
    price: '900 000 $',
    engine: '4.0L V8 Biturbo',
    power: '720 л.с.',
    drive: 'Задний привод',
  },
  {
    model: 'Bugatti Chiron Sport',
    price: '4 300 000 $',
    engine: '8.0L W16 Quad Turbo',
    power: '1600 л.с.',
    drive: 'Задний привод',
  },
  {
    model: 'Mercedes-Benz AMG One',
    price: '4 600 000 $',
    engine: '1.6L V6 Turbo Hybrid',
    power: '1000 л.с.',
    drive: 'Задний привод',
  },
  {
    model: 'Lamborghini Revuelto',
    price: '1 400 000 $',
    engine: '6.5L V12 Biturbo',
    power: '1010 л.с.',
    drive: 'Задний привод',
  },
  {
    model: 'McLaren Senna',
    price: '1 200 000 $',
    engine: '4.0L Twin-Turbo V8',
    power: '800 л.с.',
    drive: 'Задний привод',
  },
];

document
  .getElementById('tableForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();

    const maxPrice = parseInt(
      document
        .getElementById('maxPrice')
        .value.replace(/\s/g, '')
        .replace('$', ''),
    );
    const minPower = parseInt(document.getElementById('minPower').value);
    const engineType = document
      .getElementById('engineType')
      .value.toLowerCase();
    const resultTable = document.getElementById('resultTable');
    resultTable.innerHTML = ''; // Очистить предыдущие результаты

    const headerRow = document.createElement('div');
    headerRow.className = 'row-header';
    headerRow.innerHTML =
      '<div>Модель</div><div>Цена</div><div>Тип двигателя</div><div>Мощность</div><div>Привод</div>';
    resultTable.appendChild(headerRow);

    cars.forEach((car) => {
      const carPrice = parseInt(car.price.replace(/\s/g, '').replace('$', ''));
      const carPower = parseInt(car.power.replace(' л.с.', ''));

      if (
        (isNaN(maxPrice) || carPrice <= maxPrice) &&
        (isNaN(minPower) || carPower >= minPower) &&
        (engineType === '' || car.engine.toLowerCase().includes(engineType))
      ) {
        const row = document.createElement('div');
        row.className = 'row';
        row.innerHTML = `<div>${car.model}</div><div>${car.price}</div><div>${car.engine}</div><div>${car.power}</div><div>${car.drive}</div>`;
        resultTable.appendChild(row);
      }
    });

    localStorage.setItem('maxPrice', maxPrice);
    localStorage.setItem('minPower', minPower);
    localStorage.setItem('engineType', engineType);
  });

window.onload = function () {
  const savedMaxPrice = localStorage.getItem('maxPrice');
  const savedMinPower = localStorage.getItem('minPower');
  const savedEngineType = localStorage.getItem('engineType');

  if (savedMaxPrice) {
    document.getElementById('maxPrice').value = savedMaxPrice;
  }
  if (savedMinPower) {
    document.getElementById('minPower').value = savedMinPower;
  }
  if (savedEngineType) {
    document.getElementById('engineType').value = savedEngineType;
  }
};
