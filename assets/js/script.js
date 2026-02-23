const buttonLoad = document.getElementById('load');
const brandsDivAll = document.getElementById('brands');

if (buttonLoad && brandsDivAll) {

  buttonLoad.addEventListener('click', carregarTodasMarcas);

  async function carregarTodasMarcas() {
    brandsDivAll.innerHTML = '<p>Carregando...</p>';

    try {
      const response = await fetch(
        'https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json'
      );

      const data = await response.json();
      brandsDivAll.innerHTML = '';

      data.Results.slice(0, 30).forEach(marca => {
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
          <h3>${marca.Make_Name}</h3>
          <p>ID: ${marca.Make_ID}</p>
        `;

        brandsDivAll.appendChild(card);
      });

    } catch (error) {
      console.error(error);
      brandsDivAll.innerHTML = '<p>Erro ao carregar dados.</p>';
    }
  }
}