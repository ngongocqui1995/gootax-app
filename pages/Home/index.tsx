import { useAsyncEffect } from "ahooks";
import to from "await-to-js";
import {
  Box,
  ChevronRightIcon,
  Divider,
  Flex,
  Image,
  Text,
  View,
} from "native-base";
import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../services/customer";
import { updateProfileInfo } from "../../slices/profileSlice";
import { NAVIGATOR_SCREEN } from "../../utils/enum";

const Home = ({ navigation }: any) => {
  const profile = useSelector((state: any) => state.profile);
  const dispatch = useDispatch();

  useAsyncEffect(async () => {
    if (profile?.token) {
      const [err, res] = await to(getProfile(profile.token));
      if (err) return;
      dispatch(updateProfileInfo(res.data));
    }
  }, [profile?.token]);

  return (
    <View>
      <View h="26%" backgroundColor="green.300" padding="6">
        <Flex
          direction="row"
          h="100%"
          justifyContent="space-between"
          alignItems="center"
          mt="6"
        >
          <Flex direction="column">
            <Text fontSize={20} fontWeight={700}>
              Di chuyển
            </Text>
            <Text fontSize={11}>Chúng tôi sẽ đưa bạn đến bất kỳ đâu!</Text>
          </Flex>
          <Image alt="car" source={require("../../assets/car.png")} size="xl" />
        </Flex>
      </View>
      <Box
        rounded="md"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
        _dark={{
          borderColor: "coolGray.600",
          backgroundColor: "gray.700",
        }}
        _web={{
          shadow: 2,
          borderWidth: 0,
        }}
        _light={{
          backgroundColor: "gray.50",
        }}
        paddingY={4}
        paddingX={6}
        position="absolute"
        w="90%"
        left="5%"
        right="5%"
        mt="190"
      >
        <TouchableOpacity
          onPress={() => navigation.navigate(NAVIGATOR_SCREEN.SEARCH_LOCATION)}
        >
          <Flex direction="row" alignItems="center" style={{ gap: 14 }}>
            <Image
              source={require("../../assets/location.png")}
              alt="location"
              size="16px"
            />
            <Text fontSize={16} fontWeight={600}>
              Đến đâu?
            </Text>
          </Flex>
        </TouchableOpacity>
      </Box>
      <View h="74%" padding={6} mt="6">
        <Flex direction="column" style={{ gap: 20 }}>
          <Flex direction="row" alignItems="center" style={{ gap: 6 }}>
            <Image
              source={require("../../assets/location-2.png")}
              size="16px"
              alt="location"
            />
            <Flex direction="column" w="90%">
              <Text fontSize={14} fontWeight={600}>
                Viện Thẩm Mỹ Wiin
              </Text>
              <Text isTruncated fontSize={12} w="100%">
                214C Lý Chính Thắng, P9, Q3, Hồ Chí Minh, 700000, Việt Nam
              </Text>
            </Flex>
            <ChevronRightIcon />
          </Flex>
          <Divider />
          <Flex direction="row" alignItems="center" style={{ gap: 6 }}>
            <Image
              source={require("../../assets/location-2.png")}
              size="16px"
              alt="location"
            />
            <Flex direction="column" w="90%">
              <Text fontSize={14} fontWeight={600}>
                Sân Bay Quốc Tế Tân Sơn Nhất
              </Text>
              <Text isTruncated fontSize={12} w="100%">
                Trường Sơn ST, P2, Q.Tân Bình, Hồ Chí Minh, 700000, Việt Nam
              </Text>
            </Flex>
            <ChevronRightIcon />
          </Flex>
          <Divider />
          <Flex direction="row" alignItems="center" style={{ gap: 6 }}>
            <Image
              source={require("../../assets/location-2.png")}
              size="16px"
              alt="location"
            />
            <Flex direction="column" w="90%">
              <Text fontSize={14} fontWeight={600}>
                Công viên Vinhomes Central Park
              </Text>
              <Text isTruncated fontSize={12} w="100%">
                208 Nguyễn Hữu Cảnh, P22, Q. Bình Thạnh, Hồ Chí Minh, Việt Nam
              </Text>
            </Flex>
            <ChevronRightIcon />
          </Flex>
        </Flex>
        <Flex direction="column" mt="8">
          <Text fontSize={16} fontWeight={600}>
            Thêm nhiều cách để di chuyển
          </Text>
          <Flex
            direction="row"
            alignItems="center"
            mt="3"
            backgroundColor="blue.100"
            style={{ gap: 14 }}
            padding={8}
            borderRadius={10}
          >
            <MaterialCommunityIcons name="account-clock-outline" size={30} />
            <Text fontSize={16} fontWeight={500}>
              Thuê xe theo giờ
            </Text>
          </Flex>
        </Flex>
      </View>
    </View>
  );
};

export default Home;
