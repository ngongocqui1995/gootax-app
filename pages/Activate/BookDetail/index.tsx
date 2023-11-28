import { useAsyncEffect, useSetState } from "ahooks";
import to from "await-to-js";
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
import { updateStatusBookCar } from "../../../services/book";
import { getTypeCars } from "../../../services/car";
import {
  ENUM_STATUS_BOOK,
  GOOGLE_MAPS_API_KEY,
  NAVIGATOR_SCREEN,
  STATUS_BOOK,
} from "../../../utils/enum";

const BookDetail = ({ route, navigation }: any) => {
  const { location_from, location_to, distance, amount, type_car, id, status } =
    route.params || {};
  const toast = useToast();
  const map = React.useRef<MapView | null>();
  const [state, setState] = useSetState({
    type_cars: [],
  });

  useAsyncEffect(async () => {
    const [, res] = await to(getTypeCars());
    setState({ type_cars: res?.data || [] });
  }, []);

  const onSubmit = async () => {
    const [err]: any = await to(updateStatusBookCar(id, "CANCELED"));

    if (err) {
      return toast.show({
        description:
          err?.response?.data?.message?.toString?.() || "Huỷ đặt xe thất bại!",
        placement: "top",
      });
    }

    toast.show({ description: "Huỷ đặt xe thành công!", placement: "top" });
    navigation.navigate(NAVIGATOR_SCREEN.ACTIVATE);
  };

  return (
    <Flex direction="column">
      <View height="70%">
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
          {location_from?.lat && location_from?.lng && (
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
          {location_to?.lat && location_to?.lng && (
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
          {location_from?.lat &&
            location_from?.lng &&
            location_to?.lat &&
            location_to?.lng && (
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
      <View height="30%">
        <Center>
          <Box w="90%" p="4">
            <View>
              <FormControl isRequired>
                <FormControl.Label>Loại xe</FormControl.Label>
                <Select
                  placeholder="Chọn loại xe"
                  selectedValue={type_car}
                  isDisabled
                >
                  {state.type_cars?.map?.((item: any) => (
                    <Select.Item
                      key={item?.id}
                      label={item?.name}
                      value={item?.id}
                    />
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormControl.Label>Khoảng cách</FormControl.Label>
                <Input
                  value={`${distance || 0}`}
                  isDisabled
                  placeholder="Khoảng cách"
                />
              </FormControl>
              <FormControl isRequired>
                <FormControl.Label>Thành tiền</FormControl.Label>
                <Input
                  value={`${amount || 0}`}
                  isDisabled
                  placeholder="Thành tiền"
                />
              </FormControl>
              {status === ENUM_STATUS_BOOK.FINDING && (
                <Button onPress={onSubmit} my="4" colorScheme="red">
                  Huỷ đặt xe
                </Button>
              )}
              {status !== ENUM_STATUS_BOOK.FINDING && (
                <Button my="4" colorScheme="gray" disabled>
                  {STATUS_BOOK[status as ENUM_STATUS_BOOK]?.text}
                </Button>
              )}
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

export default BookDetail;
