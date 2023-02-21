const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");

modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal));

function toggleModal(){
    fetch('http://localhost:5678/api/works')

        .then(response => response.json())
        .then(data => {
    // génération des projets via l'api
        for (let i = 0; i < data.length; i++) {

            let figure = document.createElement("figure");
            let img = document.createElement("img"); 
            
            let figcaption = document.createElement("figcaption");
            let galerie = document.querySelector(".galerie");

            figure.setAttribute("category-", data[i].categoryId);
            img.classList.add("edit")
            img.setAttribute("src", data[i].imageUrl);
            img.setAttribute("crossorigin", "anonymous");
            figcaption.textContent = "éditer";

            figures.push(figure);

            galerie.appendChild(figure);
            figure.appendChild(img);
            figure.appendChild(figcaption);

        }
    })
    .catch(error => console.error(error));
    modalContainer.classList.toggle("actives")
}