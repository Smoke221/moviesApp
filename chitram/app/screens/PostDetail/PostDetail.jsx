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
import colors from '../../theme/colors';

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
                color={colors.text.light}
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
            <Ionicons name="heart-outline" size={14} color={colors.text.light} />
            <Text style={styles.actionText}>{comment.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentAction}>
            <Ionicons name="chatbubble-outline" size={14} color={colors.text.light} />
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
          <Ionicons name="chatbubble-outline" size={20} color={colors.text.light} />
          <Text style={styles.commentInputText}>Add a comment...</Text>
        </TouchableOpacity>
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons 
              name="heart-outline" 
              size={24} 
              color={colors.text.light}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons 
              name="bookmark-outline" 
              size={24} 
              color={colors.text.light}
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
    backgroundColor: colors.background.primary,
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
    height: 60,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  heroSection: {
    padding: 16,
    paddingTop: 16,
    backgroundColor: colors.background.primary,
  },
  heroContent: {
    marginBottom: 20,
  },
  author: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    lineHeight: 34,
  },
  contentSection: {
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  body: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border.light,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 8,
    fontSize: 15,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border.light,
    marginHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 20,
  },
  commentContainer: {
    marginBottom: 20,
  },
  commentContent: {
    backgroundColor: colors.background.light,
    borderRadius: 12,
    padding: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  replyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyCount: {
    fontSize: 12,
    color: colors.text.light,
    marginLeft: 4,
  },
  commentText: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 16,
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: colors.text.light,
  },
  replies: {
    marginTop: 12,
    marginLeft: 20,
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: colors.border.light,
  },
  replyContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.background.light,
    borderRadius: 12,
  },
  replyAuthor: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  replyText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    backgroundColor: colors.background.primary,
  },
  commentInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.light,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    gap: 8,
  },
  commentInputText: {
    fontSize: 14,
    color: colors.text.light,
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
});

export default PostDetail;
