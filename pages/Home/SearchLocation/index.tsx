import { useAsyncEffect, useSetState } from "ahooks";
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
  useToast,
} from "native-base";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { findGoogleMapsAPI } from "../../../services/location";
import { NAVIGATOR_SCREEN } from "../../../utils/enum";

const SearchLocation = ({ navigation }: any) => {
  const toast = useToast();
  const [state, setState] = useSetState({
    location_from: {
      lat: 0,
      lng: 0,
    },
    location_to: {
      lat: 0,
      lng: 0,
    },
    address_from: "",
    address_to: "",
    active: 1,
    results: [],
  });

  useAsyncEffect(async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      toast.show({
        description: "Bạn không cho phép truy cập vị trí!",
        placement: "top",
      });
      return;
    }

    const { coords } = await Location.getCurrentPositionAsync({});

    if (coords) {
      const { longitude, latitude } = coords;

      setState({ location_from: { lat: latitude, lng: longitude } });
    }
  }, []);

  useAsyncEffect(async () => {
    if (state.active === 0) {
      if (state.address_from) {
        const [, res] = await to(findGoogleMapsAPI(state.address_from));
        setState({ results: res?.data?.results || [] });
      } else {
        setState({ results: [] });
      }
    }

    if (state.active === 1) {
      if (state.address_to) {
        const [, res] = await to(findGoogleMapsAPI(state.address_to));
        setState({ results: res?.data?.results || [] });
      } else {
        setState({ results: [] });
      }
    }
  }, [state.active]);

  useEffect(() => {
    if (state.location_from.lat && state.location_to.lat) {
      navigation.navigate(NAVIGATOR_SCREEN.BOOK_CAR);
    }
  }, [state.location_from, state.location_to]);

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
              isReadOnly={state.active != 0}
              value={state.address_from}
              onChangeText={async (value) => {
                setState({ address_from: value });
                if (value) {
                  const [, res] = await to(findGoogleMapsAPI(value));
                  setState({ results: res?.data?.results || [] });
                }
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
                if (value) {
                  const [, res] = await to(findGoogleMapsAPI(value));
                  setState({ results: res?.data?.results || [] });
                }
              }}
              backgroundColor={state.active === 1 ? "gray.300" : undefined}
              isReadOnly={state.active != 1}
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
          data={state.results}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                const location = {
                  lat: item?.geometry?.location?.lat,
                  lng: item?.geometry?.location?.lng,
                };

                if (state.active === 0) {
                  setState({
                    location_from: location,
                    address_from: item?.formatted_address,
                  });
                }

                if (state.active === 1) {
                  setState({
                    location_to: location,
                    address_to: item?.formatted_address,
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
