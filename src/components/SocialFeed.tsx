import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  PanGestureHandler,
  State,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Heart,
  MessageCircle,
  Share,
  BookOpen,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MoreVertical,
  User,
  Clock,
  Tag,
} from 'lucide-react-native';
import { useStore } from '../store/useStore';
import { Content, User as UserType } from '../types';

const { width, height } = Dimensions.get('window');

interface FeedItemProps {
  content: Content;
  creator: UserType;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onUserPress: () => void;
}

const FeedItem: React.FC<FeedItemProps> = ({
  content,
  creator,
  onLike,
  onComment,
  onShare,
  onUserPress,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showLoveAnimation, setShowLoveAnimation] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike();
    
    if (!isLiked) {
      setShowLoveAnimation(true);
      setTimeout(() => setShowLoveAnimation(false), 1500);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const getContentIcon = () => {
    switch (content.type) {
      case 'video':
        return isPlaying ? Pause : Play;
      case 'quiz':
        return BookOpen;
      case 'note':
        return BookOpen;
      default:
        return BookOpen;
    }
  };

  const getContentTypeColor = () => {
    switch (content.type) {
      case 'video':
        return '#FF3B30';
      case 'quiz':
        return '#34C759';
      case 'note':
        return '#007AFF';
      default:
        return '#FF9500';
    }
  };

  const ContentIcon = getContentIcon();

  return (
    <View style={styles.feedItem}>
      {/* Background Video/Image */}
      <View style={styles.backgroundContainer}>
        {content.media.length > 0 && content.media[0].type === 'video' ? (
          <View style={styles.videoContainer}>
            <View style={styles.videoPlaceholder}>
              <ContentIcon size={48} color="#FFFFFF" strokeWidth={2} />
            </View>
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <View style={styles.imagePlaceholder}>
              <BookOpen size={48} color="#FFFFFF" strokeWidth={2} />
            </View>
          </View>
        )}
      </View>

      {/* Content Overlay */}
      <View style={styles.contentOverlay}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.contentTypeBadge}>
            <Text style={[styles.contentTypeText, { color: getContentTypeColor() }]}>
              {content.type.toUpperCase()}
            </Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical size={24} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Bottom Content */}
        <View style={styles.bottomContent}>
          {/* Creator Info */}
          <TouchableOpacity style={styles.creatorInfo} onPress={onUserPress}>
            <View style={styles.avatar}>
              <User size={20} color="#FFFFFF" strokeWidth={2} />
            </View>
            <Text style={styles.creatorName}>{creator.username}</Text>
            <View style={styles.followButton}>
              <Text style={styles.followText}>Follow</Text>
            </View>
          </TouchableOpacity>

          {/* Content Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.description} numberOfLines={3}>
              {content.description}
            </Text>
            <View style={styles.tagsContainer}>
              {content.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Tag size={12} color="#FFFFFF" strokeWidth={2} />
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Music Info */}
          <View style={styles.musicInfo}>
            <Text style={styles.musicText}>
              📚 {content.type === 'quiz' ? 'Quiz' : content.type === 'note' ? 'Knowledge' : 'Learning'} • 
              {content.duration ? ` ${Math.floor(content.duration / 60)}:${(content.duration % 60).toString().padStart(2, '0')}` : ''}
            </Text>
          </View>
        </View>

        {/* Right Side Actions */}
        <View style={styles.rightActions}>
          {/* User Avatar */}
          <TouchableOpacity style={styles.userAvatar} onPress={onUserPress}>
            <User size={24} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>

          {/* Like Button */}
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Heart 
              size={28} 
              color={isLiked ? '#FF3B30' : '#FFFFFF'} 
              fill={isLiked ? '#FF3B30' : 'none'}
              strokeWidth={2} 
            />
            <Text style={styles.actionCount}>{content.likes}</Text>
          </TouchableOpacity>

          {/* Comment Button */}
          <TouchableOpacity style={styles.actionButton} onPress={onComment}>
            <MessageCircle size={28} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.actionCount}>{content.comments?.length || 0}</Text>
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity style={styles.actionButton} onPress={onShare}>
            <Share size={28} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.actionCount}>{content.shares}</Text>
          </TouchableOpacity>

          {/* Play/Pause Button */}
          {content.type === 'video' && (
            <TouchableOpacity style={styles.actionButton} onPress={handlePlayPause}>
              <ContentIcon size={28} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
          )}

          {/* Mute Button */}
          {content.type === 'video' && (
            <TouchableOpacity style={styles.actionButton} onPress={handleMuteToggle}>
              {isMuted ? (
                <VolumeX size={28} color="#FFFFFF" strokeWidth={2} />
              ) : (
                <Volume2 size={28} color="#FFFFFF" strokeWidth={2} />
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Love Animation */}
        {showLoveAnimation && (
          <View style={styles.loveAnimation}>
            <Text style={styles.loveText}>❤️</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const SocialFeed: React.FC = () => {
  const { feedItems, likeContent, addExperience } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock data for demonstration
  const mockFeedItems = [
    {
      id: '1',
      content: {
        id: '1',
        type: 'video' as const,
        title: 'React Native Basics',
        description: 'Learn the fundamentals of React Native development with this comprehensive tutorial. Perfect for beginners!',
        media: [],
        creator: '1',
        likes: 1247,
        comments: [],
        shares: 89,
        tags: ['react-native', 'tutorial', 'programming'],
        relatedNodes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        duration: 180,
        views: 15420,
      },
      creator: {
        id: '1',
        username: 'code_master',
        email: 'code@example.com',
        avatar: '',
        level: 15,
        experience: 15000,
        achievements: [],
        following: [],
        followers: [],
        preferences: {
          theme: 'dark',
          notifications: true,
          aiEnabled: true,
          autoSave: true,
          language: 'en',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    {
      id: '2',
      content: {
        id: '2',
        type: 'quiz' as const,
        title: 'JavaScript Fundamentals',
        description: 'Test your JavaScript knowledge with this interactive quiz covering variables, functions, and objects.',
        media: [],
        creator: '2',
        likes: 892,
        comments: [],
        shares: 45,
        tags: ['javascript', 'quiz', 'programming'],
        relatedNodes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 8920,
      },
      creator: {
        id: '2',
        username: 'js_expert',
        email: 'js@example.com',
        avatar: '',
        level: 12,
        experience: 12000,
        achievements: [],
        following: [],
        followers: [],
        preferences: {
          theme: 'dark',
          notifications: true,
          aiEnabled: true,
          autoSave: true,
          language: 'en',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  ];

  const handleLike = (contentId: string) => {
    likeContent(contentId);
    addExperience(5);
  };

  const handleComment = (contentId: string) => {
    // TODO: Navigate to comments screen
    console.log('Comment on content:', contentId);
    addExperience(2);
  };

  const handleShare = (contentId: string) => {
    // TODO: Implement share functionality
    console.log('Share content:', contentId);
    addExperience(3);
  };

  const handleUserPress = (userId: string) => {
    // TODO: Navigate to user profile
    console.log('View user profile:', userId);
  };

  const onGestureEvent = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationY } = event.nativeEvent;
      if (Math.abs(translationY) > 100) {
        if (translationY > 0 && currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        } else if (translationY < 0 && currentIndex < mockFeedItems.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchText}>🔍</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.feedContainer}>
        {mockFeedItems.map((item, index) => (
          <PanGestureHandler key={item.id} onGestureEvent={onGestureEvent}>
            <View style={[
              styles.feedItemContainer,
              { transform: [{ translateY: (index - currentIndex) * height }] }
            ]}>
              <FeedItem
                content={item.content}
                creator={item.creator}
                onLike={() => handleLike(item.content.id)}
                onComment={() => handleComment(item.content.id)}
                onShare={() => handleShare(item.content.id)}
                onUserPress={() => handleUserPress(item.creator.id)}
              />
            </View>
          </PanGestureHandler>
        ))}
      </View>
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
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  searchButton: {
    padding: 8,
  },
  searchText: {
    fontSize: 20,
  },
  feedContainer: {
    flex: 1,
  },
  feedItemContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  feedItem: {
    flex: 1,
    position: 'relative',
  },
  backgroundContainer: {
    flex: 1,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },
  contentTypeBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  contentTypeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  moreButton: {
    padding: 8,
  },
  bottomContent: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 80,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  creatorName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    flex: 1,
  },
  followButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  descriptionContainer: {
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  musicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  rightActions: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    alignItems: 'center',
    gap: 20,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionCount: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  loveAnimation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 1000,
  },
  loveText: {
    fontSize: 80,
  },
});

export default SocialFeed; 