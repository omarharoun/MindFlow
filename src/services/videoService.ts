export interface VideoData {
  id: string;
  title: string;
  description: string;
  author: string;
  imageUrl: string;
  thumbnailUrl?: string;
  aspectRatio?: number;
  duration?: number;
  likes: number;
  comments: number;
  shares: number;
  bookmarks: number;
  music: string;
  tags: string[];
  category: 'science' | 'nature';
  isLiked?: boolean;
  isBookmarked?: boolean;
  createdAt: Date;
}

// 5 Real Science/Nature Images from Wikimedia Commons
const REAL_VIDEOS: VideoData[] = [
  {
    id: '1',
    title: 'Earth from Space',
    description: 'A beautiful image of the Earth from space.',
    author: '@wikimedia',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg',
    aspectRatio: 1, // 400x400
    duration: undefined,
    likes: 120,
    comments: 12,
    shares: 8,
    bookmarks: 5,
    music: 'Space Ambience',
    tags: ['earth', 'space', 'nature'],
    category: 'nature',
    createdAt: new Date('2024-06-01'),
  },
  {
    id: '2',
    title: 'Great Barrier Reef',
    description: 'A vibrant underwater scene from the Great Barrier Reef.',
    author: '@wikimedia',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Great_Barrier_Reef_-_Flickr_-_eutrophication_%26_hypoxia_%281%29.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Great_Barrier_Reef_-_Flickr_-_eutrophication_%26_hypoxia_%281%29.jpg',
    aspectRatio: 1.5, // 600x400
    duration: undefined,
    likes: 210,
    comments: 18,
    shares: 12,
    bookmarks: 8,
    music: 'Ocean Waves',
    tags: ['reef', 'ocean', 'nature', 'coral'],
    category: 'nature',
    createdAt: new Date('2024-06-02'),
  },
  {
    id: '3',
    title: 'Andromeda Galaxy',
    description: 'A breathtaking view of the Andromeda Galaxy.',
    author: '@wikimedia',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Andromeda_Galaxy_%28with_h-alpha%29.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Andromeda_Galaxy_%28with_h-alpha%29.jpg',
    aspectRatio: 1.5, // 600x400
    duration: undefined,
    likes: 175,
    comments: 14,
    shares: 9,
    bookmarks: 6,
    music: 'Galactic Echoes',
    tags: ['galaxy', 'space', 'andromeda', 'science'],
    category: 'science',
    createdAt: new Date('2024-06-03'),
  },
  {
    id: '4',
    title: 'Amazon Rainforest',
    description: 'A lush green canopy in the Amazon Rainforest.',
    author: '@wikimedia',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Amazon_Manaus_forest.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Amazon_Manaus_forest.jpg',
    aspectRatio: 1.5, // 600x400
    duration: undefined,
    likes: 160,
    comments: 11,
    shares: 7,
    bookmarks: 5,
    music: 'Rainforest Sounds',
    tags: ['amazon', 'rainforest', 'nature', 'forest'],
    category: 'nature',
    createdAt: new Date('2024-06-04'),
  },
  {
    id: '5',
    title: 'Microscopic Life',
    description: 'A colorful microscopic view of plankton in water.',
    author: '@wikimedia',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Plankton_collage.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Plankton_collage.jpg',
    aspectRatio: 1.33, // 400x300
    duration: undefined,
    likes: 130,
    comments: 8,
    shares: 5,
    bookmarks: 4,
    music: 'Microworld',
    tags: ['plankton', 'microscope', 'science', 'biology'],
    category: 'science',
    createdAt: new Date('2024-06-05'),
  },
];

class VideoService {
  private videos: VideoData[] = REAL_VIDEOS;

  // Get all videos
  getAllVideos(): VideoData[] {
    return [...this.videos];
  }

  // Get videos by category
  getVideosByCategory(category: VideoData['category']): VideoData[] {
    return this.videos.filter(video => video.category === category);
  }

  // Get videos by tag
  getVideosByTag(tag: string): VideoData[] {
    return this.videos.filter(video => 
      video.tags.some(videoTag => 
        videoTag.toLowerCase().includes(tag.toLowerCase())
      )
    );
  }

  // Get trending videos (most liked)
  getTrendingVideos(limit: number = 10): VideoData[] {
    return [...this.videos]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, limit);
  }

  // Get recent videos
  getRecentVideos(limit: number = 10): VideoData[] {
    return [...this.videos]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // Get video by ID
  getVideoById(id: string): VideoData | undefined {
    return this.videos.find(video => video.id === id);
  }

  // Search videos by title or description
  searchVideos(query: string): VideoData[] {
    const lowercaseQuery = query.toLowerCase();
    return this.videos.filter(video => 
      video.title.toLowerCase().includes(lowercaseQuery) ||
      video.description.toLowerCase().includes(lowercaseQuery) ||
      video.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Add a new video
  addVideo(video: Omit<VideoData, 'id' | 'createdAt'>): VideoData {
    const newVideo: VideoData = {
      ...video,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    this.videos.unshift(newVideo);
    return newVideo;
  }

  // Update video likes
  toggleLike(videoId: string): VideoData | null {
    const videoIndex = this.videos.findIndex(video => video.id === videoId);
    if (videoIndex === -1) return null;

    const video = this.videos[videoIndex];
    const updatedVideo = {
      ...video,
      isLiked: !video.isLiked,
      likes: video.isLiked ? video.likes - 1 : video.likes + 1,
    };

    this.videos[videoIndex] = updatedVideo;
    return updatedVideo;
  }

  // Update video bookmarks
  toggleBookmark(videoId: string): VideoData | null {
    const videoIndex = this.videos.findIndex(video => video.id === videoId);
    if (videoIndex === -1) return null;

    const video = this.videos[videoIndex];
    const updatedVideo = {
      ...video,
      isBookmarked: !video.isBookmarked,
      bookmarks: video.isBookmarked ? video.bookmarks - 1 : video.bookmarks + 1,
    };

    this.videos[videoIndex] = updatedVideo;
    return updatedVideo;
  }

  // Get video statistics
  getVideoStats() {
    const totalVideos = this.videos.length;
    const totalLikes = this.videos.reduce((sum, video) => sum + video.likes, 0);
    const totalComments = this.videos.reduce((sum, video) => sum + video.comments, 0);
    const totalShares = this.videos.reduce((sum, video) => sum + video.shares, 0);
    const totalBookmarks = this.videos.reduce((sum, video) => sum + video.bookmarks, 0);

    const categoryStats = this.videos.reduce((stats, video) => {
      stats[video.category] = (stats[video.category] || 0) + 1;
      return stats;
    }, {} as Record<string, number>);

    return {
      totalVideos,
      totalLikes,
      totalComments,
      totalShares,
      totalBookmarks,
      categoryStats,
    };
  }

  // Get recommended videos based on a video
  getRecommendedVideos(videoId: string, limit: number = 5): VideoData[] {
    const currentVideo = this.getVideoById(videoId);
    if (!currentVideo) return [];

    // Find videos with similar tags or category
    const recommendations = this.videos
      .filter(video => video.id !== videoId)
      .map(video => {
        const tagSimilarity = video.tags.filter(tag => 
          currentVideo.tags.includes(tag)
        ).length;
        const categoryMatch = video.category === currentVideo.category ? 2 : 0;
        const score = tagSimilarity + categoryMatch;
        
        return { video, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.video);

    return recommendations;
  }
}

export const videoService = new VideoService();
export default videoService; 