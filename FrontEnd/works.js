/* Variable */

let figures = [];

let elementsFilter = [];

let all = [];

let objects = [];

let appartements = [];

let restaurants = [];

let galleryGrid = "" ;

/* Récupération des projets */

fetch('http://localhost:5678/api/works')

  .then(response => response.json())
  .then(data => {

    for (let i = 0; i < data.length; i++) {

        figure = document.createElement("figure");
        img = document.createElement("img"); 
        figcaption = document.createElement("figcaption");
        galleryGrid = document.querySelector(".gallery");

        figure.setAttribute("category-", data[i].categoryId);
        figure.setAttribute("data-id", data[i].id);
        img.setAttribute("src", data[i].imageUrl);
        img.setAttribute("crossorigin", "anonymous");
        figcaption.innerHTML = data[i].title;

        figures.push(figure);

        galleryGrid.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(figcaption);


    }
})
.catch(error => console.error(error));


/* Récupération des catégories. */

fetch('http://localhost:5678/api/categories')
  .then(response => response.json())
  .then(data => {
    const filtres = document.querySelector('.filtres');
    for (let i = 0; i < data.length; i++) {
      const category = data[i];
      const button = document.createElement('button');
      button.setAttribute('category-', (i + 1));
      button.classList.add('element-filter', + i);
      button.innerText = category.name;
      filtres.appendChild(button);


      /* Variable Filtrage */

      elementsFilter =  document.querySelectorAll(".element-filter");
      all = document.querySelector(".all");
      objects = document.querySelector("#category-");
      appartements = document.querySelector("#category-");
      restaurants = document.querySelector("#category-");
      
      /* Filtrage */
      
      for (let element of elementsFilter) {
        element.addEventListener("click", function(){
          for ( let e of elementsFilter) {
            e.classList.remove("active");
          }
          this.classList.add("active");
          
          for (let figure of figures) {
            if (
              figure.getAttribute("category-") === this.getAttribute("category-") 
            ){
              figure.style.display = "block";} 
            else if (this === all){
              figure.style.display = "block";} 
            else {figure.style.display = "none";}}
        })
      }      

    }
  });
