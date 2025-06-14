// script.js
document.addEventListener("DOMContentLoaded", () => {
    fetch("/data/privacy-policy.json")
      .then((res) => res.json())
      .then((data) => {
        const container = document.getElementById("privacy-content");
  
        // Add main title
        const title = document.createElement("h1");
        title.className = "text-2xl lg:text-5xl font-bold mb-8 max-w-5xl mx-auto";
        title.textContent = data.title;
        container.appendChild(title);
  
        // Loop through sections
        data.sections.forEach((section) => {
          const sectionDiv = document.createElement("div");
          sectionDiv.className = "space-y-4 mb-6 max-w-5xl mx-auto";
  
          const heading = document.createElement("h3");
          heading.className = "font-bold";
          heading.textContent = section.heading;
  
          const paragraph = document.createElement("p");
          paragraph.textContent = section.content;
  
          sectionDiv.appendChild(heading);
          sectionDiv.appendChild(paragraph);
          container.appendChild(sectionDiv);
        });
      })
      .catch((err) => {
        console.error("Failed to load JSON:", err);
        document.getElementById("privacy-content").innerHTML =
          "<p class='text-red-500'>Failed to load privacy content.</p>";
      });
  });