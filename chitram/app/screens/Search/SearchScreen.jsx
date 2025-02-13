import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
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

// Default image for missing posters
const DEFAULT_POSTER = require('../../../assets/images/default_poster.png');

const fetchMovies = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      params: {
        ...params,
      },
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 10000, // 10 seconds timeout
    });

    return response.data.results || [];
  } catch (error) {
    console.error("Fetch Movies Error Details:", {
      message: error.message,
      code: error.code,
      config: error.config,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : null,
    });

    // Detailed error handling
    if (error.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      throw new Error(
        `API Error: ${error.response.status} - ${JSON.stringify(
          error.response.data
        )}`
      );
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("No response received from server");
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Request setup error: ${error.message}`);
    }
  }
};

// Simple poster-only component for upcoming movies
const UpcomingMovieItem = React.memo(({ movie, onPress }) => {
  const posterSource = movie.poster_path
    ? { uri: `${POSTER_BASE_URL}${movie.poster_path}` }
    : DEFAULT_POSTER;

  return (
    <TouchableOpacity onPress={() => onPress(movie)} style={styles.upcomingItem}>
      <Image 
        source={posterSource}
        style={styles.upcomingPoster}
        defaultSource={DEFAULT_POSTER}
        onError={(e) => {
          console.log('Image load error:', e.nativeEvent.error);
        }}
      />
    </TouchableOpacity>
  );
});

// Component for all movies with rating
const MovieItem = React.memo(({ movie, onPress }) => {
  const posterSource = movie.poster_path
    ? { uri: `${POSTER_BASE_URL}${movie.poster_path}` }
    : DEFAULT_POSTER;

  return (
    <TouchableOpacity onPress={() => onPress(movie)} style={styles.movieItem}>
      <Image 
        source={posterSource}
        style={styles.moviePoster}
        defaultSource={DEFAULT_POSTER}
        onError={(e) => {
          console.log('Image load error:', e.nativeEvent.error);
        }}
      />
    </TouchableOpacity>
  );
});

const UpcomingMovies = React.memo(({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadMovies = async () => {
      try {
        const upcomingMovies = await fetchMovies("/movie/upcoming", {
          language: "en-US",
          region: "IN",
        });
        if (mounted) {
          setMovies(upcomingMovies);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading upcoming movies:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadMovies();

    return () => {
      mounted = false;
    };
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
});

const AllMovies = React.memo(({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadMovies = async () => {
      try {
        const popularMovies = await fetchMovies("/movie/popular", {
          language: "en-US",
        });
        if (mounted) {
          setMovies(popularMovies);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading popular movies:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };
    loadMovies();
    return () => {
      mounted = false;
    };
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
});

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

  const renderScene = useMemo(
    () =>
      SceneMap({
        upcoming: () => <UpcomingMovies navigation={navigation} />,
        allMovies: () => <AllMovies navigation={navigation} />,
      }),
    [navigation]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() && searchQuery.length >= 2) {
        handleSearch();
      }
    }, 500); // Wait 500ms after last keystroke before searching

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchActive(false);
      setSearchResults([]);
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
        Platform.OS === "ios"
          ? error.message
          : "Unable to perform search. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (text) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setSearchActive(false);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const checkNetworkConnection = async () => {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        setNetworkError(
          "No internet connection. Please check your network settings."
        );
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
            onChangeText={handleTextChange}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("");
                setSearchActive(false);
                setSearchResults([]);
              }}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {searchActive ? (
        <View style={styles.resultsContainer}>
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
        </View>
      ) : (
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
  upcomingMovieTitle: {
    fontSize: 12,
    color: colors.text.primary,
    marginTop: 4,
    textAlign: "center",
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
  resultsContainer: {
    flex: 1,
  },
});
