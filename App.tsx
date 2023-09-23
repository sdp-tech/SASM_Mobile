import React, { useEffect, useState, useCallback } from "react";
import { Text, TouchableOpacity, View, Linking, LinkingStatic, Alert } from "react-native";
import { LinkingOptions, NavigationContainer, useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapScreen from "./src/pages/SpotMap";
import LoginScreen from "./src/components/Auth/Login";
import MyPageScreen from "./src/pages/MyPage";
import ForestScreen from "./src/pages/Forest";
import StoryScreen, { StoryStackParams } from "./src/pages/Story";
import Navbar0 from "./src/assets/navbar/Navbar0.svg";
import Navbar1 from "./src/assets/navbar/Navbar1.svg";
import Navbar2 from "./src/assets/navbar/Navbar2.svg";
import Navbar3 from "./src/assets/navbar/Navbar3.svg";
import Navbar4 from "./src/assets/navbar/Navbar4.svg";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HomeScreen from "./src/pages/Home";
import { Coord } from "react-native-nmap";
import SplashScreen from "react-native-splash-screen";
import { LoginProvider } from "./src/common/Context";

export type AppProps = {
  Home: any;
  Login: any;
}

const Stack = createNativeStackNavigator();
const useInitialURL = () => {
  const [url, setUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const getUrlAsync = async () => {
      // Get the deep link used to open the app
      const initialUrl = await Linking.getInitialURL();
      // console.log(initialUrl)

      // The setTimeout is just for testing purpose
      setTimeout(() => {
        setUrl(initialUrl);
        setProcessing(false);
      }, 1000);
    };

    getUrlAsync();
  }, []);

  return {url, processing};
};

const App = (): JSX.Element => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 800);
  });

  // const navigation = useNavigation<StackNavigationProp<TabProps>>();

  // useEffect(() => {
  //   //IOS && ANDROID : 앱이 딥링크로 처음 실행될때, 앱이 열려있지 않을 때
  //   Linking.getInitialURL()
  //   .then((url) => deepLink(url))
    
  //   //IOS : 앱이 딥링크로 처음 실행될때, 앱이 열려있지 않을 때 && 앱이 실행 중일 때
  //   //ANDROID : 앱이 실행 중일 때
  //   Linking.addEventListener('url', addListenerLink);

  //   return () => remover()
  // })

  // const deepLink = (url: any) => {
  //   console.log('deep', url)
  //   if (url) {
  //     console.log(url)
  //     // navigation.navigate('OTHER_PAGE', { share: url })
  //   }
  // };

  // const addListenerLink = ({url}: any) => {
  //   console.log('listener', url)
  //   if (url) {
  //     // navigation.navigate('OTHER_PAGE', { share: url })
  //     console.log(url)
  //   }
  // };

  // const remover = () => {
  //   Linking.removeAllListeners('url');
  // };

  const {url: initialUrl, processing} = useInitialURL();
  useEffect(() => {
    if(initialUrl) Alert.alert(initialUrl!)
  }, [])

  const linking : LinkingOptions<AppProps> = {
    prefixes: ["kakao6f1497a97a65b5fe1ca5cf4769c318fd://"],
    config: {
      screens: {
        Home: {
          screens: {
            홈: ':from/:id',
            스토리: ':from/:id',
            포레스트: ':from/:id'
          }
        },
        Login: {}
      },
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LoginProvider>
        <NavigationContainer linking={linking}>
          <Stack.Navigator
            screenOptions={() => ({
              headerShown: false,
            })}
          >
            <Stack.Screen name="Home" component={HomeScreens} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </LoginProvider>
    </GestureHandlerRootView>
  );
};

export type TabProps = {
  홈: {
    id?: number | undefined;
  };
  맵: {
    id?: number;
    coor?: Coord;
    place_name?: string;
  };
  스토리: {
    id: number | undefined;
  };
  포레스트:{
    id: number | undefined;
  }
  마이페이지: undefined;
};

const CustomTab = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View
      style={{
        height: 88,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#FFFFFF",
        borderColor: "#E3E3E3",
        borderTopWidth: 1,
        paddingHorizontal: 10,
      }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index == index;
        const onPress = () => {
          if (route.name == "홈") {
            if (isFocused)
              navigation.reset({
                routes: [{ name: route.name, params: { id: undefined } }],
              });
            else navigation.navigate(route.name, { id: undefined });
          } else if (route.name == "맵") {
            if (isFocused)
              navigation.reset({
                routes: [
                  {
                    name: route.name,
                    params: { id: undefined, coor: undefined },
                  },
                ],
              });
            else
              navigation.navigate(route.name, {
                id: undefined,
                coor: undefined,
              });
          } else if (route.name == "스토리") {
            if (isFocused)
              navigation.reset({
                routes: [{ name: route.name, params: { id: undefined } }],
              });
            else navigation.navigate(route.name, { id: undefined });
          }
          else if (route.name == "포레스트") {
            if (isFocused)
              navigation.reset({
                routes: [{ name: route.name, params: { id: undefined } }],
              });
            else navigation.navigate(route.name, { id: undefined });
          }
          else {
            if (isFocused) navigation.reset({ routes: [{ name: route.name }] });
            else navigation.navigate(route.name);
          }
        };
        return (
          <TouchableOpacity
            onPress={onPress}
            style={{
              width: "20%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {
              {
                0: <Navbar0 color={isFocused ? "#67D393" : "#202020"} />,
                1: <Navbar1 color={isFocused ? "#67D393" : "#202020"} />,
                2: <Navbar2 color={isFocused ? "#67D393" : "#202020"} />,
                3: <Navbar3 color={isFocused ? "#67D393" : "#202020"} />,
                4: <Navbar4 color={isFocused ? "#67D393" : "#202020"} />,
              }[index]
            }

            <Text
              style={{
                color: isFocused ? "#67D393" : "#202020",
                marginVertical: 5,
                fontSize: 12,
              }}
            >
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const Tab = createBottomTabNavigator<TabProps>();
const HomeScreens = (): JSX.Element => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTab {...props} />}
      initialRouteName="홈"
      screenOptions={() => ({
        headerShown: false,
      })}
      backBehavior="order"
    >
      <Tab.Screen name={"홈"} component={HomeScreen} />
      <Tab.Screen name={"스토리"} component={StoryScreen} />
      <Tab.Screen name={"맵"} component={MapScreen} />
      <Tab.Screen name={"포레스트"} component={ForestScreen} />
      <Tab.Screen name={"마이페이지"} component={MyPageScreen} />
    </Tab.Navigator>
  );
};

export default App;
