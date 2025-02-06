import { useAuth } from "@/hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";

export default function LoginScreen() {
  const { login } = useAuth();
  const navigation = useNavigation(); // Get navigation object
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const success = login(username, password);
    if (success) {
      Alert.alert("Login Successful", `Welcome, ${username}!`);
      navigation.navigate("TabNavigator");
    } else {
      Alert.alert("Login Failed", "Invalid username or password.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Login Screen</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
