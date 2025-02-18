import colors from "@/app/theme/colors";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import NewsScreen from "../News/NewsScreen";
import MovieDetailsScreen from "../Search/MovieDetailsScreen";
import TvSeriesDetailsScreen from "../Search/TvSeriesDetailsScreen";
import HomeScreen from "./HomeScreen";
import TopImdbMovies from "./TopImdbMovies";

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.primary },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} />
      <Stack.Screen name="TvSeriesDetails" component={TvSeriesDetailsScreen} />
      <Stack.Screen name="TopMovies" component={TopImdbMovies} />
      <Stack.Screen name="NewsScreen" component={NewsScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
