function alertButton(){
    alert("Hello World!")
}

// Adding a "bouncing" animation to the header text
const header = document.querySelector("header");

header.addEventListener("mouseenter", function() {
  header.style.animation = "bounce 1s ease";
});

header.addEventListener("mouseleave", function() {
  header.style.animation = "";
});
