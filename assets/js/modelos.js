const titulo = document.getElementById('titulo');
const modelsDiv = document.getElementById('models');
const aviso = document.getElementById('aviso');

// modal
const modal = document.getElementById('modal');
const fechar = document.getElementById('fechar');
const modeloNome = document.getElementById('modelo-nome');
const marcaNomeEl = document.getElementById('marca-nome');
const carroImg = document.getElementById('carro-img');
const infoExtra = document.getElementById('info-extra');

// 🔑 API NINJAS
const API_KEY = 'HULZHFmbL3qlNRBiFZ6TTDganYQvhUfTu21aFugO';

// garante modal fechado
modal.classList.add('hidden');

// marca selecionada
const marcaNome = localStorage.getItem('marcaNome');

if (!marcaNome) {
  titulo.textContent = 'Nenhuma marca selecionada';
  aviso.textContent = 'Volte e selecione uma marca.';
} else {
  titulo.textContent = `Modelos da marca ${marcaNome}`;
  carregarModelos(marcaNome);
}

fechar.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// FECHAR AO CLICAR FORA
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.add('hidden');
});

async function carregarModelos(makeName) {
  modelsDiv.innerHTML = '<p>Carregando modelos...</p>';
  aviso.textContent = '';

  try {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${encodeURIComponent(makeName)}?format=json`;
    const response = await fetch(url);
    const data = await response.json();

    modelsDiv.innerHTML = '';

    if (!data.Results || data.Results.length === 0) {
      modelsDiv.innerHTML = '<p>Nenhum modelo encontrado.</p>';
      return;
    }

    data.Results.forEach(modelo => {
      const card = document.createElement('div');
      card.className = 'card clickable';
      card.textContent = modelo.Model_Name;

      card.addEventListener('click', async () => {
        modeloNome.textContent = modelo.Model_Name;
        marcaNomeEl.textContent = `Marca: ${makeName}`;
        infoExtra.innerHTML = '<p>Carregando informações...</p>';

        // imagem com fallback
        carroImg.onerror = () => {
          carroImg.src = 'https://via.placeholder.com/600x400?text=Imagem+indisponível';
        };
        carroImg.src = `https://source.unsplash.com/600x400/?car`;

        modal.classList.remove('hidden');

        await carregarInfoExtra(makeName, modelo.Model_Name);
      });

      modelsDiv.appendChild(card);
    });

  } catch (error) {
    console.error(error);
    modelsDiv.innerHTML = '<p>Erro ao carregar modelos.</p>';
  }
}

// 🔥 BUSCA NA API-NINJAS
async function carregarInfoExtra(marca, modelo) {
  try {
    const url = `https://api.api-ninjas.com/v1/cars?make=${encodeURIComponent(marca)}&model=${encodeURIComponent(modelo)}`;

    const response = await fetch(url, {
      headers: {
        'X-Api-Key': API_KEY
      }
    });

    const data = await response.json();

    if (!data || data.length === 0) {
      infoExtra.innerHTML = `
        <p>🚫 Informações técnicas não disponíveis</p>
      `;
      return;
    }

    const car = data[0];

    infoExtra.innerHTML = `
      <p><strong>Ano:</strong> ${car.year ?? 'N/A'}</p>
      <p><strong>Combustível:</strong> ${car.fuel_type ?? 'N/A'}</p>
      <p><strong>Consumo:</strong> ${car.city_mpg ? car.city_mpg + ' MPG' : 'N/A'}</p>
      <p><strong>Cilindros:</strong> ${car.cylinders ?? 'N/A'}</p>
      <p><strong>Tração:</strong> ${car.drive ?? 'N/A'}</p>
      <p><strong>Classe:</strong> ${car.class ?? 'N/A'}</p>
    `;

  } catch (error) {
    console.error(error);
    infoExtra.innerHTML = `<p>Erro ao carregar informações técnicas.</p>`;
  }
}