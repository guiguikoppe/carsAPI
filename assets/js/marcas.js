const buttonCarros = document.getElementById('carros');
const buttonCaminhoes = document.getElementById('caminhoes');
const buttonMotos = document.getElementById('motos');
const brandsDiv = document.getElementById('brands');

buttonCarros.addEventListener('click', () => carregarMarcas('car'));
buttonCaminhoes.addEventListener('click', () => carregarMarcas('truck'));
buttonMotos.addEventListener('click', () => carregarMarcas('motorcycle'));

async function carregarMarcas(tipo) {
  brandsDiv.innerHTML = '<p>Carregando marcas...</p>';

  try {
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/${tipo}?format=json`
    );

    const data = await response.json();
    brandsDiv.innerHTML = '';

    if (!data.Results || data.Results.length === 0) {
      brandsDiv.innerHTML = '<p>Nenhuma marca encontrada.</p>';
      return;
    }

    data.Results.forEach(marca => {
      const nomeLimpo = marca.MakeName.replace(/^#\d+\s*/, '');

      const card = document.createElement('div');
      card.className = 'card clickable';

      card.innerHTML = `
        <h3>${nomeLimpo}</h3>
        <p>ID: ${marca.MakeId}</p>
      `;

      card.addEventListener('click', () => {
        localStorage.setItem('marcaNome', nomeLimpo);
        window.location.href = 'modelos.html';
      });

      brandsDiv.appendChild(card);
    });

  } catch (error) {
    console.error(error);
    brandsDiv.innerHTML = '<p>Erro ao carregar marcas.</p>';
  }
}
