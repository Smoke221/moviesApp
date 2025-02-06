import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Feather from "react-native-vector-icons/Feather";

const ProfileDrawer = ({ closeDrawer }) => {
  const handleGesture = (event) => {
    if (event.nativeEvent.translationX < -50) {
      closeDrawer(); // Close if swiped left
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
          <Text style={styles.userName}>John Doe</Text>
        </View>

        {/* Spacer to push menu items to bottom */}
        <View style={styles.flexSpacer} />

        {/* Menu Items */}
        <TouchableOpacity style={styles.menuItem}>
          <Feather name="settings" size={18} color="black" />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Feather name="log-out" size={18} color="black" />
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: 270,
    paddingVertical: 40,
    paddingHorizontal: 20,
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    shadowColor: "#000",
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
    // marginLeft: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
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
  },
});

export default ProfileDrawer;
