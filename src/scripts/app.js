/*
And a Favorites list
Fully Responsive using Tailwind CSS https://tailwindcss.com/

take the value of evelutianry name pass it into function that will retunr img to id in html
*/

import { InjectPokemonDataToParentContainer, InjectEvolutionData, InjectLocationData, InjectSpritesForEvolutionaryPaths, PopulateList } from "./injections.js";
import { SaveFavoritesToLocalStorage, GetFavorites, RemoveFromLocalStorage } from "./localStorage.js";

// declare global variables
const pokeDataCont = document.querySelector('#pokeDataCont');
let randomBtn = document.querySelector('#randomBtn');
let searchBar = document.querySelector('#searchBar');
let searchBtn = document.querySelector('#searchBtn');
let favoritesBtn = document.querySelector('#favoritesBtn');
let favorites = GetFavorites();
let collectionBtn = document.querySelector('#collectionBtn');
let smallModal = document.querySelector('#small-modal');
let closeBtn = document.querySelector('#closeBtn');
let injectListItems = document.querySelector('#injectListItems');
let popover = document.getElementById('popover');
let viewEvolutionsBtn = document.querySelector('#viewEvolutionsBtn');
let pokemonUrl, speciesUrl, evolutionChainUrl, encounterUrl, pokemonSearchValue;
let pokemonName, pokemonID, defaultSprite, shinySprite, pokemonType, pokemonAbilities, pokemonMoves;
let pokemonEvolutions, pokemonLocation;
let pokemonObject = {};// declare global object variable to be able to save the pokemon to favorites
let allPokeUrl = `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=648`;

// declare event listners
window.addEventListener('load', function () {
    GetRandomPokemon();
    this.document.querySelector('#loadingIcon').style.display = 'none';
    pokeDataCont.style.display = 'block';
    popover.style.display = 'none';
})

window.onload = function () {
    let favorites = GetFavorites();
    if (favorites.length > 0) {
        for (let i = 0; i < favorites.length; i++) {
            pokemonObject.name = favorites[i];
            PopulateList();
        }
    }
};
viewEvolutionsBtn.addEventListener('click', function () {
    if (popover.style.display === 'none') {
        popover.style.display = 'block';
    }
    else {
        popover.style.display = 'none';
    }
});

randomBtn.addEventListener('click', function () {
    GetRandomPokemon();
});

searchBtn.addEventListener('click', function () {
    console.log('Searching pokemon...');
    pokemonSearchValue = searchBar.value.toLowerCase();
    console.log('Looking for... ' + pokemonSearchValue);
    GetPokemonDataSearch(pokemonSearchValue);
});

searchBar.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        console.log('Searching via enter key...');
        pokemonSearchValue = searchBar.value.toLowerCase();
        GetPokemonDataSearch(pokemonSearchValue);
    }
});

favoritesBtn.addEventListener('click', function () {
    console.log(`${pokemonObject.name} added to Favorites!`);
    let favorites = GetFavorites();// had to reinitialize to make sure latest version of favorites array is used
    console.log(favorites);
    let favoritesStr = JSON.stringify(favorites);// stringify array to make proper comparison with includes
    console.log(favoritesStr);
    if (!favoritesStr.includes(JSON.stringify(pokemonObject.name))) {
        SaveFavoritesToLocalStorage(pokemonObject.name);
        PopulateList();
    }
});

collectionBtn.addEventListener('click', function () {
    // add function to create elements and populate with data
    // Use pokemon object values as arguments to populate on html
    smallModal.style.display = 'block';
    // potentially add display list here
});

closeBtn.addEventListener('click', function () {
    smallModal.style.display = 'none';
})



favorites.map(x => console.log(x));
// console.log(favorites);
// declare functions
// const GetDisplayAllPokemon = async () => {
//     const response = await fetch(allPokeUrl);
//     const pokemon = await response.json();

//     console.log('GetDisplayAllPokemon function below:')
//     console.log(pokemon);
//     pokemon.results.slice(0, 4).map(pkmn => {
//         pokemonUrl = pkmn.url;
//         console.log('Searching all pokemon...');
//         console.log(pokemonUrl);
//         console.log('Place your create element function in here');
//     });
// }
// GetDisplayAllPokemon(); 
// this function will be used for display settings if time permits: sort by, show x amount at a time, etc. But remember to create a GETALLDATA function! check above dummy!!!


const GetPokemonDataSearch = async nameID => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameID}/`);
    const pokemon = await response.json();
    console.log('GetPokemonDataSearch function below:')
    console.log(pokemon)
    pokemonName = `${pokemon.name[0].toUpperCase()}${pokemon.name.substring(1)}`;
    pokemonID = `#${pokemon.id}`;
    defaultSprite = `${pokemon.sprites.front_default}`;
    shinySprite = `${pokemon.sprites.front_shiny}`;
    let abilitiesArr = [];
    pokemon.abilities.map(x => {
        abilitiesArr.push(`${x.ability.name.charAt(0).toUpperCase()}${x.ability.name.substring(1)}`);
        console.log(abilitiesArr.join(', '));// see if you can use includes to check if a string has the '-' character and if it does split it into an array with '-' and iterate throuhg words making first char capitalized rest lower case. If no the just reutnr the single word with first letter upper case rest lower case. try same for moves.. and see if you can use replace method.
    });
    pokemonAbilities = `${abilitiesArr.map(x => x.replace('-', ' ')).join(', ')}`;
    let typesArr = [];
    pokemon.types.map(x => typesArr.push(`${x.type.name.charAt(0).toUpperCase()}${x.type.name.substring(1)}`));
    pokemonType = `Type: ${typesArr.join(', ')}`;
    let movesArr = [];
    pokemon.moves.map(x => movesArr.push(x.move.name.charAt(0).toUpperCase() + x.move.name.substring(1)));
    pokemonMoves = `${movesArr.map(x => x.replace('-', ' ')).join(', ')}`;
    speciesUrl = pokemon.species.url;
    encounterUrl = pokemon.location_area_encounters;
    pokemonObject = {
        name: pokemonName,
        id: pokemonID,
        defaultSprite: defaultSprite,
        shinySprite: shinySprite,
        pokemonType: pokemonType,
        pokemonAbilities: pokemonAbilities,
        pokemonMoves: pokemonMoves
    }
    // add logic to save favorited unfavorited states
    InjectPokemonDataToParentContainer(pokemonName, pokemonID, defaultSprite, shinySprite, pokemonType, pokemonAbilities, pokemonMoves);
    GetPokemonSpecies(speciesUrl);
    GetLocationEncounter(encounterUrl);
}

const GetRandomPokemon = async () => {
    const response = await fetch(allPokeUrl);
    const pokemon = await response.json();
    let randomIndex = Math.floor(Math.random() * pokemon.results.length);
    let randomPokemon = pokemon.results[randomIndex].name;
    GetPokemonDataSearch(randomPokemon);
}

const GetPokemonSpecies = async url => {
    const response = await fetch(url);
    const pokemon = await response.json();
    console.log('GetPokemonSpecies function below:');
    console.log(pokemon);
    evolutionChainUrl = pokemon.evolution_chain.url;
    GetEvolutionChain(evolutionChainUrl);
}

const GetEvolutionChain = async url => {
    const response = await fetch(url);
    const pokemon = await response.json()
    console.log(pokemon);
    let evolutionArr = [];
    evolutionArr.push(`${pokemon.chain.species.name}`);
    if (pokemon.chain.evolves_to.length !== 0) {
        console.log('Array was not empty!!')
        pokemon.chain.evolves_to.map(x => {
            evolutionArr.push(x.species.name)
            console.log(evolutionArr[x]);
        });
        if (pokemon.chain.evolves_to[0].evolves_to.length !== 0) {
            evolutionArr.push(`${pokemon.chain.evolves_to[0].evolves_to[0].species.name}`);
            console.log('Second evolution array value: ' + evolutionArr[2]);
        }
    }
    console.log('Injecting all elments...')
    popover.innerHTML = '';
    for (let i = 0; i < evolutionArr.length; i++) {
        console.log('Sprites injected for: ' + evolutionArr[i]);
        InjectSpritesForEvolutionaryPaths(evolutionArr[i]);
    }
    pokemonEvolutions = evolutionArr.map(x => x.charAt(0).toUpperCase() + x.substring(1)).join(', ');
    InjectEvolutionData(pokemonEvolutions);
}

const GetLocationEncounter = async url => {
    const response = await fetch(url);
    const pokemon = await response.json();
    console.log(`GetLocationEncounter function belowL`);
    console.log(pokemon);
    let locationArr = [];
    if (pokemon.length === 0 || pokemon === []) {
        locationArr.push('Unspecified');
        pokemonLocation = locationArr;
        InjectLocationData(pokemonLocation);
    }
    else {
        pokemon.map(x => {
            locationArr.push(`${x.location_area.name}`);
        });
        let randomIndex = Math.floor(Math.random() * locationArr.length);
        pokemonLocation = locationArr[randomIndex].split('-').join(' ').split(' ').map(x => x.charAt(0).toUpperCase() + x.substring(1)).join(' ');
        InjectLocationData(pokemonLocation);
    }
}

// Display pokemon in favorites list
if (favorites.length !== 0) {
    PopulateList();
}

export { pokemonObject, injectListItems };