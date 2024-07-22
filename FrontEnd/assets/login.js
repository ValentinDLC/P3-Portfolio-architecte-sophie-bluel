const form = document.getElementById("form");

const email = document.getElementById("email");

const password = document.getElementById("password");

const error = document.querySelector(".error-message");
error.innerText = "";

function welcomeHome() {
  document.location.href = "./index.html";
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  let user = {
    email: email.value,
    password: password.value,
  };

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((Response) => {
      if (Response.ok) {
        return Response.json();
      } else if (Response.status === 401) {
        console.log("unauthorized");
        error.innerText = "Erreur de Mot de passe et/ou identifiant";
        //if status 404, display unknow user
      } else if (Response.status === 404) {
        console.log("user not found");
        error.innerText = "Utilisateur inconnu";
      }
    })

    .then((data) => {
      sessionStorage.setItem("token", data.token);

      welcomeHome();
    })

    .catch((error) => {
      console.log(error);
    });
});
