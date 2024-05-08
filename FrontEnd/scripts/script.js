
//Création de la gallerie de travaux
createGallery()

//Obtient le token d'identification
getToken()

//Crée le contenu de la modale
modaleContent() 

//Retire les travaux
document.addEventListener("DOMContentLoaded", function() {
    removeWorks();
});

//Se déconnecter
clickLogOut()

//Vérifie si le token est présent quand la page se charge
window.onload = checkToken();

//Ouverture de la modale
openPopUp()

//Fermeture de la modale
modaleClosing()
