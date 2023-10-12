import API from "../utils/request";

export const findGoogleMapsAPI = (address: string) => {
  return API.get(`https://maps.googleapis.com/maps/api/place/textsearch/json`, {
    params: {
      key: "AIzaSyDuG_Yw3NrzoN79fIWHnE10-9zSbcNvJK8",
      query: address,
      language: "vi-VN",
    },
  });
};
