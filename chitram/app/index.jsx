import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useAuth } from "../hooks/useAuth";
import LoginScreen from "./screens/Login/LoginScreen";
import TabNavigator from "./screens/TabNavigator";

const Stack = createStackNavigator();

export default function App() {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName={true ? "TabNavigator" : "LoginScreen"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />

      <Stack.Screen name="TabNavigator" component={TabNavigator} />
    </Stack.Navigator>
  );
}
