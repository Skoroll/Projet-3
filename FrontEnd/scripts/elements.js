//Galerie où apparaissent les travaux
let gallery = document.querySelector(".gallery");
const modaleGallery = document.getElementById("modaleGallery");
const modale = document.querySelector(".modale");

//Titre modale
let modaleTitle = document.getElementById("modaleTitle");

//Boutons de filtre
const filterAll = document.getElementById("all");
const filterItems = document.getElementById("items");
const filterAppartements = document.getElementById("appartements");
const filterHandR = document.getElementById("hotelsAndRestaurants");

//Bouton fermeture modale
const closeModale = document.getElementById("closeModale");
const bgModale = document.querySelector(".modaleBackground");

//Bouton modifier, pour modale
const mod = document.getElementById("mod");

//Message d'erreur mauvais log
let erreurLog = document.getElementById("erreurLog");
