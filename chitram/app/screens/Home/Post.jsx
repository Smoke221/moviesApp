import React, { useState, useRef } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Post = ({ item }) => {
  const profileImageUrl = `https://www.gravatar.com/avatar/749c3e6ccdb52132b8ee9dad27b61c22?d=https://ui-avatars.com/api/${item.postedBy}/128/random`;

  const [modalVisible, setModalVisible] = useState(false);
  const ellipsisRef = useRef(null); // To position the modal

  return (
    <View>
      {/* Profile Image & Name */}
      <View style={styles.leftContainer}>
        <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
        <Text style={styles.postedBy}>{item.postedBy}'s</Text>
      </View>

      {/* Title & Body */}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>

      {/* Comments & Actions Container */}
      <View style={styles.commentsAndActionsContainer}>
        <Text style={styles.commentText}>{item.comments.length} Comments</Text>

        <View style={styles.rightContainer}>

          {/* Ellipsis Icon to Open Modal */}
          <TouchableOpacity
            ref={ellipsisRef}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="ellipsis-vertical-outline" size={16} color="#777" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons
              name="party-popper"
              size={18}
              color="#777"
            />
            <Text style={styles.actionText}>{item.shares} </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome name="comments-o" size={18} color="#777" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="whistle" size={18} color="#777" />
            <Text style={styles.actionText}>{item.likes}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for Actions */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Edit Post</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Delete Post</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  postedBy: {
    fontSize: 14,
    // fontWeight: "bold",
    color: "gray",
    marginBottom: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginTop: 3,
    marginLeft: 24,
  },
  body: {
    fontSize: 14,
    color: "#444",
    marginVertical: 6,
    marginLeft: 24,
  },
  commentsAndActionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingLeft: 2,
  },
  rightContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 12,
    gap: 30,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  actionText: {
    fontSize: 12,
    color: "#777",
  },
  commentText: {
    marginTop: 10,
    fontSize: 12,
    color: "#555",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  modalButton: {
    padding: 10,
  },
  modalButtonText: {
    fontSize: 14,
    color: "#222",
  },
});

export default Post;
