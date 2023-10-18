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
  Heading,
  Image,
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
import { GOOGLE_MAPS_API_KEY, NAVIGATOR_SCREEN } from "../../../utils/enum";

const initError = {
  type_car: "",
};

const BookCar = ({ route, navigation }: any) => {
  const { location_from, location_to } = route.params;
  const toast = useToast();
  const profile = useSelector((state: any) => state.profile);
  const map = React.useRef<MapView | null>();
  const [state, setState] = useSetState({
    type_cars: [],
    type_car: "",
    error: initError,
  });

  useAsyncEffect(async () => {
    const [, res] = await to(getTypeCars());
    setState({ type_cars: res?.data || [] });
  }, []);

  const validate = () => {
    if (_.isEmpty(state.type_car)) {
      setState({ error: { ...initError, type_car: "Loại xe là bắt buộc!" } });
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
          from_address: location_from?.address,
          from_address_lat: location_from?.lat,
          from_address_lng: location_from?.lng,
          to_address: location_to?.address,
          to_address_lat: location_to?.lat,
          to_address_lng: location_to?.lng,
          name: profile?.name,
          phone: profile?.phone,
          type_car: state.type_car,
          customer: profile?.id,
        })
      );

      if (err) {
        return toast.show({
          description:
            err?.response?.data?.message?.toString?.() || "Đăng xe thất bại!",
          placement: "top",
        });
      }

      toast.show({ description: "Đăng xe thành công!", placement: "top" });
      navigation.navigate(NAVIGATOR_SCREEN.HOME);
    }
  };

  return (
    <Flex direction="column">
      <View height="75%">
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
          {location_from.lat && location_from.lng && (
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
          )}
          {location_to.lat && location_to.lng && (
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
          )}
          {location_from.lat &&
            location_from.lng &&
            location_to.lat &&
            location_to.lng && (
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
              />
            )}
        </MapView>
      </View>
      <View height="25%">
        <Center>
          <Box w="90%" py="4">
            <Heading
              size="sm"
              color="coolGray.800"
              _dark={{
                color: "warmGray.50",
              }}
              fontWeight="semibold"
            >
              Thông tin đặt xe
            </Heading>
            <View mt="4">
              <FormControl isRequired isInvalid={!!state.error.type_car}>
                <FormControl.Label>Loại xe</FormControl.Label>
                <Select
                  placeholder="Chọn loại xe"
                  onValueChange={(value) => setState({ type_car: value })}
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
              <Button onPress={onSubmit} mt="2" colorScheme="indigo">
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
