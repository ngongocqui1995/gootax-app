import * as Location from "expo-location";
import { LocationAccuracy } from "expo-location";

export const getCurrentPosition = (): Promise<Location.LocationObject> => {
  return new Promise(async (resolve, reject) => {
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      reject(new Error("Error"));
    }, 500);

    resolve(
      await Location.getCurrentPositionAsync({
        accuracy: LocationAccuracy.Highest,
      })
    );
  });
};
