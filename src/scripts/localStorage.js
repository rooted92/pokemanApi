//declare global variables

//add to favorites function
function SaveFavoritesToLocalStorage(pokemon) {
    //get current values that are saved into local storage
    //create an array of values to store into local storage
    // let favorites = []; empty array was only returing one person
    let favorites = GetFavorites();

    //add new name to our favorites array
    if (!favorites.includes(pokemon))//includes checks to see if city already exists in array if not ture then push city
    {
        favorites.push(pokemon);

        //save our updated arrray to local storage
        //localStorage creates empty array
        localStorage.setItem('Favorites', JSON.stringify(favorites));
    }
}

//create function get local storage
function GetFavorites() {
    //get all of the values that are in stored in favorites in local storage
    let localStorageData = localStorage.getItem('Favorites');// getItem we need to 'get' values
    if (localStorageData === null) {
        return [];
    }
    
    return JSON.parse(localStorageData); //we need to return our data parsed as jSON
}

//function to delete favorties from list
function RemoveFromLocalStorage(pokemon) {
    let favorites = GetFavorites();
    //find the index of the name in local storage
    let pokemonIndex = favorites.indexOf(pokemon);//reread docs on indexOf()!

    //remove the name from the array using the splice method
    favorites.splice(pokemonIndex, 1);

    //save updated array to local storage
    localStorage.setItem('Favorites', JSON.stringify(favorites));
}

export { SaveFavoritesToLocalStorage, GetFavorites, RemoveFromLocalStorage };