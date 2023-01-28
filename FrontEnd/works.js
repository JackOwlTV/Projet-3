fetch('http://localhost:5678/api/works')

  .then(response => response.json())
  .then(data => {

    for (let i = 0; i < data.length; i++) {

        let figure = document.createElement("figure");
        let img = document.createElement("img"); 
        let figcaption = document.createElement("figcaption");
        let gallery = document.querySelector(".gallery");

        figure.setAttribute("data-category-id", data[i].categoryId);
        img.setAttribute("src", data[i].imageUrl);
        img.setAttribute("crossorigin", "anonymous");
        figcaption.innerHTML = data[i].title;

        gallery.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(figcaption);


    }
})
.catch(error => console.error(error))

