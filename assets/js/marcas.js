const buttonCarros = document.getElementById('carros');
const buttonCaminhoes = document.getElementById('caminhoes');
const buttonMotos = document.getElementById('motos');
const brandsDivTipos = document.getElementById('brands');

if (buttonCarros && buttonCaminhoes && buttonMotos && brandsDivTipos) {

  buttonCarros.addEventListener('click', () => carregarMarcasPorTipo('car'));
  buttonCaminhoes.addEventListener('click', () => carregarMarcasPorTipo('truck'));
  buttonMotos.addEventListener('click', () => carregarMarcasPorTipo('motorcycle'));

  async function carregarMarcasPorTipo(tipo) {
    brandsDivTipos.innerHTML = '<p>Carregando marcas...</p>';

    try {
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/${tipo}?format=json`
      );

      const data = await response.json();
      brandsDivTipos.innerHTML = '';

      if (!data.Results || data.Results.length === 0) {
        brandsDivTipos.innerHTML = '<p>Nenhuma marca encontrada.</p>';
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
          localStorage.setItem('marcaId', marca.MakeId);
          window.location.href = 'modelos.html';
        });

        brandsDivTipos.appendChild(card);
      });

    } catch (error) {
      console.error(error);
      brandsDivTipos.innerHTML = '<p>Erro ao carregar marcas.</p>';
    }
  }
}