import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import axios from "axios";
import { TMDB_API_KEY } from "../../services/tmdbApi";
import colors from "../../theme/colors";

const { width } = Dimensions.get("window");
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const NowPlayingMoviesSection = ({ navigation }) => {
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchNowPlayingMovies = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${TMDB_API_KEY}`,
            "Content-Type": "application/json;charset=utf-8",
          },
        };

        const response = await axios.get(
          `${TMDB_BASE_URL}/movie/now_playing?region=IN&page=${page}`,
          {
            ...config,
            params: {
              page: page,
              region: "IN",
            },
          }
        );

        // Set total pages on first fetch
        if (page === 1) {
          setTotalPages(response.data.total_pages);
        }

        const filterMovies = response.data.results.filter(
          (movie) =>
            movie.original_language == "te" ||
            movie.original_language == "hi" ||
            movie.original_language == "ta" ||
            movie.original_language == "ml" ||
            movie.original_language == "bn" ||
            movie.original_language == "kn" ||
            movie.original_language == "gu" ||
            movie.original_language == "mr" ||
            movie.original_language == "pa"
        );

        // Append new movies to existing list
        setNowPlayingMovies((prevMovies) =>
          page === 1
            ? filterMovies
            : [...prevMovies, ...filterMovies]
        );
      } catch (error) {
        console.error("Error fetching now playing movies:", error);
      }
    };

    fetchNowPlayingMovies();
  }, [page]);

  const loadMoreMovies = () => {
    // Load next page if not all pages have been fetched
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  if (nowPlayingMovies.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Now Playing in Theaters</Text>
        {/* <TouchableOpacity 
          onPress={() => navigation.navigate('AllNowPlayingMovies', { movies: nowPlayingMovies })}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity> */}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.movieScrollView}
        onScroll={({ nativeEvent }) => {
          // Check if user has scrolled to the end of the horizontal scroll
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToEnd = 
            layoutMeasurement.width + contentOffset.x >= contentSize.width - 20;
          
          if (isCloseToEnd) {
            loadMoreMovies();
          }
        }}
        scrollEventThrottle={400}
      >
        {nowPlayingMovies.map((movie, index) => (
          <View key={movie.id} style={styles.movieItem}>
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
              }}
              style={styles.moviePoster}
              resizeMode="cover"
            />
          </View>
        ))}
        {page < totalPages && (
          <TouchableOpacity 
            style={styles.loadMoreButton} 
            onPress={loadMoreMovies}
          >
            <Text style={styles.loadMoreText}>Load More</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  headerTitle: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: "bold",
  },
  viewAllText: {
    color: colors.primary,
    fontSize: 16,
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
  movieTitle: {
    color: "white",
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
  },
  loadMoreButton: {
    width: width * 0.4,
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginHorizontal: 5,
  },
  loadMoreText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default NowPlayingMoviesSection;
