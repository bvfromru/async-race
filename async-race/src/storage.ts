import { getCars } from "./api";
import { ICar, IStorage } from "./interfaces";
import { constants } from "./constants";

export const storage:IStorage = {
  garagePage: constants.defaultGaragePage,
  winnersPage: constants.defaultWinnersPage,
  cars: [],
  carsCount: 0,
}