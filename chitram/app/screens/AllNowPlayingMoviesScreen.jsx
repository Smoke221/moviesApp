import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors';

const { width } = Dimensions.get('window');

const AllNowPlayingMoviesScreen = ({ route, navigation }) => {

  
  const { movies } = route.params;

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.movieItem}
      onPress={() => navigation.navigate('MovieDetails', { movie: item })}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.moviePoster}
        resizeMode="cover"
      />
      <View style={styles.movieInfoContainer}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.movieRating}>
          ⭐ {item.vote_average.toFixed(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,1)']}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Now Playing in India</Text>
      </View>

      <FlatList
        data={movies}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  backText: {
    color: colors.primary,
    fontSize: 18,
    marginRight: 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  movieItem: {
    width: width * 0.42,
    marginBottom: 20,
  },
  moviePoster: {
    width: '100%',
    height: width * 0.6,
    borderRadius: 10,
  },
  movieInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  movieTitle: {
    color: 'white',
    fontSize: 16,
    width: '80%',
  },
  movieRating: {
    color: colors.primary,
    fontSize: 14,
  },
});

export default AllNowPlayingMoviesScreen;
