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
} from "react-native";

const { width } = Dimensions.get("window");
const API_URL = "http://10.0.18.177:8090/city-movies";

const PlayingAroundYou = ({ onResultsFetched }) => {
  const [movies, setMovies] = useState([]);

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
      }
    };

    fetchCityMovies();
  }, []);

  if (movies.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>In theaters around you</Text>
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
              <Text style={styles.languageText}>
                {movie.languages.join(", ")}
              </Text>
              <Text style={styles.ratingText}>{movie.rating}</Text>
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
    color: "white",
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
    top: 5,
    left: 5,
    right: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  languageText: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    fontSize: 12,
    padding: 5,
    borderRadius: 5,
  },
  ratingText: {
    backgroundColor: "rgba(255, 165, 0, 0.8)",
    color: "white",
    fontSize: 12,
    padding: 5,
    borderRadius: 5,
  },
});

export default PlayingAroundYou;
