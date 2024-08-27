// eslint-disable-next-line no-undef
const socket = io();

const animationInterval = 50; //time between each element fade in milliseconds
let currentMachine = 0;
const fadeSpeed = 0.15; //fade time in seconds

let currentWindow = "Washer";
document.addEventListener("DOMContentLoaded", () => {
  socket.emit("get-states", (response) => {
    syncFromJSON(response);
  });

  const dryerWindow = document.getElementById("dryerWindow");
  const washerWindow = document.getElementById("washerWindow");
  const dryerElements = document.querySelectorAll(".dryer-item");
  const washerElements = document.querySelectorAll(".washer-item");
  const washerButton = document.getElementById("washer-button");
  const dryerButton = document.getElementById("dryer-button");
  const buttons = document.querySelectorAll(".list-item");
  const allMachines = document.querySelectorAll(".grid-item");
  const setStateBody = document.getElementById("set-state-body");
  const allStatusTitles = document.querySelectorAll(".status");
  const allTimeLeft = document.querySelectorAll(".timeLeft");
  const allUsers = document.querySelectorAll(".user");

  const isSetStateWindowOpen = function () {
    return setStateBody.style.display === "block";
  };

  document.documentElement.style.setProperty("--fade-speed", `${fadeSpeed}s`);
  showWasherWindow();
  function toggleSetStateWindow() {
    if (setStateBody.style.display === "block") {
      setStateBody.style.opacity = 0;
      setTimeout(() => {
        setStateBody.style.display = "none";
      }, 250);
    } else {
      setStateBody.style.display = "block";
      setTimeout(() => {
        setStateBody.style.transition = "opacity 0.5s";
        setStateBody.style.opacity = 1;
      }, 10); // Small delay to ensure the display change is applied before the transition
    }
  }

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      if (!isSetStateWindowOpen()) {
        buttons.forEach((btn) => btn.classList.remove("selected"));
        this.classList.add("selected");
      }
    });
  });

  washerButton.addEventListener("click", () => {
    if (currentWindow === "Dryer" && !isSetStateWindowOpen()) {
      showWasherWindow();
      currentWindow = "Washer";
    }
  });

  dryerButton.addEventListener("click", () => {
    if (currentWindow === "Washer" && !isSetStateWindowOpen()) {
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
      setTimeout(() => {
        dryerWindow.style.display = "none";
        washerElements.forEach((washer) => (washer.style.opacity = 0));
        washerWindow.style.display = "grid";
        //strts at 1 so that the first element's delay is multiplied by 1 and not 0 (no delay)
        for (let i = 1; i < 9; i++) {
          setTimeout(() => {
            washerElements[i - 1].style.opacity = 1;
          }, animationInterval * i);
        }
      }, animationInterval * 10);
    } else {
      washerElements.forEach((washer) => (washer.style.opacity = 0));
      washerWindow.style.display = "grid";
      for (let i = 1; i < 9; i++) {
        setTimeout(() => {
          washerElements[i - 1].style.opacity = 1;
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
      setTimeout(() => {
        washerWindow.style.display = "none";
        dryerElements.forEach((dryer) => (dryer.style.opacity = 0));
        dryerWindow.style.display = "grid";
        for (let i = 1; i < 9; i++) {
          setTimeout(() => {
            dryerElements[i - 1].style.opacity = 1;
          }, animationInterval * i);
        }
      }, animationInterval * 10); // Wait for the fade-out animation to complete plus a small delay
    } else {
      dryerElements.forEach((dryer) => (dryer.style.opacity = 0));
      dryerWindow.style.display = "grid";
      for (let i = 1; i < 9; i++) {
        setTimeout(() => {
          dryerElements[i - 1].style.opacity = 1;
        }, animationInterval * i);
      }
    }
  }

  for (let i = 0; i < allMachines.length; i++) {
    allMachines[i].addEventListener("click", () => {
      currentMachine = i;
      if (setStateBody != "block") {
        toggleSetStateWindow();
      }
    });
  }

  document.getElementById("set-state-close").addEventListener("click", () => {
    toggleSetStateWindow();
  });

  document
    .getElementById("set-state-available")
    .addEventListener("click", () => {
      toggleSetStateWindow();
      allMachines[currentMachine].classList.remove("in-use");
      allMachines[currentMachine].classList.remove("broken");
      allMachines[currentMachine].classList.remove("finished");
      allMachines[currentMachine].classList.add("available");
      allStatusTitles[currentMachine].innerText = "Available";
    });
  document.getElementById("set-state-in-use").addEventListener("click", () => {
    toggleSetStateWindow();
    allMachines[currentMachine].classList.remove("available");
    allMachines[currentMachine].classList.remove("broken");
    allMachines[currentMachine].classList.remove("finished");
    allMachines[currentMachine].classList.add("in-use");
    allStatusTitles[currentMachine].innerText = "In Use";
  });
  document.getElementById("set-state-broken").addEventListener("click", () => {
    toggleSetStateWindow();
    allMachines[currentMachine].classList.remove("available");
    allMachines[currentMachine].classList.remove("in-use");
    allMachines[currentMachine].classList.remove("finished");
    allMachines[currentMachine].classList.add("broken");
    allStatusTitles[currentMachine].innerText = "Broken";
  });
  document
    .getElementById("set-state-finished")
    .addEventListener("click", () => {
      toggleSetStateWindow();
      allMachines[currentMachine].classList.remove("available");
      allMachines[currentMachine].classList.remove("in-use");
      allMachines[currentMachine].classList.remove("broken");
      allMachines[currentMachine].classList.add("finished");
      allStatusTitles[currentMachine].innerText = "Finished";
    });

  function writeState(machine, state) {
    machine.classList.remove("available");
    machine.classList.remove("in-use");
    machine.classList.remove("broken");
    machine.classList.remove("finished");
    switch (state) {
      case "Available":
        machine.classList.add("available");
        break;
      case "In Use":
        machine.classList.add("in-use");
        break;
      case "Broken":
        machine.classList.add("broken");
        break;
      case "Finished":
        machine.classList.add("finished");
        break;
      default:
        machine.classList.add("available");
        break;
    }
  }

  function syncFromJSON(states) {
    states["Washers"].forEach((machine) => {
      allTimeLeft[machine.id - 1].innerText = machine.time;
      allUsers[machine.id - 1].innerText = machine.user;
      console.log(machine.status);
      allStatusTitles[machine.id - 1].innerText = machine.status;
      writeState(allStatusTitles[machine.id - 1], machine.status);
    });
    states["Dryers"].forEach((machine) => {
      allTimeLeft[machine.id + 7].innerText = machine.time;
      allUsers[machine.id + 7].innerText = machine.user;
      console.log(machine.status);
      allStatusTitles[machine.id + 7].innerText = machine.status;
      writeState(allStatusTitles[machine.id + 7], machine.status);
    });
  }
});
