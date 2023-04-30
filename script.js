const submitForm = document.querySelector('form');
const input = document.querySelector('input')
const results = document.querySelector('.results');



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
                    <div class="card">
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