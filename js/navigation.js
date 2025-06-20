import { initializeMap, deselectBranch } from "./map.js";
import {
  populateBranchSelect,
  populateCategorySelect,
  populateTransmissionTypeSelect,
  renderVehicleCards,
  setupReservationFormHandler,
  prefillReservationForm,
} from "./reservation.js";
import { populateHourSelects } from "./reservation.js";
import { getSelectedBranchId } from "./state.js";

// cargar paginas
export function loadPage(page) {
  const state = { page };
  localStorage.setItem("lastPage", JSON.stringify(state));

  fetch(`pages/${page}.html`)
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("main").innerHTML = html;
      updateNavActiveState(page);

      if (page === "home") {
        requestAnimationFrame(() => {
          initializeMap();
          deselectBranch();

          const deselectBtn = document.getElementById("branch-deselect-btn");
          if (deselectBtn) {
            deselectBtn.addEventListener("click", deselectBranch);
          }
        });
      }
      if (page === "reservation") {
        requestAnimationFrame(() => {
          populateCategorySelect();
          populateHourSelects();
          populateBranchSelect(getSelectedBranchId());
          populateTransmissionTypeSelect();
          setupReservationFormHandler();
          prefillReservationForm();
        });
      }
      if (page === "filtered-vehicles") {
        requestAnimationFrame(() => {
          renderVehicleCards("vehicle-cards-container");
        });
      }
      const cancelBtn = document.getElementById("cancel-reservation-btn");
      if (cancelBtn) {
        cancelBtn.addEventListener("click", () => loadPage("home"));
      }
      const backToReservationBtn = document.getElementById(
        "back-to-reservation-btn"
      );
      if (backToReservationBtn) {
        backToReservationBtn.addEventListener("click", () =>
          loadPage("reservation")
        );
      }
    })
    .catch((err) => {
      document.getElementById("main").innerHTML =
        "<p class='text-red-500'>Error cargando la página.</p>";
    });
}

// switchear paginas
export function setupNavLinks() {
  document.addEventListener("click", (e) => {
    const target = e.target.closest("[data-page]");
    if (target) {
      e.preventDefault();
      const page = target.getAttribute("data-page");
      loadPage(page);
    }
  });
}

// actualizar estado activo del navbar
function updateNavActiveState(activePage) {
  const navLinks = document.querySelectorAll(".page-link");

  navLinks.forEach((link) => {
    link.classList.remove("text-white");
  });

  const activeLink = document.querySelector(`[data-page="${activePage}"]`);
  if (activeLink) {
    activeLink.classList.add("text-white");
  }
}
