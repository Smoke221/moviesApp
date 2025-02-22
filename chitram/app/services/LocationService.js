import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const storeLocation = async (data) => {
  try {
    await AsyncStorage.setItem("userLocation", JSON.stringify(data));
    console.log("Location stored successfully:", data);
  } catch (e) {
    console.error("Error storing location:", e);
  }
};

const retrieveLocation = async () => {
  try {
    const stored = await AsyncStorage.getItem("userLocation");
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.error("Error retrieving location:", e);
    return null;
  }
};

const getLocationFromIP = async () => {
  try {
    console.log("Fetching location from IP...");
    const response = await axios.get("http://ip-api.com/json/");

    if (response.data.status !== "success") {
      throw new Error("Failed to get location from IP API");
    }

    const locationData = {
      city: response.data.city,
      region: response.data.regionName,
      country: response.data.country,
      source: "IP",
      timestamp: new Date().toISOString(),
    };

    console.log("IP-based Location:", locationData);
    await storeLocation(locationData);
    return locationData;
  } catch (err) {
    console.error("IP location fetch error:", err);

    const fallbackLocation = {
      city: "Hyderabad",
      region: "Telangana",
      country: "India",
      source: "Fallback",
      timestamp: new Date().toISOString(),
    };

    console.log("Using fallback location:", fallbackLocation);
    await storeLocation(fallbackLocation);
    return fallbackLocation;
  }
};

const getLocation = async () => {
  const storedLocation = await retrieveLocation();

  if (storedLocation) {
    return storedLocation;
  } else {
    return await getLocationFromIP();
  }
};

export default getLocation;
