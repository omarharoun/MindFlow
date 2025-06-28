import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  FlatList,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  X,
  Pin,
  Calendar,
  Tag,
  Upload,
  MessageCircle,
  Send,
} from 'lucide-react-native';
import { useStore } from '../../src/store/useStore';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  media: any[];
  relatedNodes?: string[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
}

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'txt';
  uploadedAt: Date;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function NotesScreen() {
  const { notes, addNote, updateNote, deleteNote } = useStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'documents'>('notes');
  
  // Notes form states
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('General');
  const [noteTags, setNoteTags] = useState('');

  // Documents and chat states
  const [documents, setDocuments] = useState<Document[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // Real-time data
  const [realTimeNotes, setRealTimeNotes] = useState(notes);

  useEffect(() => {
    setRealTimeNotes(notes);
  }, [notes]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRealTimeNotes(notes);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const filteredNotes = realTimeNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || note.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const pinnedNotes = filteredNotes.filter(note => note.isPinned);
  const regularNotes = filteredNotes.filter(note => !note.isPinned);

  // Notes functions
  const handleCreateNote = () => {
    if (!noteTitle.trim()) {
      Alert.alert('Error', 'Please enter a title for your note.');
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title: noteTitle,
      content: noteContent,
      category: noteCategory,
      tags: noteTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      media: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
    };

    addNote(newNote);
    setNoteTitle('');
    setNoteContent('');
    setNoteCategory('General');
    setNoteTags('');
    setShowCreateModal(false);
    Alert.alert('Success', 'Note created successfully!');
  };

  const handleEditNote = () => {
    if (!selectedNote || !noteTitle.trim()) {
      Alert.alert('Error', 'Please enter a title for your note.');
      return;
    }

    const updatedNote = {
      ...selectedNote,
      title: noteTitle,
      content: noteContent,
      category: noteCategory,
      tags: noteTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      updatedAt: new Date(),
    };

    updateNote(selectedNote.id, updatedNote);
    setShowEditModal(false);
    setSelectedNote(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteCategory('General');
    setNoteTags('');
    Alert.alert('Success', 'Note updated successfully!');
  };

  const handleDeleteNote = (noteId: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteNote(noteId) },
      ]
    );
  };

  const handleTogglePin = (noteId: string) => {
    const note = realTimeNotes.find(n => n.id === noteId);
    if (note) {
      updateNote(noteId, { isPinned: !note.isPinned });
    }
  };

  const openEditModal = (note: Note) => {
    setSelectedNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteCategory(note.category);
    setNoteTags(note.tags.join(', '));
    setShowEditModal(true);
  };

  // Documents functions
  const handleUploadDocument = () => {
    const newDocument: Document = {
      id: Date.now().toString(),
      name: 'Sample Document.pdf',
      type: 'pdf',
      uploadedAt: new Date(),
    };
    
    setDocuments([newDocument, ...documents]);
    setShowUploadModal(false);
    Alert.alert('Document Uploaded', 'Your document has been uploaded successfully!');
  };

  const handleChatWithDocument = (document: Document) => {
    setSelectedDocument(document);
    setShowChatModal(true);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const newMessage: ChatMessage = {
      role: 'user',
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        role: 'assistant',
        content: `I've analyzed "${selectedDocument?.name}" and found relevant information about your question: "${chatInput}". This is a placeholder response - AI document analysis will be implemented later.`,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderNoteCard = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={styles.noteCard}
      onPress={() => openEditModal(item)}
      activeOpacity={0.8}
    >
      <View style={styles.noteHeader}>
        <View style={styles.noteTitleRow}>
          <FileText size={16} color="#007AFF" />
          <Text style={styles.noteTitle} numberOfLines={1}>
            {item.title}
          </Text>
          {item.isPinned && <Pin size={14} color="#FFD700" />}
        </View>
        <View style={styles.noteActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleTogglePin(item.id)}
          >
            <Pin size={16} color={item.isPinned ? "#FFD700" : "#666"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => openEditModal(item)}
          >
            <Edit3 size={16} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteNote(item.id)}
          >
            <Trash2 size={16} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.noteContent} numberOfLines={3}>
        {item.content}
      </Text>
      
      <View style={styles.noteFooter}>
        <View style={styles.noteMeta}>
          <Text style={styles.noteCategory}>{item.category}</Text>
          <Text style={styles.noteDate}>{formatDate(item.updatedAt)}</Text>
        </View>
        {item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Tag size={12} color="#007AFF" />
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {item.tags.length > 2 && (
              <Text style={styles.moreTags}>+{item.tags.length - 2}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderDocumentCard = ({ item }: { item: Document }) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.documentCard}
      onPress={() => handleChatWithDocument(item)}
    >
      <View style={styles.documentInfo}>
        <FileText size={24} color="#007AFF" />
        <View style={styles.documentDetails}>
          <Text style={styles.documentName}>{item.name}</Text>
          <Text style={styles.documentDate}>{formatDate(item.uploadedAt)}</Text>
        </View>
      </View>
      <MessageCircle size={20} color="#007AFF" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notes & Documents</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => {
              if (activeTab === 'notes') {
                setShowCreateModal(true);
              } else {
                setShowUploadModal(true);
              }
            }}
          >
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'notes' && styles.activeTab]}
            onPress={() => setActiveTab('notes')}
          >
            <FileText size={20} color={activeTab === 'notes' ? '#007AFF' : '#666'} />
            <Text style={[styles.tabText, activeTab === 'notes' && styles.activeTabText]}>
              Notes ({realTimeNotes.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'documents' && styles.activeTab]}
            onPress={() => setActiveTab('documents')}
          >
            <Upload size={20} color={activeTab === 'documents' ? '#007AFF' : '#666'} />
            <Text style={[styles.tabText, activeTab === 'documents' && styles.activeTabText]}>
              Documents ({documents.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder={activeTab === 'notes' ? "Search notes..." : "Search documents..."}
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'notes' ? (
          <FlatList
            data={[...pinnedNotes, ...regularNotes]}
            renderItem={renderNoteCard}
            keyExtractor={(item) => item.id}
            style={styles.notesList}
            contentContainerStyle={styles.notesContent}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={['#007AFF']}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <FileText size={48} color="#666" />
                <Text style={styles.emptyTitle}>No notes yet</Text>
                <Text style={styles.emptySubtitle}>
                  Create your first note to get started
                </Text>
                <TouchableOpacity
                  style={styles.emptyButton}
                  onPress={() => setShowCreateModal(true)}
                >
                  <Plus size={20} color="#FFFFFF" />
                  <Text style={styles.emptyButtonText}>Create Note</Text>
                </TouchableOpacity>
              </View>
            }
          />
        ) : (
          <ScrollView style={styles.documentsList} showsVerticalScrollIndicator={false}>
            {/* Upload Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Upload Documents</Text>
              <TouchableOpacity style={styles.uploadCard} onPress={() => setShowUploadModal(true)}>
                <Upload size={32} color="#007AFF" />
                <Text style={styles.uploadText}>Upload PDF or Document</Text>
                <Text style={styles.uploadSubtext}>Tap to select a file</Text>
              </TouchableOpacity>
            </View>

            {/* Documents List */}
            {documents.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Documents</Text>
                {documents.map(doc => renderDocumentCard({ item: doc }))}
              </View>
            )}

            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.quickActions}>
                <TouchableOpacity style={styles.actionCard} onPress={() => setShowUploadModal(true)}>
                  <Upload size={24} color="#34C759" />
                  <Text style={styles.actionText}>Upload New</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionCard} onPress={() => setShowChatModal(true)}>
                  <MessageCircle size={24} color="#AF52DE" />
                  <Text style={styles.actionText}>Chat with AI</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}

        {/* Create Note Modal */}
        <Modal
          visible={showCreateModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowCreateModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Note</Text>
                <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                <TextInput
                  style={styles.input}
                  placeholder="Note title..."
                  placeholderTextColor="#666"
                  value={noteTitle}
                  onChangeText={setNoteTitle}
                />
                <TextInput
                  style={[styles.input, styles.contentInput]}
                  placeholder="Write your note here..."
                  placeholderTextColor="#666"
                  value={noteContent}
                  onChangeText={setNoteContent}
                  multiline
                  textAlignVertical="top"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Category (e.g., Work, Personal, Ideas)"
                  placeholderTextColor="#666"
                  value={noteCategory}
                  onChangeText={setNoteCategory}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Tags (comma separated)"
                  placeholderTextColor="#666"
                  value={noteTags}
                  onChangeText={setNoteTags}
                />
              </View>
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowCreateModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleCreateNote}
                >
                  <Text style={styles.saveButtonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit Note Modal */}
        <Modal
          visible={showEditModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowEditModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Note</Text>
                <TouchableOpacity onPress={() => setShowEditModal(false)}>
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                <TextInput
                  style={styles.input}
                  placeholder="Note title..."
                  placeholderTextColor="#666"
                  value={noteTitle}
                  onChangeText={setNoteTitle}
                />
                <TextInput
                  style={[styles.input, styles.contentInput]}
                  placeholder="Write your note here..."
                  placeholderTextColor="#666"
                  value={noteContent}
                  onChangeText={setNoteContent}
                  multiline
                  textAlignVertical="top"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Category (e.g., Work, Personal, Ideas)"
                  placeholderTextColor="#666"
                  value={noteCategory}
                  onChangeText={setNoteCategory}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Tags (comma separated)"
                  placeholderTextColor="#666"
                  value={noteTags}
                  onChangeText={setNoteTags}
                />
              </View>
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowEditModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleEditNote}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Upload Modal */}
        <Modal visible={showUploadModal} animationType="slide" transparent onRequestClose={() => setShowUploadModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.uploadModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Upload Document</Text>
                <TouchableOpacity onPress={() => setShowUploadModal(false)}>
                  <X size={28} color="#fff" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.uploadPreview}>
                <Upload size={64} color="#007AFF" />
                <Text style={styles.uploadPreviewText}>File upload functionality coming soon</Text>
                <Text style={styles.uploadPreviewSubtext}>You'll be able to upload PDFs and other documents</Text>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setShowUploadModal(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleUploadDocument}>
                  <Text style={styles.saveButtonText}>Upload</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Chat Modal */}
        <Modal visible={showChatModal} animationType="slide" transparent onRequestClose={() => setShowChatModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.chatModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {selectedDocument ? `Chat about ${selectedDocument.name}` : 'Document Chat'}
                </Text>
                <TouchableOpacity onPress={() => setShowChatModal(false)}>
                  <X size={28} color="#fff" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.chatMessages}>
                {chatMessages.length === 0 ? (
                  <View style={styles.emptyChat}>
                    <MessageCircle size={48} color="#007AFF" />
                    <Text style={styles.emptyChatText}>Ask questions about your documents</Text>
                  </View>
                ) : (
                  chatMessages.map((message, index) => (
                    <View key={index} style={[
                      styles.message,
                      message.role === 'user' ? styles.userMessage : styles.aiMessage
                    ]}>
                      <Text style={styles.messageText}>{message.content}</Text>
                      <Text style={styles.messageTime}>
                        {formatDate(message.timestamp)}
                      </Text>
                    </View>
                  ))
                )}
              </ScrollView>

              <View style={styles.chatInputContainer}>
                <TextInput
                  style={styles.chatInput}
                  placeholder="Ask a question about your document..."
                  placeholderTextColor="#666"
                  value={chatInput}
                  onChangeText={setChatInput}
                  multiline
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                  <Send size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  createButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginLeft: 12,
  },
  filterButton: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 12,
  },
  notesList: {
    flex: 1,
  },
  notesContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  noteCard: {
    backgroundColor: '#334155',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  noteTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  noteTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    flex: 1,
  },
  noteActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  noteContent: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  noteCategory: {
    color: '#007AFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  noteDate: {
    color: '#888888',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    color: '#007AFF',
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
  moreTags: {
    color: '#888888',
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#CCCCCC',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  modalContent: {
    padding: 20,
  },
  input: {
    backgroundColor: '#334155',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
  },
  contentInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#334155',
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
    backgroundColor: '#007AFF',
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
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#334155',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  activeTabText: {
    color: '#007AFF',
  },
  documentsList: {
    flex: 1,
  },
  section: {
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
  },
  uploadCard: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginTop: 12,
  },
  uploadSubtext: {
    color: '#888888',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  documentCard: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  documentDetails: {
    flexDirection: 'column',
    marginLeft: 12,
  },
  documentName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  documentDate: {
    color: '#888888',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionCard: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  chatModal: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  chatMessages: {
    flex: 1,
    padding: 20,
  },
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChatText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginTop: 16,
  },
  message: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userMessage: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  aiMessage: {
    backgroundColor: 'rgba(175, 82, 222, 0.1)',
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  messageTime: {
    color: '#888888',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#334155',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
  },
  uploadModal: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    padding: 20,
  },
  uploadPreview: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  uploadPreviewText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginTop: 16,
    textAlign: 'center',
  },
  uploadPreviewSubtext: {
    color: '#888888',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 8,
    textAlign: 'center',
  },
}); 