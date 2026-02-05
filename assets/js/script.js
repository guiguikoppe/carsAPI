const button = document.getElementById('load');
const brandsDiv = document.getElementById('brands');


button.addEventListener('click', carregarMarcas);


async function carregarMarcas() {
brandsDiv.innerHTML = '<p>Carregando...</p>';


try {
const response = await fetch(
'https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json'
);


const data = await response.json();


brandsDiv.innerHTML = '';


data.Results.slice(0, 30).forEach(marca => {
const card = document.createElement('div');
card.classList.add('card');


card.innerHTML = `
<h3>${marca.Make_Name}</h3>
<p>ID: ${marca.Make_ID}</p>
`;


brandsDiv.appendChild(card);
});


} catch (error) {
brandsDiv.innerHTML = '<p>Erro ao carregar dados.</p>';
console.error(error);
}
}