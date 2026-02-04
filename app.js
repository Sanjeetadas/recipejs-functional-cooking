// Recipe data
const RecipeApp = (() => {
  console.log("RecipeApp initializing...");

const recipes = [
  {
    id: 1,
    title: "Pasta",
    difficulty: "Medium",
    time: 20,
    ingredients: ["Pasta", "Salt", "Oil", "Garlic", "Tomato Sauce"],
    steps: [
      "Boil water",
      "Add pasta and salt",
      {
        text: "Prepare sauce",
        substeps: [
          "Heat oil",
          "Add garlic",
          {
            text: "Make spice mix",
            substeps: ["Add chili flakes", "Add pepper"]
          }
        ]
      },
      "Mix pasta with sauce",
      "Serve hot"
    ]
  },

  {
    id: 2,
    title: "Sandwich",
    difficulty: "Medium",
    time: 10,
    ingredients: ["Bread", "Butter", "Vegetables", "Salt", "Pepper"],
    steps: [
      "Take bread slices",
      "Apply butter",
      "Add vegetables",
      "Sprinkle salt and pepper",
      "Close sandwich and cut"
    ]
  },

  {
    id: 3,
    title: "Omelette",
    difficulty: "Easy",
    time: 15,
    ingredients: ["Eggs", "Salt", "Onion", "Oil", "Pepper"],
    steps: [
      "Break eggs into bowl",
      "Add salt and pepper",
      "Beat eggs well",
      "Heat oil in pan",
      "Pour egg mixture",
      "Cook until golden"
    ]
  },

  {
    id: 4,
    title: "Fried Rice",
    difficulty: "Hard",
    time: 25,
    ingredients: ["Rice", "Oil", "Vegetables", "Soy Sauce", "Salt"],
    steps: [
      "Boil rice and drain water",
      {
        text: "Prepare vegetables",
        substeps: [
          "Chop vegetables",
          "Heat oil in pan",
          {
            text: "Cook vegetables",
            substeps: ["Add onion", "Add carrot", "Stir fry"]
          }
        ]
      },
      "Add rice",
      "Add soy sauce and salt",
      "Mix well and serve"
    ]
  },

  {
    id: 5,
    title: "Tea",
    difficulty: "Easy",
    time: 10,
    ingredients: ["Water", "Tea leaves", "Milk", "Sugar"],
    steps: [
      "Boil water",
      "Add tea leaves",
      "Add milk",
      "Add sugar",
      "Strain and serve"
    ]
  },

  {
    id: 6,
    title: "Salad",
    difficulty: "Easy",
    time: 10,
    ingredients: ["Lettuce", "Tomato", "Cucumber", "Salt", "Lemon"],
    steps: [
      "Wash vegetables",
      "Chop vegetables",
      "Add salt and lemon",
      "Mix well",
      "Serve fresh"
    ]
  },

  {
    id: 7,
    title: "Soup",
    difficulty: "Medium",
    time: 30,
    ingredients: ["Water", "Vegetables", "Salt", "Pepper", "Garlic"],
    steps: [
      "Boil water",
      {
        text: "Prepare vegetables",
        substeps: [
          "Chop vegetables",
          "Heat oil",
          {
            text: "Cook base",
            substeps: ["Add garlic", "Add vegetables", "Stir well"]
          }
        ]
      },
      "Add vegetables to water",
      "Add salt and pepper",
      "Simmer and serve"
    ]
  },

  {
    id: 8,
    title: "Pancakes",
    difficulty: "Hard",
    time: 20,
    ingredients: ["Flour", "Milk", "Egg", "Sugar", "Butter"],
    steps: [
      "Mix flour and sugar",
      "Add milk and egg",
      "Whisk batter",
      "Heat pan and add butter",
      "Pour batter",
      "Cook both sides",
      "Serve with syrup"
    ]
  }
];


let currentFilter = "all";
let currentSort = "none";

// DOM selection
const recipeContainer = document.querySelector('#recipe-container');
const filterButtons = document.querySelectorAll('[data-filter]');
const sortButtons = document.querySelectorAll('[data-sort]');

const renderSteps = (steps, level = 0) => {
  let html = "<ul class='steps-level-" + level + "'>";

  steps.forEach(step => {
    if (typeof step === "string") {
      html += `<li>${step}</li>`;
    } else {
      html += `<li>${step.text}`;
      html += renderSteps(step.substeps, level + 1);
      html += `</li>`;
    }
  });

  html += "</ul>";
  return html;
};

const createStepsHTML = (steps) => {
  return `
    <div class="steps-container">
      ${renderSteps(steps)}
    </div>
  `;
};

// Function to create recipe card
const createRecipeCard = (recipe) => {
  return `
    <div class="recipe-card" data-recipe-id="${recipe.id}">
      <h3>${recipe.title}</h3>

      <button class="toggle-btn" data-toggle="steps">Show Steps</button>
      <button class="toggle-btn" data-toggle="ingredients">Show Ingredients</button>

      <div class="ingredients-container">
        <ul>
          ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
        </ul>
      </div>

      ${createStepsHTML(recipe.steps)}
    </div>
  `;
};

const filterByDifficulty = (recipes, level) => {
    return recipes.filter(
        recipe => recipe.difficulty.toLowerCase() === level.toLowerCase()
    );
};

const filterByTime = (recipes, maxTime) => {
    return recipes.filter(recipe => recipe.time < maxTime);
};

const applyFilter = (recipes, filterType) => {
    switch (filterType) {
        case "easy":
            return filterByDifficulty(recipes, "easy");
        case "medium":
            return filterByDifficulty(recipes, "medium");
        case "hard":
            return filterByDifficulty(recipes, "hard");
        case "quick":
            return filterByTime(recipes, 20);
        default:
            return recipes;
    }
};

const sortByName = (recipes) => {
    return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
};

const sortByTime = (recipes) => {
    return [...recipes].sort((a, b) => a.time - b.time);
};

const applySort = (recipes, sortType) => {
    switch (sortType) {
        case "name":
            return sortByName(recipes);
        case "time":
            return sortByTime(recipes);
        default:
            return recipes;
    }
};

const updateDisplay = () => {
    let recipesToDisplay = recipes;

    recipesToDisplay = applyFilter(recipesToDisplay, currentFilter);
    recipesToDisplay = applySort(recipesToDisplay, currentSort);

    renderRecipes(recipesToDisplay);
    updateActiveButtons();
};

const updateActiveButtons = () => {
    filterButtons.forEach(btn => {
        btn.classList.remove("active");
        if (btn.dataset.filter === currentFilter) {
            btn.classList.add("active");
        }
    });

    sortButtons.forEach(btn => {
        btn.classList.remove("active");
        if (btn.dataset.sort === currentSort) {
            btn.classList.add("active");
        }
    });
};

const handleFilterClick = (event) => {
    currentFilter = event.target.dataset.filter;
    updateDisplay();
};

const handleSortClick = (event) => {
    currentSort = event.target.dataset.sort;
    updateDisplay();
};

const handleToggleClick = (e) => {
  if (!e.target.classList.contains("toggle-btn")) return;

  const button = e.target;
  const card = button.closest(".recipe-card");
  const toggleType = button.dataset.toggle;

  const container = card.querySelector(`.${toggleType}-container`);

  container.classList.toggle("visible");

  if (container.classList.contains("visible")) {
  button.textContent = `Hide ${toggleType}`;
  button.classList.add("active");
  } else {
  button.textContent = `Show ${toggleType}`;
  button.classList.remove("active");
  }
};

const init = () => {
  setupEventListeners();
  updateDisplay();
};

const setupEventListeners = () => {
    filterButtons.forEach(btn => {
        btn.addEventListener("click", handleFilterClick);
    });

    sortButtons.forEach(btn => {
        btn.addEventListener("click", handleSortClick);
    });

    recipeContainer.addEventListener("click", handleToggleClick);
    console.log("Event listeners attached!");

};

// Render function
const renderRecipes = (recipesToRender) => {
    const recipeCardsHTML = recipesToRender
        .map(createRecipeCard)
        .join('');

    recipeContainer.innerHTML = recipeCardsHTML;
};

// Initialize app
// renderRecipes(recipes);
  return {
    init,
    updateDisplay
  };
})();

RecipeApp.init();
console.log("RecipeApp ready!");