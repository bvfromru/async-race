import { render, storageInit } from "./app";
import { storage } from "./storage";

async function init() {
  const carInfo = await storageInit();
  storage.cars = carInfo.items;
  storage.carsCount = carInfo.count;
  await render();
}

init();
