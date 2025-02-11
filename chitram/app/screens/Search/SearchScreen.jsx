import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const UpcomingMovies = () => (
  <View style={styles.scene}>
    <Text style={styles.text}>Upcoming Movies</Text>
  </View>
);

const AllMovies = () => (
  <View style={styles.scene}>
    <Text style={styles.text}>All Movies</Text>
  </View>
);

export default function SearchScreen() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "upcoming", title: "Upcoming" },
    { key: "allMovies", title: "All Movies" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  const fetchMovies = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSearchActive(true);
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=${searchQuery}&apikey=e3328e04`
      );
      const data = await response.json();
      if (data.Search) {
        // Fetch full details for each movie
        const detailedMovies = await Promise.all(
          data.Search.map(async (movie) => {
            const detailsResponse = await fetch(
              `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=e3328e04`
            );
            const details = await detailsResponse.json();
            return { ...movie, ...details }; // Merge basic & detailed data
          })
        );
        setMovies(detailedMovies);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchActive(false);
    setMovies([]);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar with Icons */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#555" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search movies..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={fetchMovies}
          autoCorrect={false}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#e63946" />
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs (Hidden when search is active) */}
      {!searchActive ? (
        <TabView
          navigationState={{ index, routes }}
          renderScene={SceneMap({
            upcoming: UpcomingMovies,
            allMovies: AllMovies,
          })}
          onIndexChange={setIndex}
          initialLayout={{ width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: "#e63946" }}
              style={styles.tabBar}
              labelStyle={styles.label}
              activeColor="#e63946"
              inactiveColor="#555"
            />
          )}
        />
      ) : (
        <>
          {/* Loading Indicator */}
          {loading && <ActivityIndicator size="large" color="#e63946" />}

          {/* Movies List */}
          <FlatList
            data={movies}
            keyExtractor={(item) => item.imdbID}
            renderItem={({ item }) => (
              <View style={styles.movieItem}>
                <Image source={{ uri: item.Poster }} style={styles.poster} />
                <View style={styles.movieInfo}>
                  <Text style={styles.movieTitle}>{item.Title}</Text>
                  <Text style={styles.movieYear}>{item.Year}</Text>
                  <Text style={styles.movieGenre}>🎭 {item.Genre}</Text>
                  <Text style={styles.movieRating}>⭐ {item.imdbRating} / 10</Text>
                </View>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#f8f8f8",
    marginHorizontal: 15,
    marginBottom: 15,
    paddingLeft: 12,
    elevation: 3,
  },
  searchBar: {
    flex: 1,
    height: 45,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  searchIcon: {
    paddingHorizontal: 5,
  },
  clearButton: {
    padding: 10,
  },
  tabBar: {
    backgroundColor: "#fff",
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  scene: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  movieItem: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 6,
    marginRight: 15,
  },
  movieInfo: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  movieYear: {
    fontSize: 14,
    color: "gray",
    marginBottom: 2,
  },
  movieGenre: {
    fontSize: 14,
    color: "#007bff",
    fontWeight: "500",
    marginBottom: 2,
  },
  movieRating: {
    fontSize: 14,
    color: "#e63946",
    fontWeight: "bold",
  },
});

