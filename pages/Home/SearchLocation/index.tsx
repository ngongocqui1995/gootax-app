import { useIsFocused } from "@react-navigation/native";
import { useAsyncEffect, useRequest, useSetState } from "ahooks";
import to from "await-to-js";
import * as Location from "expo-location";
import {
  ChevronLeftIcon,
  Divider,
  FlatList,
  Flex,
  Image,
  Input,
  Text,
  View,
} from "native-base";
import { TouchableOpacity } from "react-native";
import { findGoogleMapsAPI } from "../../../services/location";
import { NAVIGATOR_SCREEN } from "../../../utils/enum";
import { getCurrentPosition } from "../../../utils/utils";

const SearchLocation = ({ navigation }: any) => {
  const isFocused = useIsFocused();
  const [state, setState] = useSetState({
    location_from: {
      address: "",
      lat: 0,
      lng: 0,
    },
    location_to: {
      address: "",
      lat: 0,
      lng: 0,
    },
    location_current: {
      lat: 0,
      lng: 0,
    },
    address_from: "",
    address_to: "",
    active: 1,
  });

  const { data, run } = useRequest(findGoogleMapsAPI, {
    debounceWait: 1000,
    manual: true,
  });

  useAsyncEffect(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    let location;
    do {
      [, location] = await to(getCurrentPosition());
    } while (!location?.coords);

    if (location.coords) {
      const { longitude, latitude } = location.coords;

      setState({
        location_current: { lat: latitude, lng: longitude },
        location_from: { lat: latitude, lng: longitude, address: "" },
      });
    }
  }, [isFocused]);

  useAsyncEffect(async () => {
    if (state.active === 0) run(state.address_from);
    if (state.active === 1) run(state.address_to);
  }, [state.active]);

  return (
    <View>
      <View h="15%" paddingX="6">
        <Flex h="100%" direction="row" alignItems="flex-end">
          <Flex
            direction="row"
            w="8%"
            h="100%"
            alignItems="center"
            paddingTop={3}
          >
            <View>
              <TouchableOpacity
                onPress={() => navigation.navigate(NAVIGATOR_SCREEN.HOME)}
              >
                <ChevronLeftIcon size="16px" />
              </TouchableOpacity>
            </View>
          </Flex>
          <Flex direction="column" w="92%">
            <Input
              placeholder="Vị trí hiện tại"
              width="100%"
              borderRadius="4"
              py="3"
              px="1"
              fontSize="14"
              borderWidth="0"
              onPressIn={() => setState({ active: 0 })}
              // isReadOnly={state.active != 0}
              value={state.address_from}
              onChangeText={async (value) => {
                setState({ address_from: value });
                run(value);
              }}
              backgroundColor={state.active === 0 ? "gray.300" : undefined}
              InputLeftElement={
                <Image
                  margin={3}
                  source={require("../../../assets/dot.png")}
                  size="16px"
                  alt="location"
                />
              }
            />
            <Input
              placeholder="Đến đâu?"
              width="100%"
              borderRadius="4"
              py="3"
              px="1"
              fontSize="14"
              borderWidth="0"
              onPressIn={() => setState({ active: 1 })}
              value={state.address_to}
              onChangeText={async (value) => {
                setState({ address_to: value });
                run(value);
              }}
              backgroundColor={state.active === 1 ? "gray.300" : undefined}
              // isReadOnly={state.active != 1}
              InputLeftElement={
                <Image
                  margin={3}
                  source={require("../../../assets/location.png")}
                  size="16px"
                  alt="location"
                />
              }
            />
          </Flex>
        </Flex>
      </View>
      <View h="85%" padding={6}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                const location = {
                  lat: item?.geometry?.location?.lat,
                  lng: item?.geometry?.location?.lng,
                  address: item?.formatted_address,
                };

                let location_from = location;
                let location_to = location;
                let address_from = "";
                if (state.active === 0) {
                  location_to = state.location_to;
                  address_from = item?.formatted_address;

                  setState({
                    location_from: location,
                    address_from: item?.formatted_address,
                  });
                }

                if (state.active === 1) {
                  location_from = state.location_from;

                  setState({
                    location_to: location,
                    address_to: item?.formatted_address,
                  });
                }

                if (location_from.lat && location_to.lat) {
                  navigation.navigate(NAVIGATOR_SCREEN.BOOK_CAR, {
                    location_from: address_from
                      ? location_from
                      : state.location_current,
                    location_to,
                  });
                }
              }}
            >
              <Flex direction="column" style={{ gap: 20 }}>
                <Flex direction="row" alignItems="center" style={{ gap: 6 }}>
                  <Image
                    source={require("../../../assets/location-2.png")}
                    size="16px"
                    alt="location"
                  />
                  <Flex direction="column" w="90%">
                    <Text fontSize={14} fontWeight={600}>
                      {item?.name}
                    </Text>
                    <Text fontSize={12} w="100%">
                      {item?.formatted_address}
                    </Text>
                  </Flex>
                </Flex>
                <Divider />
              </Flex>
            </TouchableOpacity>
          )}
          keyExtractor={(item: any) => item.place_id}
        />
      </View>
    </View>
  );
};

export default SearchLocation;
