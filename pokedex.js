
const urlParams = new URLSearchParams(window.location.search);
const indexNum = urlParams.get('indexNum');

var x = 0;
if (typeof indexNum !== 'undefined' && indexNum !== null){
  x = parseInt(indexNum);
}


//test
document.addEventListener('DOMContentLoaded', async function () {
  
  console.log("test");
  const slider = document.getElementById('slider');
  loadContent(slider); //loads the main content with slider
  


  function getQueryParam(param) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
  }
  const pokemonName = getQueryParam('pokemonName');
  const pokemonNameElement = document.createElement('p');
  
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
  const data = await response.json();
  const id = data.id;
  const p_name = data.name; //capss
  const p_height = data.height;
  const p_weight = data.weight;
  //types (array)
  const p_types = data.types.map(type => type.type.name).join(', ');
  const pokemonTypes = data.types.map(typeObject => typeObject.type.name);
  const p_weak = getPokemonWeaknesses(pokemonTypes[0], pokemonTypes[1]);

  

  if (id >= 100) {  //reuse to convert name to id properly
    pokemonId = String(id);
  } else if (id < 100 && id >= 10) {
    pokemonId = '0' + String(id);
  } else if (id < 10 && id > 0) {
    pokemonId = '00' + String(id);
  } else {
    pokemonId = '1025';
  }
  const spriteURL = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemonId}.png`;


  // code for pokemonpage.html
  // Height in the API is in decimeter. This is converted to meters for convention.
  pokemonNameElement.innerHTML = `
  <div class="info-container">
    <img class="pokemon-img" alt="" src="${spriteURL}">
    <div class="poke-info">
      <div class="poke-padding">
        
        <p>
        Pokemon info </br>
        ID: ${id} </br>
        Name: ${p_name} </br>
        Height: ${p_height / 10}  meters</br> 
        Weight: ${p_weight / 10} kilograms</br>
        Types: ${p_types} </br>
        Weaknesses: <div class="weaknessColor">${p_weak}</div></br>
        
        </br>
        <div class="switchButtons">
          <button class="leftEntry">Left</button>
          <button class="rightEntry">Right</button>
        </div>
        <a href="index.html"><button class="backbutton">BACK</button></a>
        </p>
      </div>
    </div>
  </div>
  
  
  
  
  `;
  document.body.appendChild(pokemonNameElement);
  const rightEntry = pokemonNameElement.querySelector('.rightEntry');
  rightEntry.addEventListener('click', function () {
    console.log("right button pressed");
    const pokemonId = id;
    if (pokemonId < 1025){
      window.location.href = `pokemonpage.html?pokemonName=${pokemonId + 1}`;
    }
  });
  const leftEntry = pokemonNameElement.querySelector('.leftEntry');
  leftEntry.addEventListener('click', function () {
    console.log("left button pressed");
    const pokemonId = id;
    if (pokemonId > 1){
      window.location.href = `pokemonpage.html?pokemonName=${pokemonId - 1}`;
    }
  });
  document.title = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1) + `'s Pokedex Entry`;  //changes title of the page to the pokemon's name
});


async function loadContent(slider){
  const numberOfCards = 9;
  for (let i = 1; i <= numberOfCards; i++) {
    const card = document.createElement('div');
    card.classList.add('card');
    let pokemonIdNum = x + i;
    let pokemonId = '';

    if (pokemonIdNum <= 0) {
      pokemonIdNum = 1025 + pokemonIdNum;
    } else if (pokemonIdNum > 1025) {
      pokemonIdNum = pokemonIdNum - 1025;
    }
    console.log(pokemonIdNum);


    if (pokemonIdNum >= 100) {
      pokemonId = String(pokemonIdNum);
    } else if (pokemonIdNum < 100 && pokemonIdNum >= 10) {
      pokemonId = '0' + String(pokemonIdNum);
    } else if (pokemonIdNum < 10 && pokemonIdNum > 0) {
      pokemonId = '00' + String(pokemonIdNum);
    } else {
      pokemonId = '1025'; // Ensure a valid value
    }

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${parseInt(pokemonId, 10)}`); //10 for decimal as opposed to otcal
      const data = await response.json();

      const pokemonNameText = data.name;
      const pokemonTypeText = data.types.map(type => type.type.name).join(', ');
      const pokemonIdText = data.id;

      const pokemonImageUrl = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemonId}.png`;

      // card from html
      card.innerHTML = `
        <a href="pokemonpage.html?pokemonName=${pokemonNameText}"><div class="image-content">
          <span class="overlay"></span>
          <div class="card-image">
            <img class="pokemon-img" alt="" src="${pokemonImageUrl}">
          </div>
        </div>
        <div class="card-content">
          <h2 class="pokemon-name">${pokemonNameText.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
          <p class="description">${pokemonTypeText}</p>
          <p>${pokemonIdText}</p>
          <button class="button">Details</button>
        </div></a>

        
      `;
      

      // append the card to the slider
      slider.appendChild(card);
      const button = card.querySelector('.button');
      button.addEventListener('click', function () {
        const pokemonName = pokemonNameText;
        window.location.href = `pokemonpage.html?pokemonName=${pokemonName}`;
      });
      searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const searchInput = document.getElementById('searchInput');
        const searchTerm = searchInput.value.trim(); //  removes spaces
        console.log('pause');
        pokeSearch(searchTerm.toLowerCase());
        


        //window.location.href = `pokemonpage.html?pokemonName=${searchTerm.toLowerCase()}`; //lowercase since API uses lowercase
        console.log('searched:', searchTerm);
        
      });
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
    }
    
  }
}


// Search function to search pokemon using input field
async function pokeSearch(query) {
  try {
    // Fetch data for the searched Pokémon
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
    if (!response.ok) {
      //If the response is not successful, it means the Pokémon doesn't exist
      window.location.href = `index.html`;
      return;
  }
    
    // Redirect to the Pokémon page if it exists
    window.location.href = `pokemonpage.html?pokemonName=${query}`;
  } catch (error) {
    // edit
    console.log("Error Occured");
  }
}

document.querySelector('.right').addEventListener('click', function () {
  console.log(x);
  x = x + 9;
  if (x > 1025) {
    x = x - 1025;
  }
  window.location.href = `index.html?indexNum=${x}`;
});

document.querySelector('.left').addEventListener('click', function () {
  console.log(x);
  x = x - 9;
  if (x < -1025) {
    x = x + 1025;
  }
  window.location.href = `index.html?indexNum=${x}`;
});



//this chart will return weaknesses and stuff
const typeChart = {
  "normal": { weakTo: ["fighting"], strongAgainst: [] },
  "fighting": { weakTo: ["flying", "psychic", "fairy"], strongAgainst: ["normal", "rock", "steel", "ice", "dark"] },
  "flying": { weakTo: ["rock", "electric", "ice"], strongAgainst: ["fighting", "bug", "grass"] },
  "poison": { weakTo: ["ground", "psychic"], strongAgainst: ["grass", "fairy"] },
  "ground": { weakTo: ["water", "grass", "ice"], strongAgainst: ["poison", "rock", "steel", "fire", "electric"] },
  "rock": { weakTo: ["water", "grass", "fighting", "ground", "steel"], strongAgainst: ["flying", "bug", "fire", "ice"] },
  "bug": { weakTo: ["flying", "rock", "fire"], strongAgainst: ["grass", "psychic", "dark"] },
  "ghost": { weakTo: ["ghost", "dark"], strongAgainst: ["psychic", "ghost"] },
  "steel": { weakTo: ["fighting", "ground", "fire"], strongAgainst: ["rock", "ice", "fairy"] },
  "fire": { weakTo: ["water", "ground", "rock"], strongAgainst: ["bug", "steel", "grass", "ice"] },
  "water": { weakTo: ["electric", "grass"], strongAgainst: ["ground", "rock", "fire"] },
  "grass": { weakTo: ["flying", "poison", "bug", "fire", "ice"], strongAgainst: ["ground", "rock", "water"] },
  "electric": { weakTo: ["ground"], strongAgainst: ["flying", "water"] },
  "psychic": { weakTo: ["bug", "ghost", "dark"], strongAgainst: ["fighting", "poison"] },
  "ice": { weakTo: ["fire", "fighting", "rock", "steel"], strongAgainst: ["flying", "ground", "grass", "dragon"] },
  "dragon": { weakTo: ["ice", "dragon", "fairy"], strongAgainst: ["dragon"] },
  "dark": { weakTo: ["fighting", "bug", "fairy"], strongAgainst: ["ghost", "psychic"] },
  "fairy": { weakTo: ["poison", "steel"], strongAgainst: ["fighting", "dragon", "dark"] }
};

function getPokemonWeaknesses(pokemonType1, pokemonType2) {
  let weaknesses = [];
  let strong = [];

  if (typeChart[pokemonType1]) {
    weaknesses.push(...typeChart[pokemonType1].weakTo);
  }

  if (pokemonType2 && typeChart[pokemonType2]) {
    weaknesses.push(...typeChart[pokemonType2].weakTo);
  }

  const weaknessSet = [...new Set(weaknesses)];
  weaknesses = weaknessSet;

  if (typeChart[pokemonType1]) {
    strong.push(...typeChart[pokemonType1].strongAgainst);
  }

  if (pokemonType2 && typeChart[pokemonType2]) {
    strong.push(...typeChart[pokemonType2].strongAgainst);
  }

  const strongSet = [...new Set(strong)];
  strong = strongSet;

  const filteredArray = weaknesses.filter(item => strong.indexOf(item) === -1);

  return filteredArray;
}


//make a search query function