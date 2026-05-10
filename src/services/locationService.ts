import * as Location from 'expo-location';

let cached: string | null = null;

export const LocationService = {
  async preload() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    const pos = await Location.getLastKnownPositionAsync();
    if (pos) {
      cached = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
    }
  },

  async getLocation(): Promise<string> {
    if (cached) return cached;

    const pos = await Location.getCurrentPositionAsync({});
    const url = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;

    cached = url;
    return url;
  }
};