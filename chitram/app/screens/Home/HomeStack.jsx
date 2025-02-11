import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import PostDetail from '../PostDetail/PostDetail';
import colors from '../../theme/colors';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.primary },
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen 
        name="PostDetails" 
        component={PostDetail}
        options={{
          animation: 'slide_from_right',
          animationDuration: 200,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
