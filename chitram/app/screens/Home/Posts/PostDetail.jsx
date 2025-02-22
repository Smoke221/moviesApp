import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import colors from '../../../theme/colors';

const { width, height } = Dimensions.get('window');

const Comment = ({ comment }) => {
  const hasReplies = comment.replies && comment.replies.length > 0;
  const [showReplies, setShowReplies] = useState(false);
  
  return (
    <View style={styles.commentContainer}>
      <TouchableOpacity 
        style={styles.commentContent}
        onPress={() => hasReplies && setShowReplies(!showReplies)}
      >
        <View style={styles.commentHeader}>
          <Text style={styles.commentAuthor}>{comment.author}</Text>
          {hasReplies && (
            <View style={styles.replyIndicator}>
              <Ionicons 
                name={showReplies ? "chevron-up" : "chevron-down"} 
                size={16} 
                color={colors.secondary}
              />
              <Text style={styles.replyCount}>
                {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.commentText}>{comment.comment}</Text>
        <View style={styles.commentFooter}>
          <TouchableOpacity style={styles.commentAction}>
            <Ionicons name="heart-outline" size={14} color={colors.secondary} />
            <Text style={styles.actionText}>{comment.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentAction}>
            <Ionicons name="chatbubble-outline" size={14} color={colors.secondary} />
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      
      {hasReplies && showReplies && (
        <View style={styles.replies}>
          {comment.replies.map((reply, index) => (
            <View key={index} style={styles.replyContainer}>
              <Text style={styles.replyAuthor}>{reply.author}</Text>
              <Text style={styles.replyText}>{reply.reply}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const PostDetail = ({ route, navigation }) => {
  const { post } = route.params;
  const [scrollY] = useState(new Animated.Value(0));

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Floating Header */}
      <Animated.View style={[styles.floatingHeader, { opacity: headerOpacity }]}>
        <BlurView intensity={100} style={StyleSheet.absoluteFill} />
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={28} color={colors.text.primary} />
          </TouchableOpacity>
          <Text numberOfLines={1} style={styles.headerTitle}>{post.title}</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.author}>{post.postedBy}</Text>
            <Text style={styles.title}>{post.title}</Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.body}>{post.body}</Text>
          
          {/* Engagement Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={20} color={colors.primary} />
              <Text style={styles.statText}>{post.likes}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="chatbubble" size={20} color={colors.primary} />
              <Text style={styles.statText}>{post.comments.length}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="share-social" size={20} color={colors.primary} />
              <Text style={styles.statText}>{post.shares}</Text>
            </View>
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={styles.sectionTitle}>
              Comments ({post.comments.length})
            </Text>
            {post.comments.map((comment, index) => (
              <Comment key={index} comment={comment} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.commentInput}>
          <Ionicons name="chatbubble-outline" size={20} color={colors.secondary} />
          <Text style={styles.commentInputText}>Add a comment...</Text>
        </TouchableOpacity>
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons 
              name="heart-outline" 
              size={24} 
              color={colors.secondary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons 
              name="share-social" 
              size={24} 
              color={colors.secondary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  scrollView: {
    flex: 1,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    // backgroundColor: colors.primary,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    padding: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  heroSection: {
    padding: 16,
    paddingTop: 16,
    backgroundColor: "black",
  },
  heroContent: {
    marginBottom: 20,
  },
  author: {
    fontSize: 14,
    marginBottom: 8,
    letterSpacing: 0.5,
    color:"white"
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    lineHeight: 34,
  },
  contentSection: {
    backgroundColor: "black",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  body: {
    fontSize: 16,
    color: 'white',
    lineHeight: 26,
    marginBottom: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingVertical: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: 'white',
    fontSize: 14,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  commentsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
  },
  commentContainer: {
    marginBottom: 15,
  },
  commentContent: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAuthor: {
    color: colors.primary,
    fontWeight: '600',
  },
  commentText: {
    color: 'white',
    lineHeight: 22,
  },
  commentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  commentInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
  },
  commentInputText: {
    color: 'white',
    marginLeft: 10,
    opacity: 0.7,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 15,
  },
  replies: {
    marginTop: 12,
    marginLeft: 20,
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.2)',
  },
  replyContainer: {
    marginTop: 8,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
  },
  replyAuthor: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  replyText: {
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
    opacity: 0.8,
  },
  replyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyCount: {
    fontSize: 12,
    color: 'white',
    marginLeft: 4,
    opacity: 0.7,
  },
});

export default PostDetail;
