import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/Home/HomeScreen";
import NewsScreen from "../screens/News/NewsScreen";
import ReviewsScreen from "../screens/Reviews/ReviewScreen";
import SearchScreen from "../screens/Search/SearchScreen";
import ProfileDrawer from "./ProfileDrawer";

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get("window");

const TabNavigator = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [translateX] = useState(new Animated.Value(-width));

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(translateX, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setDrawerOpen(false));
  };

  const CustomHeader = () => ({
    headerTitle: () => (
      <Text
        style={{
          color: "red",
          fontSize: 32,
          fontWeight: "700",
          fontFamily: "cursive",
          letterSpacing: 2,
        }}
      >
        Chitram
      </Text>
    ),
    headerTitleAlign: "center",
    headerLeft: () => (
      <TouchableOpacity onPress={openDrawer}>
        <Image
          source={{
            uri: `https://www.gravatar.com/avatar/749c3e6ccdb52132b8ee9dad27b61c22?d=https://ui-avatars.com/api/John+Doe/128/random`,
          }}
          style={{ width: 30, height: 30, borderRadius: 15, marginLeft: 10 }}
        />
      </TouchableOpacity>
    ),
    headerRight: () => (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginRight: 10,
          gap: 10,
        }}
      >
        <TouchableOpacity style={{ marginRight: 15 }}>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="message-square" size={24} color="black" />
        </TouchableOpacity>
      </View>
    ),
  });

  return (
    <>
      {/* Sidebar */}
      {isDrawerOpen && (
        <Animated.View
          style={{
            position: "absolute",
            width: "75%",
            height: "100%",
            backgroundColor: "white",
            zIndex: 10,
            transform: [{ translateX }],
          }}
        >
          <ProfileDrawer closeDrawer={closeDrawer} />
        </Animated.View>
      )}

      {/* Bottom Tab Navigator */}
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "red",
          tabBarInactiveTintColor: "gray",
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" size={size} color={color} />
            ),
            headerShown: true,
            ...CustomHeader(),
          }}
        />
        <Tab.Screen
          name="News"
          component={NewsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="newspaper"
                size={size}
                color={color}
              />
            ),
            headerShown: true,
            ...CustomHeader(),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" size={size} color={color} />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Reviews"
          component={ReviewsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="movie-open-edit-outline"
                size={size}
                color={color}
              />
            ),
            headerShown: true,
            ...CustomHeader(),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default TabNavigator;
