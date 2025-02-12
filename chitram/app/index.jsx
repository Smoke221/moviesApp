import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "../hooks/useAuth";
import LoginScreen from "./screens/Login/LoginScreen";
import TabNavigator from "./screens/TabNavigator";
import colors from "./theme/colors";

const Stack = createStackNavigator();

export default function App() {
  const { user, checkAuthStatus } = useAuth();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuthStatus();
      setIsAuthChecking(false);
    };

    initializeAuth();
  }, []);

  if (isAuthChecking) {
    return (
      <View 
        style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: colors.background.primary 
        }}
      >
        <ActivityIndicator 
          size="large" 
          color={colors.primary} 
        />
      </View>
    );
  }

  return (

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={user ? "TabNavigator" : "LoginScreen"}
      >
        <Stack.Screen 
          name="LoginScreen" 
          component={LoginScreen} 
        />
        <Stack.Screen 
          name="TabNavigator" 
          component={TabNavigator} 
        />
      </Stack.Navigator>

  );
}
