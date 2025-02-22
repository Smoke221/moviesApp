import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import NowPlayingMoviesSection from "./NowPlayingMoviesSection";
import PlayingAroundYou from "./PlayingAroundYou";
import TopImdbMovies from "./TrendingAll";
import TrendingMovies from "./TopTV";
import TrendingNews from "./TrendingNews";
import colors from "@/app/theme/colors";

const HomeScreen = () => {
  const [dataFetched, setDataFetched] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <TrendingNews />
        <PlayingAroundYou onResultsFetched={setDataFetched} />
        {dataFetched && <NowPlayingMoviesSection />}
        <TopImdbMovies />
        <TrendingMovies />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
});

export default HomeScreen;
