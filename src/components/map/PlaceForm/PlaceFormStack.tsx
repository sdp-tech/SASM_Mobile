import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import PlaceProfileScreen from "./PlaceProfileScreen";

const Stack = createStackNavigator();

export default function PlaceFormStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={PlaceProfileScreen} />
    </Stack.Navigator>
  );
}
