import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  Platform,
  ImageBackground,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const MAX_VIDEO_WIDTH = Platform.OS === 'web' ? 600 : 480;

interface AutoScaleVideoProps {
  videoUrl: string;
  thumbnailUrl?: string;
  aspectRatio?: number; // width/height ratio
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  onPlaybackStatusUpdate?: (status: AVPlaybackStatus) => void;
  onError?: (error: string) => void;
  style?: any;
  resizeMode?: ResizeMode;
  showControls?: boolean;
  onPress?: () => void;
}

const AutoScaleVideo: React.FC<AutoScaleVideoProps> = ({
  videoUrl,
  thumbnailUrl,
  aspectRatio = 9 / 16, // Default TikTok-style aspect ratio
  autoPlay = false,
  loop = true,
  muted = false,
  onPlaybackStatusUpdate,
  onError,
  style,
  resizeMode = ResizeMode.COVER,
  showControls = true,
  onPress,
}) => {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showControlsOverlay, setShowControlsOverlay] = useState(false);

  // Animation values
  const controlsOpacity = useSharedValue(0);
  const scaleValue = useSharedValue(1);

  // Calculate video dimensions based on aspect ratio and screen size
  const getVideoDimensions = () => {
    const maxWidth = screenWidth;
    const maxHeight = screenHeight * 0.8; // Leave some space for UI

    let videoWidth = maxWidth;
    let videoHeight = videoWidth / aspectRatio;

    // If height exceeds max height, scale down
    if (videoHeight > maxHeight) {
      videoHeight = maxHeight;
      videoWidth = videoHeight * aspectRatio;
    }

    return { width: videoWidth, height: videoHeight };
  };

  const { width: videoWidth, height: videoHeight } = getVideoDimensions();

  const controlsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
  }));

  const scaleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  useEffect(() => {
    if (showControlsOverlay) {
      controlsOpacity.value = withTiming(1, { duration: 200 });
      setTimeout(() => {
        controlsOpacity.value = withTiming(0, { duration: 500 });
        setShowControlsOverlay(false);
      }, 3000);
    }
  }, [showControlsOverlay]);

  const handlePlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
    setStatus(playbackStatus);
    
    if (playbackStatus.isLoaded) {
      setIsLoading(false);
      setIsPlaying(playbackStatus.isPlaying);
    }
    
    onPlaybackStatusUpdate?.(playbackStatus);
  };

  const handleError = (error: any) => {
    let errorMessage = 'Video playback error';
    
    // Handle different error object structures
    if (error && typeof error === 'object') {
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.toString) {
        errorMessage = error.toString();
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    setError(errorMessage);
    setIsLoading(false);
    onError?.(errorMessage);
  };

  const togglePlayPause = async () => {
    try {
      if (isPlaying) {
        await videoRef.current?.pauseAsync();
      } else {
        await videoRef.current?.playAsync();
      }
    } catch (err) {
      console.error('Error toggling play/pause:', err);
    }
  };

  const toggleMute = async () => {
    try {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      await videoRef.current?.setIsMutedAsync(newMuted);
    } catch (err) {
      console.error('Error toggling mute:', err);
    }
  };

  const restartVideo = async () => {
    try {
      await videoRef.current?.setPositionAsync(0);
      await videoRef.current?.playAsync();
    } catch (err) {
      console.error('Error restarting video:', err);
    }
  };

  const handleVideoPress = () => {
    if (showControls) {
      setShowControlsOverlay(true);
    }
    onPress?.();
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setError(null);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (error) {
    return (
      <View style={[styles.errorContainer, { width: videoWidth, height: videoHeight }, style]}>
        <LinearGradient
          colors={['#FF6B6B', '#FF8E8E']}
          style={styles.errorGradient}
        >
          <Text style={styles.errorText}>Video Error</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => setError(null)}>
            <RotateCcw size={20} color="#FFFFFF" />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.outerContainer, { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', position: 'relative' }, style]}>
      {/* Blurred/Darkened Background */}
      {thumbnailUrl ? (
        <ImageBackground
          source={{ uri: thumbnailUrl }}
          style={styles.backgroundFill}
          blurRadius={Platform.OS === 'web' ? 20 : 10}
          resizeMode="cover"
        >
          <View style={styles.backgroundOverlay} />
        </ImageBackground>
      ) : (
        <View style={[styles.backgroundFill, styles.backgroundOverlay]} />
      )}
      {/* Centered Video */}
      <View style={[styles.centeredVideoContainer, { maxWidth: MAX_VIDEO_WIDTH, width: '100%', alignSelf: 'center', position: 'relative', zIndex: 2 }]}> 
        <TouchableOpacity
          style={styles.videoContainer}
          onPress={handleVideoPress}
          activeOpacity={1}
        >
          <Video
            ref={videoRef}
            style={[styles.video, scaleAnimatedStyle]}
            source={{ uri: videoUrl }}
            posterSource={thumbnailUrl ? { uri: thumbnailUrl } : undefined}
            posterStyle={styles.poster}
            resizeMode={resizeMode}
            shouldPlay={autoPlay}
            isLooping={loop}
            isMuted={isMuted}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            onLoadStart={handleLoadStart}
            onLoad={handleLoad}
            onError={(error) => handleError(error)}
          />
          {/* Loading Overlay */}
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.loadingText}>Loading video...</Text>
            </View>
          )}
          {/* Controls Overlay */}
          {showControls && showControlsOverlay && (
            <Animated.View style={[styles.controlsOverlay, controlsAnimatedStyle]}>
              <LinearGradient
                colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.3)']}
                style={styles.controlsGradient}
              >
                {/* Center Play/Pause Button */}
                <TouchableOpacity
                  style={styles.centerPlayButton}
                  onPress={togglePlayPause}
                >
                  {isPlaying ? (
                    <Pause size={40} color="#FFFFFF" strokeWidth={2} />
                  ) : (
                    <Play size={40} color="#FFFFFF" strokeWidth={2} />
                  )}
                </TouchableOpacity>
                {/* Bottom Controls */}
                <View style={styles.bottomControls}>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={toggleMute}
                  >
                    {isMuted ? (
                      <VolumeX size={24} color="#FFFFFF" strokeWidth={2} />
                    ) : (
                      <Volume2 size={24} color="#FFFFFF" strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={restartVideo}
                  >
                    <RotateCcw size={24} color="#FFFFFF" strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>
          )}
          {/* Video Progress Bar */}
          {status?.isLoaded && status.durationMillis && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(status.positionMillis / status.durationMillis) * 100}%`,
                    },
                  ]}
                />
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backgroundFill: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 1,
  },
  centeredVideoContainer: {
    width: '100%',
    maxWidth: MAX_VIDEO_WIDTH,
    alignSelf: 'center',
    position: 'relative',
    zIndex: 2,
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    flex: 1,
  },
  poster: {
    resizeMode: 'cover',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginTop: 12,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  controlsGradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  centerPlayButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 40,
    width: 80,
    height: 80,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  progressBar: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    overflow: 'hidden',
  },
  errorGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  errorSubtext: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});

export default AutoScaleVideo; 