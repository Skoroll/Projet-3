
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

            console.log(works.map)
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

console.log(setObjets);
console.log(setAppartements);
console.log(setHotelRestau)
console.log(setTous)

        //Fonctions de filtrages des travaux
        const filterItems = document.getElementById("items");
        filterItems.addEventListener("click", function (){

            document.querySelectorAll(".actual-works").innerHTML = ""           
})

        })
        .catch((error) => console.error(error));
      
      }




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
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

}




