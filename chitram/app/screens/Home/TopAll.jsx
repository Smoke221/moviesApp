import { TMDB_API_KEY } from "@/app/services/tmdbApi";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const TopImdbMovies = () => {
  const [movies, setMovies] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchTopMovies();
  }, []);

  const fetchTopMovies = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      };

      const response = await axios.get(
        "https://api.themoviedb.org/3/trending/all/day?region=IN",
        {
          ...config,
          params: {
            page: 1,
          },
        }
      );
      setMovies(response.data.results.slice(0, 10));
    } catch (error) {
      console.error("Error fetching top movies:", error);
    }
  };

  const handleMoviePress = (item) => {
    if (item.media_type === "tv") {
      navigation.navigate("TvSeriesDetails", {
        movie: {
          id: item.id,
          title: item.name,
          poster_path: item.poster_path,
          overview: item.overview,
          vote_average: item.vote_average,
          media_type: "tv",
        },
      });
    } else {
      navigation.navigate("MovieDetails", { movie: item });
    }
  };

  const handleViewAll = () => {
    navigation.navigate("TopMovies");
  };

  const renderMovie = ({ item, index }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => handleMoviePress(item)}
    >
      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>{index + 1}</Text>
      </View>
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w342${item.poster_path}`,
        }}
        style={styles.poster}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏆 Trending Now</Text>
        {/* <TouchableOpacity onPress={handleViewAll}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity> */}
      </View>
      <FlatList
        data={movies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  viewAll: {
    color: "#007AFF",
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 8,
  },
  movieCard: {
    width: width * 0.33,
    marginHorizontal: 8,
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    overflow: "hidden",
  },
  rankBadge: {
    position: "absolute",
    top: 3,
    left: 3,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  rankText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  poster: {
    width: "100%",
    height: width * 0.5,
  },
  movieInfo: {
    padding: 8,
  },
  movieTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  rating: {
    color: "#FFC107",
    fontSize: 12,
  },
});

export default TopImdbMovies;
