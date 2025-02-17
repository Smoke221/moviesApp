import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import colors from '../../theme/colors';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const fetchNews = async () => {
  try {
    const response = await axios.get('https://api.slenterprisess.com/latest-articles', {
      timeout: 10000, // 10 seconds timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.data || !response.data.articles) {
      console.error('Invalid response structure:', response);
      return [];
    }
    
    console.log(`Fetched ${response.data.articles.length} news articles`);
    return response.data.articles;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Server Error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error: No response received', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request Setup Error:', error.message);
    }
    
    return [];
  }
}

export default function NewsScreen() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef(null);

  const loadNews = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      }
      const articles = await fetchNews();
      setNewsArticles(articles);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      if (showRefresh) {
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const handleReadMore = (url) => {
    setSelectedUrl(url);
  };

  const getItemLayout = (data, index) => ({
    length: height,
    offset: height * index,
    index,
  });

  const handleScrollToIndexFailed = (info) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({
        index: currentIndex,
        animated: false
      });
    });
  };

  const handleBack = () => {
    setSelectedUrl(null);
    // Scroll to the last viewed position after a short delay
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: currentIndex,
        animated: false
      });
    }, 100);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const onRefresh = useCallback(() => {
    loadNews(true);
  }, [loadNews]);

  if (selectedUrl) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <WebView 
          source={{ uri: selectedUrl }} 
          style={styles.webview}
        />
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Back to News</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        
        <View style={styles.floatingBadgeContainer}>
          <View style={styles.badgeInner}>
            <Text style={styles.chitramText}>CHITRAM</Text>
          </View>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.contentBox}>
            <Text style={styles.content} numberOfLines={10}>
              {item.content}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        ref={flatListRef}
        data={newsArticles}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.$oid}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        decelerationRate="fast"
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        onViewableItemsChanged={onViewableItemsChanged}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            title="Pull to refresh"
            titleColor={colors.primary}
          />
        }
      />
      <View style={styles.readMoreContainer}>
        <TouchableOpacity 
          style={styles.readMoreButton}
          onPress={() => handleReadMore(newsArticles[currentIndex]?.url)}
        >
          <Text style={styles.readMoreText}>Read More</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  webview: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 35,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  readMoreContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  readMoreButton: {
    backgroundColor: 'rgba(51, 51, 51, 0.9)',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  readMoreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  itemContainer: {
    width: width,
    height: height,
    backgroundColor: '#000000',
  },
  imageContainer: {
    height: '35%',
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
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#FFFFFF',
  },
  contentWrapper: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  contentBox: {
    // height: 200,
    // marginVertical: 10,
  },
  content: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#333',
  },
  source: {
    color: '#888',
    fontSize: 14,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  chitram: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#FFFFFF',
    letterSpacing: 2,
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontFamily: "cursive",
    borderLeftWidth: 5,
    borderLeftColor: '#FFFFFF',
    backgroundColor: '#000000',
    borderRadius: 4,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  floatingBadgeContainer: {
    position: 'absolute',
    bottom: -15,
    right: 16,
    backgroundColor: '#000000',
    borderRadius: 8,
    padding: 2,
    shadowColor: '#FFFFFF',
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
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 10,
    color: '#FFFFFF',
    marginTop: 2,
    letterSpacing: 1,
  },
});
