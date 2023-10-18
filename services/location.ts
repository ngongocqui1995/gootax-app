import API from "../utils/request";

export const findGoogleMapsAPI = async (address: string) => {
  if (!address) return [];

  const res = await API.get(`map`, {
    params: { address: `${address}, Việt Nam` },
  });

  return res?.data?.results || [];
};
