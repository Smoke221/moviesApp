import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Reply = ({ reply }) => {
  return (
    <View style={styles.replyContainer}>
      <Text style={styles.commentAuthor}>{reply.author}</Text>
      <Text style={styles.commentText}>{reply.comment}</Text>
      <View style={styles.commentDetails}>
        <Text style={styles.detailText}>Likes: {reply.likes}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  replyContainer: {
    marginTop: 5,
    paddingLeft: 20,
    borderLeftWidth: 2,
    borderLeftColor: "#ccc",
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  commentText: {
    fontSize: 14,
    color: "#666",
  },
  commentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  detailText: {
    fontSize: 14,
    color: "#888",
  },
});

export default Reply;
