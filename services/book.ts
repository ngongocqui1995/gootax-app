import API from "../utils/request";

export const getBookCar = (phone: string) => {
  return API.get(`book-cars`, {
    params: {
      sort: "createdAt,DESC",
      filter: `phone||$eq||${phone}`,
      join: "type_car",
    },
  });
};

export const updateStatusBookCar = (id: string, status: string) => {
  return API.put(`book-cars/status/${id}`, { status });
};
