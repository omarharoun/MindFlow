import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  FlatList,
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
  Send,
  Bookmark,
  Flag,
  Copy,
  ExternalLink,
  Music,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Search,
  Filter,
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
  onBookmark: () => void;
  isActive: boolean;
}

const FeedItem: React.FC<FeedItemProps> = ({
  content,
  creator,
  onLike,
  onComment,
  onShare,
  onUserPress,
  onBookmark,
  isActive,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showLoveAnimation, setShowLoveAnimation] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Auto-play when item becomes active
  useEffect(() => {
    if (isActive && content.type === 'video') {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [isActive, content.type]);

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

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark();
  };

  const handleComment = () => {
    setShowComments(true);
    onComment();
  };

  const handleShare = () => {
    setShowShareMenu(true);
    onShare();
  };

  const handleMore = () => {
    setShowMoreMenu(true);
  };

  const submitComment = () => {
    if (commentText.trim()) {
      setCommentText('');
      setShowComments(false);
      Alert.alert('Comment Added', 'Your comment has been posted!');
    }
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

  const getContentTypeLabel = () => {
    switch (content.type) {
      case 'video':
        return 'VIDEO';
      case 'quiz':
        return 'QUIZ';
      case 'note':
        return 'NOTE';
      default:
        return 'CONTENT';
    }
  };

  const ContentIcon = getContentIcon();

  return (
    <View style={styles.feedItem}>
      {/* Background Video/Image */}
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={['#1E3A8A', '#3B82F6', '#60A5FA']}
          style={styles.backgroundGradient}
        >
          <View style={styles.contentPlaceholder}>
            <ContentIcon size={64} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.contentTypeLabel}>{getContentTypeLabel()}</Text>
          </View>
          
          {/* Video Progress Bar */}
          {content.type === 'video' && (
            <View style={styles.videoProgress}>
              <View style={[styles.videoProgressBar, { width: '45%' }]} />
            </View>
          )}
        </LinearGradient>
      </View>

      {/* Content Overlay */}
      <View style={styles.contentOverlay}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.contentTypeBadge}>
            <Text style={[styles.contentTypeText, { color: getContentTypeColor() }]}>
              {getContentTypeLabel()}
            </Text>
          </View>
          <TouchableOpacity style={styles.moreButton} onPress={handleMore}>
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
            <Text style={styles.creatorName}>@{creator.username}</Text>
            <View style={styles.followButton}>
              <Text style={styles.followText}>Follow</Text>
            </View>
          </TouchableOpacity>

          {/* Content Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.description} numberOfLines={3}>
              {content.description}
            </Text>
          </View>

          {/* Music Info */}
          <View style={styles.musicContainer}>
            <Music size={16} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.musicText} numberOfLines={1}>
              {content.type === 'video' ? 'Original Sound' : 'MindFlow Learning'}
            </Text>
          </View>
        </View>

        {/* Right Side Interaction Buttons */}
        <View style={styles.interactionButtons}>
          {/* Like Button */}
          <TouchableOpacity style={styles.interactionButton} onPress={handleLike}>
            <View style={styles.iconContainer}>
              <Heart 
                size={28} 
                color={isLiked ? "#FF3B30" : "#FFFFFF"} 
                fill={isLiked ? "#FF3B30" : "none"}
                strokeWidth={2} 
              />
            </View>
            <Text style={[styles.interactionCount, isLiked && styles.likedText]}>
              {content.likes.toLocaleString()}
            </Text>
          </TouchableOpacity>

          {/* Comment Button */}
          <TouchableOpacity style={styles.interactionButton} onPress={handleComment}>
            <View style={styles.iconContainer}>
              <MessageCircle size={28} color="#FFFFFF" strokeWidth={2} />
            </View>
            <Text style={styles.interactionCount}>
              {content.comments.length.toLocaleString()}
            </Text>
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity style={styles.interactionButton} onPress={handleShare}>
            <View style={styles.iconContainer}>
              <Share size={28} color="#FFFFFF" strokeWidth={2} />
            </View>
            <Text style={styles.interactionCount}>
              {content.shares.toLocaleString()}
            </Text>
          </TouchableOpacity>

          {/* Bookmark Button */}
          <TouchableOpacity style={styles.interactionButton} onPress={handleBookmark}>
            <View style={styles.iconContainer}>
              <Bookmark 
                size={28} 
                color={isBookmarked ? "#FFD700" : "#FFFFFF"} 
                fill={isBookmarked ? "#FFD700" : "none"}
                strokeWidth={2} 
              />
            </View>
            <Text style={[styles.interactionCount, isBookmarked && styles.bookmarkedText]}>
              Save
            </Text>
          </TouchableOpacity>

          {/* Play/Pause Button for Videos */}
          {content.type === 'video' && (
            <TouchableOpacity style={styles.interactionButton} onPress={handlePlayPause}>
              <View style={styles.iconContainer}>
                {isPlaying ? (
                  <Pause size={28} color="#FFFFFF" strokeWidth={2} />
                ) : (
                  <Play size={28} color="#FFFFFF" strokeWidth={2} />
                )}
              </View>
              <Text style={styles.interactionCount}>
                {isPlaying ? 'Pause' : 'Play'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Love Animation */}
        {showLoveAnimation && (
          <View style={styles.loveAnimation}>
            <Text style={styles.loveEmoji}>❤️</Text>
          </View>
        )}
      </View>

      {/* Comments Modal */}
      <Modal
        visible={showComments}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowComments(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.commentsModal}>
            <View style={styles.commentsHeader}>
              <Text style={styles.commentsTitle}>Comments</Text>
              <TouchableOpacity onPress={() => setShowComments(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.commentsList}>
              {content.comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <View style={styles.commentAvatar}>
                    <User size={16} color="#FFFFFF" strokeWidth={2} />
                  </View>
                  <View style={styles.commentContent}>
                    <Text style={styles.commentAuthor}>User {comment.author}</Text>
                    <Text style={styles.commentText}>{comment.content}</Text>
                    <Text style={styles.commentTime}>
                      {comment.createdAt.toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            
            <View style={styles.commentInput}>
              <TextInput
                style={styles.input}
                placeholder="Add a comment..."
                placeholderTextColor="#666666"
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity style={styles.sendButton} onPress={submitComment}>
                <Send size={20} color="#007AFF" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Share Modal */}
      <Modal
        visible={showShareMenu}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowShareMenu(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.shareModal}>
            <Text style={styles.shareTitle}>Share to</Text>
            <View style={styles.shareOptions}>
              <TouchableOpacity style={styles.shareOption}>
                <View style={styles.shareIcon}>
                  <MessageCircle size={24} color="#007AFF" strokeWidth={2} />
                </View>
                <Text style={styles.shareOptionText}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareOption}>
                <View style={styles.shareIcon}>
                  <Copy size={24} color="#007AFF" strokeWidth={2} />
                </View>
                <Text style={styles.shareOptionText}>Copy Link</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareOption}>
                <View style={styles.shareIcon}>
                  <ExternalLink size={24} color="#007AFF" strokeWidth={2} />
                </View>
                <Text style={styles.shareOptionText}>More</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setShowShareMenu(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const SocialFeed: React.FC = () => {
  const { feedItems, likeContent, addExperience } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFeed, setSelectedFeed] = useState<'ForYou' | 'Following'>('ForYou');

  // Mock data for demonstration
  const mockFeedItems = [
    {
      id: '1',
      content: {
        id: '1',
        type: 'video' as const,
        title: 'React Native Basics',
        description: 'Learn the fundamentals of React Native development with this comprehensive tutorial. Perfect for beginners! #react-native #tutorial #programming',
        media: [],
        creator: '1',
        likes: 1247,
        comments: [
          { id: '1', content: 'Great tutorial! Very helpful for beginners.', author: '1', createdAt: new Date(), likes: 5, replies: [] },
          { id: '2', content: 'Can you make more videos like this?', author: '2', createdAt: new Date(), likes: 3, replies: [] },
        ],
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
          theme: 'dark' as const,
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
        description: 'Test your JavaScript knowledge with this interactive quiz covering variables, functions, and objects. Challenge yourself! #javascript #quiz #programming',
        media: [],
        creator: '2',
        likes: 892,
        comments: [
          { id: '3', content: 'Got 8/10! Great quiz!', author: '3', createdAt: new Date(), likes: 2, replies: [] },
        ],
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
          theme: 'dark' as const,
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
      id: '3',
      content: {
        id: '3',
        type: 'note' as const,
        title: 'Machine Learning Notes',
        description: 'Quick notes on neural networks and deep learning concepts. Perfect for revision! #machine-learning #ai #notes',
        media: [],
        creator: '3',
        likes: 567,
        comments: [],
        shares: 23,
        tags: ['machine-learning', 'ai', 'notes'],
        relatedNodes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 3450,
      },
      creator: {
        id: '3',
        username: 'ml_learner',
        email: 'ml@example.com',
        avatar: '',
        level: 8,
        experience: 8000,
        achievements: [],
        following: [],
        followers: [],
        preferences: {
          theme: 'dark' as const,
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
    console.log('Comment on content:', contentId);
    addExperience(2);
  };

  const handleShare = (contentId: string) => {
    console.log('Share content:', contentId);
    addExperience(3);
  };

  const handleBookmark = (contentId: string) => {
    console.log('Bookmark content:', contentId);
    addExperience(1);
  };

  const handleUserPress = (userId: string) => {
    console.log('View user profile:', userId);
  };

  const renderFeedItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.feedItemContainer}>
      <FeedItem
        content={item.content}
        creator={item.creator}
        onLike={() => handleLike(item.content.id)}
        onComment={() => handleComment(item.content.id)}
        onShare={() => handleShare(item.content.id)}
        onUserPress={() => handleUserPress(item.creator.id)}
        onBookmark={() => handleBookmark(item.content.id)}
        isActive={index === currentIndex}
      />
    </View>
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
        <Text style={styles.headerTitle}>Discover</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton}>
            <Search size={20} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Filter size={20} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Feed Toggle */}
      <View style={styles.feedToggle}>
        <TouchableOpacity
          style={[styles.toggleButton, selectedFeed === 'ForYou' && styles.activeToggleButton]}
          onPress={() => setSelectedFeed('ForYou')}
        >
          <Text style={[styles.toggleText, selectedFeed === 'ForYou' && styles.activeToggleText]}>
            For You
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, selectedFeed === 'Following' && styles.activeToggleButton]}
          onPress={() => setSelectedFeed('Following')}
        >
          <Text style={[styles.toggleText, selectedFeed === 'Following' && styles.activeToggleText]}>
            Following
          </Text>
        </TouchableOpacity>
      </View>

      {/* Feed */}
      <FlatList
        data={mockFeedItems}
        renderItem={renderFeedItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        style={styles.feedList}
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
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
  feedToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeToggleButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  toggleText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  activeToggleText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  feedList: {
    flex: 1,
  },
  feedItemContainer: {
    height: height,
    backgroundColor: '#000000',
  },
  feedItem: {
    flex: 1,
    position: 'relative',
  },
  backgroundContainer: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentPlaceholder: {
    alignItems: 'center',
  },
  contentTypeLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  videoProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  videoProgressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  contentOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contentTypeBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  contentTypeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  moreButton: {
    padding: 5,
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
    marginBottom: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  creatorName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    flex: 1,
  },
  followButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  followText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  descriptionContainer: {
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  musicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginLeft: 8,
    flex: 1,
  },
  interactionButtons: {
    position: 'absolute',
    right: 20,
    bottom: 120,
    alignItems: 'center',
    gap: 20,
  },
  interactionButton: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  interactionCount: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  likedText: {
    color: '#FF3B30',
  },
  bookmarkedText: {
    color: '#FFD700',
  },
  loveAnimation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 1000,
  },
  loveEmoji: {
    fontSize: 80,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  commentsModal: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '70%',
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  commentsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  closeButton: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  commentsList: {
    flex: 1,
    padding: 20,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  commentInput: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  input: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareModal: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  shareTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  shareOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  shareOption: {
    alignItems: 'center',
  },
  shareIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  shareOptionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#334155',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
});

export default SocialFeed; 