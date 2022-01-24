import { ICar } from "./interfaces";
import { path, constants } from "./constants";

export const getCars = async (
  page: number,
  limit = constants.garagePagesLimit
): Promise<{ items: ICar[]; count: number }> => {
  const response = await fetch(`${path.garage}?_page=${page}&_limit=${limit}`);
  return {
    items: await response.json(),
    count: Number(response.headers.get("X-Total-Count")),
  };
};
