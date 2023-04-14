// create elements
import { RemoveFromLocalStorage } from "./localStorage.js";
import { pokemonObject, injectListItems, GetPokemonDataSearch, funFactoid } from "./app.js";

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

// this function displays text of evolution names, takes array as argumet
const InjectEvolutionData = evolutions => {
    let evolutionText = document.querySelector('#evolutionText');
    evolutionText.textContent = evolutions;
}

// this function displays text of location, takes array as argument
const InjectLocationData = pokeLocation => {
    let location = document.querySelector('#location');
    location.textContent = pokeLocation;
}

// this function displays evolutionary paths with sprites and text via 'view evolutions' link
const InjectSpritesForEvolutionaryPaths = async nameID => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameID}/`);
    const pokemon = await response.json();

    let img = document.createElement('img');
    img.src = pokemon.sprites.front_default
    img.alt = 'Pokemon Evolution Sprite';
    let p = document.createElement('p');
    p.textContent = pokemon.name;

    let innerDiv = document.createElement('div');
    innerDiv.classList.add('columns-1', 'justify-self-center', 'flex', 'gap-4');
    innerDiv.innerHTML = `<img src="${pokemon.sprites.front_default}" alt="Pokemon Evolution Sprite" /><p>${pokemon.name.charAt(0).toUpperCase()}${pokemon.name.substring(1)}</p>`;

    popover.append(innerDiv);
}

//this function creates elements and displays them in favorites list
const PopulateList = async (nameId) => {
    // Get data to populate
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameId}/`);
    const pokemon = await response.json();
    let span = document.createElement('span');
    span.classList.add('sr-only');
    span.textContent = 'Close modal';

    // add delete img here
    let img = document.createElement('img');
    img.classList.add('deleteIcon');
    img.src = './assets/images/deleteButtonIcon.png';
    img.alt = 'delete icon';
    img.style.maxHeight = '2rem';
    img.style.width = 'auto';

    let deleteBtn = document.createElement('button');
    deleteBtn.id = 'deleteItem';
    deleteBtn.type = 'button';
    deleteBtn.setAttribute('data-modal-hide', 'small-modal');
    deleteBtn.title = 'Delete Pokemon';
    deleteBtn.append(img, span);

    // add poke sprite here
    let spriteBtnImg = document.createElement('img');
    spriteBtnImg.src = pokemon.sprites.front_default;
    spriteBtnImg.alt = `Image of ${pokemon.name}`;
    spriteBtnImg.style.maxHeight = '4rem';
    spriteBtnImg.style.width = 'auto';
    spriteBtnImg.classList.add('spriteBtnImg');

    let spriteBtn = document.createElement('button');
    spriteBtn.id = 'spriteBtn';
    spriteBtn.type = 'button';
    spriteBtn.title = 'Get Pokemon Data';
    spriteBtn.append(spriteBtnImg);

    let p = document.createElement('p');
    p.textContent = `#${pokemon.id} ${pokemon.name.charAt(0).toUpperCase()}${pokemon.name.substring(1)}`;
    p.style.padding = '.5rem';

    let innerDiv = document.createElement('div');
    innerDiv.id = 'innderDiv';
    innerDiv.classList.add('col-span-2', 'justify-self-start', 'flex');
    innerDiv.append(p);

    let outerDiv = document.createElement('div');
    outerDiv.id = 'outerDiv';
    outerDiv.classList.add('col-span-1', 'justify-between', 'flex');
    outerDiv.append(spriteBtn, deleteBtn);

    let itemDiv = document.createElement('div');
    itemDiv.id = 'item';
    itemDiv.classList.add('listItemCard', 'grid', 'grid-cols-3', 'm-0');

    itemDiv.append(innerDiv, outerDiv);
    injectListItems.append(itemDiv);

    deleteBtn.addEventListener('click', function () {
        RemoveFromLocalStorage(pokemonObject.name);// will delete item from list
        injectListItems.removeChild(itemDiv);// remove item element from list
    });
    spriteBtn.addEventListener('click', function(){
        GetPokemonDataSearch(pokemon.name);
    });
}

// function to get flavor-text (random facts) will go here
const GetFlavorText = async () => {
    let speciesIndex = Math.floor(Math.random() * 648) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${speciesIndex}/`);//flaver txt in species url
    const pokemon = await response.json();
    let flavorTxtArr = [];
    pokemon.flavor_text_entries.map(ft => {
        if(ft.language.name === 'en')
        {
            flavorTxtArr.push(ft.flavor_text);// get all flavor texts that are in english
        }
    });
    let textIndex = Math.floor(Math.random() * flavorTxtArr.length);
    GetSpriteForFactoids(pokemon.name, flavorTxtArr[textIndex], funFactoid);
}

// get image for factoid div
const GetSpriteForFactoids = async (name, arr, element) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);
    const pokemon = await response.json();
    element.innerHTML = `<p class="funPokeName mb-4">${name.charAt(0).toUpperCase()}${name.substring(1)}</p><img id="dreamWorldSprite" class="mb-4" src="${pokemon.sprites.other.dream_world.front_default}" alt="Image of ${name}"<br>${arr}`;
}

export { InjectPokemonDataToParentContainer, InjectEvolutionData, InjectLocationData, InjectSpritesForEvolutionaryPaths, PopulateList, GetFlavorText };