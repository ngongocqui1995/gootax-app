import API from "../utils/request";

export const findGoogleMapsAPI = async (address: string) => {
  if (!address) return [];

  const res = await API.get(`map`, {
    params: { address: `${address}, Việt Nam` },
  });

  return res?.data?.candidates || [];
};

export const checkPrice = async (params: {
  from_lat: number;
  from_lng: number;
  to_lat: number;
  to_lng: number;
  type_car_id: string;
}) => {
  const res = await API.get(`map/check-price`, { params });

  return res?.data;
};
