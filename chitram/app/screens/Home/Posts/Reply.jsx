import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../../theme/colors";

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
    marginLeft: 20,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: colors.secondary,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.secondary,
  },
  commentText: {
    fontSize: 14,
    color: colors.secondary,
  },
  commentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  detailText: {
    fontSize: 14,
    color: colors.secondary,
  },
});

export default Reply;
