const button = document.getElementById('load');
const brandsDiv = document.getElementById('brands');

if (button) {
  button.addEventListener('click', carregarMarcas);
}

async function carregarMarcas() {
  brandsDiv.innerHTML = '<p>Carregando marcas...</p>';

  try {
    const response = await fetch(
      'https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json'
    );

    const data = await response.json();
    brandsDiv.innerHTML = '';

    data.Results.slice(0, 30).forEach(marca => {
      const card = document.createElement('div');
      card.className = 'card clickable';

      card.innerHTML = `
        <h3>${marca.Make_Name}</h3>
        <p>ID: ${marca.Make_ID}</p>
      `;

      card.addEventListener('click', () => {
        // 👇 salva ID e nome
        localStorage.setItem('marcaId', marca.Make_ID);
        localStorage.setItem('marcaNome', marca.Make_Name);
        window.location.href = 'modelos.html';
      });

      brandsDiv.appendChild(card);
    });

  } catch (error) {
    brandsDiv.innerHTML = '<p>Erro ao carregar marcas.</p>';
    console.error(error);
  }
}
