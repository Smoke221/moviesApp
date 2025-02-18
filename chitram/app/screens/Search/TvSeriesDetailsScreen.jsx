import { TMDB_API_KEY } from "@/app/services/tmdbApi";
import colors from "@/app/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import VideoPlayerModal from "@/app/components/VideoPlayerModal";

const { width, height } = Dimensions.get("window");
const BACKDROP_HEIGHT = width * 0.5625; // 16:9 aspect ratio

const TvSeriesDetailsScreen = ({ route, navigation }) => {
  const { movie } = route.params;
  const [series, setSeries] = useState(null);
  const [similarSeries, setSimilarSeries] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchSeriesDetails();
    fetchSimilarSeries();
  }, [movie.id]);

  const fetchSeriesDetails = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      };
      const response = await axios.get(
        `https://api.themoviedb.org/3/tv/${movie.id}`,
        {
          ...config,
          params: {
            append_to_response: "videos,images",
          },
        }
      );
      setSeries(response.data);
      setSeasons(response.data.seasons);
    } catch (error) {
      console.error("Error fetching series details:", error);
    }
  };

  const fetchSimilarSeries = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      };
      const response = await axios.get(
        `https://api.themoviedb.org/3/tv/${movie.id}/similar`,
        config
      );
      setSimilarSeries(response.data.results.slice(0, 10));
    } catch (error) {
      console.error("Error fetching similar series:", error);
    }
  };

  const renderSimilarItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.similarItem}
      onPress={() => navigation.push("TvSeriesDetails", { movie: item })}
    >
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w342${item.poster_path}`,
        }}
        style={styles.similarImage}
      />
      <Text style={styles.similarTitle} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderSeasonItem = (item) => (
    <View key={item.id} style={styles.seasonItem}>
      <Image
        source={{
          uri: item.poster_path
            ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
            : "https://via.placeholder.com/342x513",
        }}
        style={styles.seasonImage}
      />
      <View style={styles.seasonInfo}>
        <Text style={styles.seasonTitle}>{item.name}</Text>
        <Text style={styles.seasonEpisodes}>{item.episode_count} Episodes</Text>
        <Text style={styles.seasonDate}>
          Air Date: {item.air_date || "TBA"}
        </Text>
      </View>
    </View>
  );

  const handleVideoPress = (video) => {
    setSelectedVideo(video);
    setIsVideoModalVisible(true);
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalVisible(false);
    setSelectedVideo(null);
  };

  if (!series) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const backButtonOpacity = scrollY.interpolate({
    inputRange: [0, BACKDROP_HEIGHT / 2, BACKDROP_HEIGHT],
    outputRange: [1, 0.7, 0.3],
    extrapolate: "clamp",
  });

  const backButtonScale = scrollY.interpolate({
    inputRange: [0, BACKDROP_HEIGHT / 2, BACKDROP_HEIGHT],
    outputRange: [1, 0.9, 0.8],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.backdropContainer}>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w780${series.backdrop_path}`,
            }}
            style={styles.backdrop}
          />
          <LinearGradient
            colors={["transparent", "#000"]}
            style={styles.gradient}
          />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{series.name}</Text>
            <Text style={styles.tagline}>{series.tagline}</Text>
          </View>

          <Text style={styles.overview}>{series.overview}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>First Aired</Text>
              <Text style={styles.statValue}>{series.first_air_date}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Status</Text>
              <Text style={styles.statValue}>{series.status}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Rating</Text>
              <Text style={styles.statValue}>
                {series.vote_average.toFixed(1)}/10
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Seasons</Text>
          <View style={styles.seasonsList}>
            {seasons.map(renderSeasonItem)}
          </View>

          {/* Videos Section */}
          {series.videos?.results && series.videos.results.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trailers & Videos</Text>

              {/* Primary Trailer */}
              {(() => {
                const trailers = series.videos.results.filter(
                  (video) => video.type === "Trailer"
                );
                const primaryTrailer = trailers[0];

                return primaryTrailer ? (
                  <TouchableOpacity
                    style={styles.primaryVideoItem}
                    onPress={() => handleVideoPress(primaryTrailer)}
                  >
                    <Image
                      source={{
                        uri: `https://img.youtube.com/vi/${primaryTrailer.key}/maxresdefault.jpg`,
                      }}
                      style={styles.primaryVideoThumbnail}
                      resizeMode="cover"
                    />
                    <View style={styles.primaryVideoOverlay}>
                      <Ionicons
                        name="play-circle"
                        size={80}
                        color="white"
                        style={styles.primaryPlayIcon}
                      />
                      <Text style={styles.primaryVideoTitle} numberOfLines={2}>
                        {primaryTrailer.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : null;
              })()}

              {/* Additional Videos */}
              {(() => {
                const additionalVideos = series.videos.results.filter(
                  (video) => video.type !== "Trailer"
                );

                return additionalVideos.length > 0 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.videoList}
                  >
                    {additionalVideos.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.videoItem}
                        onPress={() => handleVideoPress(item)}
                      >
                        <Image
                          source={{
                            uri: `https://img.youtube.com/vi/${item.key}/0.jpg`,
                          }}
                          style={styles.videoThumbnail}
                        />
                        <View style={styles.videoOverlay}>
                          <Ionicons
                            name="play-circle"
                            size={50}
                            color="white"
                            style={styles.playIcon}
                          />
                        </View>
                        <Text style={styles.videoTitle} numberOfLines={2}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : null;
              })()}
            </View>
          )}

          <Text style={styles.sectionTitle}>Similar TV Series</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.similarList}
          >
            {similarSeries.map(renderSimilarItem)}
          </ScrollView>
        </View>
      </Animated.ScrollView>

      {/* Floating Back Button */}
      <Animated.View
        style={[
          styles.backButtonContainer,
          {
            opacity: backButtonOpacity,
            transform: [{ scale: backButtonScale }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={16} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {selectedVideo && (
        <VideoPlayerModal
          isVisible={isVideoModalVisible}
          onClose={handleCloseVideoModal}
          videoKey={selectedVideo.key}
          title={selectedVideo.name}
        />
      )}
    </View>
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
  backdropContainer: {
    height: height * 0.4,
    position: "relative",
  },
  backdrop: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
  },
  headerContent: {
    position: "absolute",
    top: -60,
    left: 20,
    right: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    color: "#ddd",
    fontStyle: "italic",
  },
  infoContainer: {
    padding: 20,
  },
  overview: {
    fontSize: 16,
    color: "#fff",
    lineHeight: 24,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  statValue: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    marginTop: 20,
  },
  seasonsList: {
    marginBottom: 20,
  },
  seasonItem: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#111",
    borderRadius: 10,
    overflow: "hidden",
  },
  seasonImage: {
    width: 100,
    height: 150,
  },
  seasonInfo: {
    flex: 1,
    padding: 15,
  },
  seasonTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  seasonEpisodes: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  seasonDate: {
    fontSize: 14,
    color: "#888",
  },
  similarList: {
    marginBottom: 20,
  },
  similarItem: {
    marginRight: 15,
    width: width * 0.3,
  },
  similarImage: {
    width: "100%",
    height: height * 0.2,
    borderRadius: 10,
    marginBottom: 5,
  },
  similarTitle: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
  },
  backButtonContainer: {
    position: "absolute",
    top: 20,
    left: 8,
    zIndex: 10,
  },
  backButton: {
    width: 25,
    height: 25,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  section: {
    marginBottom: 20,
  },
  primaryVideoItem: {
    height: height * 0.3,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
  },
  primaryVideoThumbnail: {
    width: "100%",
    height: "100%",
  },
  primaryVideoOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  primaryPlayIcon: {
    marginBottom: 10,
  },
  primaryVideoTitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  videoList: {
    padding: 10,
  },
  videoItem: {
    marginRight: 10,
    width: width * 0.4,
    height: height * 0.2,
    borderRadius: 10,
    overflow: "hidden",
  },
  videoThumbnail: {
    width: "100%",
    height: "100%",
  },
  videoOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    marginBottom: 5,
  },
  videoTitle: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
});

export default TvSeriesDetailsScreen;
