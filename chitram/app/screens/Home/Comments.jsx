import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Reply from "./Reply";
import colors from '../../theme/colors';

const Comment = ({ comment, showAllReplies, handleToggleReplies }) => {
  return (
    <View style={styles.commentContainer}>
      <Text style={styles.commentAuthor}>{comment.author}</Text>
      <Text style={styles.commentText}>{comment.comment}</Text>
      <View style={styles.commentDetails}>
        <Text style={styles.detailText}>Likes: {comment.likes}</Text>
      </View>

      {/* Show only one reply by default */}
      {comment.replies.length > 0 && !showAllReplies && (
        <Reply reply={comment.replies[0]} />
      )}

      {/* Show all replies if toggle is enabled */}
      {showAllReplies && (
        <View style={styles.repliesContainer}>
          {comment.replies.map((reply, idx) => (
            <Reply key={idx} reply={reply} />
          ))}
        </View>
      )}

      {/* Button to toggle replies */}
      {comment.replies.length > 1 && (
        <TouchableOpacity style={styles.showMoreButton} onPress={handleToggleReplies}>
          <Text style={styles.showMoreText}>
            {showAllReplies ? "Show less replies" : "Show more replies"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    marginBottom: 10,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  commentText: {
    fontSize: 14,
    color: colors.text.light,
  },
  commentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  repliesContainer: {
    marginTop: 10,
  },
  showMoreButton: {
    marginTop: 10,
    padding: 5,
    backgroundColor: colors.background.light,
    borderRadius: 5,
  },
  showMoreText: {
    color: colors.accent.link,
    fontSize: 14,
    textAlign: "center",
  },
});

export default Comment;
