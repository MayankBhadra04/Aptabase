import resources from "./data.js";

const container = document.getElementById("resources-container");

resources.forEach((resource) => {
  const itemDiv = document.createElement("div");
  itemDiv.classList.add("item");

  if (resource.type === "image") {
    const img = document.createElement("img");
    img.src = resource.url;
    img.alt = resource.description;
    itemDiv.appendChild(img);
  } else if (resource.type === "pnb") {
    const link = document.createElement("a");
    link.href = resource.url;
    link.target = "_blank";
    link.textContent = resource.description;
    itemDiv.appendChild(link);
  }
  container.appendChild(itemDiv);
});
