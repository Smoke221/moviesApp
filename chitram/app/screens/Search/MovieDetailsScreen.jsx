import React, { useEffect, useState, useRef } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { TMDB_API_KEY } from '../../services/tmdbApi';
import colors from '../../theme/colors';

const { width } = Dimensions.get('window');
const BACKDROP_HEIGHT = width * 0.5625; // 16:9 aspect ratio

const MovieDetailsScreen = ({ route, navigation }) => {
  const { movie } = route.params;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}`,
          {
            params: {
              append_to_response: 'credits,videos,images,similar,keywords,reviews'
            },
            headers: {
              'Authorization': `Bearer ${TMDB_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setDetails(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movie.id]);

  const backButtonOpacity = scrollY.interpolate({
    inputRange: [0, BACKDROP_HEIGHT / 2, BACKDROP_HEIGHT],
    outputRange: [1, 0.7, 0.3],
    extrapolate: 'clamp'
  });

  const backButtonScale = scrollY.interpolate({
    inputRange: [0, BACKDROP_HEIGHT / 2, BACKDROP_HEIGHT],
    outputRange: [1, 0.9, 0.8],
    extrapolate: 'clamp'
  });

  const renderCastItem = ({ item }) => (
    <View style={styles.castItem}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w185${item.profile_path}` }}
        style={styles.castImage}
        // defaultSource={require('../../assets/placeholder.png')}
      />
      <Text style={styles.castName} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.castCharacter} numberOfLines={1}>{item.character}</Text>
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
            source={{ uri: `https://image.tmdb.org/t/p/original${details.backdrop_path}` }}
            style={styles.backdrop}
            resizeMode="cover"
          />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${details.poster_path}` }}
              style={styles.poster}
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

              <View style={styles.genresContainer}>
                {details.genres.map(genre => (
                  <View key={genre.id} style={styles.genreTag}>
                    <Text style={styles.genreText}>{genre.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Overview Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overview}>{details.overview}</Text>
          </View>

          {/* Production Info */}
          <View style={styles.section}>
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
          </View>

          {/* Cast Section */}
          {details.credits.cast.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cast</Text>
              <FlatList
                horizontal
                data={details.credits.cast}
                keyExtractor={item => item.credit_id}
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
                data={details.credits.crew.filter(person => 
                  ['Director', 'Producer', 'Screenplay', 'Story'].includes(person.job)
                )}
                keyExtractor={item => item.credit_id}
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
                keyExtractor={item => item.id.toString()}
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
                keyExtractor={item => item.id}
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
                {details.production_companies.map(company => (
                  <View key={company.id} style={styles.companyItem}>
                    {company.logo_path ? (
                      <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w200${company.logo_path}` }}
                        style={styles.companyLogo}
                        resizeMode="contain"
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
            transform: [{ scale: backButtonScale }]
          }
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
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  backdropContainer: {
    height: BACKDROP_HEIGHT,
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 20,
    left: 8,
    zIndex: 10,
  },
  backButton: {
    width: 25,
    height: 25,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerSection: {
    flexDirection: 'row',
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
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.text.secondary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    marginLeft: 4,
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
  detailsRow: {
    flexDirection: 'row',
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
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    fontWeight: '600',
    color: colors.text.primary,
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
    fontWeight: '500',
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
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'center',
  },
  castCharacter: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  crewList: {
    paddingVertical: 8,
  },
  crewItem: {
    backgroundColor: colors.background.secondary,
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 150,
  },
  crewName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  crewJob: {
    fontSize: 12,
    color: colors.text.secondary,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 16,
    fontWeight: '500',
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  companyItem: {
    width: width / 3 - 24,
    height: 60,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyLogo: {
    width: '100%',
    height: '100%',
  },
  companyName: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default MovieDetailsScreen;
