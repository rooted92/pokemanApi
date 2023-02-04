// create elements
import { GetFavorites, SaveFavoritesToLocalStorage, RemoveFromLocalStorage } from "./localStorage.js";
import { pokemonObject, injectListItems } from "./app.js";
let favorites = GetFavorites();
// this function will inject data from GetPokeDataSearch function. 
const InjectPokemonDataToParentContainer = (pokeName, pokeID, defSprite, shSprite, pokeType, pokeAbilities, pokeMoves) => {
    let name = document.querySelector('#name');
    name.textContent = pokeName;
    let numberID = document.querySelector('#numberID');
    numberID.textContent = pokeID;
    let defaultSprite = document.querySelector('#defaultSprite');
    defaultSprite.classList.add('floater');
    defaultSprite.style = 'min-width: 15rem; height: auto;';
    defaultSprite.src = defSprite;
    let shinySprite = document.querySelector('#shinySprite');
    shinySprite.classList.add('floater');
    shinySprite.style = 'min-width: 15rem; height: auto;';
    shinySprite.src = shSprite;
    let type = document.querySelector('#type');
    type.textContent = pokeType;
    let abilitiesText = document.querySelector('#abilitiesText');
    abilitiesText.textContent = pokeAbilities;
    let movesText = document.querySelector('#movesText');
    movesText.textContent = pokeMoves;
}

const InjectEvolutionData = evolutions => {
    let evolutionText = document.querySelector('#evolutionText');
    evolutionText.textContent = evolutions;
}

// this function displays location
const InjectLocationData = pokeLocation => {
    let location = document.querySelector('#location');
    location.textContent = pokeLocation;
}

// this function displays evolutionary paths
const InjectSpritesForEvolutionaryPaths = async nameID => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameID}/`);
    const pokemon = await response.json();


    console.log(pokemon.sprites.front_default);
    console.log(pokemon.sprites.front_shiny);
    // <div id="popover" class="popoverDiv">
    //     <div class="flex justify-between gap-8 p-12">
    //         <div class="col-span-auto">
    //             <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/364.png" alt="sdsdfsasf">
    //                 <p>pokemon</p>
    //         </div>
    // </div>
    let img = document.createElement('img');
    img.src = pokemon.sprites.front_default
    img.alt = 'Pokemon Evolution Sprite';
    img.classList.add('justify-self-center', 'm-0');
    let p = document.createElement('p');
    p.textContent = pokemon.name;
    // p.classList.add('justify-self-center');

    let innerDiv = document.createElement('div');
    innerDiv.classList.add('col-span-2', 'justify-self-center');
    innerDiv.append(img, p);

    // let outerDiv = document.createElement('div');
    // outerDiv.classList.add('grid', 'grid-cols-12', 'justify-items-center', 'p-8');
    // outerDiv.append(innerDiv);

    popover.append(innerDiv);
}

const PopulateList = () => {
    // may have to fetch api here
    let span = document.createElement('span');
    span.classList.add('sr-only');
    span.textContent = 'Close modal';

    let img = document.createElement('img');
    img.classList.add('deleteIcon');
    img.src = pokemonObject.defaultSprite;
    img.alt = 'delete icon';

    let button = document.createElement('button');
    button.id = 'deleteItem';
    button.type = 'button';
    button.setAttribute('data-modal-hide', 'small-modal');
    button.title = 'Delete Pokemon';
    button.append(img, span);

    let p = document.createElement('p');
    p.textContent = `${pokemonObject.id} ${pokemonObject.name}`;

    let innerDiv = document.createElement('div');
    innerDiv.id = 'innderDiv';
    innerDiv.classList.add('col-span-1', 'flex', 'justify-between');
    innerDiv.append(p, button);

    let itemDiv = document.createElement('div');
    itemDiv.id = 'item';
    itemDiv.classList.add('listItemCard', 'grid', 'grid-cols-1', 'm-0');

    itemDiv.append(innerDiv);
    injectListItems.append(itemDiv);

    button.addEventListener('click', function () {
        console.log('delete button clicked!');
        RemoveFromLocalStorage(pokemonObject.name);
        console.log(`${pokemonObject.name} was deleted from list`);
        injectListItems.removeChild(itemDiv);
    });
}

export { InjectPokemonDataToParentContainer, InjectEvolutionData, InjectLocationData, InjectSpritesForEvolutionaryPaths, PopulateList };