import { Ionicons } from "@expo/vector-icons";
import axios from 'axios';
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
} from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { TMDB_API_KEY } from '../../services/tmdbApi';
import colors from '../../theme/colors';

const { width } = Dimensions.get("window");
const BASE_URL = 'https://api.themoviedb.org/3';
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const POSTER_WIDTH = width / 3 - 16; // 3 columns with spacing
const POSTER_HEIGHT = POSTER_WIDTH * 1.5; // 3:2 aspect ratio

const fetchMovies = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      params,
      headers: {
        'Authorization': `Bearer ${TMDB_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movies:", error.response ? error.response.data : error.message);
    return [];
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
      const upcomingMovies = await fetchMovies('/movie/upcoming', {
        language: 'en-US',
        region: 'IN'
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
          onPress={() => navigation.navigate('MovieDetails', { movie: item })}
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
      const popularMovies = await fetchMovies('/movie/popular', {
        language: 'en-US'
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
          onPress={() => navigation.navigate('MovieDetails', { movie: item })}
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSearchActive(true);
    
    try {
      const results = await fetchMovies('/search/movie', {
        query: searchQuery,
        language: 'en-US'
      });
      
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
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

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.text.input} style={{ paddingHorizontal: 5 }} />
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
                  onPress={() => navigation.navigate('MovieDetails', { movie: item })}
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
    position: 'relative',
  },
  moviePoster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 8,
  },
  ratingBadge: {
    position: 'absolute',
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
    fontWeight: 'bold',
  },
  movieGrid: {
    padding: 5.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
