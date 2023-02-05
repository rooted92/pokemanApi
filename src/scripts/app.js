// Pedro Castaneda
// 02/04/20230
// Pokemon API Project
// TODO - Finish debugging favorites list, and add the 'Fun Factoids' feature

import { InjectPokemonDataToParentContainer, InjectEvolutionData, InjectLocationData, InjectSpritesForEvolutionaryPaths, PopulateList, GetFlavorText } from "./injections.js";
import { SaveFavoritesToLocalStorage, GetFavorites } from "./localStorage.js";

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
let goldBtn = document.querySelector('#goldBtn');
let funFactoid = document.querySelector('#funFactoid');
funFactoid.style.maxWidth = '23rem';
let speciesUrl, evolutionChainUrl, encounterUrl, pokemonSearchValue;
let pokemonName, pokemonID, defaultSprite, shinySprite, pokemonType, pokemonAbilities, pokemonMoves;
let pokemonEvolutions, pokemonLocation;
let pokemonObject = {};// declare global object variable to be able to save the pokemon to favorites
let allPokeUrl = `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=648`;

// declare event listners
// allows time to retrieve data then sets loading elements to none when done
window.addEventListener('load', function () {
    GetRandomPokemon();
    this.document.querySelector('#loadingIcon').style.display = 'none';
    pokeDataCont.style.display = 'block';
    popover.style.display = 'none';
})
// Populates saved favorites list on page load
window.onload = function () {
    favorites = GetFavorites();
    if (favorites.length > 0) {
        favorites.map(x => PopulateList(x.toLowerCase()));
    }
};
// toggles evolution div on/off
viewEvolutionsBtn.addEventListener('click', function () {
    if (popover.style.display === 'none') {
        popover.style.display = 'block';
    }
    else {
        popover.style.display = 'none';
    }
});
//gets random pokemon data
randomBtn.addEventListener('click', function () {
    GetRandomPokemon();
});
// searches based on input value via click
searchBtn.addEventListener('click', function () {
    pokemonSearchValue = searchBar.value.toLowerCase();
    GetPokemonDataSearch(pokemonSearchValue);
});
// searches based on input value via enter key press
searchBar.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        pokemonSearchValue = searchBar.value.toLowerCase();
        GetPokemonDataSearch(pokemonSearchValue);
    }
});
// adds pokemon to favorites list
favoritesBtn.addEventListener('click', function () {
    let favorites = GetFavorites();// had to reinitialize to make sure latest version of favorites array is used
    let favoritesStr = JSON.stringify(favorites);// stringify array to make proper comparison with includes
    if (!favoritesStr.includes(JSON.stringify(pokemonObject.name))) {
        SaveFavoritesToLocalStorage(pokemonObject.name);
        PopulateList(pokemonObject.name.toLowerCase());
    }
});
// displays items in collection
collectionBtn.addEventListener('click', function () {
    smallModal.style.display = 'block';
});
// closes collection window
closeBtn.addEventListener('click', function () {
    smallModal.style.display = 'none';
})

goldBtn.addEventListener('click', function(){
    GetFlavorText();
});


// function to find pokemon
const GetPokemonDataSearch = async nameID => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameID}/`);
    const pokemon = await response.json();
    pokemonName = `${pokemon.name[0].toUpperCase()}${pokemon.name.substring(1)}`;
    pokemonID = `#${pokemon.id}`;
    defaultSprite = `${pokemon.sprites.front_default}`;
    shinySprite = `${pokemon.sprites.front_shiny}`;
    let abilitiesArr = [];
    pokemon.abilities.map(x => {
        abilitiesArr.push(`${x.ability.name.charAt(0).toUpperCase()}${x.ability.name.substring(1)}`);
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
    InjectPokemonDataToParentContainer(pokemonName, pokemonID, defaultSprite, shinySprite, pokemonType, pokemonAbilities, pokemonMoves);
    GetPokemonSpecies(speciesUrl);
    GetLocationEncounter(encounterUrl);
}
// Generates data from a random  pokemon
const GetRandomPokemon = async () => {
    const response = await fetch(allPokeUrl);
    const pokemon = await response.json();
    let randomIndex = Math.floor(Math.random() * pokemon.results.length);
    let randomPokemon = pokemon.results[randomIndex].name;
    GetPokemonDataSearch(randomPokemon);
}
// Uses species url to get evolution url
const GetPokemonSpecies = async url => {
    const response = await fetch(url);
    const pokemon = await response.json();
    evolutionChainUrl = pokemon.evolution_chain.url;
    GetEvolutionChain(evolutionChainUrl);
}
// gets all evolution names and added to array, InjectSprites..Function gets sprites for each evolution
const GetEvolutionChain = async url => {
    const response = await fetch(url);
    const pokemon = await response.json()
    popover.innerHTML = '';
    let evolutionArr = [];
    evolutionArr.push(`${pokemon.chain.species.name}`);
    InjectSpritesForEvolutionaryPaths(pokemon.chain.species.name);
    if (pokemon.chain.evolves_to.length !== 0) {
        pokemon.chain.evolves_to.map(x => {
            evolutionArr.push(x.species.name);
            InjectSpritesForEvolutionaryPaths(x.species.name);
        });
        if (pokemon.chain.evolves_to[0].evolves_to.length !== 0) {
            evolutionArr.push(`${pokemon.chain.evolves_to[0].evolves_to[0].species.name}`);
            InjectSpritesForEvolutionaryPaths(pokemon.chain.evolves_to[0].evolves_to[0].species.name);
        }
    }
    pokemonEvolutions = evolutionArr.map(x => x.charAt(0).toUpperCase() + x.substring(1)).join(', ');
    InjectEvolutionData(pokemonEvolutions);
}
// gets location names and them to array, InjectLoactionData will display location text in browser
const GetLocationEncounter = async url => {
    const response = await fetch(url);
    const pokemon = await response.json();
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

export { pokemonObject, injectListItems, GetPokemonDataSearch, smallModal, funFactoid };