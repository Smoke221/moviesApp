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
import colors from '../../theme/colors';

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
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.text.input} style={{ paddingHorizontal: 5 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={fetchMovies}
            autoCorrect={false}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
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
              indicatorStyle={{ backgroundColor: colors.primary }}
              style={styles.tabBar}
              labelStyle={styles.tabLabel}
              activeColor={colors.primary}
              inactiveColor={colors.text.input}
            />
          )}
        />
      ) : (
        <>
          {/* Loading Indicator */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}

          {/* Movies List */}
          <FlatList
            data={movies}
            keyExtractor={(item) => item.imdbID}
            renderItem={({ item }) => (
              <View style={styles.movieItem}>
                <Image source={{ uri: item.Poster }} style={{ width: 80, height: 120, borderRadius: 6, marginRight: 15 }} />
                <View style={styles.movieContent}>
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
    backgroundColor: colors.background.primary,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderColor: colors.border.light,
    shadowColor: colors.system.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.light,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text.primary,
  },
  clearButton: {
    padding: 8,
  },
  tabBar: {
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    elevation: 0,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  movieItem: {
    backgroundColor: colors.background.secondary,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: colors.system.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  movieContent: {
    padding: 16,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
  },
  movieYear: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  movieGenre: {
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: "500",
    marginBottom: 8,
  },
  movieRating: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.primary,
  },
});
