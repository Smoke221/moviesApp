import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import MovieDetailsScreen from './MovieDetailsScreen';
import SearchScreen from './SearchScreen';
import CastDetailsScreen from '../../components/CastDetailsScreen';

const Stack = createStackNavigator();

const SearchStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SearchMain" component={SearchScreen} />
      <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} />
      <Stack.Screen name="CastDetails" component={CastDetailsScreen} />
    </Stack.Navigator>
  );
};

export default SearchStack;
