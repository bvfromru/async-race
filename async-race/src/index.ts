import { PageButtonsUpdate, render, garageUpdate, addListeners } from "./app";
import { storage } from "./storage";

async function init() {
  await garageUpdate()
  await render();
  PageButtonsUpdate();
  addListeners();
}

init();
