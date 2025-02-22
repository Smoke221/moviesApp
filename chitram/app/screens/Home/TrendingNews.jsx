import colors from "@/app/theme/colors";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

const { width } = Dimensions.get("window");
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const TrendingNews = () => {
  const [trendingNews, setTrendingNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchTrendingNews();
  }, []);

  const fetchTrendingNews = async () => {
    try {
      const response = await axios.get(
        "http://10.0.18.177:8090/latest-articles"
      );
      if (response.data.articles && response.data.articles.length > 0) {
        const newsWithImage = response.data.articles.find(
          (article) => article.image_url !== "No Image"
        );
        setTrendingNews(newsWithImage);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching trending news:", error);
      setLoading(false);
    }
  };

  const handleNewsPress = () => {
    if (trendingNews?.url) {
      navigation.navigate("NewsScreen");
    }
  };

  const renderSkeleton = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <ShimmerPlaceholder
          style={styles.skeletonTitle}
          shimmerColors={["#2A2A2A", "#1A1A1A", "#2A2A2A"]}
        />
      </View>
      <ShimmerPlaceholder
        style={styles.image}
        shimmerColors={["#2A2A2A", "#1A1A1A", "#2A2A2A"]}
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.gradient}
      >
        <ShimmerPlaceholder
          style={styles.skeletonNewsTitle}
          shimmerColors={["#2A2A2A", "#1A1A1A", "#2A2A2A"]}
        />
      </LinearGradient>
    </View>
  );

  if (loading) {
    return renderSkeleton();
  }

  if (!trendingNews) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📰 Trending</Text>
        </View>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.noDataText}>No trending news available</Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={handleNewsPress}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📰 Trending</Text>
        </View>
        <Image
          source={{
            uri:
              trendingNews.image_url ||
              "https://via.placeholder.com/400x200?text=No+Image",
          }}
          style={styles.image}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.gradient}
        >
          <Text style={styles.newsTitle}>{trendingNews.title}</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.secondary,
  },
  image: {
    width: "100%",
    height: 200,
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  newsTitle: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: "600",
  },
  skeletonTitle: {
    width: 100,
    height: 20,
    borderRadius: 4,
    marginLeft: 16,
  },
  skeletonNewsTitle: {
    width: "90%",
    height: 16,
  },
  skeletonText: {
    width: "90%",
    height: 20,
    marginVertical: 5,
  },
  noDataText: {
    color: colors.secondary,
    fontSize: 16,
    textAlign: "center",
  },
});

export default TrendingNews;
