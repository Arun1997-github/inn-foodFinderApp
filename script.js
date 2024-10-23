let recipeContainer = document.getElementById('recipe-container')
let searchInput = document.getElementById('search-input')
let searchBtn = document.getElementById('search-btn')
let recipeDetailsContent = document.querySelector(".recipe-details-content");
let recipeCloseBtn = document.querySelector(".recipe-close-btn");

//functions to get recipes
const fetchRecipes = async (recipe) => {
    recipeContainer.innerHTML = "<h2>Fetching Recipes.....</h2>";
    const data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${recipe}`
    );
    const response = await data.json()

    if (!response.meals) {
      recipeContainer.innerHTML =
        "<h3>Could not find any recipes matching your search.</h3>";
      return;
    }

    if (recipe.length>0) {
         recipeContainer.innerHTML = "";
         response.meals.forEach((meal) => {
           const recipeDiv = document.createElement("div");
           recipeDiv.classList.add("recipe");
           recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}" />
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Dish</p>
                <p>Belongs to <span>${meal.strCategory}</span> Category</p>
            `;
             
             const button = document.createElement("button");
             button.textContent = "View Recipe";
             recipeDiv.appendChild(button);
           
           //Adding eventListener to recipe button
           button.addEventListener("click", () => {
             openRecipePopup(meal)
           })

             
             recipeContainer.appendChild(recipeDiv);
             
         });
    } else {
        recipeContainer.innerHTML = `<h2>Please enter any recipe</h2>`;
    }
   
}


const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++){
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredientsList += `<li>${measure} ${ingredient}</li>`
    }
    else {
      break;
    }
  }
  return ingredientsList
} 


const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingrendientList">${fetchIngredients(meal)}</ul>
    <div class="recipeInstructions">
      <h3>Instructions:</h3>
      <p >${meal.strInstructions}</p>
    </div>
  `;
  recipeDetailsContent.parentElement.style.display = "block";
}

recipeCloseBtn.addEventListener("click", () => {
  recipeDetailsContent.parentElement.style.display="none"
})


searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchRecipe = searchInput.value.trim();
    searchInput.value = '';
    fetchRecipes(searchRecipe);
})


