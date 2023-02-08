function pageload(){


    const userInput = document.querySelector("#user");
    const passwordInput = document.querySelector("#password");
    const connectButton = document.querySelector("#connexion_button");
    
    let state = {
      user: "",
      password: "",
      error: ""
    };
    
    userInput.addEventListener("input", event => {
      state.user = event.target.value;
    });
    
    passwordInput.addEventListener("input", event => {
      state.password = event.target.value;
    });
    
    connectButton.addEventListener("click", async event => {
      event.preventDefault();
    
      try {
        const response = await fetch("http://localhost:5678/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user: state.user,
            password: state.password
          })
        });
        const data = await response.json();
    
        if (data.error) {
          state.error = data.error;
        } else {
          // navigate to next page or display success message
        }
      } catch (error) {
        console.error(error);
      }
    });
    
    
}
document.addEventListener('DOMContentLoaded', pageload, false);