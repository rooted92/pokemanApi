// might have to make create element functions for different fucntions then piece them together to make the whole poke data container

// create elements

// this function will inject data from GetPokeDataSearch function. 
const InjectPokemonDataToParentContainer = (pokeName, pokeID, defSprite, shSprite, pokeType, pokeAbilities, pokeMoves) => {
    let name = document.querySelector('#name');
    name.textContent = pokeName;
    let numberID = document.querySelector('#numberID');
    console.log('HERE IS POKEID!!!' + numberID);
    numberID.textContent = pokeID;
    console.log('HERE IT IS AFTER!!!' + numberID);
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

const InjectLocationData = pokeLocation => {
    let location = document.querySelector('#location');
    location.textContent = pokeLocation;
}

export {InjectPokemonDataToParentContainer, InjectEvolutionData, InjectLocationData};