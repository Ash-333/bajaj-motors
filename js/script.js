const motorcyclesData = {
  Pulsar: [
    { name: "PULSAR 220F ABS" },
    { name: "PULSAR 150 TD" },
    { name: "PULSAR 150" },
    { name: "PULSAR 125" },
    { name: "PULSAR NS400Z" },
    { name: "PULSAR NS 200 ABS FI" },
  ],
  Dominar: [
    { name: "DOMINAR 400" },
    { name: "DOMINAR 250" },
  ],
  Avengers: [
    { name: "AVENGER CRUISE 220" },
    { name: "AVENGER STREET 160" },
  ],
  Discover: [
    { name: "DISCOVER 125" },
    { name: "DISCOVER 110" },
  ],
  Platina: [
    { name: "PLATINA 110 H GEAR" },
    { name: "PLATINA 100 ES" },
  ]
};

const categoryList = document.getElementById("categoryList");
const modelList = document.getElementById("modelList");

// Default active category
let activeCategory = Object.keys(motorcyclesData)[0];

// Render categories
function renderCategories() {
  categoryList.innerHTML = "";
  Object.keys(motorcyclesData).forEach((cat) => {
    const li = document.createElement("li");
    li.textContent = cat;
    li.className =
      "cursor-pointer py-2 hover:font-bold hover:text-blue-600";
    if (cat === activeCategory) li.classList.add("font-bold", "text-blue-600");

    li.addEventListener("mouseenter", () => {
      activeCategory = cat;
      renderCategories();
      renderModels(cat);
    });

    categoryList.appendChild(li);
  });
}

// Render models
function renderModels(category) {
  modelList.innerHTML = "";
  motorcyclesData[category].forEach((model) => {
    const div = document.createElement("div");
    div.textContent = model.name;
    div.className =
      "text-sm hover:text-blue-600 cursor-pointer";
    modelList.appendChild(div);
  });
}

// Initial render
renderCategories();
renderModels(activeCategory);
