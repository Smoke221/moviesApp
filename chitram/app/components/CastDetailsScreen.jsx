import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Share,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { fetchCastDetails } from "../services/castService";
import colors from "../theme/colors";

const { width, height } = Dimensions.get("window");

const CastDetailsScreen = ({ route, navigation }) => {
  const { castMember } = route.params;
  const [castDetails, setCastDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandBio, setExpandBio] = useState(false);

  useEffect(() => {
    const loadCastDetails = async () => {
      try {
        setLoading(true);
        const details = await fetchCastDetails(castMember.id);
        setCastDetails(details);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadCastDetails();
  }, [castMember.id]);

  const handleShareProfile = async () => {
    try {
      const shareMessage =
        `Check out Chitram 🎬 - Your Ultimate Movie Companion!\n\n` +
        `Discover amazing cast details, movie insights, and the latest entertainment news. `;

      await Share.share({
        message: shareMessage,
        title: "Chitram - It's show time.",
      });
    } catch (error) {
      console.error("Error sharing profile:", error);
    }
  };

  const openIMDbProfile = () => {
    if (castDetails?.details?.imdb_id) {
      Linking.openURL(
        `https://www.imdb.com/name/${castDetails.details.imdb_id}`
      );
    }
  };

  const renderMovieCredits = (credits) => {
    if (!credits || credits.cast.length === 0) return null;

    return (
      <View style={styles.creditsSection}>
        <Text style={styles.sectionTitle}>Notable Movies</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.movieScrollView}
        >
          {credits.cast.slice(0, 10).map((movie) => (
            <TouchableOpacity
              key={movie.id}
              style={styles.movieItem}
              onPress={() => navigation.push("MovieDetails", { movie })}
            >
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w185${movie.poster_path}`,
                }}
                style={styles.moviePoster}
                resizeMode="cover"
              />
              <Text style={styles.movieTitle} numberOfLines={2}>
                {movie.title}
              </Text>
              <Text style={styles.movieCharacter} numberOfLines={1}>
                {movie.character}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load cast details</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,1)"]}
        style={styles.headerContainer}
      >
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShareProfile}>
            <Ionicons name="share-social" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${castMember.profile_path}`,
          }}
          style={styles.profileImage}
          resizeMode="cover"
        />

        <Text style={styles.name}>{castMember.name}</Text>

        {castDetails?.details?.place_of_birth && (
          <Text style={styles.birthInfo}>
            Born in {castDetails.details.place_of_birth}
          </Text>
        )}

        {castDetails?.details?.birthday && (
          <Text style={styles.birthInfo}>
            Born on{" "}
            {new Date(castDetails.details.birthday).toLocaleDateString()}
          </Text>
        )}
      </LinearGradient>

      <View style={styles.bioSection}>
        <Text style={styles.sectionTitle}>Biography</Text>
        <Text
          style={styles.biography}
          numberOfLines={expandBio ? undefined : 5}
        >
          {castDetails?.details?.biography || "No biography available"}
        </Text>
        {castDetails?.details?.biography?.length > 200 && (
          <TouchableOpacity onPress={() => setExpandBio(!expandBio)}>
            <Text style={styles.expandBioText}>
              {expandBio ? "Show Less" : "Read More"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.externalLinkButton}
        onPress={openIMDbProfile}
      >
        <Text style={styles.externalLinkText}>View on IMDb</Text>
      </TouchableOpacity>

      {renderMovieCredits(castDetails?.credits)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  errorText: {
    color: "white",
    fontSize: 18,
  },
  headerContainer: {
    alignItems: "center",
    paddingHorizontal: 15,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  profileImage: {
    width: width * 0.9,
    height: width * 0.6,
    borderRadius: 20,
    objectFit: "contain",
    marginBottom: 15,
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  birthInfo: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 5,
  },
  bioSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  biography: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 24,
  },
  expandBioText: {
    color: colors.primary,
    marginTop: 10,
    textAlign: "right",
  },
  creditsSection: {
    marginVertical: 15,
  },
  movieScrollView: {
    paddingHorizontal: 15,
  },
  movieItem: {
    marginRight: 15,
    width: 120,
  },
  moviePoster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "white",
    textAlign: "center",
  },
  movieCharacter: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },
  externalLinkButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
  externalLinkText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
  },
});

export default CastDetailsScreen;
