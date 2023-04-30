const submitForm = document.querySelector('form');
const input = document.querySelector('input')
const results = document.querySelector('.results');
const modalRecipe = document.querySelector('.modal-wrapper');


// extract source

function extractDomainName(url) {
    if (!url) {
      return "Unknown Source";
    }
    let domain = url.slice(url.indexOf("//") + 2, url.indexOf("/", url.indexOf("//") + 2)); // extract the domain name
    if (domain.startsWith("www.")) { // check if domain starts with "www."
      domain = domain.slice(4); // remove the "www." subdomain
    }
    return domain;
}

// fetch the recipes

function getRecipes(recipe) {
    fetch(`https://themealdb.com/api/json/v1/1/search.php?s=${recipe}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.meals);
            results.innerHTML = '';
            if(data.meals === null) {
                results.innerHTML = `<h3>No recipes found</h3>`;
            } else {
                data.meals.forEach(meal => {
                   
                    results.innerHTML += `
                    <div class="card" onclick="displayMealDetails('${meal.idMeal}')">
                        <div class="card-img-wrapper">
                            <img src="${meal.strMealThumb}" alt="">
                        </div>
                        <div class="card-desc">
                            <h2>${meal.strMeal}</h2>
                            <p>${extractDomainName(meal.strSource)}</p>
                        </div>
                    </div>
                    `
                })
            }
        })
        .catch(err => console.log(err))
    }

// search for recipes

submitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = input.value;
    if(searchTerm) {
        submitForm.reset();
        getRecipes(searchTerm);
    } else {
        alert('Please, enter your favorite foot')
    }
});

// view recipe

function displayMealDetails(mealId) {

    fetch(`https://themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
     .then(response => response.json())
     .then(data => {
        modalRecipe.classList.add('show-modal');
        const meal = data.meals[0];

      
        // get ingredients and measurements

        const ingredients = [];
        const measurements = [];
        for (let i = 1; i <= 20; i++) {
          if (meal[`strIngredient${i}`]) {
            ingredients.push(meal[`strIngredient${i}`]);
            measurements.push(meal[`strMeasure${i}`]);
          } else {
            break;
          }
        }
    
        modalRecipe.innerHTML = `
        <div class="modal">
                 <div class="modal-img-wrapper">
                     <img src="${meal.strMealThumb}" alt="">
                     <button class="modal-close" onclick="closeRecipe()">
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                             <path d="M18.3 5.70998C18.2075 5.61728 18.0976 5.54373 17.9766 5.49355C17.8556 5.44337 17.7259 5.41754 17.595 5.41754C17.464 5.41754 17.3343 5.44337 17.2134 5.49355C17.0924 5.54373 16.9825 5.61728 16.89 5.70998L12 10.59L7.10998 5.69998C7.0174 5.6074 6.90749 5.53396 6.78652 5.48385C6.66556 5.43375 6.53591 5.40796 6.40498 5.40796C6.27405 5.40796 6.1444 5.43375 6.02344 5.48385C5.90247 5.53396 5.79256 5.6074 5.69998 5.69998C5.6074 5.79256 5.53396 5.90247 5.48385 6.02344C5.43375 6.1444 5.40796 6.27405 5.40796 6.40498C5.40796 6.53591 5.43375 6.66556 5.48385 6.78652C5.53396 6.90749 5.6074 7.0174 5.69998 7.10998L10.59 12L5.69998 16.89C5.6074 16.9826 5.53396 17.0925 5.48385 17.2134C5.43375 17.3344 5.40796 17.464 5.40796 17.595C5.40796 17.7259 5.43375 17.8556 5.48385 17.9765C5.53396 18.0975 5.6074 18.2074 5.69998 18.3C5.79256 18.3926 5.90247 18.466 6.02344 18.5161C6.1444 18.5662 6.27405 18.592 6.40498 18.592C6.53591 18.592 6.66556 18.5662 6.78652 18.5161C6.90749 18.466 7.0174 18.3926 7.10998 18.3L12 13.41L16.89 18.3C16.9826 18.3926 17.0925 18.466 17.2134 18.5161C17.3344 18.5662 17.464 18.592 17.595 18.592C17.7259 18.592 17.8556 18.5662 17.9765 18.5161C18.0975 18.466 18.2074 18.3926 18.3 18.3C18.3926 18.2074 18.466 18.0975 18.5161 17.9765C18.5662 17.8556 18.592 17.7259 18.592 17.595C18.592 17.464 18.5662 17.3344 18.5161 17.2134C18.466 17.0925 18.3926 16.9826 18.3 16.89L13.41 12L18.3 7.10998C18.68 6.72998 18.68 6.08998 18.3 5.70998Z" fill="#2A2A2A"/>
                        </svg>                        
                     </button>
                 </div>
                 <div class="modal-content">
                     <article>
                         <div>
                             <h2>${meal.strMeal}</h2>
                             <h3>Instructions:</h3>
                             <p>${meal.strInstructions}</p>
                             <h3>Video: How to make <span>${meal.strMeal}</span></h3>
                           
                         </div>
                     </article>
                     <aside>
                         <div class="modal-content-ingridients">
                             <h4>Ingridients:</h4>
                             <ul>
                             ${getIngredients(meal)}
                             </ul>
                         </div>
                     </aside>
                 </div>
                 <div class="modal-footer">
                     <button class="btn" onclick="closeRecipe()">Close</button>
                 </div>
             </div>
        `;
        
     })
     .catch(err => console.log(err)) 
}

// ingredients formating

function getIngredients(meal) {
    let ingredientsList = '';
    for(let i = 1; i <= 20; i++) { // maximum of 20 ingredients
      if(meal[`strIngredient${i}`]) {
        let measure = meal[`strMeasure${i}`];
        if (measure === 'As required') {
          measure = 'Dash';
        }
        ingredientsList += `<li>${measure} of ${meal[`strIngredient${i}`].toLowerCase()}</li> `;
      } else {
        break;
      }
    }
    return ingredientsList;
  }

// close recipe modal

function closeRecipe() {
    modalRecipe.classList.remove('show-modal');
}