

//---------------------Fonction qui crée les éléments HTML suivant les besoin du filtrage
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



//--------------------- Créaction de la gallerie et des filtres
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
        //Appel de la fonction pour créer la gallerie initiale
        addWorksToHTML(setAll, gallery)

        // Click => Tous les travaux
        filterAll.addEventListener("click", function() {
          addWorksToHTML(setAll, gallery);


        });
        // Click => Objets
        
        filterItems.addEventListener("click", function() {
          addWorksToHTML(setObjets, gallery);
      });
        
      // Click => Appartements
    
      filterAppartements.addEventListener("click", function() {
        addWorksToHTML(setAppartements, gallery);
      });
      // Click => Hôtel et Restaurants
      
      filterHandR.addEventListener("click", function() {
        addWorksToHTML(setHandR, gallery);
      });

    }
    
  }

})
  .catch((error) => console.error(error));
}


//---------------------Fonction qui récupère le token dans le localStorage quand log
function getToken() {
  //Input log Admin
  const emailAdmin = document.getElementById("emailAdmin");
  const password = document.getElementById("password");

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
          if (response.ok) {
            return response.text();
          } else {
            erreurLog.style.display = "flex"
            console.log("test")
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

  // Vérifier si le token est défini 
  if (token) {
    document.querySelector(".modeEdition").style.display = "flex"
    document.getElementById("mod").style.display = "flex"
    document.querySelector(".divBtnFilter").style.display = "none"
    document.querySelector(".modale").style.display = "flex"


  }
  
}

//--------------------- Crée l'affichage des travaux dans la modale
function modaleContent() {
  if(modaleGallery)
  // Récupération des données depuis le serveur
  fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(works => {
      // Utilisation des données pour créer le contenu de la modale
      works.forEach(works => {
        //Crée la base de la carte + ajout à "gallery"
        let figure = document.createElement("figure");
        figure.className = "modale-works";
        modaleGallery.appendChild(figure);
      
        // Création et ajout de l'image
        let worksImg = document.createElement("img");
        worksImg.src = works.imageUrl;
        worksImg.alt = works.title; 
        figure.appendChild(worksImg);
      
        //Crée le bouton poubelle
        let trash = document.createElement("button")
        trash.className = "trashCan"
        trash.innerHTML = `<i class="fa-solid fa-trash-can"></i>`
        figure.appendChild(trash)

      });

    })
    .catch(error => console.error(error));
}



function removeWorks() {
  // Sélectionner tous les boutons avec la classe "trashCan"
  let trashCans = document.querySelectorAll(".trashCan");
  // Vérifier le nombre de boutons sélectionnés
  console.log("Nombre de boutons trashCan trouvés :", trashCans.length);
  // Boucler sur chaque élément et ajouter un eventListener
  for (let i = 0; i < trashCans.length; i++) {
      trashCans[i].addEventListener("click", function() {
          console.log("test");
      });
  }
}


//Retire le token quand appellée
function logout(){
  localStorage.removeItem('token');
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
    logout()
    location.reload();
  })
}

//Ferme la modale
function modaleClosing(){
  bgModale.style.display = "none"

  closeModale.addEventListener("click", ()=>{
    bgModale.style.display = "none"
  })
}
// Fermeture modale quand clic en dehors
document.addEventListener("click", function(event) {
    // Vérifier si le clic n'est pas à l'intérieur de la fenêtre modale mais dans la div bgModale
    if (!modale.contains(event.target) && bgModale.contains(event.target) && event.target !== modaleGallery) {
        modaleClosing();
    }
});

//Apparition de la modale en cliquant sur "modifier"
function openPopUp(){
     if(gallery){
       mod.addEventListener("click", ()=>{
         bgModale.style.display = "flex"

     })
  }
}


//Change contenu de la modale
function changeModaleContent(){
  modaleTitle.innerText = "Ajout photo";
  
}


addPhoto.addEventListener("click", (event)=>{
  event.preventDefault();
  changeModaleContent()

})






