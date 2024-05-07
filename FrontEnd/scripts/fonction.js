//Fonction qui crée les éléments HTML suivant les besoin du filtrage
function addWorksToHTML(set, gallery) {

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
      //Récupération de l'élément gallery
      let gallery = document.querySelector(".gallery");
      
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
        let filterAll = document.getElementById("all")
        filterAll.addEventListener("click", function() {
          gallery.innerHTML =""
          addWorksToHTML(setAll, gallery);


        });
        // Click => Objets
        
        filterItems.addEventListener("click", function() {
          gallery.innerHTML =""
          addWorksToHTML(setObjets, gallery);
      });
        
      // Click => Appartements
    
      filterAppartements.addEventListener("click", function() {
        gallery.innerHTML =""
        addWorksToHTML(setAppartements, gallery);
      });
      // Click => Hôtel et Restaurants
      
      filterHandR.addEventListener("click", function() {
        gallery.innerHTML =""
        addWorksToHTML(setHandR, gallery);
      });

    }
  }
})
  .catch((error) => console.error(error));
}






/*
//Fonction login
function apiLogin(){
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
  "email": "sophie.bluel@test.tld",
  "password": "S0phie"
  });

  const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
  };

  fetch("http://localhost:5678/api/users/login", requestOptions)
  .then((response) => response.text())
  .then(token => {
    console.log("Token d'identification:", token);
    //window.location.href = "index.html";
  })
  .catch((error) => console.error(error));

}
*/

function getToken() {
  //Input log Admin
  const emailAdmin = document.getElementById("emailAdmin");
  const password = document.getElementById("password");

  //Conditions qui permettent d'activer la fonction
  //uniquement sur la page concernées
  if(emailAdmin){
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

        // Configurer les options de la requête
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };
        
        // Envoyer la requête pour obtenir le token d'identification
        fetch("http://localhost:5678/api/users/login", requestOptions)
          .then(response => response.text())
          .then(token => {
            // Une fois le token obtenu, vous pouvez le stocker ou l'utiliser comme nécessaire
            localStorage.setItem("Token", token )
            console.log("Log")
            // Rediriger l'utilisateur vers la page index.html
            window.location.href = "index.html";
          })
          .catch(error => console.error(error));


      })

  }
}



// Fonction pour vérifier si le token est présent dans le local storage
function checkToken() {
  // Récupérer le token depuis le local storage
  const token = localStorage.getItem('token');

  // Vérifier si le token est défini et n'est pas null
  if (token) {
    console.log("Heyyy")
      // Si le token est présent, afficher la div "modeEdition"

  } else {
      // Si le token n'est pas présent, cacher la div "modeEdition"

  }
}

// Appeler la fonction au chargement de la page pour vérifier le token
window.onload = checkToken();