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
} from "react-native";

const { width } = Dimensions.get("window");

const TrendingNews = () => {
  const [trendingNews, setTrendingNews] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchTrendingNews();
  }, []);

  const fetchTrendingNews = async () => {
    try {
      const response = await axios.get(
        "https://api.slenterprisess.com/latest-articles"
      );
      if (response.data.articles && response.data.articles.length > 0) {
        const newsWithImage = response.data.articles.find(
          (article) => article.image_url !== "No Image"
        );
        setTrendingNews(newsWithImage);
      }
    } catch (error) {
      console.error("Error fetching trending news:", error);
    }
  };

  const handleNewsPress = () => {
    if (trendingNews?.url) {
      navigation.navigate("NewsScreen");
    }
  };

  if (!trendingNews) return null;

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
    backgroundColor: "#1A1A1A",
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
    color: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    justifyContent: "flex-end",
    padding: 16,
  },
  newsTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default TrendingNews;
