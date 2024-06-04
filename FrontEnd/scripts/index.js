// Création des sets
let setObjets = new Set();
let setAppartements = new Set();
let setHandR = new Set();
let setAll = new Set();

let modaleGallery = document.createElement("div");

//Boutons de filtre
const filterAll = document.getElementById("all");
const filterItems = document.getElementById("items");
const filterAppartements = document.getElementById("appartements");
const filterHandR = document.getElementById("hotelsAndRestaurants");

//Input envoi API
let imgInput = document.createElement("img"); //Affiche l'image uploadé en thumbnail
let selectedFile; //Pour envoyer l'image à l'upload
let inputTitle = document.createElement("input"); //Input du titre à l'upload
let select = document.createElement("select"); // Input catégorie à l'upload

//---------------------Fonction qui crée les éléments HTML suivant les besoin du filtrage---------------------
function addWorksToHTML(set, gallery) {
  gallery.innerHTML = "";
  gallery = document.querySelector(".gallery");
  set.forEach((works) => {
    //Crée la base de la carte + ajout à "gallery"
    let figure = document.createElement("figure");
    figure.className = "actual-works";
    gallery.appendChild(figure);

    // Création et ajout de l'image
    let worksImg = document.createElement("img");
    worksImg.src = works.imageUrl;
    worksImg.alt = works.title;
    figure.appendChild(worksImg);

    // Crée le titre de la carte
    let figcaption = document.createElement("figcaption");
    figcaption.innerText = works.title;
    figure.appendChild(figcaption);
  });
}

function placeWorksOnFilter(data) {
  for (let i = 0; i < data.length; i++) {
    let category = data[i].category.name;

    // Ajout des works au sets
    switch (category) {
      case "Objets":
        setObjets.add(data[i]);
        break;

      case "Appartements":
        setAppartements.add(data[i]);
        break;

      case "Hotels & restaurants":
        setHandR.add(data[i]);
        break;
    }
  }
}

//---------------------Filtres---------------------
function filtersListeners() {
  //Appel de la fonction pour créer la galerie initiale
  gallery = document.querySelector(".gallery");
  addWorksToHTML(setAll, gallery);
  // Filtre => Tous les travaux
  filterAll.addEventListener("click", function () {
    addWorksToHTML(setAll, gallery);
  });
  // Filtre => Objets
  filterItems.addEventListener("click", function () {
    addWorksToHTML(setObjets, gallery);
  });
  // Filtre => Appartements
  filterAppartements.addEventListener("click", function () {
    addWorksToHTML(setAppartements, gallery);
  });
  // Filtre => Hôtel et Restaurants
  filterHandR.addEventListener("click", function () {
    addWorksToHTML(setHandR, gallery);
  });
}

//--------------------- Créaction de la gallerie et des filtres---------------------
function createGallery() {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch("http://localhost:5678/api/works", requestOptions)
    .then((response) => response.text())
    .then((works) => {
      //Transforme les données de l'API en JSON
      works = JSON.parse(works);

      //Condition vérifiant l'existant de la zone .gallery
      //Si elle existe alors la fonction se joue
      placeWorksOnFilter(works);
      setAll = works;
      filtersListeners();
    })
    .catch((error) => console.error(error));
}

//Quand le bouton "logout" est cliqué alors retire le statut d'administrateur
function clickLogOut() {
  if (localStorage.getItem("token")) {
    document.getElementById("login").style.display = "none";
    document.getElementById("logout").style.display = "flex";
  }
  let btnLogout = document.getElementById("logout");
  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("token");
    location.reload();
  });
}

//Fonction de fermeture de la modale
function modaleClosing() {
  bgModale = document.querySelector(".modaleBackground");
  if (bgModale.style.display === "flex") {
    bgModale.style.display = "none";
  }
}
//--------------------- Fonction pour vérifier si le token est présent dans le local storage
function checkToken() {
  // Récupérer le token depuis le local storage
  const token = localStorage.getItem("token");

  // Vérifier si le token est acquis
  if (token) {
    //S'il est acquis, change l'affichage de ces éléments :
    document.querySelector(".modeEdition").style.display = "flex";
    document.getElementById("mod").style.display = "flex";
    document.querySelector(".divBtnFilter").style.display = "none";
    document.querySelector(".modale").style.display = "flex";
  }
}
// Fermeture modale quand clic en dehors
document.addEventListener("click", function (event) {
  // Vérifier si le clic n'est pas à l'intérieur de la fenêtre modale mais dans la div bgModale
  //Galerie où apparaissent les travaux
  let modale = document.querySelector(".modale");
  if (
    !modale.contains(event.target) &&
    bgModale.contains(event.target) &&
    event.target !== modaleGallery
  ) {
    modaleClosing();
  }
});

//Apparition de la modale en cliquant sur "modifier"
function openPopUp() {
  mod.addEventListener("click", () => {
    //Galerie où apparaissent les travaux
    let modale = document.querySelector(".modale");
    modale.innerHTML = "";

    bgModale.style.display = "flex";
    creationModale();
  });
}

//---------------------Modale---------------------

// Création du titre et du bouton de fermeture
function modaleTitleFunct() {
  //Galerie où apparaissent les travaux
  let modale = document.querySelector(".modale");
  let modaleTitle = document.createElement("p");
  modaleTitle.id = "modaleTitle";
  modaleTitle.textContent = "Galerie photo";
  modale.appendChild(modaleTitle);
}

// Création de la galerie
function modaleGalleryCreation() {
  //Galerie où apparaissent les travaux
  let modale = document.querySelector(".modale");
  modaleGallery = document.createElement("div");
  modaleGallery.id = "modaleGallery";
  modale.appendChild(modaleGallery);
  fetchAndDisplayModaleGallery();
}

// Ajout du bouton "Ajouter une photo"
function createAddPhotoButton() {
  //Galerie où apparaissent les travaux
  let modale = document.querySelector(".modale");
  let addPhotoButton = document.createElement("input");
  addPhotoButton = document.createElement("input");
  addPhotoButton.type = "submit";
  addPhotoButton.id = "addPhoto";
  addPhotoButton.value = "Ajouter une photo";
  modale.appendChild(addPhotoButton);
}

//Retire tout le contenu de modaleGallery
function resetGallery() {
  modaleGallery.innerHTML = "";
  modaleGallery.style.margin = "auto";
  addPhotoButton.style.display = "none";
  //Change le texte du titre
  //Titre modale
  modaleTitle.innerText = "Ajout photo";
}

//Crée la flèche de retour en arrière
function arrowLeftBack() {
  //Galerie où apparaissent les travaux
  let modale = document.querySelector(".modale");
  const arrowLeft = document.createElement("i");
  arrowLeft.className = "fa-solid fa-arrow-left arrowLeft";
  modale.appendChild(arrowLeft);
  modale.appendChild(modaleGallery);

  //EventListener flêche retour arrière
  arrowLeft.addEventListener("click", () => {
    modale.innerHTML = "";
    creationModale();
  });
}

let isCategoryFetched = false; // Permet à fetchCategory() de ne pas se lancer si "true", évite duplication des options
function fetchCategory() {
  if (isCategoryFetched) {
    return;
  }

  // isCategoryFetched passe true pour ne pas relancer la fonction inutilement au reload modale
  isCategoryFetched = true;

  //Token
  const token = localStorage.getItem("token");

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch("http://localhost:5678/api/categories", requestOptions)
    .then((response) => response.text())
    .then((options) => {
      options = JSON.parse(options);
      // Options de catégorie
      emptyCategoryOption();
      options.forEach((option) => {
        let optionHTML = document.createElement("option");
        optionHTML.textContent = option.name;
        optionHTML.value = option.id;
        select.appendChild(optionHTML);
      });
    })
    .catch((error) => console.error(error));
}

/*let isCreateInputsUploadFiles = false;
if (isCreateInputsUploadFiles) {
  return;
}*/

function createInputsUploadFiles() {
  //Galerie où apparaissent les travaux
  let modale = document.querySelector(".modale");
  isCreateInputsUploadFiles = true;
  // Zone upload photo
  const dropArea = document.createElement("div");
  dropArea.id = "dropArea";
  dropArea.classList.add("drop-area");

  //Crée bouton "+ Ajouter Photo"
  btnInputPhoto = document.createElement("button");
  btnInputPhoto.innerText = "+ Ajouter Photo";
  btnInputPhoto.id = "btnInputPhoto";

  //Ajoute le logo d'image lorsque pas d'upload
  const noImageIcon = document.createElement("i");
  noImageIcon.id = "no-image-icon";
  noImageIcon.classList.add("fa-regular", "fa-image");

  //Ajoute le texte lorsque pas d'upload
  const noImageText = document.createElement("p");
  noImageText.id = "noImageText";
  noImageText.textContent = "jpg, png : 4mo max";

  // Création de l'élément label Titre
  let labelTitle = document.createElement("label");
  labelTitle.for = "titre";
  labelTitle.textContent = "Titre";
  labelTitle.id = "labelTitle";

  // Création de l'élément input
  inputTitle.type = "text";
  inputTitle.id = "title"; // identifiant pour lier l'input et le labelTitle

  // Ajout de l'input à l'intérieur du labelTitle
  labelTitle.appendChild(inputTitle);

  // Crée l'input et catégorie + label
  let labelCategory = document.createElement("label");
  labelCategory.textContent = "Catégorie";
  labelCategory.id = "labelCategory";

  // Création de l'élément select
  select.id = "categories"; // identifiant pour l'élément select

  //Crée bouton Valider
  let btnValider = document.createElement("button");
  btnValider.type = "submit";
  btnValider.id = "btnValider";
  btnValider.innerText = "Valider";
  btnValider.style.background = "#a8a4a4";
  btnValider.disabled = true;

  // Ajout des éléments à la dropArea
  dropArea.appendChild(noImageIcon);
  dropArea.appendChild(btnInputPhoto);
  dropArea.appendChild(noImageText);

  // Ajout de la dropArea à l'intérieur de la div avec l'ID "modaleGallery"
  modaleGallery = document.getElementById("modaleGallery");
  modaleGallery.style.display = "flex";
  modaleGallery.style.flexDirection = "column";
  modaleGallery.style.gap = "5px";

  //Rajoute les elements de la 2eme page modale à la gallerie
  modaleGallery.appendChild(dropArea);
  modaleGallery.appendChild(labelTitle);
  modaleGallery.appendChild(inputTitle);
  modaleGallery.appendChild(labelCategory);
  modaleGallery.appendChild(select);

  modale.appendChild(btnValider);
}

function emptyCategoryOption() {
  // Option vide
  let emptyOption = document.createElement("option");
  emptyOption.value = ""; // Valeur vide
  emptyOption.textContent = ""; // Texte vide
  select.appendChild(emptyOption);
}

//Crée la modale et l'affichage de son premier panneau
function creationModale() {
  //Galerie où apparaissent les travaux
  let modale = document.querySelector(".modale");
  modaleTitleFunct();
  //Création du bouton de fermeture "X"
  let closeModale = document.createElement("button");
  closeModale.id = "closeModale";
  closeModale.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  modale.appendChild(closeModale);

  modaleGalleryCreation();
  createAddPhotoButton();

  // Ajout de l'événement de clic au bouton de fermeture
  closeModale.addEventListener("click", function () {
    bgModale.style.display = "none";
  });

  //Bouton "Ajouter une photo" + création de tous les éléments de la galerie d'upload
  addPhotoButton = document.getElementById("addPhoto");
  addPhotoButton.addEventListener("click", (event) => {
    resetGallery();
    arrowLeftBack();
    modaleGallery.style.overflow = "hidden";
    createInputsUploadFiles();
    fetchCategory();

    // Écouteurs d'événements pour vérifier la validité du formulaire
    inputTitle.addEventListener("input", checkFormValidity);
    select.addEventListener("change", checkFormValidity);

    btnInputPhoto.addEventListener("click", function () {
      let inputPhoto = document.createElement("input");
      inputPhoto.type = "file";

      inputPhoto.onchange = function (e) {
        selectedFile = e.target.files[0];
        let reader = new FileReader(); // Créer un objet FileReader
        reader.onload = function (event) {
          // Créer un élément image
          imgInput.src = event.target.result; // Récupérer l'URL de données de l'image
          imgInput.alt = "Image uploadée";
          imgInput.classList.add("thumbnail");
          imgInput.id = "imgToUpload";
          // Afficher l'image dans la div dropArea
          dropArea.innerHTML = ""; // Supprimer le contenu existant de la div
          dropArea.appendChild(imgInput); // Ajouter l'image à la div
          // Vérifier la validité du formulaire après l'upload
          checkFormValidity();
        };
        reader.readAsDataURL(selectedFile); // Lire le contenu du fichier en tant qu'URL de données
      };
      inputPhoto.click();
    });
  });
}

// Fonction pour vérifier si tous les champs sont remplis
function checkFormValidity() {
  if (
    inputTitle.value !== "" &&
    select.value !== "" &&
    dropArea.querySelector("img")
  ) {
    btnValider.style.background = "#1D6154";
    btnValider.disabled = false;
    clickToSubmitWorks();
  } else {
    btnValider.style.background = "#a8a4a4";
    btnValider.disabled = true;
  }
}

//----------------------------Envoi des fichiers sur l'API---------------------
function clickToSubmitWorks() {
  btnValider.addEventListener("click", (event) => {
    event.preventDefault();

    if (!selectedFile) {
      console.error("Image input not found or no file selected");
      alert("Veuillez sélectionner une image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile); // Utilise `selectedFile` pour les fichiers
    formData.append("title", inputTitle.value);
    formData.append("category", select.value);

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const tokenString = localStorage.getItem("token");
    if (!tokenString) {
      console.error("Token not found in localStorage");
      alert("Token non trouvé. Veuillez vous reconnecter.");
      return;
    }

    const obj = JSON.parse(tokenString);

    if (!obj.token) {
      console.error("Token is invalid");
      alert("Token invalide. Veuillez vous reconnecter.");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${obj.token}`);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };

    fetch("http://localhost:5678/api/works/", requestOptions)
      .then((response) => {
        fetchAndDisplayModaleGallery();
        createGallery();
        //WIP
        select = document.getElementById("categories");
        select.value = "";
        inputTitle = document.getElementById("title");
        inputTitle.value = "";
        bgModale.style.display = "none";
        if (!response.ok) {
          let errorMsg = `Erreur ${response.status}: ${response.statusText}`;
          switch (response.status) {
            case 400:
              errorMsg = "Requête incorrecte. Vérifiez les données envoyées.";
              break;
            case 401:
              errorMsg =
                "Non autorisé. Vérifiez votre token d'authentification.";
              break;
            case 404:
              errorMsg = "Ressource non trouvée.";
              break;
            case 500:
              errorMsg = "Erreur serveur. Réessayez plus tard.";
              break;
            default:
              errorMsg = `Erreur inattendue: ${response.statusText}`;
          }
          throw new Error(errorMsg);
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
        alert(`Erreur lors de l'envoi des données : ${error.message}`);
      });
  });
}

//Retire les travaux dans la modale
function removeWorks() {
  // Sélectionner tous les boutons avec la classe "trashCan"
  let trashCans = document.querySelectorAll(".trashCan");

  // Boucler sur chaque élément et ajouter un eventListener
  for (let i = 0; i < trashCans.length; i++) {
    trashCans[i].addEventListener("click", function () {
      let id = trashCans[i].dataset.numeroFigure;
      let figureTargeted = document.getElementById(`figure_${id}`);

      //Token json parse
      const obj = JSON.parse(localStorage.getItem("token"));

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${obj.token}`);

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(`http://localhost:5678/api/works/${id}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log(result);
          modaleGallery.innerHTML = "";
          fetchAndDisplayModaleGallery();
          createGallery();
        })
        .catch((error) => console.error("Error:", error));
    });
  }
}

//---------------------Crée le contenu dans la modale---------------------
// Récupération des données depuis le serveur
function fetchAndDisplayModaleGallery() {
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((works) => {
      let modaleGallery = document.getElementById("modaleGallery");
      // Utilisation des données pour créer le contenu de la modale
      works.forEach(function (work) {
        // Crée la base de la carte + ajout à "gallery"
        let figure = document.createElement("figure");
        figure.className = "modale-works";
        figure.id = `figure_${work.id}`;
        // Création et ajout de l'image
        let worksImg = document.createElement("img");
        worksImg.src = work.imageUrl;
        worksImg.alt = work.title;

        // Crée le bouton poubelle
        let trash = document.createElement("button");
        trash.className = `trashCan`;
        trash.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
        trash.dataset.numeroFigure = work.id;

        figure.appendChild(trash);
        modaleGallery.appendChild(figure);
        figure.appendChild(worksImg);
      });
      // Retire les travaux
      removeWorks();
    })
    .catch((error) => console.error(error));
}

//----------------------------Fonctions au lancement de la page---------------------
//Création de la gallerie de travaux
createGallery();

//Se déconnecter
clickLogOut();

//Ouverture de la modale
openPopUp();

//Fermeture de la modale
modaleClosing();

checkToken();

//Bouton changement panneau modale
addPhotoButton = document.getElementById("addPhoto");
