document.addEventListener("DOMContentLoaded", function () {
  // Call your initLogin function or any other relevant code here
  initLogin();
});

function initLogin() {
  // Attach event listener to the form submission
  const logForm = document.querySelector(".logForm");
  if (logForm) {
    logForm.addEventListener("submit", (event) => {
      event.preventDefault();
      getToken();
    });
  } else {
    console.error("Log form not found");
  }
}

function getToken() {
  // Get input values
  const inputEmailAdmin = document.getElementById("emailAdmin");
  const inputPasswordAdmin = document.getElementById("password");

  const emailValue = inputEmailAdmin.value;
  const passwordValue = inputPasswordAdmin.value;

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

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
      console.log("Response status:", response.status); // Log the response status
      if (response.ok) {
        return response.text(); // Get the response as plain text
      } else {
        const errorLog = document.getElementById("errorLog");
        if (errorLog) {
          errorLog.style.display = "flex";
          console.log("test");
        } else {
          console.error("Error log element not found");
        }
        throw new Error("Invalid credentials");
      }
    })
    .then((token) => {
      // Store the token in localStorage
      localStorage.setItem("token", token);
      // Redirect to the index.html page
      window.location.href = "index.html";
    })
    .catch((error) => console.error("Error:", error));
}
