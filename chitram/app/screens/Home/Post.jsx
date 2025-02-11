import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../theme/colors";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get('window');

const Post = ({ item }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const ellipsisRef = useRef(null);
  const profileImageUrl = `https://www.gravatar.com/avatar/749c3e6ccdb52132b8ee9dad27b61c22?d=https://ui-avatars.com/api/${item.postedBy}/128/random`;

  const handleEllipsisPress = () => {
    ellipsisRef.current.measure((x, y, width, height, pageX, pageY) => {
      setMenuPosition({ x: pageX - 100, y: pageY + height });
      setModalVisible(true);
    });
  };

  const handlePostPress = () => {
    navigation.navigate('PostDetails', { post: item });
  };

  // Get user's primary color (could be based on username hash)
  const getUserColor = (username) => {
    const colors = ['#FFD700', '#9B59B6', '#3498DB', '#E74C3C', '#2ECC71'];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const userColor = getUserColor(item.postedBy);

  // Determine post category and its style
  const getPostStyle = () => {
    const content = (item.title + " " + item.body).toLowerCase();
    if (content.includes('review')) {
      return { color: '#FFD700', icon: 'star-outline', label: 'REVIEW' };
    } else if (content.includes('music')) {
      return { color: '#9B59B6', icon: 'musical-notes-outline', label: 'SOUNDTRACK' };
    } else if (content.includes('theory')) {
      return { color: '#3498DB', icon: 'bulb-outline', label: 'THEORY' };
    } else if (content.includes('scene')) {
      return { color: '#E74C3C', icon: 'videocam-outline', label: 'SCENE' };
    }
    return { color: colors.primary, icon: 'film-outline', label: 'CINEPHILE' };
  };

  const postStyle = getPostStyle();

  return (
    <TouchableOpacity style={styles.container} onPress={handlePostPress} activeOpacity={0.9}>
      {/* Header with Username */}
      <View style={styles.header}>
        <View style={styles.userStrip}>
          <View style={[styles.userMarker, { backgroundColor: userColor }]} />
          <Text style={styles.username}>{item.postedBy}</Text>
        </View>
        
        <TouchableOpacity
          ref={ellipsisRef}
          onPress={handleEllipsisPress}
          style={styles.moreButton}
        >
          <MaterialCommunityIcons name="dots-vertical" size={18} color={colors.text.light} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.body} numberOfLines={3}>{item.body}</Text>
      </View>

      {/* Footer with Comment Count */}
      <View style={styles.footer}>
        {/* <View style={styles.authorSection}>
          <Image source={{ uri: profileImageUrl }} style={styles.authorImage} />
          <Text style={styles.authorName}>{item.postedBy}</Text>
        </View> */}

        <Text style={styles.commentCount}>
          {item.comments.length} {item.comments.length === 1 ? 'comment' : 'comments'}
        </Text>

        <View style={styles.engagementStrip}>
          <TouchableOpacity style={styles.engagementButton}>
            <View style={styles.likeContainer}>
              <Ionicons name="thumbs-up-outline" size={18} color={colors.text.light} />
              <Text style={styles.likeCount}>{item.likes}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.engagementButton}>
            <Ionicons name="chatbubble-outline" size={16} color={colors.text.light} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.engagementButton}>
            <Ionicons name="arrow-redo-outline" size={18} color={colors.text.light} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View 
            style={[
              styles.menuContent,
              {
                position: 'absolute',
                top: menuPosition.y,
                left: menuPosition.x,
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="flag-outline" size={18} color={colors.primary} />
              <Text style={styles.menuItemText}>Report</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    marginVertical: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 12,
  },
  userStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  userMarker: {
    width: 3,
    height: 16,
    marginRight: 8,
    borderRadius: 1.5,
  },
  username: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: colors.text.primary,
  },
  content: {
    padding: 16,
    paddingTop: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
    lineHeight: 24,
  },
  body: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  authorName: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  commentCount: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  engagementStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.light,
    borderRadius: 20,
    padding: 4,
  },
  engagementButton: {
    padding: 6,
    marginHorizontal: 4,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeCount: {
    fontSize: 12,
    color: colors.text.light,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuContent: {
    backgroundColor: colors.background.primary,
    borderRadius: 6,
    padding: 4,
    shadowColor: colors.system.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    width: 120,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
  },
  menuItemText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
  },
});

export default Post;
