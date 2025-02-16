import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  PanResponder,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "../screens/Home/HomeStack";
import NewsScreen from "../screens/News/NewsScreen";
import ReviewsScreen from "../screens/Reviews/ReviewScreen";
import SearchStack from "../screens/Search/SearchStack";
import ProfileDrawer from "./ProfileDrawer";
import colors from '../theme/colors';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get("window");

const TabNavigator = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [translateX] = useState(new Animated.Value(-width));
  const [overlayOpacity] = useState(new Animated.Value(0));

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return gestureState.dx < 0; // Only respond to left swipes
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx < 0) {
        translateX.setValue(Math.max(-width, gestureState.dx));
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -width * 0.3) {
        // If dragged more than 30% of the width, close the drawer
        closeDrawer();
      } else {
        // Otherwise, snap back to open position
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: -width,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => setDrawerOpen(false));
  };

  const CustomHeader = () => ({
    headerTitle: () => (
      <Text
        style={{
          color: colors.accent.primary,
          fontSize: 32,
          fontWeight: "700",
          fontFamily: "cursive",
          textShadowColor: colors.primary,
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 2,
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
          style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 10 }}
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
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="message-square" size={24} color="white" />
        </TouchableOpacity>
      </View>
    ),
    headerStyle: {
      backgroundColor:"black",
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
  });

  return (
    <>
      {/* Sidebar */}
      {isDrawerOpen && (
        <>
          <Animated.View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 9,
              opacity: overlayOpacity,
            }}
          >
            <TouchableWithoutFeedback onPress={closeDrawer}>
              <View style={{ width: '100%', height: '100%' }} />
            </TouchableWithoutFeedback>
          </Animated.View>
          <Animated.View
            {...panResponder.panHandlers}
            style={{
              position: "absolute",
              width: "75%",
              height: "100%",
              backgroundColor: colors.background.primary,
              zIndex: 10,
              transform: [{ translateX }],
              shadowColor: colors.system.shadow,
              shadowOffset: { width: -2, height: 0 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <ProfileDrawer closeDrawer={closeDrawer} />
          </Animated.View>
        </>
      )}

      {/* Bottom Tab Navigator */}
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: "white",
          tabBarStyle: {
            backgroundColor:"black",
            borderTopWidth: 0,
            elevation: 8,
            shadowColor: colors.system.shadow,
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
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
              <MaterialCommunityIcons name="newspaper-variant" size={size} color={color} />
            ),
            headerShown: true,
            ...CustomHeader(),
          }}
        />
        <Tab.Screen
          name="Reviews"
          component={ReviewsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="star-half-full" size={size} color={color} />
            ),
            headerShown: true,
            ...CustomHeader(),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="movie-search" size={size} color={color} />
            ),
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default TabNavigator;
