import React, { useState, useRef, useEffect } from 'react';
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
}

const FeedItem: React.FC<FeedItemProps> = ({
  content,
  creator,
  onLike,
  onComment,
  onShare,
  onUserPress,
  onBookmark,
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
      // TODO: Add comment to content
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
            {/* Video Progress Bar */}
            <View style={styles.videoProgress}>
              <View style={[styles.videoProgressBar, { width: '45%' }]} />
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
            <Music size={16} color="#FFFFFF" strokeWidth={2} />
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
          <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
            <MessageCircle size={28} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.actionCount}>{content.comments?.length || 0}</Text>
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Share size={28} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.actionCount}>{content.shares}</Text>
          </TouchableOpacity>

          {/* Bookmark Button */}
          <TouchableOpacity style={styles.actionButton} onPress={handleBookmark}>
            <Bookmark 
              size={28} 
              color={isBookmarked ? '#FFD700' : '#FFFFFF'} 
              fill={isBookmarked ? '#FFD700' : 'none'}
              strokeWidth={2} 
            />
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

      {/* Comments Modal */}
      <Modal
        visible={showComments}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowComments(false)}
      >
        <View style={styles.commentsModal}>
          <View style={styles.commentsHeader}>
            <Text style={styles.commentsTitle}>Comments</Text>
            <TouchableOpacity onPress={() => setShowComments(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.commentsList}>
            {content.comments?.map((comment, index) => (
              <View key={index} style={styles.commentItem}>
                <View style={styles.commentAvatar}>
                  <User size={16} color="#FFFFFF" strokeWidth={2} />
                </View>
                <View style={styles.commentContent}>
                  <Text style={styles.commentAuthor}>User {index + 1}</Text>
                  <Text style={styles.commentText}>{comment.content}</Text>
                  <Text style={styles.commentTime}>
                    {new Date(comment.createdAt).toLocaleDateString()}
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
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={submitComment}>
              <Send size={20} color="#007AFF" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Share Menu Modal */}
      <Modal
        visible={showShareMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowShareMenu(false)}
      >
        <TouchableOpacity
          style={styles.shareModalOverlay}
          activeOpacity={1}
          onPress={() => setShowShareMenu(false)}
        >
          <View style={styles.shareModalContent}>
            <Text style={styles.shareModalTitle}>Share to</Text>
            <View style={styles.shareOptions}>
              <TouchableOpacity style={styles.shareOption}>
                <View style={styles.shareOptionIcon}>
                  <Copy size={24} color="#FFFFFF" strokeWidth={2} />
                </View>
                <Text style={styles.shareOptionText}>Copy Link</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareOption}>
                <View style={styles.shareOptionIcon}>
                  <ExternalLink size={24} color="#FFFFFF" strokeWidth={2} />
                </View>
                <Text style={styles.shareOptionText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareOption}>
                <View style={styles.shareOptionIcon}>
                  <Bookmark size={24} color="#FFFFFF" strokeWidth={2} />
                </View>
                <Text style={styles.shareOptionText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* More Menu Modal */}
      <Modal
        visible={showMoreMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMoreMenu(false)}
      >
        <TouchableOpacity
          style={styles.moreModalOverlay}
          activeOpacity={1}
          onPress={() => setShowMoreMenu(false)}
        >
          <View style={styles.moreModalContent}>
            <TouchableOpacity style={styles.moreOption}>
              <ThumbsUp size={20} color="#34C759" strokeWidth={2} />
              <Text style={styles.moreOptionText}>Like</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.moreOption}>
              <ThumbsDown size={20} color="#FF3B30" strokeWidth={2} />
              <Text style={styles.moreOptionText}>Dislike</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.moreOption}>
              <Flag size={20} color="#FF9500" strokeWidth={2} />
              <Text style={styles.moreOptionText}>Report</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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

  const onGestureEvent = (event: any) => {
    // Simple swipe detection without PanGestureHandler
    console.log('Gesture detected');
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
          <View key={item.id} style={[
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
              onBookmark={() => handleBookmark(item.content.id)}
            />
          </View>
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
  videoProgress: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
  },
  videoProgressBar: {
    height: '100%',
    backgroundColor: '#FF3B30',
    borderRadius: 1,
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
    gap: 8,
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
  // Comments Modal Styles
  commentsModal: {
    flex: 1,
    backgroundColor: '#1E293B',
    marginTop: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    fontSize: 24,
    color: '#FFFFFF',
  },
  commentsList: {
    flex: 1,
    padding: 20,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
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
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  input: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    marginRight: 12,
  },
  sendButton: {
    padding: 8,
  },
  // Share Menu Modal Styles
  shareModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  shareModalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  shareModalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  shareOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  shareOption: {
    alignItems: 'center',
  },
  shareOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  shareOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  // More Menu Modal Styles
  moreModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreModalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    minWidth: 200,
  },
  moreOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  moreOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
});

export default SocialFeed; 