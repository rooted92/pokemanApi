/*
Ability to search by name and Pokedex Number (X)
only Gen 1 - 5 pokemon (X)
Ability to search by name and Pokedex Number 
Ability to get a random pokemon
image of pokemon and shiny form (X)
Pokemon Name (X)
show 1 location from any game. If pokemon doesn't have a location, have it return "N/A" (X)
Element Typing
All possible abilities (X)
All possible moves
Show Evolutionary Paths, if pokemon doesn't have an evolutionary path, have it return "N/A" (X)
And a Favorites list

Fully Responsive using Tailwind CSS
https://tailwindcss.com/

Have a Prototype in Figma (X)
*/

// declare global variables
const pokeDataCont = document.querySelector('#pokeDataCont');
let randomBtn = document.querySelector('#randomBtn');
let searchBar = document.querySelector('#searchBar');
let searchBtn = document.querySelector('#searchBtn');
let pokemonUrl, speciesUrl, evolutionChainUrl, encounterUrl, pokemonSearchValue;
let allPokeUrl = `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=648`;

// declare functions
const GetAllPokemon = async () => {
    const response = await fetch(allPokeUrl);
    const pokemon = await response.json();

    console.log('GetAllPokemon function below:')
    console.log(pokemon);
    return pokemon.results.slice(0, 4).map(pkmn => {
        pokemonUrl = pkmn.url
        GetPokemonData(pokemonUrl);
    });
}

GetAllPokemon();

const GetPokemonData = async url => {
    const response = await fetch(url);
    const pokemon = await response.json();
    console.log('GetPokemonData function below:')
    console.log(pokemon);
    console.log(`Name logged: ${pokemon.name[0].toUpperCase()}${pokemon.name.substring(1)}`);// capitalize first letter
    console.log(`ID logged: ${pokemon.id}`);
    console.log(`Front Sprite logged: ${pokemon.sprites.front_default}`);
    console.log(`Shiny Sprite logged: ${pokemon.sprites.front_shiny}`);
    console.log('Abilities logged:')
    let abilitiesArr = [];
    pokemon.abilities.map(x => {
        abilitiesArr.push(`${x.ability.name}`);
        console.log(abilitiesArr.join(', '));
    });

    speciesUrl = pokemon.species.url;
    console.log(`Species URL logged: ${speciesUrl}`);
    encounterUrl = pokemon.location_area_encounters;
    console.log(`Encounter URL logged: ${encounterUrl}`);
    GetPokemonSpecies(speciesUrl);
    GetLocationEncounter(encounterUrl);
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
    const pokemon = await response.json();
    console.log('GetEvolutionChain function below');
    console.log(pokemon);
    console.log(`Evolution 1 ${pokemon.chain.species.name}`);
    console.log(`Evolution 2 ${pokemon.chain.evolves_to[0].species.name}`);
    console.log(`Evolution 3 ${pokemon.chain.evolves_to[0].evolves_to[0].species.name}`);
}

const GetLocationEncounter = async url => {
    const response = await fetch(url);
    const pokemon = await response.json();
    console.log(`GetLocationEncounter function belowL`);
    console.log(pokemon);
    console.log(pokemon.map(x => {
        if(x.location_area.length === 0)
        {
            console.log(`Location not found`);
        }
        else{
            console.log(`Locations found: ${x.location_area.name}`);
        }
    }));
}

