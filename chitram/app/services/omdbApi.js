import axios from 'axios';

// Replace with your actual OMDB API key
export const OMDB_API_KEY = 'ea2b7a44';

export const fetchMovieRatings = async (imdbId) => {
  try {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        i: imdbId,
        apikey: OMDB_API_KEY,
      },
    });

    if (response.data.Response === 'True') {
      return {
        imdbRating: response.data.imdbRating,
        rottenTomatoesRating: response.data.Ratings?.find(
          rating => rating.Source === 'Rotten Tomatoes'
        )?.Value,
        metascore: response.data.Metascore,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching OMDB ratings:', error);
    return null;
  }
};
