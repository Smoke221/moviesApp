import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
// import { DEFAULT_POSTER } from '../constants/Images';
import colors from '../theme/colors';

const CastComponent = ({ cast }) => {
  const renderCastItem = ({ item }) => (
    <View style={styles.castItem}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w185${item.profile_path}` }}
        style={styles.castImage}
        // defaultSource={DEFAULT_POSTER}
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

  if (!cast || cast.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Cast</Text>
      <FlatList
        horizontal
        data={cast}
        keyExtractor={(item) => item.credit_id}
        renderItem={renderCastItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.castList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  castItem: {
    marginRight: 10,
    alignItems: 'center',
    width: 100,
    paddingHorizontal: 5,
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
    color: 'white',
    textAlign: 'center',
  },
  castCharacter: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
  },
});

export default CastComponent;
