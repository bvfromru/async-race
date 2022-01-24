import { ICar, IWinner } from "./interfaces";
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

export const getCar = async (id: number): Promise<ICar> => {
  return (await fetch(`${path.garage}/${id}`)).json();
};

const getSortOrder = (sort: string, order: string): string => {
  if (sort && order) {
    return `&_sort=${sort}&_order=${order}`;
  } else {
    return "";
  }
};

export const getWinners = async ({
  page,
  limit = constants.defaultWinnersPage,
  sort,
  order,
}: {
  page: number;
  limit: number;
  sort: string;
  order: string;
}): Promise<{ items: IWinner[]; count: number }> => {
  const response = await fetch(`${path.winners}?_page=${page}&_limit=${limit}${getSortOrder(sort, order)}`);
  const items = await response.json();
  return {
    items: await Promise.all(
      items.map(async (winner: { id: number }) => ({ ...winner, car: await getCar(winner.id) }))
    ),
    count: Number(response.headers.get("X-Total-Count")),
  };
};
