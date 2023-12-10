import { useAsyncEffect, useSetState } from "ahooks";
import to from "await-to-js";
import * as _ from "lodash";
import {
  Box,
  Button,
  Center,
  ChevronLeftIcon,
  Flex,
  FormControl,
  Image,
  Input,
  Select,
  View,
  useToast,
} from "native-base";
import React from "react";
import { TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useSelector } from "react-redux";
import { bookCar, getTypeCars } from "../../../services/car";
import { checkPrice } from "../../../services/location";
import { GOOGLE_MAPS_API_KEY, NAVIGATOR_SCREEN } from "../../../utils/enum";

const initError = {
  type_car: "",
  distance: "",
  amount: "",
};

const BookCar = ({ route, navigation }: any) => {
  const { location_from, location_to } = route.params || {};
  const toast = useToast();
  const profile = useSelector((state: any) => state.profile);
  const map = React.useRef<MapView | null>();
  const [state, setState] = useSetState({
    type_cars: [],
    type_car: "",
    distance: 0,
    amount: 0,
    error: initError,
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
  });

  useAsyncEffect(async () => {
    const [, res] = await to(getTypeCars());
    setState({ type_cars: res?.data || [] });

    map.current?.fitToSuppliedMarkers(["mk1", "mk2"], {
      edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
    });
  }, []);

  const validate = () => {
    if (_.isEmpty(state.type_car)) {
      setState({ error: { ...initError, type_car: "Loại xe là bắt buộc!" } });
      return false;
    }

    if (state.distance <= 0) {
      setState({
        error: { ...initError, distance: "Khoảng cách là bắt buộc!" },
      });
      return false;
    }

    if (state.amount <= 0) {
      setState({
        error: { ...initError, amount: "Thành tiền là bắt buộc!" },
      });
      return false;
    }

    setState({ error: initError });

    return true;
  };

  const onSubmit = async () => {
    const check = validate();

    if (check) {
      const [err]: any = await to(
        bookCar({
          from_address: state.location_from?.address,
          from_address_lat: state.location_from?.lat,
          from_address_lng: state.location_from?.lng,
          to_address: state.location_to?.address,
          to_address_lat: state.location_to?.lat,
          to_address_lng: state.location_to?.lng,
          name: profile?.name,
          phone: profile?.phone,
          type_car: state.type_car,
          customer: profile?.id,
          distance: state.distance,
          amount: state.amount,
        })
      );

      if (err) {
        return toast.show({
          description:
            err?.response?.data?.message?.toString?.() || "Đặt xe thất bại!",
          placement: "top",
        });
      }

      toast.show({ description: "Đặt xe thành công!", placement: "top" });
      navigation.navigate(NAVIGATOR_SCREEN.HOME);
    }
  };

  return (
    <Flex direction="column">
      <View height="60%">
        <MapView
          ref={(ref) => {
            map.current = ref;
          }}
          style={{ width: "100%", height: "100%" }}
          userInterfaceStyle="light"
          onMapReady={() => {
            map.current?.fitToSuppliedMarkers(["mk1", "mk2"], {
              edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
            });
          }}
        >
          {location_from?.lat && location_from?.lng ? (
            <Marker
              coordinate={{
                latitude: location_from.lat,
                longitude: location_from.lng,
              }}
              identifier={"mk1"}
            >
              <Image
                alt="location-user"
                source={require("../../../assets/location-user.png")}
                style={{ height: 35, width: 35 }}
              />
            </Marker>
          ) : null}
          {location_to?.lat && location_to?.lng ? (
            <Marker
              coordinate={{
                latitude: location_to.lat,
                longitude: location_to.lng,
              }}
              identifier={"mk2"}
            >
              <Image
                alt="location-house"
                source={require("../../../assets/location-house.png")}
                style={{ height: 35, width: 35 }}
              />
            </Marker>
          ) : null}
          {location_from?.lat &&
          location_from?.lng &&
          location_to?.lat &&
          location_to?.lng ? (
            <MapViewDirections
              language="vi"
              strokeWidth={5}
              strokeColor="green"
              origin={{
                latitude: location_from.lat,
                longitude: location_from.lng,
              }}
              destination={{
                latitude: location_to.lat,
                longitude: location_to.lng,
              }}
              apikey={GOOGLE_MAPS_API_KEY}
              onReady={(distance) => {
                setState({
                  location_from: {
                    address: distance?.legs?.[0]?.start_address || "",
                    lat: distance?.legs?.[0]?.start_location?.lat || 0,
                    lng: distance?.legs?.[0]?.start_location?.lng || 0,
                  },
                  location_to: {
                    address: distance?.legs?.[0]?.end_address || "",
                    lat: distance?.legs?.[0]?.end_location?.lat || 0,
                    lng: distance?.legs?.[0]?.end_location?.lng || 0,
                  },
                });
              }}
            />
          ) : null}
        </MapView>
      </View>
      <View height="40%">
        <Center>
          <Box w="90%" p="4">
            <View>
              <FormControl isRequired isInvalid={!!state.error.type_car}>
                <FormControl.Label>Loại xe</FormControl.Label>
                <Select
                  placeholder="Chọn loại xe"
                  onValueChange={async (value) => {
                    const [, res] = await to(
                      checkPrice({
                        from_lat: location_from?.lat,
                        from_lng: location_from?.lng,
                        to_lat: location_to?.lat,
                        to_lng: location_to?.lng,
                        type_car_id: value,
                      })
                    );
                    setState({
                      type_car: value,
                      distance: res?.distance || 0,
                      amount: res?.amount || 0,
                      error: { ...initError, distance: "", amount: "" },
                    });
                  }}
                >
                  {state.type_cars?.map?.((item: any) => (
                    <Select.Item
                      key={item?.id}
                      label={item?.name}
                      value={item?.id}
                    />
                  ))}
                </Select>
                <FormControl.ErrorMessage>
                  {state.error.type_car}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isReadOnly
                isInvalid={!!state.error.distance}
              >
                <FormControl.Label>Khoảng cách</FormControl.Label>
                <Input
                  value={`${state.distance || 0}`}
                  isDisabled
                  placeholder="Khoảng cách"
                />
                <FormControl.ErrorMessage>
                  {state.error.distance}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isReadOnly
                isInvalid={!!state.error.amount}
              >
                <FormControl.Label>Thành tiền</FormControl.Label>
                <Input
                  value={`${state.amount || 0}`}
                  isDisabled
                  placeholder="Thành tiền"
                />
                <FormControl.ErrorMessage>
                  {state.error.amount}
                </FormControl.ErrorMessage>
              </FormControl>
              <Button onPress={onSubmit} my="4" colorScheme="indigo">
                Đặt xe
              </Button>
            </View>
          </Box>
        </Center>
      </View>
      <View position="absolute" top={55} left={5}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeftIcon size="24px" />
        </TouchableOpacity>
      </View>
    </Flex>
  );
};

export default BookCar;
