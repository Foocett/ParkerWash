const animationInterval = 50; //time between each element fade in milliseconds


const fadeSpeed = 0.15; //fade time in seconds


let currentWindow = "Washer";
document.addEventListener("DOMContentLoaded", () => {

  const dryerWindow = document.getElementById("dryerWindow");
  const washerWindow = document.getElementById("washerWindow");
  const dryerElements = document.querySelectorAll(".dryer-item");
  const washerElements = document.querySelectorAll(".washer-item");
  const washerButton = document.getElementById("washer-button");
  const dryerButton = document.getElementById("dryer-button");
  const buttons = document.querySelectorAll(".list-item");

  document.documentElement.style.setProperty("--fade-speed", `${fadeSpeed}s`);
  showWasherWindow();

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      buttons.forEach((btn) => btn.classList.remove("selected"));
      this.classList.add("selected");
    });
  });

  washerButton.addEventListener("click", () => {
    if (currentWindow === "Dryer") {
      showWasherWindow();
      currentWindow = "Washer";
    }
  });

  dryerButton.addEventListener("click", () => {
    if (currentWindow === "Washer") {
      showDryerWindow();
      currentWindow = "Dryer";
    }
  });

  function showWasherWindow() {
    if (dryerWindow.style.display !== "none") {
      let j = 1;
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          dryerElements[i].style.opacity = 0;
        }, animationInterval * j);
        j++;
      }
      setTimeout(
        () => {
          dryerWindow.style.display = "none";
          washerElements.forEach((washer) => (washer.style.opacity = 0));
          washerWindow.style.display = "grid";
          //strts at 1 so that the first element's delay is multiplied by 1 and not 0 (no delay)
          for (let i = 1; i < 9; i++) {
            setTimeout(() => {
              washerElements[i-1].style.opacity = 1;
            }, animationInterval * i);
          }
        },
        animationInterval * 10,
      ); 
    } else {
      washerElements.forEach((washer) => (washer.style.opacity = 0));
      washerWindow.style.display = "grid";
      for (let i = 1; i < 9; i++) {
        setTimeout(() => {
          washerElements[i-1].style.opacity = 1;
        }, animationInterval * i);
      }
    }
  }

  function showDryerWindow() {
    if (washerWindow.style.display !== "none") {
      let j = 1;
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          washerElements[i].style.opacity = 0;
        }, animationInterval * j);
        j++;
      }
      setTimeout(
        () => {
          washerWindow.style.display = "none";
          dryerElements.forEach((dryer) => (dryer.style.opacity = 0));
          dryerWindow.style.display = "grid";
          for (let i = 1; i < 9; i++) {
            setTimeout(() => {
              dryerElements[i-1].style.opacity = 1;
            }, animationInterval * i);
          }
        },
        animationInterval * 10,
      ); // Wait for the fade-out animation to complete plus a small delay
    } else {
      dryerElements.forEach((dryer) => (dryer.style.opacity = 0));
      dryerWindow.style.display = "grid";
      for (let i = 1; i < 9; i++) {
        setTimeout(() => {
          dryerElements[i-1].style.opacity = 1;
        }, animationInterval * i);
      }
    }
  }
});
