const userToken = sessionStorage.getItem("token");
const hiddenElements = document.querySelectorAll(".hidden");
const login = document.querySelector(".login");
const modifier = document.querySelector("#projet")
const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");
const modalDelete = document.querySelector(".delete-works-modal");
const modalAdd = document.querySelector(".add-works-modal");
const deletAllWorksBtn = document.querySelector(".delete-all-works");
const modalReturn = document.querySelector(".fa-arrow-left");
const openModalAdd = document.querySelector(".add-works");


if (userToken) {
    for (let element of hiddenElements) {
      element.classList.remove("hidden");
    }
    login.style.display = "none";
}

modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal));
openModalAdd.addEventListener("click", function(){
    modalAdd.classList.remove("inactif");
    modalDelete.classList.add("inactif");
})

modalReturn.addEventListener("click", function(){
    modalAdd.classList.add("inactif");
    modalDelete.classList.remove("inactif");
})

let trashIcons = [];

fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {
    // génération des projets via l'api
    for (let i = 0; i < data.length; i++) {

        let figure = document.createElement("figure");
        let img = document.createElement("img"); 
        let trashIcon = document.createElement("i");
        let figcaption = document.createElement("figcaption");
        let galerie = document.querySelector(".galerie");

        figure.setAttribute("category-", data[i].categoryId);
        figure.setAttribute("data-id", data[i].id);
        img.classList.add("edit");
        trashIcon.classList = ("fa-solid" + " " + "fa-trash-can");
        trashIcon.setAttribute("data-id", data[i].id);
        img.setAttribute("src", data[i].imageUrl);
        img.setAttribute("crossorigin", "anonymous");
        figcaption.textContent = "éditer";

        trashIcons.push(trashIcon);

        galerie.appendChild(figure);
        figure.appendChild(trashIcon);
        figure.appendChild(img);
        figure.appendChild(figcaption);

    }
        initDeleteWorks();
})
.catch(error => console.error(error));

for (let button of modalTriggers) {
    button.addEventListener("click", function () {
        modalContainer.classList.remove("actives");
        if (
            modalContainer.getAttribute("data-modal") ===
            button.getAttribute("data-modal")
        ) {
            modalContainer.classList.add("actives");
        }  
    })
}
    
function initDeleteWorks() {
    // pour un travail
    for (let trash of trashIcons) {
      trash.addEventListener("click", function () {
        const workId = trash.getAttribute("data-id");
        deleteWork(workId);
      });
    }
  
    // pour tous les travaux
    deletAllWorksBtn.addEventListener("click", async function () {
      if (confirm("Êtes-vous sûr de vouloir supprimer tous les travaux ?")) {
        try {
          for (let i in data) {
            const workId = data[i].id;
            deleteWork(workId);
          }
          galerie.innerHTML = "";
          gallery.innerHTML = "";
          console.log("Tous les travaux ont été supprimés");
          if (!response.ok) {
            throw new Error("Erreur lors de la suppression des éléments");
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
}

async function deleteWork(workId) {
    try {
      const fetchInit = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
  
      const response = await fetch(
        `http://localhost:5678/api/works/${workId}`,
        fetchInit
      );
      if (response.ok) {
        const figures = document.querySelectorAll("figure");
        for (let figure of figures) {
          if (figure.getAttribute("data-id") === workId) {
            figure.remove();
            console.log(
              `${figure.querySelector("img").alt} a été supprimé avec succès`
            );
          }
        }
      } else throw new Error("Erreur lors de la suppression de l'élément");
    } catch (error) {
      console.error(error);
    }
  }


/* Si l'on click sur le bouton ajouter une photo cela fais apparaitre la seconde modal
    Changer l'input categorie par l'élément pertinant (demander au mentor ou l'élève)
    Faire que quand l'on ajoute une photo elle aparait et aussi faire qu'elle s'ajoute au fichier de l'api
    Faire que l'on puisse lui ajouter un titre et que cela s'ajoute a l'api
    Faire que l'on puisse lui donner une categorie de l'api
    Faire que le bouton valider change de couleur une fois toute les information rentrer
    et qu'au click de ce bouton cela valide et envoie les informations*/