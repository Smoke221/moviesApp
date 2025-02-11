// import feed from "../../../feed";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Post from "./Post";
import { feed } from '../../data/feed';

const HomeScreen = () => {
  const [showAllReplies, setShowAllReplies] = useState(false);

  const handleToggleReplies = () => {
    setShowAllReplies((prevState) => !prevState);
  };

  const renderItem = ({ item }) => {
    return (
      <Post
        item={item}
        showAllReplies={showAllReplies}
        handleToggleReplies={handleToggleReplies}
      />
    );
  };

  return (
    <FlatList
      data={feed}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 3,
  },
});

export default HomeScreen;
