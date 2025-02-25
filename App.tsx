import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeBaseProvider, StatusBar, extendTheme } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Provider } from "react-redux";
import Activate from "./pages/Activate";
import BookDetail from "./pages/Activate/BookDetail";
import Home from "./pages/Home";
import BookCar from "./pages/Home/BookCar";
import SearchLocation from "./pages/Home/SearchLocation";
import Login from "./pages/Login";
import Message from "./pages/Message";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import { store } from "./store";
import { NAVIGATOR_SCREEN } from "./utils/enum";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

// extend the theme
export const theme = extendTheme({ config });

const HomeScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name={NAVIGATOR_SCREEN.HOME}
        component={Home}
        options={{
          headerShown: false,
          tabBarLabel: "Trang chủ",
          tabBarLabelStyle: { width: "100%" },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={NAVIGATOR_SCREEN.ACTIVATE}
        component={Activate}
        options={{
          headerShown: false,
          tabBarLabel: "Hoạt động",
          tabBarLabelStyle: { width: "100%" },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="application"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name={NAVIGATOR_SCREEN.MESSAGE}
        component={Message}
        options={{
          headerShown: false,
          tabBarLabel: "Tin nhắn",
          tabBarLabelStyle: { width: "100%" },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chat" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={NAVIGATOR_SCREEN.PROFILE}
        component={Profile}
        options={{
          headerShown: false,
          tabBarLabel: "Tài khoản",
          tabBarLabelStyle: { width: "100%" },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" />
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name={NAVIGATOR_SCREEN.LOGIN}
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={NAVIGATOR_SCREEN.REGISTER}
              component={Register}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={NAVIGATOR_SCREEN.HOME_SCREEN}
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={NAVIGATOR_SCREEN.BOOK_CAR}
              component={BookCar}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={NAVIGATOR_SCREEN.BOOK_DETAIL}
              component={BookDetail}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={NAVIGATOR_SCREEN.SEARCH_LOCATION}
              component={SearchLocation}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </Provider>
  );
};
export default App;
