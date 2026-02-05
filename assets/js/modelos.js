const marcaSelecionada = JSON.parse(localStorage.getItem('marcaSelecionada'));

const titulo = document.getElementById('titulo');
const modelsDiv = document.getElementById('models');

if (!marcaSelecionada) {
  titulo.textContent = 'Nenhuma marca selecionada';
} else {
  titulo.textContent = `Modelos da marca ${marcaSelecionada.Make_Name}`;

  carregarModelos(marcaSelecionada.Make_ID);
}

async function carregarModelos(makeId) {
  try {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${makeId}?format=json`;
    const response = await fetch(url);
    const data = await response.json();

    modelsDiv.innerHTML = '';

    if (!data.Results || data.Results.length === 0) {
      modelsDiv.innerHTML = '<p>Nenhum modelo encontrado.</p>';
      return;
    }

    data.Results.forEach(modelo => {
      const card = document.createElement('div');
      card.className = 'card';
      card.textContent = modelo.Model_Name;
      modelsDiv.appendChild(card);
    });

  } catch (error) {
    console.error(error);
    modelsDiv.innerHTML = '<p>Erro ao carregar modelos.</p>';
  }
}