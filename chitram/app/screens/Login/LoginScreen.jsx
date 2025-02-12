import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../../hooks/useAuth";
import colors from "../../theme/colors";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const { login, error, isLoading } = useAuth();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert("Login Error", error);
    }
  }, [error]);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Invalid Input", "Please enter both username and password");
      return;
    }

    const success = await login(username, password);
    if (success) {
      navigation.reset({
        index: 0,
        routes: [{ name: "TabNavigator" }],
      });
    }
  };

  return (
    <LinearGradient
      colors={[colors.background.primary, colors.background.secondary]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <Animated.View
          style={[
            styles.loginBox,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons
              name="movie-roll"
              size={80}
              color={colors.primary}
            />
            <Text style={styles.appTitle}>Chitram</Text>
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="account"
              size={24}
              color={colors.text.secondary}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Username"
              placeholderTextColor={colors.text.secondary}
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock"
              size={24}
              color={colors.text.secondary}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor={colors.text.secondary}
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.showPasswordButton}
            >
              <MaterialCommunityIcons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <MaterialCommunityIcons
                name="loading"
                size={24}
                color={colors.text.white}
              />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPasswordLink}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardContainer: {
    width: "100%",
    alignItems: "center",
  },
  loginBox: {
    width: "85%",
    backgroundColor: colors.background.light,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: colors.system.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text.primary,
    marginTop: 10,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: colors.text.primary,
  },
  showPasswordButton: {
    padding: 10,
  },
  loginButton: {
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: colors.background.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPasswordLink: {
    marginTop: 15,
  },
  forgotPasswordText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
});

export default LoginScreen;
