import React from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import TopImdbMovies from "./TopImdbMovies";
import TrendingMovies from "./TrendingMovies";
import TrendingNews from "./TrendingNews";
import NowPlayingMoviesSection from "./NowPlayingMoviesSection";

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <TrendingNews />
        <NowPlayingMoviesSection />
        <TopImdbMovies />
        <TrendingMovies />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollView: {
    flex: 1,
  },
});

export default HomeScreen;
