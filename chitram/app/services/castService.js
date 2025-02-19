import axios from "axios";
import { TMDB_API_KEY } from "./tmdbApi";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const WIKIDATA_SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";

export const fetchCastDetails = async (personId) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
        "Content-Type": "application/json;charset=utf-8",
      },
    };

    // Fetch basic person details
    const personResponse = await axios.get(
      `${TMDB_BASE_URL}/person/${personId}`,
      {
        ...config,
        params: {
          append_to_response: "credits,external_ids",
        },
      }
    );

    // Fetch movies the person has acted in
    const creditsResponse = await axios.get(
      `${TMDB_BASE_URL}/person/${personId}/movie_credits`,
      {
        ...config,
      }
    );

    // Combine the data
    return {
      details: personResponse.data,
      credits: creditsResponse.data,
    };
  } catch (error) {
    console.error("Error fetching cast details:", error);

    // Fallback to Wikidata if TMDB fails
    if (error.response && error.response.status === 404) {
      return fetchWikidataCastDetails(
        personResponse.data.external_ids.wikidata_id || personResponse.data.name
      );
    }

    throw error;
  }
};

const fetchWikidataCastDetails = async (identifier) => {
  try {
    // Construct a SPARQL query to fetch Wikidata details
    const sparqlQuery = `
      SELECT ?person ?personLabel ?biography ?birthDate ?birthPlace ?occupations 
      WHERE {
        ?person wdt:P345 "${identifier}".
        OPTIONAL { ?person wdt:P569 ?birthDate. }
        OPTIONAL { ?person wdt:P19 ?birthPlaceItem. ?birthPlaceItem rdfs:label ?birthPlace. }
        OPTIONAL { ?person wdt:P106 ?occupation. }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
      }
      LIMIT 1
    `;

    const response = await axios.get(WIKIDATA_SPARQL_ENDPOINT, {
      params: {
        query: sparqlQuery,
        format: "json",
      },
    });

    return {
      wikidata: response.data.results.bindings[0],
    };
  } catch (error) {
    console.error("Error fetching Wikidata details:", error);
    throw error;
  }
};
