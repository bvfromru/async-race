import { getCars } from "./api";
import { ICar, IStorage } from "./interfaces";
import { constants } from "./constants";

export const storage: IStorage = {
  garagePage: constants.defaultGaragePage,
  winnersPage: constants.defaultWinnersPage,
  cars: [],
  winners: [],
  carsCount: 0,
  winnersCount: 0,
  view: "garage",
  sort: "time",
  sortOrder: "asc",
};
