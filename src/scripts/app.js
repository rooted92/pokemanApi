/*
Ability to search by name and Pokedex Number (X)
only Gen 1 - 5 pokemon (X)
Ability to search by name and Pokedex Number (X)
Ability to get a random pokemon (X)
image of pokemon and shiny form (X)
Pokemon Name (X)
show 1 location from any game. If pokemon doesn't have a location, have it return "N/A" (X)
Element Typing (X)
All possible abilities (X)
All possible moves (X)
Show Evolutionary Paths, if pokemon doesn't have an evolutionary path, have it return "N/A" (X)
And a Favorites list
Fully Responsive using Tailwind CSS https://tailwindcss.com/
Have a Prototype in Figma (X)
*/

import { InjectPokemonDataToParentContainer, InjectEvolutionData, InjectLocationData } from "./injections.js";

// declare global variables
const pokeDataCont = document.querySelector('#pokeDataCont');
let randomBtn = document.querySelector('#randomBtn');
let searchBar = document.querySelector('#searchBar');
let searchBtn = document.querySelector('#searchBtn');
let pokemonUrl, randomPokemonUrl, speciesUrl, evolutionChainUrl, encounterUrl, pokemonSearchValue;
let pokemonName, pokemonID, defaultSprite, shinySprite, pokemonType, pokemonAbilities, pokemonMoves;
let pokemonEvolutions, pokemonLocation;
let allPokeUrl = `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=648`;

// declare event listners
randomBtn.addEventListener('click', function () {
    console.log('Getting random pokemon...');
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

// declare functions
const GetDisplayAllPokemon = async () => {
    const response = await fetch(allPokeUrl);
    const pokemon = await response.json();

    console.log('GetDisplayAllPokemon function below:')
    console.log(pokemon);
    pokemon.results.slice(0, 4).map(pkmn => {
        pokemonUrl = pkmn.url;
        // GetPokemonDataSearch(pokemonUrl);
        console.log('Searching all pokemon...');
        console.log(pokemonUrl);
        console.log('Place your create element function in here');
    });
}

// GetDisplayAllPokemon(); this function will be used for display settings if time permits: sort by, show x amount at a time, etc. But remember to create a GETALLDATA function! check above dummy!!!


const GetPokemonDataSearch = async nameID => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameID}/`);
    const pokemon = await response.json();
    console.log('GetPokemonDataSearch function below:')
    console.log(pokemon);
    console.log(`Name logged: ${pokemon.name[0].toUpperCase()}${pokemon.name.substring(1)}`);// capitalize first letter
    pokemonName = `${pokemon.name[0].toUpperCase()}${pokemon.name.substring(1)}`;
    console.log(`Pokemon name variable logged: ${typeof pokemonName}`);
    console.log(`ID logged: ${pokemon.id}`);
    pokemonID = `#${pokemon.id}`;
    console.log(`Pokemon ID variable logged: ${typeof pokemonID}`);
    console.log(`Front Sprite logged: ${pokemon.sprites.front_default}`);
    defaultSprite = `${pokemon.sprites.front_default}`;
    console.log(`Pokemon Default Sprite variable logged: ${defaultSprite}`);
    console.log(`Shiny Sprite logged: ${pokemon.sprites.front_shiny}`);
    shinySprite = `${pokemon.sprites.front_shiny}`;
    console.log(`Pokemon Shiny Sprite variable logged: ${shinySprite}`);
    console.log('Abilities logged:')
    let abilitiesArr = [];
    pokemon.abilities.map(x => {
        abilitiesArr.push(`${x.ability.name.charAt(0).toUpperCase()}${x.ability.name.substring(1)}`);
        console.log(abilitiesArr.join(', '));// see if you can use includes to check if a string has the '-' character and if it does split it into an array with '-' and iterate throuhg words making first char capitalized rest lower case. If no the just reutnr the single word with first letter upper case rest lower case. try same for moves.. and see if you can use replace method.
    });
    pokemonAbilities = `${abilitiesArr.join(', ')}`;
    console.log(`Pokemon Abilities variable logged: ${pokemonAbilities}`);
    let typesArr = [];
    pokemon.types.map(x => typesArr.push(`${x.type.name.charAt(0).toUpperCase()}${x.type.name.substring(1)}`));
    console.log(`Types logged: ${typesArr.join(', ')}`);
    pokemonType = `Type: ${typesArr.join(', ')}`;
    console.log(`Pokemon Types variable logged: ${pokemonType}`);
    let movesArr = [];
    pokemon.moves.map(x => movesArr.push(x.move.name));
    console.log(`Moves logged: `);
    pokemonMoves = `${movesArr.map(x => x.replace('-', ' ')).map(y => y.split(' ').map(z => z.charAt(0).toUpperCase() + z.substring(1)).join(' '))}`;
    console.log(`Pokemon Moves logged: ${pokemonMoves}`);
    speciesUrl = pokemon.species.url;
    console.log(`Species URL logged: ${speciesUrl}`);
    encounterUrl = pokemon.location_area_encounters;
    console.log(`Encounter URL logged: ${encounterUrl}`);
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
    console.log('Evolution Chain URL logged: ' + evolutionChainUrl);
    GetEvolutionChain(evolutionChainUrl);
}

const GetEvolutionChain = async url => {
    const response = await fetch(url);
    const pokemon = await response.json()
    let evolutionArr = [];
    evolutionArr.push(`${pokemon.chain.species.name}`);
    if(pokemon.chain.evolves_to.length === 0)
    {
        evolutionArr.push('N/A');
    }
    else
    {
        evolutionArr.push(`${pokemon.chain.evolves_to[0].species.name}`);
    }
    if(pokemon.chain.evolves_to.length === 0 || pokemon.chain.evolves_to[0].evolves_to.length === 0)
    {
        evolutionArr.push('N/A');
    }
    else
    {
        evolutionArr.push(`${pokemon.chain.evolves_to[0].evolves_to[0].species.name}`);
    }
    pokemonEvolutions = evolutionArr.map(x => x.charAt(0).toUpperCase() + x.substring(1)).join(', ');
    InjectEvolutionData(pokemonEvolutions)
}

const GetLocationEncounter = async url => {
    const response = await fetch(url);
    const pokemon = await response.json();
    console.log(`GetLocationEncounter function belowL`);
    console.log(pokemon);
    let locationArr = [];
    if (pokemon.length === 0 || pokemon === []) {
        locationArr.push('N/A');
        pokemonLocation = locationArr;
        InjectLocationData(pokemonLocation);
    }
    else {
        pokemon.map(x => {
            locationArr.push(`${x.location_area.name}`);
        });
        let randomIndex = Math.floor(Math.random() * locationArr.length);
        pokemonLocation = locationArr[randomIndex].split('-').join(' ').split(' ').map(x => x.charAt(0).toUpperCase() + x.substring(1)).join(' ');
        console.log('Here is location data ' + pokemonLocation);
        InjectLocationData(pokemonLocation);
    }
}