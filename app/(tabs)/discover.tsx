import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal, TextInput, Alert, FlatList, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, X, Heart, MessageCircle, Share, Bookmark, Music, User, Plus, Play, Pause } from 'lucide-react-native';
import { useStore } from '../../src/store/useStore';

const { width, height } = Dimensions.get('window');

interface VideoPost {
  id: string;
  title: string;
  description: string;
  author: string;
  likes: number;
  comments: number;
  shares: number;
  bookmarks: number;
  music: string;
  isLiked: boolean;
  isBookmarked: boolean;
  videoUrl?: string;
  thumbnail?: string;
}

export default function DiscoverScreen() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const { addExperience } = useStore();

  // Mock video data
  const [videos, setVideos] = useState<VideoPost[]>([
    {
      id: '1',
      title: 'Amazing sunset view! 🌅',
      description: 'Beautiful sunset captured during my evening walk. Nature is truly incredible!',
      author: '@nature_lover',
      likes: 1247,
      comments: 89,
      shares: 45,
      bookmarks: 23,
      music: 'Sunset Vibes - Chill Music',
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: '2',
      title: 'Cooking tutorial 🍳',
      description: 'Quick and easy pasta recipe that takes only 15 minutes!',
      author: '@chef_mike',
      likes: 892,
      comments: 156,
      shares: 67,
      bookmarks: 34,
      music: 'Kitchen Beats - Cooking Music',
      isLiked: true,
      isBookmarked: false,
    },
  ]);

  const handleSaveVideo = () => {
    if (!videoTitle.trim()) {
      Alert.alert('Error', 'Please enter a video title.');
      return;
    }

    const newVideo: VideoPost = {
      id: Date.now().toString(),
      title: videoTitle,
      description: videoDescription,
      author: '@your_username',
      likes: 0,
      comments: 0,
      shares: 0,
      bookmarks: 0,
      music: 'Original Sound',
      isLiked: false,
      isBookmarked: false,
    };
    
    setVideos([newVideo, ...videos]);
    setVideoTitle('');
    setVideoDescription('');
    setShowVideoModal(false);
    addExperience(20);
    Alert.alert('Video Created', 'Your video has been created successfully!');
  };

  const toggleLike = (videoId: string) => {
    setVideos(videos.map(video => {
      if (video.id === videoId) {
        return {
          ...video,
          isLiked: !video.isLiked,
          likes: video.isLiked ? video.likes - 1 : video.likes + 1
        };
      }
      return video;
    }));
  };

  const toggleBookmark = (videoId: string) => {
    setVideos(videos.map(video => {
      if (video.id === videoId) {
        return {
          ...video,
          isBookmarked: !video.isBookmarked,
          bookmarks: video.isBookmarked ? video.bookmarks - 1 : video.bookmarks + 1
        };
      }
      return video;
    }));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderVideo = ({ item, index }: { item: VideoPost; index: number }) => (
    <View style={styles.videoContainer}>
      {/* Video Background */}
      <View style={styles.videoBackground}>
        <LinearGradient
          colors={['#000000', '#1a1a1a', '#000000']}
          style={styles.videoGradient}
        >
          <View style={styles.videoPlaceholder}>
            <Video size={64} color="#FFFFFF" opacity={0.3} />
            <Text style={styles.videoPlaceholderText}>Video Content</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Right Side Actions */}
      <View style={styles.rightActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(item.id)}>
          <Heart size={28} color={item.isLiked ? '#FF3B30' : '#FFFFFF'} fill={item.isLiked ? '#FF3B30' : 'none'} />
          <Text style={styles.actionText}>{formatNumber(item.likes)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={28} color="#FFFFFF" />
          <Text style={styles.actionText}>{formatNumber(item.comments)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Share size={28} color="#FFFFFF" />
          <Text style={styles.actionText}>{formatNumber(item.shares)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => toggleBookmark(item.id)}>
          <Bookmark size={28} color={item.isBookmarked ? '#FFD700' : '#FFFFFF'} fill={item.isBookmarked ? '#FFD700' : 'none'} />
          <Text style={styles.actionText}>{formatNumber(item.bookmarks)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Music size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Bottom Content */}
      <View style={styles.bottomContent}>
        <View style={styles.authorSection}>
          <View style={styles.authorAvatar}>
            <User size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.authorName}>{item.author}</Text>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.videoTitle}>{item.title}</Text>
        <Text style={styles.videoDescription}>{item.description}</Text>

        <View style={styles.musicSection}>
          <Music size={16} color="#FFFFFF" />
          <Text style={styles.musicText}>{item.music}</Text>
        </View>
      </View>

      {/* Play/Pause Button */}
      <TouchableOpacity 
        style={styles.playButton}
        onPress={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? <Pause size={32} color="#FFFFFF" /> : <Play size={32} color="#FFFFFF" />}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <TouchableOpacity style={styles.createButton} onPress={() => setShowVideoModal(true)}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={videos}
        renderItem={renderVideo}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.y / height);
          setCurrentVideoIndex(index);
        }}
      />

      {/* Video Creation Modal */}
      <Modal visible={showVideoModal} animationType="slide" transparent onRequestClose={() => setShowVideoModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.videoModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Video</Text>
              <TouchableOpacity onPress={() => setShowVideoModal(false)}>
                <X size={28} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <TextInput
                style={styles.videoInput}
                placeholder="Video title..."
                value={videoTitle}
                onChangeText={setVideoTitle}
                placeholderTextColor="#888"
              />
              <TextInput
                style={[styles.videoInput, styles.videoDescriptionInput]}
                placeholder="Video description (optional)..."
                value={videoDescription}
                onChangeText={setVideoDescription}
                multiline
                placeholderTextColor="#888"
              />

              <View style={styles.videoPreview}>
                <Video size={48} color="#FF3B30" />
                <Text style={styles.videoPreviewText}>Video recording feature coming soon</Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowVideoModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveVideo}>
                <Text style={styles.saveButtonText}>Create Video</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

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
  createButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    width: width,
    height: height,
    position: 'relative',
  },
  videoBackground: {
    flex: 1,
  },
  videoGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlaceholderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginTop: 16,
    opacity: 0.7,
  },
  rightActions: {
    position: 'absolute',
    right: 16,
    bottom: 120,
    alignItems: 'center',
    gap: 20,
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
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  authorName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    flex: 1,
  },
  followButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
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
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -16 }, { translateY: -16 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 32,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoModal: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  modalContent: {
    marginBottom: 16,
  },
  videoInput: {
    backgroundColor: '#334155',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  videoDescriptionInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  videoPreview: {
    backgroundColor: '#334155',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  videoPreviewText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 8,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#CCCCCC',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
}); 