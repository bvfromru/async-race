import { PageButtonsUpdate, render, garageUpdate, addListeners } from "./app";
import { storage } from "./storage";

async function init() {
  await garageUpdate()
  await render();
  PageButtonsUpdate();
  addListeners();
  // alert('Уважаемый проверяющий! Не успел доделать работу до конца, прошу проверить через день-два. Дискорд для связи: Vitaliy (bvfromru)#4741')
}

init();
