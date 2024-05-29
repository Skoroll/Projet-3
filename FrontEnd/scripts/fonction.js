//Galerie où apparaissent les travaux
let gallery = document.querySelector(".gallery");

const modale = document.querySelector(".modale");

// Création des sets
let setObjets = new Set();
let setAppartements = new Set();
let setHandR = new Set();
let setAll = new Set();


//Titre modale
let modalTitle = document.getElementById("modaleTitle");

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

//Input log Admin
const emailAdmin = document.getElementById("emailAdmin");
const password = document.getElementById("password");

//Input envoi API
let imgInput = document.createElement('img'); //Affiche l'image uploadé en thumbnail
let selectedFile; //Pour envoyer l'image à l'upload
let inputTitle = document.createElement("input"); //Input du titre à l'upload
let select = document.createElement("select"); // Input catégorie à l'upload

//---------------------Fonction qui crée les éléments HTML suivant les besoin du filtrage---------------------
function addWorksToHTML(set, gallery) {
  gallery.innerHTML =""
  set.forEach(works => {
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


function placeWorksOnFilter(data){
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
function filtersListeners(){
  //Appel de la fonction pour créer la galerie initiale
  addWorksToHTML(setAll, gallery)
  // Filtre => Tous les travaux
  filterAll.addEventListener("click", function() {
    addWorksToHTML(setAll, gallery);
  });
  // Filtre => Objets
  filterItems.addEventListener("click", function() {
    addWorksToHTML(setObjets, gallery);
  });
  // Filtre => Appartements
  filterAppartements.addEventListener("click", function() {
    addWorksToHTML(setAppartements, gallery);
  });
  // Filtre => Hôtel et Restaurants
  filterHandR.addEventListener("click", function() {
    addWorksToHTML(setHandR, gallery);
  });
}


//--------------------- Créaction de la gallerie et des filtres---------------------
function createGallery(){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  fetch("http://localhost:5678/api/works", requestOptions)
    .then((response) => response.text())
    .then((works) => {
      if(gallery){
        //Transforme les données de l'API en JSON
        works = JSON.parse(works);

        //Condition vérifiant l'existant de la zone .gallery
        //Si elle existe alors la fonction se joue
          placeWorksOnFilter(works)
          setAll = works;
          filtersListeners()
      }
    })
    .catch((error) => console.error(error));
}


//---------------------Fonction qui récupère le token dans le localStorage quand log---------------------
function getToken() {
  //Conditions qui permettent d'activer la fonction
  //uniquement sur la page concernées
  if(emailAdmin){
    document.getElementById("login").style.fontWeight = "700"
    //Récupération des infos entrées pour log 
    const logForm = document.querySelector(".logForm ")

    //Event Listener de l'envoi du formulaire Log Admin
    logForm.addEventListener("submit", (event)=>{
      event.preventDefault();
      let inputEmailAdmin = emailAdmin.value;
      let inputPasswordAdmin = password.value;

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      
      const raw = JSON.stringify({
        email: inputEmailAdmin,
        password: inputPasswordAdmin
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };
        
      // Envoyer la requête pour obtenir le token d'identification
      fetch("http://localhost:5678/api/users/login", requestOptions)
        .then(response => {

          //Si info log-in correspondent :
          if (response.ok) {
            return response.text();
          } else {
            //Sinon, message d'erreur
            erreurLog.style.display = "flex"
            throw new Error("Identifiants incorrects");
          }
        })
        .then(token => {
          // Stock le token dans le localStorage
          localStorage.setItem("token", token);

          // Retour à la page index.html
          window.location.href = "index.html";
        })
        .catch(error => console.error(error));
    });
  }
}

//--------------------- Fonction pour vérifier si le token est présent dans le local storage
function checkToken() {
  // Récupérer le token depuis le local storage
  const token = localStorage.getItem('token');

  // Vérifier si le token est acquis
  if (token) {
    //S'il est acquis, change l'affichage de ces éléments :
    document.querySelector(".modeEdition").style.display = "flex"
    document.getElementById("mod").style.display = "flex"
    document.querySelector(".divBtnFilter").style.display = "none"
    document.querySelector(".modale").style.display = "flex"
  }
}

//Retire les travaux dans la modale
function removeWorks() {
  // Sélectionner tous les boutons avec la classe "trashCan"
  let trashCans = document.querySelectorAll(".trashCan");

  // Boucler sur chaque élément et ajouter un eventListener
  for (let i = 0; i < trashCans.length; i++) {
      trashCans[i].addEventListener("click", function() {
        let id = trashCans[i].dataset.numeroFigure
        let figureTargeted = document.getElementById(`figure_${id}`)

        //Token json parse
        const obj = JSON.parse(localStorage.getItem("token"));

      const myHeaders = new Headers();
      myHeaders.append("Authorization",`Bearer ${obj.token}` );

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
      };
      
      fetch(`http://localhost:5678/api/works/${id}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        modaleGallery.innerHTML = "";
        fetchAndDisplayModaleGallery();
        createGallery();
      })
      .catch((error) => console.error('Error:', error));
    });
  }
}

//Quand le bouton "logout" est cliqué alors retire le statut d'administrateur
function clickLogOut(){
  if (localStorage.getItem('token')) {
    document.getElementById("login").style.display = "none"
    document.getElementById("logout").style.display = "flex"
  }
  let btnLogout = document.getElementById("logout")
  btnLogout.addEventListener("click", () =>{
    localStorage.removeItem('token');
    location.reload();
  })
}

//Fonction de fermeture de la modale
function modaleClosing(){
  if(gallery){
      if(bgModale.style.display === "flex"){
        bgModale.style.display = "none"
      }
  }
}

// Fermeture modale quand clic en dehors
document.addEventListener("click", function(event) {
    // Vérifier si le clic n'est pas à l'intérieur de la fenêtre modale mais dans la div bgModale
    if(gallery){
      if (!modale.contains(event.target) && bgModale.contains(event.target) && event.target !== modaleGallery) {
          modaleClosing();
      }
    }
});

//Apparition de la modale en cliquant sur "modifier"
function openPopUp(){
    if(gallery){
      mod.addEventListener("click", ()=>{
        modale.innerHTML = ""
        bgModale.style.display = "flex"
        creationModale()  
     })
  }
}


//---------------------Modale---------------------

//Crée la modale et l'affichage de son premier panneau
function creationModale(){
  // Création du titre et du bouton de fermeture
  let modaleTitle = document.createElement("p");
  modaleTitle.id = "modaleTitle";
  modaleTitle.textContent = "Galerie photo";
  modale.appendChild(modaleTitle);

  //Création du bouton de fermeture "X"
  let closeModale = document.createElement("button");
  closeModale.id = "closeModale";
  closeModale.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  modale.appendChild(closeModale);

  // Création de la galerie
  let modaleGallery = document.createElement("div");
  modaleGallery.id = "modaleGallery";
  modale.appendChild(modaleGallery);
  fetchAndDisplayModaleGallery()
  // Ajout du bouton "Ajouter une photo"
  let addPhotoButton = document.createElement("input");
  addPhotoButton.type = "submit";
  addPhotoButton.id = "addPhoto";
  addPhotoButton.value = "Ajouter une photo";
  modale.appendChild(addPhotoButton);

  // Ajout de l'événement de clic au bouton de fermeture
  closeModale.addEventListener("click", function() {
    bgModale.style.display = "none";
  });

    //Bouton "Ajouter une photo" + création de tous les éléments de la galerie d'upload
    addPhotoButton.addEventListener("click", (event)=>{

      //Retire tout le contenu de modaleGallery
      modaleGallery.innerHTML = "";
      modaleGallery.style.margin = "auto";
      addPhotoButton.style.display = "none"
      //Change le texte du titre
      modaleTitle.innerText = "Ajout photo";
      
      //Crée la flèche de retour en arrière
      const arrowLeft = document.createElement("i");
      arrowLeft.className = 'fa-solid fa-arrow-left arrowLeft';
      modale.appendChild(arrowLeft);
      modale.appendChild(modaleGallery)
     
      modaleGallery.style.overflow = "hidden"

      // Zone upload photo
      const dropArea = document.createElement('div');
      dropArea.id = 'dropArea';
      dropArea.classList.add('drop-area');

      
      //Crée bouton "+ Ajouter Photo"
      btnInputPhoto = document.createElement("button");
      btnInputPhoto.innerText = "+ Ajouter Photo";
      btnInputPhoto.id = "btnInputPhoto"

      //Ajoute le logo d'image lorsque pas d'upload
      const noImageIcon = document.createElement('i');
      noImageIcon.id = 'no-image-icon';
      noImageIcon.classList.add('fa-regular', 'fa-image');

      //Ajoute le texte lorsque pas d'upload
      const noImageText = document.createElement('p');
      noImageText.id = 'noImageText';
      noImageText.textContent = 'jpg, png : 4mo max';

      // Création de l'élément label Titre
      let labelTitle = document.createElement("label");
      labelTitle.for = ("titre")
      labelTitle.textContent = "Titre";
      labelTitle.id = "labelTitle"

      // Création de l'élément input
      inputTitle.type = "text";
      inputTitle.id = "titre"; // identifiant pour lier l'input et le labelTitle

      // Ajout de l'input à l'intérieur du labelTitle
      labelTitle.appendChild(inputTitle);

      
      // Crée l'input et catégorie + label
      let labelCategory = document.createElement("label");
      labelCategory.textContent = "Catégorie";
      labelCategory.id = "labelCategory";

      // Création de l'élément select
      select.id = "categories"; // identifiant pour l'élément select

      // Option vide
      let emptyOption = document.createElement("option");
      emptyOption.value = ""; // Valeur vide
      emptyOption.textContent = ""; // Texte vide
      select.appendChild(emptyOption);


    //Token json parse
    const obj = JSON.parse(localStorage.getItem("token"));

    const myHeaders = new Headers();
    myHeaders.append("Authorization",`Bearer ${obj.token}` );
      
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };
      
      fetch("http://localhost:5678/api/categories", requestOptions)
        .then((response) => response.text())
        .then((options) =>{
          options = JSON.parse(options)
            // Options de catégorie
            options.forEach(option => {
            let optionHTML = document.createElement("option");
            optionHTML.textContent = option.name;
            optionHTML.value = option.id;
            select.appendChild(optionHTML);
            })
        })
        .catch((error) => console.error(error));

      //Crée bouton Valider
      let btnValider = document.createElement("button");
      btnValider.type = "submit"
      btnValider.id = "btnValider"
      btnValider.innerText = "Valider"
      btnValider.style.background = "#a8a4a4"
      btnValider.disabled = true

      // Ajout des éléments à la dropArea
      dropArea.appendChild(noImageIcon);
      dropArea.appendChild(btnInputPhoto)
      dropArea.appendChild(noImageText);

      // Ajout de la dropArea à l'intérieur de la div avec l'ID "modaleGallery"
      modaleGallery = document.getElementById('modaleGallery');
      modaleGallery.style.display = "flex";
      modaleGallery.style.flexDirection = "column";
      modaleGallery.style.gap = "5px";

      //Rajoute les elements de la 2eme page modale à la gallerie
      modaleGallery.appendChild(dropArea);
      modaleGallery.appendChild(labelTitle)
      modaleGallery.appendChild(inputTitle)
      modaleGallery.appendChild(labelCategory)
      modaleGallery.appendChild(select)
   
    
      modale.appendChild(btnValider);

    // Fonction pour vérifier si tous les champs sont remplis
    function checkFormValidity() {
      if (inputTitle.value !== "" && select.value !== "" && dropArea.querySelector('img')) {
          btnValider.style.background = "#1D6154";
          btnValider.disabled = false;
          clickToSubmitWorks()
          
      } else {
          btnValider.style.background = "#a8a4a4";
          btnValider.disabled = true;
      }
  }

  // Écouteurs d'événements pour vérifier la validité du formulaire
  inputTitle.addEventListener('input', checkFormValidity);
  select.addEventListener('change', checkFormValidity);


  btnInputPhoto.addEventListener('click', function() {
      let inputPhoto = document.createElement('input');
      inputPhoto.type = 'file';
      
      inputPhoto.onchange = function(e) {
        selectedFile = e.target.files[0];
        let reader = new FileReader(); // Créer un objet FileReader
          
          reader.onload = function(event) {
              // Créer un élément image
              imgInput.src = event.target.result; // Récupérer l'URL de données de l'image
              imgInput.alt = 'Image uploadée';
              imgInput.classList.add('thumbnail');
              imgInput.id = "imgToUpload"

              // Afficher l'image dans la div dropArea
              dropArea.innerHTML = ''; // Supprimer le contenu existant de la div
              dropArea.appendChild(imgInput); // Ajouter l'image à la div

              // Vérifier la validité du formulaire après l'upload
              checkFormValidity();
          };
          reader.readAsDataURL(selectedFile); // Lire le contenu du fichier en tant qu'URL de données
      }
      inputPhoto.click();
  });


      //EventListener flêche retour arrière
      arrowLeft.addEventListener("click", ()=>{
      //Retire tout le contenu de modaleGallery
      modale.innerHTML ="";
      //Appel de la fonction creationModale pour réinitialiser le contenu de la modale
      creationModale()
        }) 
    }) 
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
      redirect: "follow"
    };

    fetch("http://localhost:5678/api/works/", requestOptions)
      .then((response) => {
        if (!response.ok) {
          let errorMsg = `Erreur ${response.status}: ${response.statusText}`;
          switch (response.status) {
            case 400:
              errorMsg = "Requête incorrecte. Vérifiez les données envoyées.";
              break;
            case 401:
              errorMsg = "Non autorisé. Vérifiez votre token d'authentification.";
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
        alert("Les données ont été envoyées avec succès !");
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
        alert(`Erreur lors de l'envoi des données : ${error.message}`);
      });
  });
}



//---------------------Crée le contenu dans la modale---------------------
// Récupération des données depuis le serveur
function fetchAndDisplayModaleGallery() {
  fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(works => {
      let modaleGallery = document.getElementById("modaleGallery");
      // Utilisation des données pour créer le contenu de la modale
      works.forEach(function(work) {
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
    .catch(error => console.error(error));
}

//----------------------------Fonctions au lancement de la page---------------------
//Création de la gallerie de travaux
createGallery()

//Obtient le token d'identification
getToken()

//Se déconnecter
clickLogOut()

//Vérifie si le token est présent quand la page se charge
window.onload = checkToken();

//Ouverture de la modale
openPopUp()

//Fermeture de la modale
modaleClosing()




//Bouton changement panneau modale
const addPhotoButton = document.getElementById("addPhoto");