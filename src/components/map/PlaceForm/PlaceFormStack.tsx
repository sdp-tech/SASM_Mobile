import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import PlaceProfileScreen from "./PlaceProfileScreen";
import PlaceFormHeader from "./PlaceFormHeader";
import { Alert } from "react-native";

const Stack = createStackNavigator();

interface PlaceFormStackProps {
  setTab: Dispatch<SetStateAction<number>>;
}

export default function PlaceFormStack({ setTab }: PlaceFormStackProps) {
  const [closePopup, setClosePopup] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (closePopup) {
      Alert.alert("나가시겠습니까?", "입력하신 정보는 저장되지 않습니다.", [
        { text: "머무르기", style: "cancel", onPress: () => {} },
        {
          text: "나가기",
          style: "destructive",
          // If the user confirmed, then we dispatch the action we blocked earlier
          // This will continue the action that had triggered the removal of the screen
          onPress: () => setTab(0),
        },
      ]);
    }
  }, [closePopup]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={PlaceProfileScreen}
        options={{
          header: () => (
            <PlaceFormHeader
              onLeft={() => navigation.goBack()}
              onRight={() => setClosePopup(true)}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}
