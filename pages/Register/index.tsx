import { useSetState } from "ahooks";
import to from "await-to-js";
import * as _ from "lodash";
import {
  Box,
  Button,
  Center,
  FormControl,
  HStack,
  Heading,
  Input,
  Link,
  Text,
  VStack,
  useToast,
} from "native-base";
import { createCustomer } from "../../services/customer";
import { NAVIGATOR_SCREEN } from "../../utils/enum";

const initError = {
  name: "",
  phone: "",
  password: "",
  confirm_password: "",
};

const Register = ({ navigation }: any) => {
  const toast = useToast();
  const [state, setState] = useSetState({
    name: "",
    phone: "",
    password: "",
    confirm_password: "",
    error: initError,
  });

  const validate = () => {
    if (_.isEmpty(state?.name)) {
      setState({ error: { ...initError, name: "Tên không được rỗng!" } });
      return false;
    }

    if (_.isEmpty(state?.phone)) {
      setState({
        error: { ...initError, phone: "Số điện thoại không được rỗng!" },
      });
      return false;
    }

    if (_.isEmpty(state?.password)) {
      setState({
        error: { ...initError, password: "Mật khẩu không được rỗng!" },
      });
      return false;
    }

    if (_.isEmpty(state?.confirm_password)) {
      setState({
        error: {
          ...initError,
          confirm_password: "Xác nhận mật khẩu không được rỗng!",
        },
      });
      return false;
    }

    if (state?.password !== state.confirm_password) {
      setState({
        error: {
          ...initError,
          confirm_password: "Mật khẩu xác nhận không khớp!",
        },
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
        createCustomer({
          name: state.name?.trim?.(),
          password: state.password?.trim?.(),
          phone: state.phone?.trim?.(),
        })
      );

      if (err) {
        return toast.show({
          description:
            err?.response?.data?.message?.toString?.() || "Đăng ký thất bại!",
          placement: "top",
        });
      }

      toast.show({ description: "Đăng ký thành công!", placement: "top" });
      navigation.navigate(NAVIGATOR_SCREEN.LOGIN);
    }
  };

  return (
    <Center w="100%" h="100%">
      <Box safeArea p="2" w="90%" maxW="290" py="8">
        <Heading
          size="lg"
          color="coolGray.800"
          _dark={{
            color: "warmGray.50",
          }}
          fontWeight="semibold"
        >
          GooTax
        </Heading>
        <Heading
          mt="1"
          color="coolGray.600"
          _dark={{
            color: "warmGray.200",
          }}
          fontWeight="medium"
          size="xs"
        >
          Đăng ký tài khoản
        </Heading>
        <VStack space={3} mt="5">
          <FormControl isRequired isInvalid={!!state.error.name}>
            <FormControl.Label>Tên</FormControl.Label>
            <Input
              placeholder="Nguyễn Văn A"
              onChangeText={(value) => setState({ name: value })}
            />
            <FormControl.ErrorMessage>
              {state.error.name}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={!!state.error.phone}>
            <FormControl.Label>Số điện thoại</FormControl.Label>
            <Input
              placeholder="0851234567"
              onChangeText={(value) => setState({ phone: value })}
            />
            <FormControl.ErrorMessage>
              {state.error.phone}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={!!state.error.password}>
            <FormControl.Label>Mật khẩu</FormControl.Label>
            <Input
              type="password"
              placeholder="123456"
              onChangeText={(value) => setState({ password: value })}
            />
            <FormControl.ErrorMessage>
              {state.error.password}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={!!state.error.confirm_password}>
            <FormControl.Label>Xác nhận mật khẩu</FormControl.Label>
            <Input
              type="password"
              placeholder="123456"
              onChangeText={(value) => setState({ confirm_password: value })}
            />
            <FormControl.ErrorMessage>
              {state.error.confirm_password}
            </FormControl.ErrorMessage>
          </FormControl>
          <Button onPress={onSubmit} mt="2" colorScheme="indigo">
            Đăng ký
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text
              fontSize="sm"
              color="coolGray.600"
              _dark={{
                color: "warmGray.200",
              }}
            >
              Bạn đã có tài khoản.{" "}
            </Text>
            <Link
              _text={{
                color: "indigo.500",
                fontWeight: "medium",
                fontSize: "sm",
              }}
              onPress={() => navigation.navigate(NAVIGATOR_SCREEN.LOGIN)}
            >
              Đăng nhập
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>
  );
};

export default Register;
