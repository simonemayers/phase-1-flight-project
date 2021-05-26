const form = document.querySelector(".form form")
const ingredients = document.querySelector("tbody tr")


function getRecipes(data){
    results = []
    for(i = 0; i < searchList.length; i++){
        results.push(data.hits.filter(recipe => recipe.recipe.ingredientLines.join(", ").includes(searchList[i])))
    }
    return results
}


function runFetch(){
    const mealType = document.querySelector("#meals").value
    fetch(`https://api.edamam.com/search?q=&app_id=17eadeeb&app_key=d8fc8d8518b03a9649327f7450c78ede&health=alcohol-free&mealType=${mealType}&health=vegan&dishType=main&pancake&preserve&salad&sandwhiches&soup&starter`
    ).then(resp => resp.json()).then(data => getRecipes(data)).then(displayRecipes)
}
function createAlert(message){
    let alert = document.createElement("div")
    alert.id = "overlay"
    alert.textContent = message
    document.body.prepend(alert)
    setTimeout(function(){alert.style.display = "none"}, 2000)
}

form.addEventListener("submit", (e) => {
    e.preventDefault()
    const input = document.querySelector("form input").value
    if(input === ""){
        createAlert("Please type in an ingredient first!")
    } else if(ingredients.innerText.includes(input)){
        createAlert("You already added that ingredient!")
    } else {
        let xButton = document.createElement("button")
        let ingredient = document.createElement("td")
        ingredient.textContent = input
        xButton.textContent = "X"
        ingredients.appendChild(ingredient)
        ingredient.appendChild(xButton)
    }
    form.reset()
})

document.querySelector("table").addEventListener("click", (e) => {
    if(e.target.textContent === "X"){
        e.target.parentNode.remove()
    }
})
let searchList = []
function getIngredients(){
    searchList = []
    return document.querySelectorAll("table td").forEach(ingredient => {
        return searchList.push(ingredient.textContent.split("X")[0].toLowerCase())
    })
}

const recipesContainer = document.querySelector(".recipes-container")

function displayRecipes(recipes){
    recipes.flat().forEach(recipe => {
        let div = document.createElement("div")
        let recipeName = document.createElement("h5")
        let recipeDescription = document.createElement("p")
        let image = document.createElement("img")
        let cardBody = document.createElement("div")
        cardBody.className = "card-body"
        div.className = "recipe card col-sm"
        recipeName.textContent = recipe.recipe.label
        recipeName.className = "card-title"
        image.src = recipe.recipe.image
        image.className = "card-image-top"
        recipeDescription = recipe.recipe.ingredientLines.join(", ")
        recipeDescription.className = "card-text"
        recipesContainer.appendChild(div)
        div.append(image, cardBody)
        cardBody.append(recipeName, recipeDescription)
    })
}  


const findRecipesButton = document.querySelector(".ingredients-list")

function clearIngredientsList(){
    return document.querySelectorAll("tbody td").forEach(td => td.remove())
}

findRecipesButton.addEventListener("submit", (e) => {
    e.preventDefault()
    recipesContainer.innerHTML = ""
    getIngredients()
    runFetch()
    setTimeout(function(){
        if(!document.querySelector(".card")){
            createAlert(`Sorry we couldn't find a recipe for that :(. Try starting over.`)
        }
    }, 400)
    clearIngredientsList()
    
})

