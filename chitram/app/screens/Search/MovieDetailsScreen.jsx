import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
  FlatList,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { TMDB_API_KEY } from "../../services/tmdbApi";
import colors from "../../theme/colors";

const { width } = Dimensions.get("window");
const BACKDROP_HEIGHT = width * 0.5625; // 16:9 aspect ratio

// Default images for missing posters and backdrops
const DEFAULT_POSTER = require("../../../assets/images/default_poster.png");
const DEFAULT_BACKDROP = require("../../../assets/images/default_backdrop.jpg");

const MovieDetailsScreen = ({ route, navigation }) => {
  const { movie } = route.params;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const [detailsResponse, watchProvidersResponse, externalIdsResponse] =
          await Promise.all([
            axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
              params: {
                append_to_response:
                  "credits,videos,images,similar,keywords,reviews",
              },
              headers: {
                Authorization: `Bearer ${TMDB_API_KEY}`,
                "Content-Type": "application/json",
              },
            }),
            axios.get(
              `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers`,
              {
                headers: {
                  Authorization: `Bearer ${TMDB_API_KEY}`,
                  "Content-Type": "application/json",
                },
              }
            ),
            axios.get(
              `https://api.themoviedb.org/3/movie/${movie.id}/external_ids`,
              {
                headers: {
                  Authorization: `Bearer ${TMDB_API_KEY}`,
                  "Content-Type": "application/json",
                },
              }
            ),
          ]);

        // const [imdbRatingResponse] = await Promise.all([
        //   axios.get(
        //     `https://api.themoviedb.org/3/find/${externalIdsResponse.data.imdb_id}`,
        //     {
        //       headers: {
        //         Authorization: `Bearer ${TMDB_API_KEY}`,
        //         "Content-Type": "application/json",
        //       },
        //     }
        //   ),
        // ]);

        setDetails({
          ...detailsResponse.data,
          watchProviders: watchProvidersResponse.data.results,
          // imdbRating: imdbRatingResponse.data.imdbRating,
          imdbId: externalIdsResponse.data.imdb_id,
        });
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movie.id]);

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

  const renderCastItem = ({ item }) => (
    <View style={styles.castItem}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w185${item.profile_path}` }}
        style={styles.castImage}
        defaultSource={DEFAULT_POSTER}
        onError={(e) => {
          console.log("Cast image load error:", e.nativeEvent.error);
        }}
      />
      <Text style={styles.castName} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.castCharacter} numberOfLines={1}>
        {item.character}
      </Text>
    </View>
  );

  const renderCrewItem = ({ item }) => (
    <View style={styles.crewItem}>
      <Text style={styles.crewName}>{item.name}</Text>
      <Text style={styles.crewJob}>{item.job}</Text>
    </View>
  );

  const renderKeywordItem = ({ item }) => (
    <View style={styles.keywordTag}>
      <Text style={styles.keywordText}>{item.name}</Text>
    </View>
  );

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewAuthor}>{item.author}</Text>
        <Text style={styles.reviewDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.reviewContent} numberOfLines={3}>
        {item.content}
      </Text>
    </View>
  );

  if (!details) {
    return null;
  }

  const posterSource = details.poster_path
    ? { uri: `https://image.tmdb.org/t/p/w500${details.poster_path}` }
    : DEFAULT_POSTER;

  const backdropSource = details.backdrop_path
    ? { uri: `https://image.tmdb.org/t/p/original${details.backdrop_path}` }
    : DEFAULT_BACKDROP;

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        bounces={false}
      >
        {/* Backdrop Section */}
        <View style={styles.backdropContainer}>
          <Image
            source={backdropSource}
            style={styles.backdrop}
            defaultSource={DEFAULT_BACKDROP}
            onError={(e) => {
              console.log("Backdrop image load error:", e.nativeEvent.error);
            }}
            resizeMode="cover"
          />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Image
              source={posterSource}
              style={styles.poster}
              defaultSource={DEFAULT_POSTER}
              onError={(e) => {
                console.log("Poster image load error:", e.nativeEvent.error);
              }}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.title}>{details.title}</Text>
              <Text style={styles.tagline}>{details.tagline}</Text>

              {/* <View style={styles.ratingContainer}>
                <Ionicons name="star" size={20} color={colors.primary} />
                <Text style={styles.rating}>
                  {details.vote_average.toFixed(1)} ({details.vote_count} votes)
                </Text>
              </View> */}

              <View style={styles.detailsRow}>
                <Text style={styles.releaseDate}>
                  {new Date(details.release_date).getFullYear()}
                </Text>
                <Text style={styles.runtime}>
                  {Math.floor(details.runtime / 60)}h {details.runtime % 60}m
                </Text>
              </View>
              <Text style={styles.originalLanguage}>
                Original Language: {details.original_language?.toUpperCase()}
              </Text>
              <View style={styles.adultContainer}>
                <Text style={styles.adultLabel}></Text>
                {details.adult ? (
                  <View style={styles.adultBadge}>
                    <Ionicons name="warning" size={20} color="#FF6B6B" />
                    <Text style={styles.adultText}>18+</Text>
                  </View>
                ) : (
                  <View style={styles.adultBadge}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CD964" />
                    <Text style={styles.adultText}>All Ages</Text>
                  </View>
                )}
              </View>

              <View style={styles.genresContainer}>
                {details.genres.map((genre) => (
                  <View key={genre.id} style={styles.genreTag}>
                    <Text style={styles.genreText}>{genre.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Basic Info Section */}
          {/* <View style={styles.section}>
            <View style={styles.basicInfo}>
              <Text style={styles.year}>
                {details.release_date?.split("-")[0]} •{" "}
                {Math.floor(details.runtime / 60)}h {details.runtime % 60}m
              </Text>
              {details.imdbRating && (
                <View style={styles.imdbRating}>
                  <Image
                    source={require("../../../assets/images/imdb.png")}
                    style={styles.imdbLogo}
                  />
                  <Text style={styles.ratingText}>{details.imdbRating}</Text>
                </View>
              )}
            </View>
            <Text style={styles.originalLanguage}>
              Original Language: {details.original_language?.toUpperCase()}
            </Text>
            <View style={styles.genreContainer}>
              {details.genres?.map((genre) => (
                <View key={genre.id} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>
          </View> */}

          {/* Watch Providers Section */}
          {details.watchProviders?.IN && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Available On</Text>
              <View style={styles.watchProvidersContainer}>
                {details.watchProviders.IN.flatrate?.map((provider) => {
                  // Map of OTT direct URLs
                  const ottUrls = {
                    'Netflix': 'https://www.netflix.com/browse',
                    'Amazon Prime Video': 'https://www.primevideo.com',
                    'Disney Plus': 'https://www.hotstar.com',
                    'Apple TV Plus': 'https://tv.apple.com',
                    'Hulu': 'https://www.hulu.com',
                    'HBO Max': 'https://www.hbomax.com',
                  };

                  return (
                    <TouchableOpacity
                      key={provider.provider_id}
                      style={styles.providerItem}
                      onPress={() => {
                        const directUrl = ottUrls[provider.provider_name];
                        const url = directUrl || details.watchProviders.IN.link;
                        Linking.canOpenURL(url).then((supported) => {
                          if (supported) {
                            Linking.openURL(url);
                          }
                        });
                      }}
                    >
                      <Image
                        source={{
                          uri: `https://image.tmdb.org/t/p/original${provider.logo_path}`,
                        }}
                        style={styles.providerLogo}
                      />
                      <Text style={styles.providerName}>
                        {provider.provider_name}
                      </Text>
                      {details.watchProviders.IN.flatrate_price && (
                        <Text style={styles.providerPrice}>
                          ₹{details.watchProviders.IN.flatrate_price}/month
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {details.watchProviders.IN.rent && (
                <View style={styles.rentSection}>
                  <Text style={styles.rentTitle}>Available for Rent</Text>
                  <View style={styles.watchProvidersContainer}>
                    {details.watchProviders.IN.rent.map((provider) => {
                      const rentPrice = details.watchProviders.IN.rent_price?.[provider.provider_id];
                      return (
                        <TouchableOpacity
                          key={provider.provider_id}
                          style={styles.providerItem}
                          onPress={() => {
                            const url = details.watchProviders.IN.link;
                            Linking.canOpenURL(url).then((supported) => {
                              if (supported) {
                                Linking.openURL(url);
                              }
                            });
                          }}
                        >
                          <Image
                            source={{
                              uri: `https://image.tmdb.org/t/p/original${provider.logo_path}`,
                            }}
                            style={styles.providerLogo}
                          />
                          <Text style={styles.providerName}>
                            {provider.provider_name}
                          </Text>
                          {rentPrice && (
                            <Text style={styles.providerPrice}>
                              ₹{rentPrice}
                            </Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Overview Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overview}>{details.overview}</Text>
          </View>

          {/* Production Info */}
          {/* <View style={styles.section}>
            <Text style={styles.sectionTitle}>Production Info</Text>
            <View style={styles.productionDetails}>
              <Text style={styles.productionText}>
                Status: <Text style={styles.productionValue}>{details.status}</Text>
              </Text>
              <Text style={styles.productionText}>
                Budget: <Text style={styles.productionValue}>
                  ${details.budget.toLocaleString()}
                </Text>
              </Text>
              <Text style={styles.productionText}>
                Revenue: <Text style={styles.productionValue}>
                  ${details.revenue.toLocaleString()}
                </Text>
              </Text>
            </View>
          </View> */}

          {/* Cast Section */}
          {details.credits.cast.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cast</Text>
              <FlatList
                horizontal
                data={details.credits.cast}
                keyExtractor={(item) => item.credit_id}
                renderItem={renderCastItem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.castList}
              />
            </View>
          )}

          {/* Crew Section */}
          {details.credits.crew.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Crew</Text>
              <FlatList
                horizontal
                data={details.credits.crew.filter((person) =>
                  ["Director", "Producer", "Screenplay", "Story"].includes(
                    person.job
                  )
                )}
                keyExtractor={(item) => item.credit_id}
                renderItem={renderCrewItem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.crewList}
              />
            </View>
          )}

          {/* Keywords/Tags */}
          {details.keywords.keywords.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Keywords</Text>
              <FlatList
                horizontal
                data={details.keywords.keywords}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderKeywordItem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.keywordsList}
              />
            </View>
          )}

          {/* Reviews Section */}
          {details.reviews.results.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <FlatList
                data={details.reviews.results.slice(0, 3)}
                keyExtractor={(item) => item.id}
                renderItem={renderReviewItem}
                scrollEnabled={false}
              />
            </View>
          )}

          {/* Production Companies */}
          {details.production_companies.length > 0 && (
            <View style={[styles.section, styles.lastSection]}>
              <Text style={styles.sectionTitle}>Production Companies</Text>
              <View style={styles.companiesContainer}>
                {details.production_companies.map((company) => (
                  <View key={company.id} style={styles.companyItem}>
                    {company.logo_path ? (
                      <Image
                        source={{
                          uri: `https://image.tmdb.org/t/p/w200${company.logo_path}`,
                        }}
                        style={styles.companyLogo}
                        resizeMode="contain"
                        defaultSource={DEFAULT_POSTER}
                        onError={(e) => {
                          console.log(
                            "Company logo image load error:",
                            e.nativeEvent.error
                          );
                        }}
                      />
                    ) : (
                      <Text style={styles.companyName}>{company.name}</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  scrollView: {
    flex: 1,
  },
  backdropContainer: {
    height: BACKDROP_HEIGHT,
  },
  backdrop: {
    width: "100%",
    height: "100%",
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
  content: {
    flex: 1,
    padding: 16,
  },
  headerSection: {
    flexDirection: "row",
    marginBottom: 20,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    fontStyle: "italic",
    color: colors.text.secondary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rating: {
    marginLeft: 4,
    fontSize: 16,
    color: colors.primary,
    fontWeight: "bold",
  },
  detailsRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  releaseDate: {
    fontSize: 14,
    color: colors.text.secondary,
    marginRight: 16,
  },
  runtime: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  genreTag: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  section: {
    marginBottom: 24,
  },
  lastSection: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginBottom: 12,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.secondary,
  },
  productionDetails: {
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 8,
  },
  productionText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  productionValue: {
    color: colors.text.primary,
    fontWeight: "500",
  },
  castList: {
    paddingVertical: 8,
  },
  castItem: {
    width: 100,
    marginRight: 16,
  },
  castImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  castName: {
    fontSize: 14,
    fontWeight: "500",
    color: "white",
    textAlign: "center",
  },
  castCharacter: {
    fontSize: 12,
    color: colors.primary,
    textAlign: "center",
  },
  crewList: {
    paddingVertical: 8,
  },
  crewItem: {
    backgroundColor: "black",
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 150,
  },
  crewName: {
    fontSize: 14,
    fontWeight: "500",
    color: "white",
    marginBottom: 4,
  },
  crewJob: {
    fontSize: 12,
    color: colors.primary,
  },
  keywordsList: {
    paddingVertical: 8,
  },
  keywordTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  keywordText: {
    fontSize: 12,
    color: colors.text.white,
  },
  reviewItem: {
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text.primary,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  reviewContent: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  companiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    backgroundColor: "white",
  },
  companyItem: {
    width: width / 3 - 24,
    height: 60,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  companyLogo: {
    width: "100%",
    height: "100%",
  },
  companyName: {
    fontSize: 12,
    color: "black",
    textAlign: "center",
  },
  basicInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    justifyContent: "space-between",
  },
  year: {
    fontSize: 14,
    color: "white",
    opacity: 0.8,
  },
  imdbRating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3ce13",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  imdbLogo: {
    width: 40,
    height: 20,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "black",
    fontWeight: "600",
  },
  originalLanguage: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 12,
    fontWeight: "500",
  },
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  watchProvidersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 16,
  },
  providerItem: {
    width: width / 3 - 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  providerLogo: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginBottom: 8,
  },
  providerName: {
    fontSize: 12,
    color: "white",
    textAlign: "center",
    marginBottom: 4,
    fontWeight: '500',
  },
  providerPrice: {
    fontSize: 11,
    color: colors.primary,
    textAlign: "center",
    fontWeight: '600',
  },
  rentSection: {
    marginTop: 24,
  },
  rentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 12,
  },
  adultContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
    // backgroundColor: 'rgba(255,255,255,0.05)',
    // padding: 12,
    borderRadius: 8,
  },
  adultLabel: {
    fontSize: 14,
    color: 'white',
    marginRight: 12,
    fontWeight: '500',
  },
  adultBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  adultText: {
    color:"white",
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default MovieDetailsScreen;
