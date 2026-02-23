const titulo = document.getElementById('titulo');
const modelsDiv = document.getElementById('models');
const aviso = document.getElementById('aviso');

const modal = document.getElementById('modal');
const fechar = document.getElementById('fechar');
const modeloNome = document.getElementById('modelo-nome');
const marcaNomeEl = document.getElementById('marca-nome');
const carroImg = document.getElementById('carro-img');
const infoExtra = document.getElementById('info-extra');

if (titulo && modelsDiv && aviso && modal) {

  modal.style.display = 'none';

  const marcaNome = localStorage.getItem('marcaNome');

  if (!marcaNome) {
    titulo.textContent = 'Nenhuma marca selecionada';
    aviso.textContent = 'Volte e selecione uma marca.';
  } else {
    titulo.textContent = `Modelos da marca ${marcaNome}`;
    carregarModelos(marcaNome);
  }

  fechar.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // =========================
  // CARREGAR MODELOS
  // =========================
  async function carregarModelos(makeName) {
    modelsDiv.innerHTML = '<p>Carregando modelos...</p>';
    aviso.textContent = '';

    try {
      const url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${encodeURIComponent(makeName)}?format=json`;
      const response = await fetch(url);
      const data = await response.json();

      modelsDiv.innerHTML = '';

      if (!data.Results || data.Results.length === 0) {
        modelsDiv.innerHTML = '<p>Nenhum modelo encontrado.</p>';
        return;
      }

      // Remove duplicados
      const modelosUnicos = [...new Set(data.Results.map(m => m.Model_Name))];

      modelosUnicos.forEach(modelo => {
        const card = document.createElement('div');
        card.className = 'card clickable';
        card.textContent = modelo;

        card.addEventListener('click', () => {
          abrirModal(makeName, modelo);
        });

        modelsDiv.appendChild(card);
      });

    } catch (error) {
      console.error(error);
      modelsDiv.innerHTML = '<p>Erro ao carregar modelos.</p>';
    }
  }

  // =========================
  // ABRIR MODAL
  // =========================
  function abrirModal(marca, modelo) {
    modeloNome.textContent = modelo;
    marcaNomeEl.textContent = `Marca: ${marca}`;
    infoExtra.innerHTML = '<p>Carregando informações...</p>';

    carroImg.src = 'https://placehold.co/600x400?text=Carro';
    carroImg.onerror = () => {
      carroImg.src = 'https://placehold.co/600x400?text=Imagem+indisponível';
    };

    modal.style.display = 'flex';

    carregarInfoExtra(marca, modelo);
  }

  // =========================
  // INFO EXTRA (TIPOS)
  // =========================
  async function carregarInfoExtra(marca, modelo) {
    try {
      const url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeModel/${encodeURIComponent(marca)}/${encodeURIComponent(modelo)}?format=json`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.Results || data.Results.length === 0) {
        infoExtra.innerHTML = '<p>🚫 Informações não disponíveis</p>';
        return;
      }

      const tipos = [...new Set(
        data.Results.map(item => item.VehicleTypeName).filter(Boolean)
      )];

      infoExtra.innerHTML = `
        <p><strong>Modelo:</strong> ${modelo}</p>
        <p><strong>Marca:</strong> ${marca}</p>
        <p><strong>Tipo(s):</strong></p>
        <ul>
          ${tipos.map(tipo => `<li>${tipo}</li>`).join('')}
        </ul>
        <p><strong>Fonte:</strong> NHTSA</p>
      `;

    } catch (error) {
      console.error(error);
      infoExtra.innerHTML = '<p>⚠️ Não foi possível carregar informações.</p>';
    }
  }
}