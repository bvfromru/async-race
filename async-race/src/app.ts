import { ICar, ICarCreate } from "./interfaces";
import { getCars, getWinners, createCar, deleteCar, deleteWinner } from "./api";
import { constants } from "./constants";
import { storage } from "./storage";
import { carBrands, carModels } from "./carData";

export async function garageUpdate(): Promise<void> {
  const carInfo = await getCars(storage.garagePage);
  storage.cars = carInfo.items;
  storage.carsCount = carInfo.count;
}

export async function winnersUpdate(): Promise<void> {
  const winnersInfo = await getWinners({
    page: storage.winnersPage,
    limit: constants.winnersPagesLimit,
    sort: storage.sort,
    order: storage.sortOrder,
  });
  storage.winners = winnersInfo.items;
  storage.winnersCount = winnersInfo.count;
}

export function PageButtonsUpdate(): void {
  const prevButton = document.getElementById("prev") as HTMLButtonElement;
  const nextButton = document.getElementById("next") as HTMLButtonElement;
  const garageViewBtn = document.querySelector(".garage-menu-btn") as HTMLButtonElement;
  const winnersViewBtn = document.querySelector(".winners-menu-btn") as HTMLButtonElement;
  if (storage.view === "garage") {
    garageViewBtn.disabled = true;
    winnersViewBtn.disabled = false;
    if (storage.garagePage * constants.garagePagesLimit < storage.carsCount) {
      nextButton.disabled = false;
    } else {
      nextButton.disabled = true;
    }
    if (storage.garagePage > 1) {
      prevButton.disabled = false;
    } else {
      prevButton.disabled = true;
    }
  } else if (storage.view === "winners") {
    garageViewBtn.disabled = false;
    winnersViewBtn.disabled = true;
    if (storage.winnersPage * constants.winnersPagesLimit < storage.winnersCount) {
      nextButton.disabled = false;
    } else {
      nextButton.disabled = true;
    }
    if (storage.winnersPage > 1) {
      prevButton.disabled = false;
    } else {
      prevButton.disabled = true;
    }
  }
}

export const render = async (): Promise<void> => {
  const template = `
    <nav class="menu">
      <button class="btn garage-menu-btn" id="garage-menu" disabled>To garage</button>
      <button class="btn winners-menu-btn" id="winners-menu">To winners</button>
    </nav>
    <main id="garage-view">
      <div>
        <p class="winner-message" id="message">Number one wins</p>
      </div>
      <div>
        <form class="form" id="create">
          <input class="input" id="create-name" name="name" type="text">
          <input class="color" id="create-color" name="color" type="color" value="#6c779f">
          <button class="btn" type="submit">Create</button>
        </form>
        <form class="form" id="update">
          <input class="input" id="update-name" name="name" type="text" disabled>
          <input class="color" id="update-color" name="color" type="color" value="#6c779f" disabled>
          <button class="btn" id="update-submit" type="submit">Update</button>
        </form>
      </div>
      <div class="race-controls">
        <button class="btn race-btn primary" id="race">Race</button>
        <button class="btn reset-btn primary" id="reset">Reset</button>
        <button class="btn generator-btn" id="generator">Generate cars</button>
      </div>
      <div id="garage-cars">
        ${renderGarage()}
      </div>
    </main>
    <main id="winners-view" style="display: none">
      ${renderWinners()}
    </main>
    <nav class="pagination">
      <button class="btn primary prev-btn" disabled id="prev">Previous page</button>
      <button class="btn primary next-btn" disabled id="next">Next page</button>
    </nav>
  `;
  const root = document.createElement("div");
  root.innerHTML = template;
  document.body.appendChild(root);
};

const renderGarage = () => `
  <h1>Garage (total number of cars: ${storage.carsCount})</h1>
  <h2>Page: ${storage.garagePage} / ${Math.ceil(storage.carsCount / constants.garagePagesLimit)}</h2>
  <ul class="garage">
  ${storage.cars.map((car) => `<li>${renderGarageRow(car)}</li>`).join("")}
  </ul>
`;

const renderWinners = () => `
  <h1>Winners (total number of winners: ${storage.winnersCount})</h1>
  <h2>Page: ${storage.winnersPage} / ${Math.ceil(storage.winnersCount / constants.winnersPagesLimit)}</h2>
  <table class="table" cellspasing="0" border="0" cellpadding="0">
    <thead>
      <th>Number</th>
      <th>Car</th>
      <th>Name</th>
      <th class="table-btn table-wins" id="sort-by-wins">Wins</th>
      <th class="table-btn table-time" id="sort-by-time">Best time (seconds)</th>
    </thead>
    <tbody>
      ${storage.winners
        .map(
          (winner, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${renderCar(winner.car.color)}</td>
        <td>${winner.car.name}</td>
        <td>${winner.wins}</td>
        <td>${winner.time}</td>
      </tr>
    `
        )
        .join("")}
    </tbody>
  </table>
`;

const renderCar = (color: string) => `
  <?xml version='1.0' encoding='iso-8859-1'?>
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 470 470" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 470 470">
    <g fill='${color}'>
      <path d="m126.184,358.951c19.299,0 35-15.701 35-35s-15.701-35-35-35-35,15.701-35,35 15.701,35 35,35zm0-55c11.028,0 20,8.972 20,20s-8.972,20-20,20-20-8.972-20-20 8.971-20 20-20z"/>
      <path d="m343.816,288.951c-19.299,0-35,15.701-35,35s15.701,35 35,35 35-15.701 35-35-15.701-35-35-35zm0,55c-11.028,0-20-8.972-20-20s8.972-20 20-20 20,8.972 20,20-8.971,20-20,20z"/>
      <path d="m137.5,116.049h23.779c4.143,0 7.5-3.358 7.5-7.5s-3.357-7.5-7.5-7.5h-23.779c-10.423,0-27.031,7.176-34.177,14.767l-60.088,63.845c-2.051,2.179-2.609,5.368-1.423,8.115 1.187,2.747 3.893,4.525 6.885,4.525h290.271c2.562,0 4.945-1.307 6.323-3.467 1.377-2.159 1.558-4.873 0.478-7.195l-30.854-66.365c-3.315-7.046-14.628-14.225-22.415-14.225h-101.221c-4.143,0-7.5,3.358-7.5,7.5l-.001,68.752h-117.722l48.19-51.204c4.243-4.508 17.066-10.048 23.254-10.048zm61.279,0h93.7c2.203,0.103 7.842,3.681 8.849,5.581l25.883,55.671h-128.433l.001-61.252z"/>
      <path d="m470,257.692c0-26.631-20.555-55.149-45.819-63.57-0.017-0.006-35.078-11.693-35.078-11.693-5.854-1.951-13.576-8.812-16.203-14.394l-30.84-65.535c-8.299-17.636-30.068-31.451-49.56-31.451h-155c-18.639,0-43.247,10.632-56.022,24.206l-69.158,73.482c-6.909,7.34-12.32,20.984-12.32,31.064v94.15c0,20.678 16.822,37.5 37.5,37.5h14.06c3.775,37.846 35.8,67.5 74.624,67.5s70.849-29.654 74.624-67.5h45.509c4.143,0 7.5-3.358 7.5-7.5s-3.357-7.5-7.5-7.5h-45.509c-3.775-37.846-35.8-67.5-74.624-67.5s-70.849,29.654-74.624,67.5h-14.06c-12.406,0-22.5-10.093-22.5-22.5v-94.15c0-6.294 3.929-16.2 8.242-20.783l69.159-73.483c9.941-10.563 30.594-19.486 45.099-19.486h155c13.682,0 30.162,10.458 35.987,22.838l30.84,65.535c4.421,9.395 15.182,18.955 25.031,22.238l28.498,9.499c-0.492,2.841-0.748,5.729-0.748,8.642 0,25.238 18.65,46.198 42.892,49.831v29.32c0,12.407-8.357,22.5-18.631,22.5h-17.929c-3.775-37.846-35.8-67.5-74.624-67.5-41.355,0-75,33.645-75,75s33.645,75 75,75c38.824,0 70.849-29.654 74.624-67.5h17.929c18.544,0 33.631-16.822 33.631-37.5v-36.26zm-343.816,6.259c33.084,0 60,26.916 60,60s-26.916,60-60,60-60-26.916-60-60 26.916-60 60-60zm217.632,120c-33.084,0-60-26.916-60-60s26.916-60 60-60 60,26.916 60,60-26.916,60-60,60zm83.292-169.15c0-0.969 0.04-1.934 0.117-2.893 13.16,7.627 23.787,22.37 26.864,37.266-15.466-3.785-26.981-17.756-26.981-34.373z"/>
    </g>
  </svg>`;

const renderGarageRow = ({ id, name, color }: ICar) => `
  <div class="car-header">
    <div class="select-btns">
      <button class="btn select-btn" id="select-car-${id}">Select</button>
      <button class="btn remove-btn" id="remove-car-${id}">Remove</button>
    </div>
    <div class="car-name">${name}</div>
  </div>
  <div class = "car-row">
    <div class="car-controls">
    <button class="btn start-engine-btn" id="start-engine-car-${id}">Start</button>
    <button class="btn stop-engine-btn" id="stop-engine-car-${id}" disabled>Stop</button>
    </div>
    <div class="road">
        <div class="car" id="car-${id}">
          ${renderCar(color)}
        </div>
      <div class="flag"></div>
    </div>
  </div>
`;

export const addListeners = function (): void {
  const createBtn = document.getElementById("create") as HTMLButtonElement;
  const garageCars = document.getElementById("garage-cars") as HTMLElement;
  const createNameInput = document.getElementById("create-name") as HTMLInputElement;
  const createColorInput = document.getElementById("create-color") as HTMLInputElement;
  document.body.addEventListener("click", async (event) => {
    const eventTarget = event.target as HTMLButtonElement;
    const winnersView = document.getElementById("winners-view") as HTMLElement;
    const garageView = document.getElementById("garage-view") as HTMLElement;

    if (eventTarget.classList.contains("prev-btn")) {
      if (storage.view === "garage") {
        storage.garagePage -= 1;
        await garageUpdate();
        PageButtonsUpdate();
        garageCars.innerHTML = renderGarage();
      } else {
        storage.winnersPage -= 1;
        await winnersUpdate();
        PageButtonsUpdate();
        winnersView.innerHTML = renderWinners();
      }
    }
    if (eventTarget.classList.contains("next-btn")) {
      if (storage.view === "garage") {
        storage.garagePage += 1;
        await garageUpdate();
        PageButtonsUpdate();
        garageCars.innerHTML = renderGarage();
      } else {
        storage.winnersPage += 1;
        await winnersUpdate();
        PageButtonsUpdate();
        winnersView.innerHTML = renderWinners();
      }
    }

    if (eventTarget.classList.contains("garage-menu-btn")) {
      winnersView.style.display = "none";
      garageView.style.display = "block";
      storage.view = "garage";
      PageButtonsUpdate();
    }
    if (eventTarget.classList.contains("winners-menu-btn")) {
      winnersView.style.display = "block";
      garageView.style.display = "none";
      await winnersUpdate();
      winnersView.innerHTML = renderWinners();
      storage.view = "winners";
      PageButtonsUpdate();
    }

    if (eventTarget.classList.contains("generator-btn")) {
      disableButtons(true);
      const cars = generateCars(constants.generateCarsLimit);
      await Promise.all(cars.map(async (car) => createCar(car)));
      await garageUpdate();
      PageButtonsUpdate();
      garageCars.innerHTML = renderGarage();
      disableButtons(false);
      PageButtonsUpdate();
    }

    if (eventTarget.classList.contains("remove-btn")) {
      const id = +(<HTMLButtonElement>event.target).id.split("remove-car-")[1];
      await deleteCar(id);
      await deleteWinner(id);
      await garageUpdate();
      garageCars.innerHTML = renderGarage();
      PageButtonsUpdate();
    }
  });

  createNameInput.addEventListener('input', (event) => {
    if (createNameInput.value) {
      createBtn.disabled = false;
    } else {
      createBtn.disabled = true;
    }
  })

  createBtn.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (createNameInput.value) {
      const newCar = {
        name: createNameInput.value,
        color: createColorInput.value,
      };
      await createCar(newCar);
      await garageUpdate();
      garageCars.innerHTML = renderGarage();
      createNameInput.value = "";
      createColorInput.value = "#6c779f";
    } else {
      alert("Please enter the car name!");
    }
  });
};

function generateCars(count: number): ICarCreate[] {
  console.log("generate");
  return new Array(count).fill(0).map((el) => ({ name: generateName(), color: generateColor() }));
}

function generateColor(): string {
  return "#" + ("00000" + Math.floor(Math.random() * Math.pow(16, 6)).toString(16)).slice(-6);
}

function generateName(): string {
  const model = carBrands[Math.floor(Math.random() * carBrands.length)];
  const name = carModels[Math.floor(Math.random() * carModels.length)];
  return `${model} ${name}`;
}

function disableButtons(operator: boolean): void {
  const btns = document.querySelectorAll(".btn") as NodeListOf<HTMLButtonElement>;
  if (operator) {
    btns.forEach((btn) => (btn.disabled = true));
  } else {
    btns.forEach((btn) => (btn.disabled = false));
  }
}
