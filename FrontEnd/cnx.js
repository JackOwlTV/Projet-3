function pageload(){


    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");
    const connectButton = document.querySelector("#connexion_button");
    let errorConnect = document.querySelector(".error-connect");

    
    let state = {
      email: "",
      password: "",
      error: ""
    };
    
    emailInput.addEventListener("input", event => {
      state.email = event.target.value;
    });
    
    passwordInput.addEventListener("input", event => {
      state.password = event.target.value;
    });
    
    connectButton.addEventListener("click", async event => {
      event.preventDefault();
    
      try {
        const response = await fetch("http://127.0.0.1:5678/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: state.email,
            password: state.password
          })
        });
        const data = await response.json();
    
        if (data.error) {
          state.error = data.error;
        } 
        if (response.status === 401) {
          errorConnect.innerHTML = "Mot de passe incorrect";
        } else if (response.status === 404) {
          errorConnect.innerHTML = "Erreur dans l’identifiant ou le mot de passe";
        }
        else {
          location.href = "index.html#edit-works";
          sessionStorage.setItem("token", data.token);
        }
      } catch (error) {
        console.error(error);
      }
    });
    
}
document.addEventListener('DOMContentLoaded', pageload, false);