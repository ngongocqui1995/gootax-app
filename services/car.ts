import API from "../utils/request";

export const getTypeCars = () => {
  return API.get(`type-cars`, {
    headers: { "x-custom-lang": "vi" },
  });
};

export const bookCar = (data: any) => {
  return API.post(`book-cars`, JSON.parse(JSON.stringify(data)), {
    headers: { "x-custom-lang": "vi" },
  });
};
