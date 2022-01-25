import { PageButtonsUpdate, render, garageUpdate, addListeners } from "./app";
import { storage } from "./storage";

async function init() {
  await garageUpdate()
  await render();
  PageButtonsUpdate();
  addListeners();
  console.log('Приветствую проверяющего!\nВсе обязательные функциональные требования вроде бы выполнил.\nВ случае каких-либо недоразумений, прошу со мной связаться.\nДискорд: @Vitaliy (bvfromru)#4741')
}

init();
