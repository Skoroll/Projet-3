//S'active au chargement complet de la page
document.addEventListener("DOMContentLoaded", function () {
  //Met le "login" en gras
  navLogin = document.getElementById("login")
 navLogin.style.fontWeight = "700";
  initLogin();
});

function initLogin() {
  const logForm = document.querySelector(".logForm");
  //Evenement de clic sur le bouton submit
  logForm.addEventListener("submit", (event) => {
    event.preventDefault();
    //Appelle de l'API pour vérifier l'identification
    getToken();
  });
}

function getToken() {
  //Emplacements des éléments du formulaire
  const inputEmailAdmin = document.getElementById("emailAdmin");
  const inputPasswordAdmin = document.getElementById("password");

  //Récupération des valeurs du formulaire
  const emailValue = inputEmailAdmin.value;
  const passwordValue = inputPasswordAdmin.value;

  //Header de la requête API
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  //Elements envoyé dans la requêtes
  const raw = JSON.stringify({
    email: emailValue,
    password: passwordValue,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:5678/api/users/login", requestOptions)
    .then((response) => {
      console.log("Response status:", response.status); 
      if (response.ok) {
        return response.text(); 
      } else {
        const errorLog = document.getElementById("errorLog");
        if (errorLog) {
          errorLog.style.display = "flex";
        }
        throw new Error("Identifiants non conformes");
      }
    })
    .then((token) => {
     //Token d'identification
      localStorage.setItem("token", token);
      //Retour à la page index.html
      window.location.href = "index.html";
    })
    .catch((error) => console.error("Error:", error));
}
