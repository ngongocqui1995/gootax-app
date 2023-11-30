import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSetState } from "ahooks";
import to from "await-to-js";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  HStack,
  Heading,
  Input,
  Link,
  Spinner,
  Text,
  VStack,
  useToast,
} from "native-base";
import { useDispatch } from "react-redux";
import { getProfile, loginCustomer } from "../../services/customer";
import { updateProfileInfo } from "../../slices/profileSlice";
import { NAVIGATOR_SCREEN } from "../../utils/enum";

const Login = ({ navigation }: any) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const [state, setState] = useSetState({
    phone: "",
    password: "",
    loading: false,
  });

  const updateProfile = async (token: string): Promise<boolean> => {
    const [err, res]: any = await to(getProfile(token));
    if (err) {
      toast.show({
        description:
          err?.response?.data?.message?.toString?.() || "Đăng nhập thất bại!",
        placement: "top",
      });
      return false;
    }

    dispatch(updateProfileInfo(res.data));
    return true;
  };

  const handleLogin = async () => {
    setState({ loading: true });

    const [err, res]: any = await to(
      loginCustomer({
        phone: state.phone?.trim?.(),
        password: state.password?.trim?.(),
      })
    );

    if (err) {
      return toast.show({
        description:
          err?.response?.data?.message?.toString?.() || "Đăng nhập thất bại!",
        placement: "top",
      });
    }

    const token = res?.data?.token || "";
    if (await updateProfile(token)) {
      toast.show({ description: "Đăng nhập thành công!", placement: "top" });
      await AsyncStorage.setItem("token", token);
      navigation.navigate(NAVIGATOR_SCREEN.HOME_SCREEN);
    }
    setState({ loading: false });
  };

  return (
    <Center w="100%" h="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading
          size="lg"
          fontWeight="600"
          color="coolGray.800"
          _dark={{
            color: "warmGray.50",
          }}
        >
          GooTax
        </Heading>
        <Heading
          mt="1"
          _dark={{
            color: "warmGray.200",
          }}
          color="coolGray.600"
          fontWeight="medium"
          size="xs"
        >
          Đăng nhập tài khoản
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Số điện thoại</FormControl.Label>
            <Input
              placeholder="0851234567"
              onChangeText={(value) => setState({ phone: value })}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Mật khẩu</FormControl.Label>
            <Input
              type="password"
              placeholder="123456"
              onChangeText={(value) => setState({ password: value })}
            />
            <Link
              _text={{
                fontSize: "xs",
                fontWeight: "500",
                color: "indigo.500",
              }}
              alignSelf="flex-end"
              mt="1"
            >
              Quên mật khẩu?
            </Link>
          </FormControl>
          <Button onPress={handleLogin} mt="2" colorScheme="indigo">
            Đăng nhập
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text
              fontSize="sm"
              color="coolGray.600"
              _dark={{
                color: "warmGray.200",
              }}
            >
              Bạn cần tài khoản mới.{" "}
            </Text>
            <Link
              _text={{
                color: "indigo.500",
                fontWeight: "medium",
                fontSize: "sm",
              }}
              onPress={() => navigation.navigate(NAVIGATOR_SCREEN.REGISTER)}
            >
              Đăng ký
            </Link>
          </HStack>
        </VStack>
      </Box>
      {state.loading && (
        <Flex
          position="absolute"
          top={0}
          bottom={0}
          left={0}
          right={0}
          bg="rgba(0, 0, 0, 0.2)"
          flex="1"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner color="cyan.500" size="lg" />
        </Flex>
      )}
    </Center>
  );
};

export default Login;
