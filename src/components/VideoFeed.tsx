import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  Music,
  User,
  MoreVertical,
  Search,
  Filter,
  Play,
  Pause,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useStore } from '../store/useStore';
import AutoScaleVideo from './AutoScaleVideo';
import { videoService, VideoData } from '../services/videoService';

const { width, height } = Dimensions.get('window');

interface VideoFeedItemProps {
  video: VideoData;
  isActive: boolean;
  onLike: (videoId: string) => void;
  onComment: (videoId: string) => void;
  onShare: (videoId: string) => void;
  onBookmark: (videoId: string) => void;
  onUserPress: (author: string) => void;
}

const VideoFeedItem: React.FC<VideoFeedItemProps> = ({
  video,
  isActive,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onUserPress,
}) => {
  const [showLoveAnimation, setShowLoveAnimation] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Animation values
  const heartScale = useSharedValue(1);
  const controlsOpacity = useSharedValue(0);

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const controlsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
  }));

  const handleLike = () => {
    onLike(video.id);
    
    if (!video.isLiked) {
      setShowLoveAnimation(true);
      heartScale.value = withSequence(
        withSpring(1.5, { damping: 10, stiffness: 300 }),
        withSpring(1, { damping: 10, stiffness: 300 })
      );
      setTimeout(() => setShowLoveAnimation(false), 1500);
    }
  };

  const handleVideoPress = () => {
    setShowControls(true);
    controlsOpacity.value = withTiming(1, { duration: 200 });
    setTimeout(() => {
      controlsOpacity.value = withTiming(0, { duration: 500 });
      setShowControls(false);
    }, 3000);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.videoContainer}>
      {/* Auto-Scale Video */}
      <AutoScaleVideo
        videoUrl={video.videoUrl}
        thumbnailUrl={video.thumbnailUrl}
        aspectRatio={video.aspectRatio}
        autoPlay={isActive}
        loop={true}
        muted={false}
        showControls={true}
        onPress={handleVideoPress}
        style={styles.videoComponent}
      />

      {/* Right Side Actions */}
      <View style={styles.rightActions}>
        {/* User Avatar */}
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={() => onUserPress(video.author)}
        >
          <View style={styles.avatar}>
            <User size={20} color="#FFFFFF" />
          </View>
          <View style={styles.followButton}>
            <Text style={styles.followButtonText}>+</Text>
          </View>
        </TouchableOpacity>

        {/* Like Button */}
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Heart 
            size={32} 
            color={video.isLiked ? '#FF3B30' : '#FFFFFF'} 
            fill={video.isLiked ? '#FF3B30' : 'none'} 
          />
          <Text style={styles.actionText}>{formatNumber(video.likes)}</Text>
        </TouchableOpacity>

        {/* Comment Button */}
        <TouchableOpacity style={styles.actionButton} onPress={() => onComment(video.id)}>
          <MessageCircle size={32} color="#FFFFFF" />
          <Text style={styles.actionText}>{formatNumber(video.comments)}</Text>
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity style={styles.actionButton} onPress={() => onShare(video.id)}>
          <Share size={32} color="#FFFFFF" />
          <Text style={styles.actionText}>{formatNumber(video.shares)}</Text>
        </TouchableOpacity>

        {/* Bookmark Button */}
        <TouchableOpacity style={styles.actionButton} onPress={() => onBookmark(video.id)}>
          <Bookmark 
            size={32} 
            color={video.isBookmarked ? '#FFD700' : '#FFFFFF'} 
            fill={video.isBookmarked ? '#FFD700' : 'none'} 
          />
          <Text style={styles.actionText}>{formatNumber(video.bookmarks)}</Text>
        </TouchableOpacity>

        {/* Music Button */}
        <TouchableOpacity style={styles.actionButton}>
          <Music size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Bottom Content */}
      <View style={styles.bottomContent}>
        <Text style={styles.authorName}>{video.author}</Text>
        <Text style={styles.videoTitle}>{video.title}</Text>
        <Text style={styles.videoDescription} numberOfLines={2}>
          {video.description}
        </Text>

        <View style={styles.musicSection}>
          <Music size={16} color="#FFFFFF" />
          <Text style={styles.musicText} numberOfLines={1}>
            {video.music}
          </Text>
        </View>
      </View>

      {/* Video Duration Badge */}
      {video.duration && (
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{formatDuration(video.duration)}</Text>
        </View>
      )}

      {/* Category Badge */}
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{video.category.toUpperCase()}</Text>
      </View>

      {/* Love Animation */}
      {showLoveAnimation && (
        <Animated.View style={[styles.loveAnimation, heartAnimatedStyle]}>
          <Text style={styles.loveEmoji}>❤️</Text>
        </Animated.View>
      )}

      {/* Controls Overlay */}
      {showControls && (
        <Animated.View style={[styles.controlsOverlay, controlsAnimatedStyle]}>
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.3)']}
            style={styles.controlsGradient}
          >
            <View style={styles.centerPlayButton}>
              {isActive ? (
                <Pause size={40} color="#FFFFFF" strokeWidth={2} />
              ) : (
                <Play size={40} color="#FFFFFF" strokeWidth={2} />
              )}
            </View>
          </LinearGradient>
        </Animated.View>
      )}
    </View>
  );
};

const VideoFeed: React.FC = () => {
  const { addExperience } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<VideoData[]>(videoService.getAllVideos());

  // Filter videos based on category and search
  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
      const categoryMatch = selectedCategory === 'all' || video.category === selectedCategory;
      const searchMatch = !searchQuery || 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return categoryMatch && searchMatch;
    });
  }, [videos, selectedCategory, searchQuery]);

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'education', label: 'Education' },
    { key: 'entertainment', label: 'Entertainment' },
    { key: 'tutorial', label: 'Tutorial' },
    { key: 'inspiration', label: 'Inspiration' },
    { key: 'music', label: 'Music' },
  ];

  const handleLike = (videoId: string) => {
    const updatedVideo = videoService.toggleLike(videoId);
    if (updatedVideo) {
      setVideos(videos.map(video => 
        video.id === videoId ? updatedVideo : video
      ));
      addExperience(5);
    }
  };

  const handleComment = (videoId: string) => {
    Alert.alert('Comments', 'Comment feature coming soon!');
    addExperience(2);
  };

  const handleShare = (videoId: string) => {
    Alert.alert('Share', 'Share feature coming soon!');
    addExperience(3);
  };

  const handleBookmark = (videoId: string) => {
    const updatedVideo = videoService.toggleBookmark(videoId);
    if (updatedVideo) {
      setVideos(videos.map(video => 
        video.id === videoId ? updatedVideo : video
      ));
      addExperience(2);
    }
  };

  const handleUserPress = (author: string) => {
    Alert.alert('User Profile', `Viewing ${author}'s profile`);
  };

  const renderVideoItem = ({ item, index }: { item: VideoData; index: number }) => (
    <VideoFeedItem
      video={item}
      isActive={index === currentIndex}
      onLike={handleLike}
      onComment={handleComment}
      onShare={handleShare}
      onBookmark={handleBookmark}
      onUserPress={handleUserPress}
    />
  );

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useMemo(() => ({
    itemVisiblePercentThreshold: 50,
  }), []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Video Feed</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton}>
            <Search size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Filter size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search videos..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item.key && styles.selectedCategoryButton
              ]}
              onPress={() => setSelectedCategory(item.key)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === item.key && styles.selectedCategoryButtonText
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {/* Video List */}
      <FlatList
        data={filteredVideos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={2}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0,0,0,0.8)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  headerButton: {
    padding: 5,
  },
  searchContainer: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    zIndex: 999,
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginLeft: 10,
  },
  categoryContainer: {
    position: 'absolute',
    top: 130,
    left: 0,
    right: 0,
    zIndex: 998,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  categoryList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  selectedCategoryButton: {
    backgroundColor: '#FF3B30',
  },
  categoryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  selectedCategoryButtonText: {
    fontFamily: 'Inter-Bold',
  },
  videoContainer: {
    width: width,
    height: height,
    position: 'relative',
  },
  videoComponent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  rightActions: {
    position: 'absolute',
    right: 16,
    bottom: 120,
    alignItems: 'center',
    gap: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  followButton: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    lineHeight: 16,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  bottomContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 80,
    padding: 20,
    paddingBottom: 40,
  },
  authorName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  videoTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  videoDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
    opacity: 0.9,
  },
  musicSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  musicText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    opacity: 0.8,
  },
  durationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255,59,48,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  loveAnimation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -40,
    marginLeft: -40,
    zIndex: 10,
  },
  loveEmoji: {
    fontSize: 80,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerPlayButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoFeed; 