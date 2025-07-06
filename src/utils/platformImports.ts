import { View } from 'react-native';
import { Platform } from 'react-native';

// BlurView conditional import
export let BlurView: any = View;
if (Platform.OS !== 'web') {
  try {
    const { BlurView: ExpoBlurView } = require('expo-blur');
    BlurView = ExpoBlurView;
  } catch (e) {
    // Keep View as fallback
    console.warn('expo-blur not available, using View as fallback');
  }
}

// React Native Maps conditional import
export let MapView: any = () => null;
export let Marker: any = () => null;
export let Callout: any = () => null;
export let PROVIDER_GOOGLE: any = undefined;

if (Platform.OS !== 'web') {
  try {
    const maps = require('react-native-maps');
    MapView = maps.default;
    Marker = maps.Marker;
    Callout = maps.Callout;
    PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
  } catch (e) {
    console.warn('react-native-maps not available, using null components as fallback');
  }
}

// PDF Reader conditional import
export let Pdf: any = null;
if (Platform.OS !== 'web') {
  try {
    Pdf = require('react-native-pdf').default;
  } catch (e) {
    console.warn('react-native-pdf not available');
  }
} 