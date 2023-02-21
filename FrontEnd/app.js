const userToken = sessionStorage.getItem("token");
const hiddenElements = document.querySelectorAll(".hidden");
const login = document.querySelector(".login");

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

function toggleModal(){
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
    })
    .catch(error => console.error(error));
    modalContainer.classList.toggle("actives")
}

function figureDelete(){

for (let trash of trashIcons) {
    trash.addEventListener("click", function () {
        const workId = icon.getAttribute("data-id");
        fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    });
}

}