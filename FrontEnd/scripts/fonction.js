

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
      if(gallery){
        // Création des sets
        let setObjets = new Set();
        let setAppartements = new Set();
        let setHandR = new Set();
        let setAll = new Set();
        setAll = works;

  
        for (let i = 0; i < works.length; i++) {
          let category = works[i].category.name;

          // Ajout des works au sets
          switch (category) {
            case "Objets":
              setObjets.add(works[i]);
            break;

            case "Appartements":
              setAppartements.add(works[i]);
            break;

            case "Hotels & restaurants":
              setHandR.add(works[i]);
            break;
          }
        }
        //---------------------Filtres---------------------
        //Appel de la fonction pour créer la gallerie initiale
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

//WIP
function removeWorks() {
  // Sélectionner tous les boutons avec la classe "trashCan"
  let trashCans = document.querySelectorAll(".trashCan");

  // Boucler sur chaque élément et ajouter un eventListener
  for (let i = 0; i < trashCans.length; i++) {
      trashCans[i].addEventListener("click", function() {
        console.log("Test")
      });
  }
}

//Quand le bouton "logout" est cliqué alors retire le statut d'administrateur
function clickLogOut(){
  if (localStorage.getItem('token')) {
    document.getElementById("login").style.display = "none"
    document.getElementById("logout").style.display = "flex"
    document.getElementById("logout").style.fontWeight = "700"  
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

  //---------------------Crée le contenu dans la modale---------------------
  // Récupération des données depuis le serveur
  fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(works => {
      // Utilisation des données pour créer le contenu de la modale
      works.forEach(works => {
        //Crée la base de la carte + ajout à "gallery"
        let figure = document.createElement("figure");
        figure.className = "modale-works"; 
      
        // Création et ajout de l'image
        let worksImg = document.createElement("img");
        worksImg.src = works.imageUrl;
        worksImg.alt = works.title; 
        
        //Crée le bouton poubelle
        let trash = document.createElement("button")
        trash.className = "trashCan"
        trash.innerHTML = `<i class="fa-solid fa-trash-can"></i>`

        figure.appendChild(trash)
        modaleGallery.appendChild(figure);
        figure.appendChild(worksImg);
      });
    })
    .catch(error => console.error(error));

    //Bouton "Ajouter une photo" + création de tous les éléments de la galerie d'upload
    addPhotoButton.addEventListener("click", (event)=>{

      //Retire tout le contenu de modaleGallery
      modaleGallery.innerHTML = "";
      modaleGallery.style.margin = "0";
      addPhotoButton.style.display = "none"
      //Change le texte du titre
      modaleTitle.innerText = "Ajout photo";
      
      //Crée la flèche de retour en arrière
      const arrowLeft = document.createElement("i");
      arrowLeft.className = 'fa-solid fa-arrow-left arrowLeft';
      modale.appendChild(arrowLeft);
      modale.appendChild(modaleGallery)
     
      // Zone upload photo
      const dropArea = document.createElement('div');
      dropArea.id = 'dropArea';
      dropArea.classList.add('drop-area');

      
      //Crée bouton "+ Ajouter Photo"
      btnInputPhoto = document.createElement("button");
      btnInputPhoto.innerText = "+ Ajouter Photo";
      btnInputPhoto.id = "btnInputPhoto"

      
      const icon = document.createElement('i');
      icon.classList.add('fa-regular', 'fa-image');
      

      const noImageIcon = document.createElement('i');
      noImageIcon.id = 'no-image-icon';
      noImageIcon.classList.add('fa-regular', 'fa-image');

      const noImageText = document.createElement('p');
      noImageText.id = 'noImageText';
      noImageText.textContent = 'jpg, png : 4mo max';

      // Création de l'élément label Titre
      let labelTitle = document.createElement("label");
      labelTitle.textContent = "Titre";
      labelTitle.id = "labelTitle"

      // Création de l'élément input
      let inputTitle = document.createElement("input");
      inputTitle.type = "text";
      inputTitle.id = "titre"; // identifiant pour lier l'input et le labelTitle

      // Ajout de l'input à l'intérieur du labelTitle
      labelTitle.appendChild(inputTitle);

      
      // Crée l'input et catégorie + label
      let labelCategory = document.createElement("label");
      labelCategory.textContent = "Catégorie";
      labelCategory.id = "labelCategory";

      // Création de l'élément select
      let select = document.createElement("select");
      select.id = "categories"; // identifiant pour l'élément select

      // Option vide
      let emptyOption = document.createElement("option");
      emptyOption.value = ""; // Valeur vide
      emptyOption.textContent = ""; // Texte vide
      select.appendChild(emptyOption);

      // Options de catégorie
      let options = ["Objets", "Appartements", "Hôtel & Restaurants"];
      options.forEach(optionText => {
          let option = document.createElement("option");
          option.value = optionText.toLowerCase().replace(/\s+/g, '_'); // Valeur de l'option en minuscules et avec des underscores à la place des espaces
          option.textContent = optionText;
          select.appendChild(option);
      });


      //Crée bouton Valider
      let btnValider = document.createElement("button");
      btnValider.type = "submit"
      btnValider.id = "btnValider"
      btnValider.innerText = "Valider"
      btnValider.style.background = "#a8a4a4"
      btnValider.disabled = true


      btnInputPhoto.addEventListener('click', function() {
        let inputPhoto = document.createElement('input');
        inputPhoto.type = 'file';
        
        inputPhoto.onchange = function(e) {
            let file = e.target.files[0];
            let reader = new FileReader(); // Créer un objet FileReader
            
            reader.onload = function(event) {
                // Créer un élément image
                let img = document.createElement('img');
                img.src = event.target.result; // Récupérer l'URL de données de l'image
                img.alt = 'Image uploadée';
                img.classList.add('thumbnail');
                
                // Afficher l'image dans la div dropArea
                dropArea.innerHTML = ''; // Supprimer le contenu existant de la div
                dropArea.appendChild(img); // Ajouter l'image à la div
            };
            
            reader.readAsDataURL(file); // Lire le contenu du fichier en tant qu'URL de données
        }
        
        inputPhoto.click();
    });


      // Ajout des éléments à la dropArea
      dropArea.appendChild(noImageIcon);
      dropArea.appendChild(btnInputPhoto)
      dropArea.appendChild(noImageText);

      // Ajout de la dropArea à l'intérieur de la div avec l'ID "modaleGallery"
      modaleGallery = document.getElementById('modaleGallery');
      modaleGallery.style.display = "flex"
      modaleGallery.style.flexDirection = "column"
      modaleGallery.style.gap = "5px"

      modaleGallery.appendChild(dropArea);
      modaleGallery.appendChild(labelTitle)
      modaleGallery.appendChild(inputTitle)
      modaleGallery.appendChild(labelCategory)
      modaleGallery.appendChild(select)
   
      modale.appendChild(btnValider);

    

        //EventListener flêche retour arrière
        arrowLeft.addEventListener("click", ()=>{
          console.log("click")
          //Retire tout le contenu de modaleGallery
          modale.innerHTML ="";
          //Appel de la fonction creationModale pour réinitialiser le contenu de la modale
          creationModale()
          
          
        }) 

    }) 
}



