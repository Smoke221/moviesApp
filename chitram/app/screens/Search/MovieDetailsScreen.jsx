import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import colors from '../../theme/colors';

export default function MovieDetailsScreen({ route }) {
  const { imdbID } = route.params;
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=e3328e`);
        const data = await response.json();
        setMovieDetails(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [imdbID]);

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />;
  }

  if (!movieDetails) {
    return <Text style={styles.errorText}>Movie details not available</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: movieDetails.Poster }} style={styles.poster} />
      <Text style={styles.title}>{movieDetails.Title} ({movieDetails.Year})</Text>
      <Text style={styles.genre}>{movieDetails.Genre}</Text>
      <Text style={styles.plot}>{movieDetails.Plot}</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detail}><Text style={styles.bold}>Director:</Text> {movieDetails.Director}</Text>
        <Text style={styles.detail}><Text style={styles.bold}>Cast:</Text> {movieDetails.Actors}</Text>
        <Text style={styles.detail}><Text style={styles.bold}>Runtime:</Text> {movieDetails.Runtime}</Text>
        <Text style={styles.detail}><Text style={styles.bold}>IMDB Rating:</Text> {movieDetails.imdbRating}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: 15,
  },
  poster: {
    width: "100%",
    height: 400,
    resizeMode: "cover",
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  genre: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: 10,
  },
  plot: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "justify",
  },
  detailsContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
  },
  detail: {
    fontSize: 16,
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  loading: {
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    color: colors.error,
    marginTop: 20,
  },
});
