import { useIsFocused } from "@react-navigation/native";
import { useAsyncEffect, useSetState } from "ahooks";
import to from "await-to-js";
import dayjs from "dayjs";
import {
  Box,
  Center,
  ChevronRightIcon,
  Divider,
  FlatList,
  Flex,
  Heading,
  Image,
  Text,
} from "native-base";
import {
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { getBookCar } from "../../services/book";
import {
  ENUM_STATUS_BOOK,
  ENUM_STATUS_BOOK_STRING,
  NAVIGATOR_SCREEN,
  STATUS_BOOK,
} from "../../utils/enum";

const Activate = ({ navigation }: any) => {
  const isFocused = useIsFocused();
  const profile = useSelector((state: any) => state.profile);
  const [state, setState] = useSetState({ data: [], loading: false });

  const loadMore = async () => {
    setState({ loading: true });
    const [, res] = await to(getBookCar(profile?.phone));
    setState({ data: res?.data || [], loading: false });
  };

  useAsyncEffect(async () => {
    if (profile?.phone && isFocused) {
      await loadMore();
    }
  }, [isFocused]);

  return (
    <Box safeArea px="4" py="4">
      <Heading
        size="lg"
        fontWeight="600"
        color="coolGray.800"
        _dark={{
          color: "warmGray.50",
        }}
      >
        Hoạt động
      </Heading>
      <FlatList
        mt="10"
        ListEmptyComponent={
          state.loading ? (
            <ActivityIndicator />
          ) : (
            <Box safeArea>
              <Center>
                <Text fontSize={14}>Không có đơn đặt</Text>
              </Center>
            </Box>
          )
        }
        refreshControl={
          <RefreshControl
            colors={["#9Bd35A", "#689F38"]}
            refreshing={state.loading}
            onRefresh={loadMore}
          />
        }
        data={state.data}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(NAVIGATOR_SCREEN.BOOK_DETAIL, {
                location_from: {
                  lat: item.from_address_lat,
                  lng: item.from_address_lng,
                },
                location_to: {
                  lat: item.to_address_lat,
                  lng: item.to_address_lng,
                },
                type_car: item.type_car?.id,
                distance: item.distance,
                amount: item.amount,
                id: item.id,
                status: item.status,
              });
            }}
            disabled={[
              ENUM_STATUS_BOOK.CANCELED,
              ENUM_STATUS_BOOK.COMPLETED,
            ].includes(item.status)}
          >
            <Flex direction="row" alignItems="center" style={{ gap: 6 }}>
              <Image
                source={require("../../assets/location.png")}
                size="32px"
                alt="location"
              />
              <Flex direction="column" w="85%">
                <Text fontSize={14} fontWeight={600}>
                  {item.from_address}
                </Text>
                <Flex direction="row" fontSize={12} style={{ gap: 4 }}>
                  <Text isTruncated>
                    {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                  </Text>
                  <Text
                    isTruncated
                    px="2"
                    bg={
                      STATUS_BOOK[item.status as ENUM_STATUS_BOOK_STRING]
                        ?.background
                    }
                    color={
                      STATUS_BOOK[item.status as ENUM_STATUS_BOOK_STRING]?.color
                    }
                  >
                    {STATUS_BOOK[item.status as ENUM_STATUS_BOOK_STRING]?.text}
                  </Text>
                </Flex>
              </Flex>
              {[
                ENUM_STATUS_BOOK.FINDING,
                ENUM_STATUS_BOOK.PICKING,
                ENUM_STATUS_BOOK.RIDING,
              ].includes(item.status) && <ChevronRightIcon />}
            </Flex>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <Divider my="2" />}
        keyExtractor={(item: any) => item.id}
      />
    </Box>
  );
};

export default Activate;
