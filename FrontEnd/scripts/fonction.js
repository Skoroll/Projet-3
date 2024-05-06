
//Création des galleries photos
function createGallery(){
    const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
    
      fetch("http://localhost:5678/api/works", requestOptions)
        .then((response) => response.text())
        .then((works) => {



          //Transforme les données de l'API en JSON
          works = JSON.parse(works)
          //Récupération de l'élément gallery
          gallery = document.querySelector(".gallery")
          //Condition vérifiant l'existant de la zone .gallery
          //Si elle existe alors la fonction se joue
          if(gallery){

            //Création de l'élément
            for(let i = 0; i < works.length; i++){
              figure = document.createElement("figure")
              figure.className ="actual-works"
              gallery.appendChild(figure)
              // Création zone img + ajout source img avec boucle
              // ajout img  à figure et ajout alt
              worksImg = document.createElement("img")
              worksImg.src = works[i].imageUrl
              worksImg.alt = works[i].title
              figure.appendChild(worksImg)
    
              //Ajout attribut alt sur img
              worksImg.alt = works[i].title
    
              //
              figcaption = document.createElement("figcaption")
              figcaption.innerText = works[i].title
              figure.appendChild(figcaption)
    
            }
    

    //Création des sets pour les filtres
    //Objets
    let setObjets = new Set();
    setObjets.add(works[0]);
    setObjets.add(works[5]);        


    let setAppartements = new Set();
    setAppartements.add(works[1]);
    setAppartements.add(works[3]);
    setAppartements.add(works[5]);
    setAppartements.add(works[6]);
    setAppartements.add(works[7]);
    setAppartements.add(works[8]);

    let setHotelRestau = new Set();
    setHotelRestau.add(works[2]);
    setHotelRestau.add(works[9]);
    setHotelRestau.add(works[10]);

    let setTous = new Set()
    setTous.add = works


      //Fonctions de filtrages des travaux
        //Filtres objets
        const filterItems = document.getElementById("items");
        filterItems.addEventListener("click", function (){
          gallery.innerHTML = ""
          let arrayObjets = Array.from(setObjets)

          for(i = 0; i < arrayObjets.length; i++){
            figure = document.createElement("figure")
            figure.className ="actual-works"
            gallery.appendChild(figure)
            // Création zone img + ajout source img avec boucle
            // ajout img  à figure et ajout alt
            worksImg = document.createElement("img")
            worksImg.src = arrayObjets[i].imageUrl
            worksImg.alt = arrayObjets[i].title
            figure.appendChild(worksImg)

            //Ajout attribut alt sur img
            worksImg.alt = arrayObjets[i].title
  
            //
            figcaption = document.createElement("figcaption")
            figcaption.innerText = arrayObjets[i].title
            figure.appendChild(figcaption)
          }        
        })

        //Filtre appartements
          const filterAppartements = document.getElementById("appartements");
          filterAppartements.addEventListener("click", function (){
            gallery.innerHTML = ""
            let arrayAppartements = Array.from(setAppartements)

            for(i = 0; i < arrayAppartements.length; i++){
              figure = document.createElement("figure")
              figure.className ="actual-works"
              gallery.appendChild(figure)
              // Création zone img + ajout source img avec boucle
              // ajout img  à figure et ajout alt
              worksImg = document.createElement("img")
              worksImg.src = arrayAppartements[i].imageUrl
              worksImg.alt = arrayAppartements[i].title
              figure.appendChild(worksImg)

              //Ajout attribut alt sur img
              worksImg.alt = arrayAppartements[i].title

              //
              figcaption = document.createElement("figcaption")
              figcaption.innerText = arrayAppartements[i].title
              figure.appendChild(figcaption)
            }        
          })

                  //Filtre Hôtels & restaurants
                  const filterHaR = document.getElementById("hotelsAndRestaurants");
                  filterHaR.addEventListener("click", function (){
                    gallery.innerHTML = ""
                    let arrayHaR = Array.from(setHotelRestau)
        
                    for(i = 0; i < arrayHaR.length; i++){
                      figure = document.createElement("figure")
                      figure.className ="actual-works"
                      gallery.appendChild(figure)
                      // Création zone img + ajout source img avec boucle
                      // ajout img  à figure et ajout alt
                      worksImg = document.createElement("img")
                      worksImg.src = arrayHaR[i].imageUrl
                      worksImg.alt = arrayHaR[i].title
                      figure.appendChild(worksImg)
        
                      //Ajout attribut alt sur img
                      worksImg.alt = arrayHaR[i].title
        
                      //
                      figcaption = document.createElement("figcaption")
                      figcaption.innerText = arrayHaR[i].title
                      figure.appendChild(figcaption)
                    }        
                  })

                  //Filtre tous
                  const filtreAll = document.getElementById("all");
                  filtreAll.addEventListener("click", function (){
                    gallery.innerHTML = ""
                    //Création de l'élément
                    for(let i = 0; i < works.length; i++){
                      figure = document.createElement("figure")
                      figure.className ="actual-works"
                      gallery.appendChild(figure)
                      // Création zone img + ajout source img avec boucle
                      // ajout img  à figure et ajout alt
                      worksImg = document.createElement("img")
                      worksImg.src = works[i].imageUrl
                      worksImg.alt = works[i].title
                      figure.appendChild(worksImg)
            
                      //Ajout attribut alt sur img
                      worksImg.alt = works[i].title
            
                      //
                      figcaption = document.createElement("figcaption")
                      figcaption.innerText = works[i].title
                      figure.appendChild(figcaption)
            
                    }
                  })
                  

      }else{
        console.log("non")
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
    console.log(logForm)

    //Event Listener de l'envoi du formulaire Log Admin
    logForm.addEventListener("submit", (event)=>{
      event.preventDefault();
      let inputEmailAdmin = emailAdmin.value;
      let inputPasswordAdmin = password.value;

      
      const adminitrator = {
        adminEmail : "sophie.bluel@test.tld",
        adminPassword : "S0phie",
      };
      

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      
      const raw = JSON.stringify({
        email: "sophie.bluel@test.tld",
        password: "S0phie"
        });
        console.log(adminitrator.adminEmail)
        console.log(adminitrator.adminPassword)
      if(inputEmailAdmin === adminitrator.adminEmail && inputPasswordAdmin === adminitrator.adminPassword){

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
            console.log("Token d'identification:", token);
            let viewAsAdministrator = true
            console.log(viewAsAdministrator)
            // Rediriger l'utilisateur vers la page index.html
          // window.location.href = "index.html";
          })
          .catch(error => console.error(error));
      }else{
        console.log("Pas log")
      }
      })

  }
}


