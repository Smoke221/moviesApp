import { TMDB_API_KEY } from "@/app/services/tmdbApi";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../../theme/colors";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width / 3 - 8;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

const TrendingMovies = () => {
  const navigation = useNavigation();
  const [topRatedTVSeries, setTopRatedTVSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTopRatedTVSeries = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      };

      const response = await axios.get(
        "https://api.themoviedb.org/3/tv/top_rated",
        {
          ...config,
          params: {
            page: 1,
            region: "IN",
            with_original_language: "hi|ta|te|ml|bn|kn|gu|mr|pa",
          },
        }
      );

      setTopRatedTVSeries(response.data.results.slice(0, 6));
      setError(null);
    } catch (error) {
      setError("Failed to fetch TV series");
      console.error("Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopRatedTVSeries();
  }, []);

  const handleItemPress = (item) => {
    navigation.navigate("TvSeriesDetails", {
      movie: {
        id: item.id,
        title: item.name,
        overview: item.overview,
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        first_air_date: item.first_air_date,
        vote_average: item.vote_average,
        vote_count: item.vote_count,
        original_language: item.original_language,
        media_type: "tv",
        origin_country: item.origin_country,
        original_name: item.original_name,
        popularity: item.popularity,
        genre_ids: item.genre_ids,
      },
    });
  };

  const renderTVSeriesCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{
          uri: item.poster_path
            ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
            : "https://via.placeholder.com/300x450?text=No+Poster",
        }}
        style={styles.poster}
        resizeMode="cover"
      />
      {item.original_language !== "hi" && (
        <View style={styles.languageBadge}>
          <Text style={styles.languageText}>
            {item.original_language.toUpperCase()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchTopRatedTVSeries}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Best Rated Shows</Text>
        {/* <TouchableOpacity onPress={() => navigation.navigate('AllSeries')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity> */}
      </View>
      <FlatList
        data={topRatedTVSeries}
        renderItem={renderTVSeriesCard}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
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
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  viewAll: {
    color: colors.primary,
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 10,
  },
  card: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    marginHorizontal: 4,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.background.medium,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  languageBadge: {
    position: "absolute",
    top: 4,
    left: 4,
    backgroundColor: "rgba(0,0,0,0.75)",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  languageText: {
    color: colors.secondary,
    fontSize: 8,
    fontWeight: "bold",
  },
  loadingContainer: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: colors.text.light,
    marginBottom: 8,
  },
  retryText: {
    color: colors.primary,
    fontWeight: "bold",
  },
});

export default TrendingMovies;
