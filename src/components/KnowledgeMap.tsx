import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Brain,
  Tag,
  Palette,
  Link,
  Eye,
  Heart,
  MessageCircle,
  Share,
  MoreVertical,
  Search,
  Filter,
  Grid,
  List,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react-native';
import { useStore } from '../store/useStore';
import { KnowledgeNode } from '../types';

const { width, height } = Dimensions.get('window');

interface KnowledgeMapProps {
  onNodePress?: (node: KnowledgeNode) => void;
}

const KnowledgeMap: React.FC<KnowledgeMapProps> = ({ onNodePress }) => {
  const {
    knowledgeNodes,
    selectedNode,
    addKnowledgeNode,
    updateKnowledgeNode,
    deleteKnowledgeNode,
    setSelectedNode,
    addExperience,
  } = useStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [editingNode, setEditingNode] = useState<KnowledgeNode | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [] as string[],
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [draggedNode, setDraggedNode] = useState<KnowledgeNode | null>(null);

  const categories = [
    { id: 'all', name: 'All', color: '#6B7280' },
    { id: 'science', name: 'Science', color: '#3B82F6' },
    { id: 'technology', name: 'Technology', color: '#8B5CF6' },
    { id: 'history', name: 'History', color: '#F59E0B' },
    { id: 'philosophy', name: 'Philosophy', color: '#10B981' },
    { id: 'literature', name: 'Literature', color: '#EF4444' },
    { id: 'arts', name: 'Arts', color: '#F97316' },
    { id: 'mathematics', name: 'Mathematics', color: '#06B6D4' },
    { id: 'health', name: 'Health', color: '#84CC16' },
    { id: 'business', name: 'Business', color: '#6366F1' },
    { id: 'personal', name: 'Personal', color: '#EC4899' },
  ];

  const colorOptions = [
    '#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444',
    '#F97316', '#06B6D4', '#84CC16', '#6366F1', '#EC4899',
  ];

  const filteredNodes = knowledgeNodes.filter(node => {
    const matchesSearch = node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         node.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         node.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || node.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddNode = () => {
    setEditingNode(null);
    setFormData({ title: '', content: '', tags: [] });
    setShowAddModal(true);
  };

  const handleEditNode = (node: KnowledgeNode) => {
    setEditingNode(node);
    setFormData({
      title: node.title,
      content: node.content,
      tags: node.tags,
    });
    setSelectedColor(node.color);
    setShowAddModal(true);
  };

  const handleDeleteNode = (node: KnowledgeNode) => {
    Alert.alert(
      'Delete Node',
      `Are you sure you want to delete "${node.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteKnowledgeNode(node.id);
            addExperience(-10);
            Alert.alert('Node Deleted', 'Knowledge node has been removed.');
          },
        },
      ]
    );
  };

  const handleSaveNode = () => {
    if (!editingNode) {
      // Create new node
      const newNode: KnowledgeNode = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        category: selectedCategory === 'all' ? 'personal' : selectedCategory,
        tags: formData.tags,
        color: selectedColor,
        position: { x: Math.random() * (width - 200), y: Math.random() * (height - 200), z: 0 },
        connections: [],
        creator: 'current-user',
        createdAt: new Date(),
        updatedAt: new Date(),
        media: [],
        isPublic: false,
        views: 0,
        likes: 0,
      };
      addKnowledgeNode(newNode);
      addExperience(20);
      Alert.alert('Node Created', 'New knowledge node has been added!');
    } else {
      // Update existing node
      updateKnowledgeNode(editingNode.id, {
        title: formData.title,
        content: formData.content,
        category: selectedCategory === 'all' ? editingNode.category : selectedCategory,
        color: selectedColor,
        tags: formData.tags,
        updatedAt: new Date(),
      });
      addExperience(10);
      Alert.alert('Node Updated', 'Knowledge node has been updated!');
    }
    setShowAddModal(false);
    setEditingNode(null);
    setFormData({ title: '', content: '', tags: [] });
  };

  const handleNodePress = (node: KnowledgeNode) => {
    setSelectedNode(node);
    setShowNodeModal(true);
    if (onNodePress) {
      onNodePress(node);
    }
  };

  const renderNode = (node: KnowledgeNode) => (
    <TouchableOpacity
      key={node.id}
      style={[
        styles.node,
        {
          backgroundColor: node.color,
          left: node.position.x,
          top: node.position.y,
        },
      ]}
      onPress={() => handleNodePress(node)}
      onLongPress={() => {
        Alert.alert(
          'Node Options',
          node.title,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Edit', onPress: () => handleEditNode(node) },
            { text: 'Delete', style: 'destructive', onPress: () => handleDeleteNode(node) },
          ]
        );
      }}
    >
      <View style={styles.nodeHeader}>
        <Text style={styles.nodeTitle} numberOfLines={2}>
          {node.title}
        </Text>
        <View style={styles.nodeStats}>
          <Eye size={12} color="#FFFFFF" />
          <Text style={styles.nodeStatText}>{node.views}</Text>
          <Heart size={12} color="#FFFFFF" />
          <Text style={styles.nodeStatText}>{node.likes}</Text>
        </View>
      </View>
      
      <Text style={styles.nodeContent} numberOfLines={3}>
        {node.content}
      </Text>
      
      <View style={styles.nodeFooter}>
        <View style={styles.nodeCategory}>
          <Text style={styles.nodeCategoryText}>
            {categories.find(cat => cat.id === node.category)?.name || 'Personal'}
          </Text>
        </View>
        
        {node.tags.length > 0 && (
          <View style={styles.nodeTags}>
            <Tag size={10} color="#FFFFFF" />
            <Text style={styles.nodeTagsText} numberOfLines={1}>
              {node.tags.slice(0, 2).join(', ')}
              {node.tags.length > 2 && '...'}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderAddModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <LinearGradient
          colors={['#0F172A', '#1E293B']}
          style={styles.modalBackground}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingNode ? 'Edit Knowledge Node' : 'Create Knowledge Node'}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAddModal(false)}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Title</Text>
              <TextInput
                style={styles.textInput}
                value={formData.title}
                onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                placeholder="Enter node title..."
                placeholderTextColor="#64748B"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Content</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.content}
                onChangeText={(text) => setFormData(prev => ({ ...prev, content: text }))}
                placeholder="Describe your knowledge..."
                placeholderTextColor="#64748B"
                multiline
                numberOfLines={6}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
                {categories.slice(1).map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.id && { backgroundColor: category.color + '20' }
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      selectedCategory === category.id && { color: category.color }
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Color</Text>
              <View style={styles.colorPicker}>
                {colorOptions.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColorOption
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: selectedColor }]}
              onPress={handleSaveNode}
            >
              <Save size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>
                {editingNode ? 'Update Node' : 'Create Node'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );

  const renderNodeModal = () => (
    <Modal
      visible={showNodeModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <LinearGradient
          colors={['#0F172A', '#1E293B']}
          style={styles.modalBackground}
        >
          {selectedNode && (
            <>
              <View style={styles.modalHeader}>
                <View style={[styles.nodeColorIndicator, { backgroundColor: selectedNode.color }]} />
                <Text style={styles.modalTitle}>{selectedNode.title}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowNodeModal(false)}
                >
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                <View style={styles.nodeDetailSection}>
                  <Text style={styles.nodeDetailContent}>{selectedNode.content}</Text>
                </View>

                <View style={styles.nodeDetailSection}>
                  <Text style={styles.nodeDetailLabel}>Category</Text>
                  <Text style={styles.nodeDetailValue}>
                    {categories.find(cat => cat.id === selectedNode.category)?.name || 'Personal'}
                  </Text>
                </View>

                {selectedNode.tags.length > 0 && (
                  <View style={styles.nodeDetailSection}>
                    <Text style={styles.nodeDetailLabel}>Tags</Text>
                    <View style={styles.tagsContainer}>
                      {selectedNode.tags.map((tag, index) => (
                        <View key={index} style={styles.tagChip}>
                          <Text style={styles.tagChipText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                <View style={styles.nodeDetailSection}>
                  <Text style={styles.nodeDetailLabel}>Stats</Text>
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Eye size={16} color="#64748B" />
                      <Text style={styles.statText}>{selectedNode.views} views</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Heart size={16} color="#64748B" />
                      <Text style={styles.statText}>{selectedNode.likes} likes</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Link size={16} color="#64748B" />
                      <Text style={styles.statText}>{selectedNode.connections.length} connections</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: selectedNode.color }]}
                    onPress={() => {
                      setShowNodeModal(false);
                      handleEditNode(selectedNode);
                    }}
                  >
                    <Edit size={16} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
                    onPress={() => {
                      setShowNodeModal(false);
                      handleDeleteNode(selectedNode);
                    }}
                  >
                    <Trash2 size={16} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </>
          )}
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Knowledge Web</Text>
            <Text style={styles.headerSubtitle}>
              {filteredNodes.length} nodes • {knowledgeNodes.length} total
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddNode}>
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search and Filters */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInput}>
            <Search size={20} color="#64748B" />
            <TextInput
              style={styles.searchTextInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search knowledge nodes..."
              placeholderTextColor="#64748B"
            />
          </View>
          
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && { backgroundColor: category.color + '20' }
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category.id && { color: category.color }
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* View Mode Toggle */}
        <View style={styles.viewModeContainer}>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'grid' && styles.activeViewModeButton]}
            onPress={() => setViewMode('grid')}
          >
            <Grid size={16} color={viewMode === 'grid' ? '#FFFFFF' : '#64748B'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'list' && styles.activeViewModeButton]}
            onPress={() => setViewMode('list')}
          >
            <List size={16} color={viewMode === 'list' ? '#FFFFFF' : '#64748B'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Knowledge Map */}
      <View style={styles.mapContainer}>
        {filteredNodes.length === 0 ? (
          <View style={styles.emptyState}>
            <Brain size={64} color="#64748B" strokeWidth={1} />
            <Text style={styles.emptyStateTitle}>No Knowledge Nodes</Text>
            <Text style={styles.emptyStateSubtitle}>
              {searchQuery || selectedCategory !== 'all' 
                ? 'No nodes match your search criteria'
                : 'Create your first knowledge node to start building your learning network'
              }
            </Text>
            {!searchQuery && selectedCategory === 'all' && (
              <TouchableOpacity style={styles.emptyStateButton} onPress={handleAddNode}>
                <Plus size={20} color="#FFFFFF" />
                <Text style={styles.emptyStateButtonText}>Create First Node</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <ScrollView 
            style={styles.nodesContainer}
            contentContainerStyle={styles.nodesContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredNodes.map(renderNode)}
          </ScrollView>
        )}
      </View>

      {renderAddModal()}
      {renderNodeModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.3)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchTextInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  filterButton: {
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    marginRight: 8,
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
  },
  viewModeContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    borderRadius: 8,
    padding: 4,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeViewModeButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  mapContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  nodesContainer: {
    flex: 1,
  },
  nodesContent: {
    padding: 20,
    minHeight: height - 200,
  },
  node: {
    position: 'absolute',
    width: 200,
    minHeight: 120,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  nodeTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  nodeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nodeStatText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginRight: 8,
  },
  nodeContent: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    lineHeight: 18,
    marginBottom: 12,
    opacity: 0.9,
  },
  nodeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nodeCategory: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  nodeCategoryText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  nodeTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    marginLeft: 8,
  },
  nodeTagsText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  modalContainer: {
    flex: 1,
  },
  modalBackground: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.3)',
  },
  nodeColorIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
    marginRight: 12,
  },
  modalTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#E2E8F0',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.5)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorOption: {
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 24,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  nodeDetailSection: {
    marginBottom: 24,
  },
  nodeDetailContent: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#E2E8F0',
    lineHeight: 24,
  },
  nodeDetailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nodeDetailValue: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
});

export default KnowledgeMap; 