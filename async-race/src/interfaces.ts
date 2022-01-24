export interface ICar {
  id: number;
  name: string;
  color: string;
}

export interface IStorage {
  garagePage: number;
  winnersPage: number;
  cars: ICar[];
  carsCount: number;
  view: string;
}
