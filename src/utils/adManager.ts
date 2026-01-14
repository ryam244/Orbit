/**
 * Advertisement Manager
 * Handles banner and interstitial ads with AdMob
 *
 * NOTE: This is a placeholder implementation for development.
 * To enable actual ads, you need to:
 * 1. Install: npx expo install react-native-google-mobile-ads
 * 2. Configure app.json with your AdMob App ID
 * 3. Replace mock functions with real AdMob SDK calls
 * 4. Get ad unit IDs from AdMob console
 */

/**
 * AdMob configuration (placeholder)
 * Replace these with your actual AdMob IDs
 */
export const AD_CONFIG = {
  // Banner ad unit IDs (test IDs - replace with real ones)
  BANNER_AD_UNIT_ID_IOS: 'ca-app-pub-3940256099942544/2934735716', // Test ID
  BANNER_AD_UNIT_ID_ANDROID: 'ca-app-pub-3940256099942544/6300978111', // Test ID

  // Interstitial ad unit IDs (test IDs - replace with real ones)
  INTERSTITIAL_AD_UNIT_ID_IOS: 'ca-app-pub-3940256099942544/4411468910', // Test ID
  INTERSTITIAL_AD_UNIT_ID_ANDROID: 'ca-app-pub-3940256099942544/1033173712', // Test ID

  // Ad frequency settings
  INTERSTITIAL_GAMES_INTERVAL: 3, // Show interstitial every N games
};

/**
 * Initialize AdMob
 * Call this once when app starts
 */
export const initializeAds = async (): Promise<void> => {
  try {
    // TODO: Replace with actual AdMob initialization
    // import MobileAds from 'react-native-google-mobile-ads';
    // await MobileAds().initialize();
    console.log('[AdManager] Ads initialized (mock)');
  } catch (error) {
    console.error('[AdManager] Failed to initialize ads:', error);
  }
};

/**
 * Load and show interstitial ad
 * Call this between games (e.g., on result screen)
 */
export const showInterstitialAd = async (): Promise<boolean> => {
  try {
    // TODO: Replace with actual AdMob interstitial
    // import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
    // const interstitial = InterstitialAd.createForAdRequest(AD_CONFIG.INTERSTITIAL_AD_UNIT_ID);
    // await interstitial.load();
    // await interstitial.show();
    console.log('[AdManager] Interstitial ad shown (mock)');
    return true;
  } catch (error) {
    console.error('[AdManager] Failed to show interstitial:', error);
    return false;
  }
};

/**
 * Check if it's time to show an interstitial ad
 * @param gamesPlayed Total number of games played
 * @returns Whether to show interstitial ad now
 */
export const shouldShowInterstitial = (gamesPlayed: number): boolean => {
  // Show ad every N games
  return gamesPlayed % AD_CONFIG.INTERSTITIAL_GAMES_INTERVAL === 0;
};

/**
 * Get banner ad unit ID for current platform
 */
export const getBannerAdUnitId = (): string => {
  // TODO: Detect platform and return appropriate ID
  // import { Platform } from 'react-native';
  // return Platform.OS === 'ios'
  //   ? AD_CONFIG.BANNER_AD_UNIT_ID_IOS
  //   : AD_CONFIG.BANNER_AD_UNIT_ID_ANDROID;
  return AD_CONFIG.BANNER_AD_UNIT_ID_ANDROID; // Default for now
};

/**
 * Implementation guide for real AdMob integration:
 *
 * 1. Install the package:
 *    npx expo install react-native-google-mobile-ads
 *
 * 2. Configure app.json:
 *    {
 *      "expo": {
 *        "plugins": [
 *          [
 *            "react-native-google-mobile-ads",
 *            {
 *              "androidAppId": "ca-app-pub-XXXXX~YYYYY",
 *              "iosAppId": "ca-app-pub-XXXXX~YYYYY"
 *            }
 *          ]
 *        ]
 *      }
 *    }
 *
 * 3. Get your AdMob App ID and Ad Unit IDs from:
 *    https://apps.admob.com/
 *
 * 4. Replace test IDs in AD_CONFIG with your real IDs
 *
 * 5. Implement real ad loading in components:
 *    import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
 *    <BannerAd
 *      unitId={getBannerAdUnitId()}
 *      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
 *    />
 */
