import API from "../utils/request";

export const createCustomer = (body: any) => {
  return API.post(`customers`, body);
};

export const loginCustomer = (body: any) => {
  return API.post(`auth/customer-login`, body, {
    headers: { "x-custom-lang": "vi" },
  });
};

export const getProfile = (token: string) => {
  return API.get(`auth/customer-profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
