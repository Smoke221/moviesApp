import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Platform,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { TMDB_API_KEY } from "../../services/tmdbApi";
import colors from "../../theme/colors";

const { width } = Dimensions.get("window");
const BASE_URL = "https://api.themoviedb.org/3";
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const POSTER_WIDTH = width / 3 - 16; // 3 columns with spacing
const POSTER_HEIGHT = POSTER_WIDTH * 1.5; // 3:2 aspect ratio

const fetchMovies = async (endpoint, params = {}) => {
  // Check network connectivity first
  const netInfo = await NetInfo.fetch();
  if (!netInfo.isConnected) {
    throw new Error("No internet connection");
  }

  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      params: {
        ...params,
        api_key: TMDB_API_KEY,
      },
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000, // 10 seconds timeout
    });
    
    return response.data.results || [];
  } catch (error) {
    // Log detailed error information
    console.error("Fetch Movies Error Details:", {
      message: error.message,
      code: error.code,
      config: error.config,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : null
    });

    // Detailed error handling
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("No response received from server. Check your network connection.");
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Request setup error: ${error.message}`);
    }
  }
};

// Simple poster-only component for upcoming movies
const UpcomingMovieItem = ({ movie, onPress }) => (
  <TouchableOpacity onPress={() => onPress(movie)} style={styles.upcomingItem}>
    <Image
      source={{ uri: `${POSTER_BASE_URL}${movie.poster_path}` }}
      style={styles.upcomingPoster}
    />
  </TouchableOpacity>
);

// Component for all movies with rating
const MovieItem = ({ movie, onPress }) => (
  <TouchableOpacity onPress={() => onPress(movie)} style={styles.movieItem}>
    <Image
      source={{ uri: `${POSTER_BASE_URL}${movie.poster_path}` }}
      style={styles.moviePoster}
    />
    {/* {movie.vote_average > 0 && (
      <View style={styles.ratingBadge}>
        <Text style={styles.ratingText}>{movie.vote_average.toFixed(1)}</Text>
      </View>
    )} */}
  </TouchableOpacity>
);

const UpcomingMovies = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      const upcomingMovies = await fetchMovies("/movie/upcoming", {
        language: "en-US",
        region: "IN",
      });
      setMovies(upcomingMovies);
      setLoading(false);
    };
    loadMovies();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <UpcomingMovieItem
          movie={item}
          onPress={() => navigation.navigate("MovieDetails", { movie: item })}
        />
      )}
      numColumns={3}
      contentContainerStyle={styles.upcomingList}
    />
  );
};

const AllMovies = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      const popularMovies = await fetchMovies("/movie/popular", {
        language: "en-US",
      });
      setMovies(popularMovies);
      setLoading(false);
    };
    loadMovies();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <MovieItem
          movie={item}
          onPress={() => navigation.navigate("MovieDetails", { movie: item })}
        />
      )}
      numColumns={3}
      contentContainerStyle={styles.movieGrid}
    />
  );
};

export default function SearchScreen({ navigation }) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "upcoming", title: "Upcoming" },
    { key: "allMovies", title: "All Movies" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [networkError, setNetworkError] = useState(null);

  useEffect(() => {
    const checkNetworkConnection = async () => {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        setNetworkError("No internet connection. Please check your network settings.");
      } else {
        setNetworkError(null);
      }
    };

    checkNetworkConnection();
    const unsubscribe = NetInfo.addEventListener(checkNetworkConnection);

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    // Check network before searching
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      Alert.alert("Network Error", "No internet connection. Please check your network settings.");
      return;
    }

    setLoading(true);
    setSearchActive(true);
    
    try {
      const results = await fetchMovies("/search/movie", {
        query: searchQuery,
        language: "en-US",
      });
      
      setSearchResults(results);
      
      if (results.length === 0) {
        Alert.alert("Search", "No movies found matching your query.");
      }
    } catch (error) {
      console.error("Search error:", error);
      Alert.alert(
        "Search Error", 
        Platform.OS === 'ios' 
          ? error.message 
          : "Unable to perform search. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchActive(false);
    setSearchResults([]);
  };

  const renderScene = SceneMap({
    upcoming: () => <UpcomingMovies navigation={navigation} />,
    allMovies: () => <AllMovies navigation={navigation} />,
  });

  // Render network error if exists
  if (networkError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{networkError}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => NetInfo.fetch()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color={colors.text.input}
            style={{ paddingHorizontal: 5 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
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

      {!searchActive ? (
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
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
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <MovieItem
                  movie={item}
                  onPress={() =>
                    navigation.navigate("MovieDetails", { movie: item })
                  }
                />
              )}
              numColumns={3}
              contentContainerStyle={styles.movieGrid}
            />
          )}
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
    padding: 8,
    backgroundColor: colors.background.secondary,
    borderColor: colors.border.light,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.light,
    borderRadius: 8,
    padding: 6,
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
    elevation: 0,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  upcomingItem: {
    margin: 5.5,
  },
  upcomingPoster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 8,
  },
  upcomingList: {
    padding: 8,
  },
  movieItem: {
    margin: 5.5,
    position: "relative",
  },
  moviePoster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 8,
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    color: colors.text.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  movieGrid: {
    padding: 5.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    color: colors.text.white,
  },
});
