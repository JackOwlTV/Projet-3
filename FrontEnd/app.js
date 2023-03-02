const userToken = sessionStorage.getItem("token");
const hiddenElements = document.querySelectorAll(".hidden");
const login = document.querySelector(".login");
const modifier = document.querySelector("#projet")
if (userToken) {
    for (let element of hiddenElements) {
      element.classList.remove("hidden");
    }
    login.style.display = "none";
}

const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");


modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal));

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

    figureDelete();
})
.catch(error => console.error(error));

function toggleModal(){
    
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
}
    

function figureDelete(){

for (let trash of trashIcons) {
    trash.addEventListener("click", function () {
        const workId = trash.getAttribute("data-id");
        fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        });
        const figures = document.querySelectorAll("figure");
        
        for (let figure of figures) {
            if (figure.getAttribute("data-id") === workId) {
            figure.remove()
            }
        }
    });
}

}

/* Si l'on click sur le bouton ajouter une photo cela fais apparaitre la seconde modal
    Changer l'input categorie par l'élément pertinant (demander au mentor ou l'élève)
    Faire que quand l'on ajoute une photo elle aparait et aussi faire qu'elle s'ajoute au fichier de l'api
    Faire que l'on puisse lui ajouter un titre et que cela s'ajoute a l'api
    Faire que l'on puisse lui donner une categorie de l'api
    Faire que le bouton valider change de couleur une fois toute les information rentrer
    et qu'au click de ce bouton cela valide et envoie les informations*/