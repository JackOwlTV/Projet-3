const userToken = sessionStorage.getItem("token");
const hiddenElements = document.querySelectorAll(".hidden");
const login = document.querySelector(".login");
const logout = document.querySelector(".logout");
const modifier = document.querySelector("#projet")
const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");
const modalDelete = document.querySelector(".delete-works-modal");
const modalAdd = document.querySelector(".add-works-modal");
const deletAllWorksBtn = document.querySelector(".delete-all-works");
const modalReturn = document.querySelector(".fa-arrow-left");
const openModalAdd = document.querySelector(".add-works");
const modalInputs = document.querySelectorAll(".add-works-modal input");
const modalSelects = document.querySelectorAll(".add-works-modal select");
const select = document.querySelector("select");
const imgInput = document.getElementById("file-input");
const titleInput = document.getElementById("title-input");
const inputImages = document.querySelectorAll(".image-input");
const previewImages = document.querySelectorAll(".preview-image");
const confirmAddWorkButton = document.querySelector(".confirm-add-work-button");
const allowedExtensions = ["jpg", ".jpeg", ".png"];
const maxFileSize = 4 * 1024 * 1024; //4Mo
const editGalleryGrid = document.querySelector(".galerie");
const formAddWorks = document.querySelector(".upload-edit-gallery");



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
let response = [];
let data = [];
let galerie = [];
let figure = [];

for (let inputImage of inputImages) {
  inputImage.addEventListener("change", function () {
    const file = inputImage.files[0];

    if (!allowedExtensions.some((e) => file.name.toLowerCase().endsWith(e))) {
      alert(`Veuillez mettre une image "jpg" ou "png"`);
      return;
    }

    if (file.size > maxFileSize) {
      alert("Image trop volumineuse !");
      return;
    }

    let reader = new FileReader();
    reader.readAsDataURL(inputImage.files[0]);

    reader.onload = function () {
      for (let image of previewImages) {
        image.src = reader.result;
      }
    };

    document.querySelectorAll(".hidden-to-preview").forEach((e) => {
      e.style.display = "none";
    });

    for (let image of previewImages) {
      image.style.display = "block";
    }
  });
}

function removePreviewImage() {
  document.querySelectorAll(".hidden-to-preview").forEach((e) => {
    e.style.display = "block";
  });
  for (let image of previewImages) {
    image.src = "";
    image.style.display = "none";
  }
}

async function getWorks() {
  try {
  const response = await fetch('http://localhost:5678/api/works');
  const data = await response.json();
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

    galerie.append(figure);
    figure.append(img, figcaption, trashIcon);



}

initDeleteWorks();
} catch (error) {
  console.error(error);
  }
}

getWorks();


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
          galleryGrid.innerHTML = "";
          figure.innerHTML = "";
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

function getCategoryOnSelect() {
  fetch("http://localhost:5678/api/categories")
  .then(response => response.json())
  .then(data => {
  for (let i in data) {
  const option = document.createElement("option");
  option.setAttribute("value", data[i].id);
  option.innerHTML = data[i].name;

  select.append(option);
}
})
.catch(error => console.error(error));
}

getCategoryOnSelect(); 

function updateConfirmButton() {
  if (
    titleInput.value.trim() !== "" &&
    select.value !== "no-value" &&
    imgInput.value !== ""
  ) {
    confirmAddWorkButton.classList.add("completed");
  } else {
    confirmAddWorkButton.classList.remove("completed");
  }
}

for (let input of modalInputs) {
  input.addEventListener("input", updateConfirmButton);
}

for (let option of modalSelects) {
  option.addEventListener("change", updateConfirmButton);
}

formAddWorks.addEventListener("submit", async function (event) {
  event.preventDefault();
  if (confirmAddWorkButton.classList.contains("completed")) {
    const postApi = "http://localhost:5678/api/works";

    const formData = new FormData();
    formData.append("title", titleInput.value);
    formData.append("image", imgInput.files[0]);
    formData.append("category", select.value);

    const fetchInit = {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: formData,
    };
    try {
      const response = await fetch(postApi, fetchInit);
      if (response.ok) {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        const reader = new FileReader();
        reader.readAsDataURL(imgInput.files[0]);
        reader.onload = function () {
          img.src = reader.result;
        };

        figure.setAttribute("category-", select.value);
        img.setAttribute("alt", titleInput.value);
        figcaption.innerHTML = titleInput.value;

        galleryGrid.append(figure);
        figure.append(img, figcaption);

        for (let work of figuresWorks) {
          work.remove();
        }
        removePreviewImage();
        backToDeleteWorksModal();
        console.log(`${titleInput.value} a bien été ajouté aux travaux`);
        titleInput.value = "";
        select.value = "no-value";
        editGalleryGrid.innerHTML = "";
        getWorks();
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    alert("Veuillez remplir tous les champs");
  }
});

/* Si l'on click sur le bouton ajouter une photo cela fais apparaitre la seconde modal
    Changer l'input categorie par l'élément pertinant (demander au mentor ou l'élève)
    Faire que quand l'on ajoute une photo elle aparait et aussi faire qu'elle s'ajoute au fichier de l'api
    Faire que l'on puisse lui ajouter un titre et que cela s'ajoute a l'api
    Faire que l'on puisse lui donner une categorie de l'api
    Faire que le bouton valider change de couleur une fois toute les information rentrer
    et qu'au click de ce bouton cela valide et envoie les informations*/