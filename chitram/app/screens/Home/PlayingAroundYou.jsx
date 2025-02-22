import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import colors from "@/app/theme/colors";

const { width } = Dimensions.get("window");
const API_URL = "https://silky-kirstin-ismoketechlabs-adffa6e7.koyeb.app/city-movies";
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const PlayingAroundYou = ({ onResultsFetched }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCityMovies = async () => {
      try {
        const storedLocation = await AsyncStorage.getItem("userLocation");
        const city = storedLocation
          ? JSON.parse(storedLocation).city.toLowerCase()
          : "hyderabad";

        const response = await axios.post(API_URL, { city });

        if (response.data.movies.length > 0) {
          setMovies(response.data.movies);
          onResultsFetched(false); // Mark data as successfully fetched
        } else {
          onResultsFetched(true); // API returned empty data
        }
      } catch (error) {
        console.error("Error fetching city movies:", error);
        onResultsFetched(true); // API request failed
      } finally {
        setLoading(false);
      }
    };

    fetchCityMovies();
  }, []);

  const renderSkeleton = () => (
    <View style={styles.container}>
      <ShimmerPlaceholder
        style={styles.skeletonHeaderTitle}
        shimmerColors={["#2A2A2A", "#1A1A1A", "#2A2A2A"]}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.movieScrollView}
      >
        {[...Array(5)].map((_, index) => (
          <View key={index} style={styles.movieItem}>
            <ShimmerPlaceholder
              style={styles.skeletonMoviePoster}
              shimmerColors={["#2A2A2A", "#1A1A1A", "#2A2A2A"]}
            />
            <View style={styles.overlayContainer}>
              <ShimmerPlaceholder
                style={styles.skeletonLanguageText}
                shimmerColors={["#2A2A2A", "#1A1A1A", "#2A2A2A"]}
              />
              <ShimmerPlaceholder
                style={styles.skeletonRatingText}
                shimmerColors={["#2A2A2A", "#1A1A1A", "#2A2A2A"]}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  if (loading) {
    return renderSkeleton();
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>What's Playing Near You</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.movieScrollView}
      >
        {movies.map((movie) => (
          <View key={movie.name} style={styles.movieItem}>
            <Image
              source={{ uri: movie.poster }}
              style={styles.moviePoster}
              resizeMode="cover"
            />
            <View style={styles.overlayContainer}>
              <View style={styles.languageContainer}>
                {movie.languages.slice(0, 2).map((language, index) => (
                  <Text key={language} style={styles.languageText}>
                    {language}
                  </Text>
                ))}
                {movie.languages.length > 2 && (
                  <Text style={styles.languageText}>
                    +{movie.languages.length - 2}
                  </Text>
                )}
              </View>
              {movie.rating && (
                <Text style={styles.ratingText}>{movie.rating}</Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  headerTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 10,
  },
  movieScrollView: {
    paddingHorizontal: 10,
  },
  movieItem: {
    marginHorizontal: 5,
    width: width * 0.4,
  },
  moviePoster: {
    width: "100%",
    height: width * 0.6,
    borderRadius: 10,
  },
  overlayContainer: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  languageContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 4,
    maxWidth: "75%",
  },
  languageText: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: colors.secondary,
    fontSize: 10,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    overflow: "hidden",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  ratingText: {
    backgroundColor: "#ff8e5d",
    fontSize: 11,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    overflow: "hidden",
    fontWeight: "700",
    color: colors.secondary,
  },
  skeletonHeaderTitle: {
    width: 200,
    height: 20,
    borderRadius: 4,
    marginLeft: 15,
    marginBottom: 10,
  },
  skeletonMoviePoster: {
    width: "100%",
    height: width * 0.6,
    borderRadius: 10,
  },
  skeletonLanguageText: {
    width: 50,
    height: 20,
    borderRadius: 5,
  },
  skeletonRatingText: {
    width: 30,
    height: 20,
    borderRadius: 5,
  },
});

export default PlayingAroundYou;
