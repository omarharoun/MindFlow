import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
  const [viewMode, setViewMode] = useState<'map' | 'grid' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [draggedNode, setDraggedNode] = useState<KnowledgeNode | null>(null);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [isLayoutCalculating, setIsLayoutCalculating] = useState(false);
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });

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

  const filteredNodes = useMemo(() => {
    return knowledgeNodes.filter(node => {
      const matchesSearch = node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           node.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           node.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || node.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [knowledgeNodes, searchQuery, selectedCategory]);

  // Force-directed layout algorithm
  const calculateOptimalLayout = useCallback(() => {
    if (filteredNodes.length === 0 || mapDimensions.width === 0) return;

    setIsLayoutCalculating(true);
    
    const nodeRadius = 120; // Minimum distance between node centers
    const repulsionForce = 200; // Force pushing nodes apart
    const attractionForce = 50; // Force pulling connected nodes together
    const damping = 0.8; // Reduces velocity over time
    const maxIterations = 100;
    
    // Initialize positions if not set
    const positions: Record<string, { x: number; y: number; vx: number; vy: number }> = {};
    filteredNodes.forEach((node, index) => {
      const currentPos = nodePositions[node.id];
      if (!currentPos) {
        // Distribute nodes in a circle initially
        const angle = (index / filteredNodes.length) * 2 * Math.PI;
        const radius = Math.min(mapDimensions.width, mapDimensions.height) * 0.3;
        positions[node.id] = {
          x: mapDimensions.width / 2 + Math.cos(angle) * radius,
          y: mapDimensions.height / 2 + Math.sin(angle) * radius,
          vx: 0,
          vy: 0
        };
      } else {
        positions[node.id] = {
          ...currentPos,
          vx: 0,
          vy: 0
        };
      }
    });

    // Force simulation
    for (let iteration = 0; iteration < maxIterations; iteration++) {
      // Apply repulsion forces between all nodes
      for (let i = 0; i < filteredNodes.length; i++) {
        for (let j = i + 1; j < filteredNodes.length; j++) {
          const nodeA = filteredNodes[i];
          const nodeB = filteredNodes[j];
          const posA = positions[nodeA.id];
          const posB = positions[nodeB.id];
          
          const dx = posB.x - posA.x;
          const dy = posB.y - posA.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0 && distance < repulsionForce) {
            const force = (repulsionForce - distance) / distance;
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            
            posA.vx -= fx;
            posA.vy -= fy;
            posB.vx += fx;
            posB.vy += fy;
          }
        }
      }

      // Apply attraction forces for connected nodes
      filteredNodes.forEach(node => {
        node.connections?.forEach(connectionId => {
          const connectedNode = filteredNodes.find(n => n.id === connectionId);
          if (connectedNode) {
            const posA = positions[node.id];
            const posB = positions[connectedNode.id];
            
            const dx = posB.x - posA.x;
            const dy = posB.y - posA.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
              const force = (distance - nodeRadius) * attractionForce / distance;
              const fx = (dx / distance) * force;
              const fy = (dy / distance) * force;
              
              posA.vx += fx;
              posA.vy += fy;
              posB.vx -= fx;
              posB.vy -= fy;
            }
          }
        });
      });

      // Update positions and apply damping
      Object.values(positions).forEach(pos => {
        pos.x += pos.vx;
        pos.y += pos.vy;
        pos.vx *= damping;
        pos.vy *= damping;
        
        // Keep nodes within bounds
        pos.x = Math.max(nodeRadius, Math.min(mapDimensions.width - nodeRadius, pos.x));
        pos.y = Math.max(nodeRadius, Math.min(mapDimensions.height - nodeRadius, pos.y));
      });
    }

    // Extract final positions
    const finalPositions: Record<string, { x: number; y: number }> = {};
    Object.keys(positions).forEach(nodeId => {
      finalPositions[nodeId] = {
        x: positions[nodeId].x,
        y: positions[nodeId].y
      };
    });

    setNodePositions(finalPositions);
    setIsLayoutCalculating(false);
  }, [filteredNodes.length, mapDimensions.width, mapDimensions.height]);

  // Calculate layout when nodes or map dimensions change
  useEffect(() => {
    if (viewMode === 'map' && filteredNodes.length > 0 && mapDimensions.width > 0) {
      // Use setTimeout to avoid immediate re-render
      const timer = setTimeout(() => {
        calculateOptimalLayout();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [viewMode, filteredNodes.length, mapDimensions.width, mapDimensions.height, calculateOptimalLayout]);

  // Handle map container layout
  const handleMapLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setMapDimensions({ width, height });
  };

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
      
      // Initialize position for the new node
      const newPosition = {
        x: Math.random() * (mapDimensions.width - 200) + 100,
        y: Math.random() * (mapDimensions.height - 200) + 100,
      };
      setNodePositions(prev => ({
        ...prev,
        [newNode.id]: newPosition
      }));
      
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

  const renderNode = (node: KnowledgeNode, index?: number) => {
    if (viewMode === 'map') {
      const position = nodePositions[node.id] || { x: 0, y: 0 };
      
      return (
        <TouchableOpacity
          key={node.id}
          style={[
            styles.mapNode,
            {
              backgroundColor: node.color,
              left: position.x - 100, // Center the node on its position
              top: position.y - 60,
              opacity: isLayoutCalculating ? 0.7 : 1,
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
                { text: 'Auto Layout', onPress: () => calculateOptimalLayout() },
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
    } else if (viewMode === 'list') {
      return (
        <TouchableOpacity
          key={node.id}
          style={styles.listNode}
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
          <View style={[styles.listNodeColor, { backgroundColor: node.color }]} />
          <View style={styles.listNodeContent}>
            <View style={styles.listNodeHeader}>
              <Text style={styles.listNodeTitle} numberOfLines={1}>
                {node.title}
              </Text>
              <View style={styles.listNodeStats}>
                <Eye size={14} color="#64748B" />
                <Text style={styles.listNodeStatText}>{node.views}</Text>
                <Heart size={14} color="#64748B" />
                <Text style={styles.listNodeStatText}>{node.likes}</Text>
              </View>
            </View>
            
            <Text style={styles.listNodeDescription} numberOfLines={2}>
              {node.content}
            </Text>
            
            <View style={styles.listNodeFooter}>
              <View style={styles.listNodeCategory}>
                <Text style={styles.listNodeCategoryText}>
                  {categories.find(cat => cat.id === node.category)?.name || 'Personal'}
                </Text>
              </View>
              
              {node.tags.length > 0 && (
                <View style={styles.listNodeTags}>
                  <Tag size={12} color="#64748B" />
                  <Text style={styles.listNodeTagsText} numberOfLines={1}>
                    {node.tags.slice(0, 3).join(', ')}
                    {node.tags.length > 3 && '...'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      // Grid view
      return (
        <TouchableOpacity
          key={node.id}
          style={styles.gridNode}
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
          <View style={[styles.gridNodeHeader, { backgroundColor: node.color }]}>
            <Text style={styles.gridNodeTitle} numberOfLines={2}>
              {node.title}
            </Text>
            <View style={styles.gridNodeStats}>
              <Eye size={12} color="#FFFFFF" />
              <Text style={styles.gridNodeStatText}>{node.views}</Text>
              <Heart size={12} color="#FFFFFF" />
              <Text style={styles.gridNodeStatText}>{node.likes}</Text>
            </View>
          </View>
          
          <View style={styles.gridNodeBody}>
            <Text style={styles.gridNodeContent} numberOfLines={3}>
              {node.content}
            </Text>
            
            <View style={styles.gridNodeFooter}>
              <View style={styles.gridNodeCategory}>
                <Text style={styles.gridNodeCategoryText}>
                  {categories.find(cat => cat.id === node.category)?.name || 'Personal'}
                </Text>
              </View>
              
              {node.tags.length > 0 && (
                <View style={styles.gridNodeTags}>
                  <Tag size={10} color="#64748B" />
                  <Text style={styles.gridNodeTagsText} numberOfLines={1}>
                    {node.tags.slice(0, 2).join(', ')}
                    {node.tags.length > 2 && '...'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

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
            style={[styles.viewModeButton, viewMode === 'map' && styles.activeViewModeButton]}
            onPress={() => setViewMode('map')}
          >
            <RotateCcw size={16} color={viewMode === 'map' ? '#FFFFFF' : '#64748B'} />
          </TouchableOpacity>
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
        
        {/* Auto Layout Button for Map View */}
        {viewMode === 'map' && (
          <TouchableOpacity
            style={styles.autoLayoutButton}
            onPress={calculateOptimalLayout}
            disabled={isLayoutCalculating}
          >
            <RotateCcw size={16} color="#FFFFFF" />
            <Text style={styles.autoLayoutButtonText}>
              {isLayoutCalculating ? 'Calculating...' : 'Auto Layout'}
            </Text>
          </TouchableOpacity>
        )}
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
        ) : viewMode === 'map' ? (
          // Map view - free-form positioning with force-directed layout
          <View 
            style={styles.mapViewContainer}
            onLayout={handleMapLayout}
          >
            {/* Connection lines between connected nodes */}
            {filteredNodes.map(node => 
              node.connections?.map(connectionId => {
                const connectedNode = filteredNodes.find(n => n.id === connectionId);
                if (!connectedNode) return null;
                
                const pos1 = nodePositions[node.id];
                const pos2 = nodePositions[connectedNode.id];
                
                if (!pos1 || !pos2) return null;
                
                return (
                  <View
                    key={`${node.id}-${connectionId}`}
                    style={[
                      styles.connectionLine,
                      {
                        left: pos1.x,
                        top: pos1.y,
                        width: Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2)),
                        transform: [
                          {
                            rotate: `${Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x)}rad`
                          }
                        ]
                      }
                    ]}
                  />
                );
              })
            )}
            
            {/* Nodes */}
            {filteredNodes.map(renderNode)}
            
            {/* Layout indicator */}
            {isLayoutCalculating && (
              <View style={styles.layoutIndicator}>
                <Text style={styles.layoutIndicatorText}>Calculating optimal layout...</Text>
              </View>
            )}
          </View>
        ) : viewMode === 'list' ? (
          // List view - vertical list
          <ScrollView 
            style={styles.listContainer}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredNodes.map((node, index) => renderNode(node, index))}
          </ScrollView>
        ) : (
          // Grid view - organized grid layout
          <ScrollView 
            style={styles.gridContainer}
            contentContainerStyle={styles.gridContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.gridLayout}>
              {filteredNodes.map((node, index) => (
                <View key={node.id} style={styles.gridItem}>
                  {renderNode(node, index)}
                </View>
              ))}
            </View>
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
  mapViewContainer: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    minHeight: height - 200,
  },
  gridContainer: {
    flex: 1,
  },
  gridContent: {
    padding: 20,
    minHeight: height - 200,
  },
  gridLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  gridItem: {
    flex: 1,
    maxWidth: width / 2 - 20,
  },
  mapNode: {
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
  gridNode: {
    backgroundColor: 'rgba(51, 65, 85, 0.3)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 200,
  },
  gridNodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
  },
  gridNodeTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  gridNodeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gridNodeStatText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginRight: 8,
  },
  gridNodeBody: {
    flex: 1,
  },
  gridNodeContent: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    lineHeight: 18,
    marginBottom: 12,
    opacity: 0.9,
  },
  gridNodeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridNodeCategory: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gridNodeCategoryText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  gridNodeTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    marginLeft: 8,
  },
  gridNodeTagsText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  listNode: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(51, 65, 85, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.3)',
    borderRadius: 12,
    marginBottom: 12,
  },
  listNodeColor: {
    width: 4,
    height: '100%',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    marginRight: 16,
  },
  listNodeContent: {
    flex: 1,
  },
  listNodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listNodeTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  listNodeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  listNodeStatText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginRight: 8,
  },
  listNodeDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#E2E8F0',
    lineHeight: 18,
    marginBottom: 12,
    opacity: 0.9,
  },
  listNodeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listNodeCategory: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  listNodeCategoryText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  listNodeTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    marginLeft: 8,
  },
  listNodeTagsText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    opacity: 0.8,
  },
  connectionLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
    transformOrigin: 'left center',
  },
  layoutIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -20 }],
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  layoutIndicatorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  autoLayoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    marginLeft: 12,
  },
  autoLayoutButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
});

export default KnowledgeMap; 