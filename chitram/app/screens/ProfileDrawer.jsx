import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, TextInput } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import { useAuth } from "../../hooks/useAuth";
import colors from '../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileDrawer = ({ closeDrawer }) => {
  const navigation = useNavigation();
  const { logout, user } = useAuth();

  const [primaryColor, setPrimaryColor] = useState('');
  const [secondaryColor, setSecondaryColor] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');

  const handleGesture = (event) => {
    if (event.nativeEvent.translationX < -50) {
      closeDrawer(); // Close if swiped left
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Validate hex code
  const isValidHex = (hex) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  };

  // Calculate float primary (similar to current ratio)
  const calculateFloatPrimary = (primaryHex) => {
    // Convert hex to RGB and adjust opacity
    const r = parseInt(primaryHex.slice(1,3), 16);
    const g = parseInt(primaryHex.slice(3,5), 16);
    const b = parseInt(primaryHex.slice(5,7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.7)`;
  };

  const handleSetColors = async () => {
    const newColors = {};
  
    if (primaryColor) {
      if (!isValidHex(primaryColor)) {
        Alert.alert("Invalid Color", "Primary color must be a valid hex code (e.g., #FF0000)");
        return;
      }
      newColors.primary = primaryColor;
      newColors.floats = { primary: calculateFloatPrimary(primaryColor) };
    }
  
    if (secondaryColor) {
      if (!isValidHex(secondaryColor)) {
        Alert.alert("Invalid Color", "Secondary color must be a valid hex code (e.g., #00FF00)");
        return;
      }
      newColors.secondary = secondaryColor;
    }
  
    if (backgroundColor) {
      if (!isValidHex(backgroundColor)) {
        Alert.alert("Invalid Color", "Background color must be a valid hex code (e.g., #0000FF)");
        return;
      }
      newColors.background = backgroundColor;
    }
  
    if (Object.keys(newColors).length === 0) {
      Alert.alert("No Colors Entered", "Please enter at least one color to update.");
      return;
    }
  
    try {
      const storedColors = await AsyncStorage.getItem("APP_COLORS");
      const existingColors = storedColors ? JSON.parse(storedColors) : {};
  
      const mergedColors = { ...existingColors, ...newColors };
  
      await AsyncStorage.setItem("APP_COLORS", JSON.stringify(mergedColors));
      Alert.alert("Success", "Colors updated! Please restart the app to see changes.");
    } catch (error) {
      Alert.alert("Error", "Failed to save colors");
    }
  };
  

  return (
    <PanGestureHandler
      onGestureEvent={handleGesture}
      onHandlerStateChange={handleGesture}
    >
      <View style={styles.container}>
        {/* Header Section (User Profile) */}
        <View style={styles.header}>
          <Image
            source={{
              uri: "https://www.gravatar.com/avatar/749c3e6ccdb52132b8ee9dad27b61c22?d=https://ui-avatars.com/api/John+Doe/128/random",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{user?.username || 'User'}</Text>
        </View>

        <View style={styles.colorSection}>
          <Text style={styles.sectionTitle}>Customize Colors</Text>
          <TextInput
            style={styles.colorInput}
            placeholder="#000000"
            placeholderTextColor={colors.text.secondary}
            value={primaryColor}
            onChangeText={setPrimaryColor}
            maxLength={7}
          />
          <TextInput
            style={styles.colorInput}
            placeholder="#000000"
            placeholderTextColor={colors.text.secondary}
            value={secondaryColor}
            onChangeText={setSecondaryColor}
            maxLength={7}
          />
          <TextInput
            style={styles.colorInput}
            placeholder="#000000"
            placeholderTextColor={colors.text.secondary}
            value={backgroundColor}
            onChangeText={setBackgroundColor}
            maxLength={7}
          />
          <TouchableOpacity 
            style={styles.setColorButton}
            onPress={handleSetColors}
          >
            <Text style={styles.setColorButtonText}>Set Colors</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer to push menu items to bottom */}
        <View style={styles.flexSpacer} />

        {/* Menu Items */}
        <TouchableOpacity style={styles.menuItem}>
          <Feather name="settings" size={18} color={colors.text.primary} />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={handleLogout}
        >
          <Feather name="log-out" size={18} color={colors.text.primary} />
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    width: 270,
    paddingVertical: 40,
    paddingHorizontal: 20,
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    shadowColor: colors.system.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginLeft: 10,
  },
  flexSpacer: {
    flex: 1, // Pushes menu items to the bottom
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 15,
    marginLeft: 10,
    fontWeight: "500",
    color: colors.text.primary,
  },
  colorSection: {
    marginVertical: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 10,
  },
  colorInput: {
    backgroundColor: colors.secondary,
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  setColorButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  setColorButtonText: {
    color: colors.text.primary,
    fontWeight: "600",
  },
});

export default ProfileDrawer;
