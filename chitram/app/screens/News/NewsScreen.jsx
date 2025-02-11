import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import { newsData } from '../../data/news';
import colors from '../../theme/colors';

const { width, height } = Dimensions.get('window');

export default function NewsScreen() {
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {/* Image Section (Top Half) */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.url }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        
        {/* Floating Chitram Badge */}
        <View style={styles.floatingBadgeContainer}>
          <View style={styles.badgeInner}>
            <Text style={styles.chitramText}>CHITRAM</Text>
            {/* <Text style={styles.tagline}>Your Daily Movie Digest</Text> */}
          </View>
        </View>
      </View>

      {/* Content Section (Bottom Half) */}
      <View style={styles.contentContainer}>
        <View style={styles.contentWrapper}>
          {/* News Content */}
          <Text style={styles.content}>{item.content}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={newsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        decelerationRate="fast"
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  itemContainer: {
    width: width,
    height: height,
    backgroundColor: colors.background.secondary,
  },
  imageContainer: {
    height: '50%',
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  contentContainer: {
    height: '50%',
    backgroundColor: colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  contentWrapper: {
    padding: 20,
    flex: 1,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  chitram: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    letterSpacing: 2,
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontFamily: "cursive",
    borderLeftWidth: 5,
    borderLeftColor: colors.accent.primary,
    backgroundColor: colors.background.light,
    borderRadius: 4,
    shadowColor: colors.system.shadow,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 24,
    textAlign: 'justify',
  },
  floatingBadgeContainer: {
    position: 'absolute',
    bottom: -15,
    right: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 2,
    shadowColor: colors.system.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  badgeInner: {
    borderWidth: 1,
    borderColor: colors.accent.primary,
    borderRadius: 6,
    padding: 4,
    alignItems: 'center',
  },
  chitramText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.primary,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 10,
    color: colors.text.secondary,
    marginTop: 2,
    letterSpacing: 1,
  },
});
