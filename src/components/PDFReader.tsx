import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share,
  Bookmark,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileText,
  Plus,
  Trash2,
  Edit,
  Eye,
  Calendar,
} from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import Pdf from 'react-native-pdf';

const { width, height } = Dimensions.get('window');

interface PDFDocument {
  id: string;
  name: string;
  uri: string;
  size: number;
  createdAt: Date;
  lastOpened?: Date;
  bookmarks: number[];
  notes: { page: number; text: string; timestamp: Date }[];
}

interface PDFReaderProps {
  onClose?: () => void;
}

const PDFReader: React.FC<PDFReaderProps> = ({ onClose }) => {
  const [documents, setDocuments] = useState<PDFDocument[]>([]);
  const [currentDocument, setCurrentDocument] = useState<PDFDocument | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<{ page: number; text: string }[]>([]);
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [selectedPageForNote, setSelectedPageForNote] = useState(1);

  // Load documents from storage on component mount
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const documentsDir = `${FileSystem.documentDirectory}pdfs/`;
      const dirInfo = await FileSystem.getInfoAsync(documentsDir);
      
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(documentsDir, { intermediates: true });
        return;
      }

      const files = await FileSystem.readDirectoryAsync(documentsDir);
      const pdfFiles = files.filter(file => file.endsWith('.pdf'));
      
      const loadedDocuments: PDFDocument[] = [];
      
      for (const file of pdfFiles) {
        const fileInfo = await FileSystem.getInfoAsync(`${documentsDir}${file}`);
        if (fileInfo.exists) {
          loadedDocuments.push({
            id: file,
            name: file.replace('.pdf', ''),
            uri: fileInfo.uri,
            size: fileInfo.size || 0,
            createdAt: new Date(fileInfo.modificationTime || Date.now()),
            bookmarks: [],
            notes: [],
          });
        }
      }
      
      setDocuments(loadedDocuments);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      if (!asset) return;

      // Copy to app's document directory
      const documentsDir = `${FileSystem.documentDirectory}pdfs/`;
      const fileName = `${Date.now()}_${asset.name}`;
      const destinationUri = `${documentsDir}${fileName}`;

      await FileSystem.makeDirectoryAsync(documentsDir, { intermediates: true });
      await FileSystem.copyAsync({
        from: asset.uri,
        to: destinationUri,
      });

      const newDocument: PDFDocument = {
        id: fileName,
        name: asset.name.replace('.pdf', ''),
        uri: destinationUri,
        size: asset.size || 0,
        createdAt: new Date(),
        bookmarks: [],
        notes: [],
      };

      setDocuments(prev => [...prev, newDocument]);
      setCurrentDocument(newDocument);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to import PDF document');
    }
  };

  const openDocument = (document: PDFDocument) => {
    setCurrentDocument(document);
    setCurrentPage(1);
    setZoom(1);
    setRotation(0);
    setShowLibrary(false);
  };

  const closeDocument = () => {
    setCurrentDocument(null);
    setCurrentPage(1);
    setZoom(1);
    setRotation(0);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
    setShowNotes(false);
  };

  const navigatePage = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const toggleBookmark = () => {
    if (!currentDocument) return;

    const updatedDocument = { ...currentDocument };
    const pageIndex = updatedDocument.bookmarks.indexOf(currentPage);
    
    if (pageIndex > -1) {
      updatedDocument.bookmarks.splice(pageIndex, 1);
    } else {
      updatedDocument.bookmarks.push(currentPage);
    }

    setCurrentDocument(updatedDocument);
    setDocuments(prev => 
      prev.map(doc => doc.id === currentDocument.id ? updatedDocument : doc)
    );
  };

  const addNote = () => {
    if (!currentDocument || !noteText.trim()) return;

    const updatedDocument = { ...currentDocument };
    updatedDocument.notes.push({
      page: selectedPageForNote,
      text: noteText.trim(),
      timestamp: new Date(),
    });

    setCurrentDocument(updatedDocument);
    setDocuments(prev => 
      prev.map(doc => doc.id === currentDocument.id ? updatedDocument : doc)
    );
    setNoteText('');
    setShowNotes(false);
  };

  const deleteDocument = (document: PDFDocument) => {
    Alert.alert(
      'Delete Document',
      `Are you sure you want to delete "${document.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await FileSystem.deleteAsync(document.uri);
              setDocuments(prev => prev.filter(doc => doc.id !== document.id));
              if (currentDocument?.id === document.id) {
                closeDocument();
              }
            } catch (error) {
              console.error('Error deleting document:', error);
              Alert.alert('Error', 'Failed to delete document');
            }
          },
        },
      ]
    );
  };

  const shareDocument = async (document: PDFDocument) => {
    try {
      if (Platform.OS === 'web') {
        // For web, create a download link
        const link = window.document.createElement('a');
        link.href = document.uri;
        link.download = document.name;
        link.click();
      } else {
        await Sharing.shareAsync(document.uri);
      }
    } catch (error) {
      console.error('Error sharing document:', error);
      Alert.alert('Error', 'Failed to share document');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderDocumentLibrary = () => (
    <Modal
      visible={showLibrary}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <LinearGradient
          colors={['#0F172A', '#1E293B']}
          style={styles.modalBackground}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>PDF Library</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowLibrary(false)}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {documents.length === 0 ? (
              <View style={styles.emptyState}>
                <FileText size={64} color="#64748B" strokeWidth={1} />
                <Text style={styles.emptyStateTitle}>No PDF Documents</Text>
                <Text style={styles.emptyStateSubtitle}>
                  Import your first PDF document to start reading
                </Text>
                <TouchableOpacity
                  style={styles.emptyStateButton}
                  onPress={() => {
                    setShowLibrary(false);
                    setShowAddModal(true);
                  }}
                >
                  <Plus size={20} color="#FFFFFF" />
                  <Text style={styles.emptyStateButtonText}>Import PDF</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {documents.map((document) => (
                  <TouchableOpacity
                    key={document.id}
                    style={styles.documentItem}
                    onPress={() => openDocument(document)}
                    onLongPress={() => {
                      Alert.alert(
                        'Document Options',
                        document.name,
                        [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Share', onPress: () => shareDocument(document) },
                          { text: 'Delete', style: 'destructive', onPress: () => deleteDocument(document) },
                        ]
                      );
                    }}
                  >
                    <View style={styles.documentIcon}>
                      <FileText size={24} color="#3B82F6" />
                    </View>
                    <View style={styles.documentInfo}>
                      <Text style={styles.documentName} numberOfLines={2}>
                        {document.name}
                      </Text>
                      <View style={styles.documentMeta}>
                        <Text style={styles.documentMetaText}>
                          {formatFileSize(document.size)}
                        </Text>
                        <Text style={styles.documentMetaText}>
                          {formatDate(document.createdAt)}
                        </Text>
                      </View>
                      {document.bookmarks.length > 0 && (
                        <View style={styles.bookmarkIndicator}>
                          <Bookmark size={12} color="#F59E0B" />
                          <Text style={styles.bookmarkText}>
                            {document.bookmarks.length} bookmark{document.bookmarks.length !== 1 ? 's' : ''}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
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
            <Text style={styles.modalTitle}>Import PDF</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAddModal(false)}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.importButton}
              onPress={pickDocument}
            >
              <Plus size={24} color="#FFFFFF" />
              <Text style={styles.importButtonText}>Select PDF File</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );

  const renderNotesModal = () => (
    <Modal
      visible={showNotes}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <LinearGradient
          colors={['#0F172A', '#1E293B']}
          style={styles.modalBackground}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Note</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowNotes(false)}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.noteLabel}>Page {selectedPageForNote}</Text>
            <TextInput
              style={styles.noteInput}
              value={noteText}
              onChangeText={setNoteText}
              placeholder="Enter your note..."
              placeholderTextColor="#64748B"
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity
              style={styles.addNoteButton}
              onPress={addNote}
            >
              <Text style={styles.addNoteButtonText}>Add Note</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );

  if (!currentDocument) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F172A', '#1E293B']}
          style={styles.background}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <Text style={styles.title}>PDF Reader</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddModal(true)}
              >
                <Plus size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <TouchableOpacity
                style={styles.libraryButton}
                onPress={() => setShowLibrary(true)}
              >
                <FileText size={32} color="#3B82F6" />
                <Text style={styles.libraryButtonText}>Open PDF Library</Text>
                <Text style={styles.libraryButtonSubtext}>
                  {documents.length} document{documents.length !== 1 ? 's' : ''} available
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {renderDocumentLibrary()}
        {renderAddModal()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B']}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* PDF Viewer Header */}
          <View style={styles.pdfHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={closeDocument}
            >
              <ChevronLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.pdfInfo}>
              <Text style={styles.pdfTitle} numberOfLines={1}>
                {currentDocument.name}
              </Text>
              <Text style={styles.pdfSubtitle}>
                Page {currentPage} of {totalPages}
              </Text>
            </View>

            <View style={styles.pdfActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowSearch(!showSearch)}
              >
                <Search size={20} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowNotes(true)}
              >
                <Edit size={20} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={toggleBookmark}
              >
                <Bookmark 
                  size={20} 
                  color={currentDocument.bookmarks.includes(currentPage) ? '#F59E0B' : '#FFFFFF'} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          {showSearch && (
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search in document..."
                placeholderTextColor="#64748B"
              />
            </View>
          )}

          {/* PDF Viewer */}
          <View style={styles.pdfContainer}>
            {Platform.OS === 'web' ? (
              currentDocument?.uri ? (
                <View style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#64748B', marginBottom: 12 }}>PDF viewing is limited on web.</Text>
                  <iframe
                    src={currentDocument.uri}
                    style={{ width: '100%', height: '100%', border: 'none', borderRadius: 12 }}
                    title="PDF Viewer"
                  />
                </View>
              ) : (
                <Text style={{ color: '#64748B' }}>No PDF selected.</Text>
              )
            ) : (
              <Pdf
                source={{ uri: currentDocument.uri }}
                page={currentPage}
                scale={zoom}
                spacing={0}
                horizontal={false}
                fitPolicy={0}
                minScale={0.5}
                maxScale={3}
                enablePaging={false}
                enableAnnotationRendering={true}
                onLoadComplete={(numberOfPages) => setTotalPages(numberOfPages)}
                onPageChanged={(page) => setCurrentPage(page)}
                onError={(error) => Alert.alert('PDF Error', String(error) || 'Failed to load PDF')}
                style={{ flex: 1, width: '100%', height: '100%', transform: [{ rotate: `${rotation}deg` }] }}
                renderActivityIndicator={() => (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#64748B' }}>Loading PDF...</Text>
                  </View>
                )}
              />
            )}
          </View>

          {/* PDF Controls */}
          <View style={styles.pdfControls}>
            <View style={styles.navigationControls}>
              <TouchableOpacity
                style={[styles.navButton, currentPage === 1 && styles.navButtonDisabled]}
                onPress={() => navigatePage('prev')}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={24} color={currentPage === 1 ? '#64748B' : '#FFFFFF'} />
              </TouchableOpacity>

              <View style={styles.pageInfo}>
                <Text style={styles.pageInfoText}>
                  {currentPage} / {totalPages}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.navButton, currentPage === totalPages && styles.navButtonDisabled]}
                onPress={() => navigatePage('next')}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={24} color={currentPage === totalPages ? '#64748B' : '#FFFFFF'} />
              </TouchableOpacity>
            </View>

            <View style={styles.zoomControls}>
              <TouchableOpacity
                style={styles.zoomButton}
                onPress={() => setZoom(Math.max(0.5, zoom - 0.25))}
              >
                <ZoomOut size={20} color="#FFFFFF" />
              </TouchableOpacity>
              
              <Text style={styles.zoomText}>{Math.round(zoom * 100)}%</Text>
              
              <TouchableOpacity
                style={styles.zoomButton}
                onPress={() => setZoom(Math.min(3, zoom + 0.25))}
              >
                <ZoomIn size={20} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.zoomButton}
                onPress={() => setRotation((rotation + 90) % 360)}
              >
                <RotateCw size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {renderNotesModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  libraryButton: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderStyle: 'dashed',
  },
  libraryButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  libraryButtonSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  modalContainer: {
    flex: 1,
  },
  modalBackground: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.3)',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(51, 65, 85, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 20,
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
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(51, 65, 85, 0.3)',
    borderRadius: 12,
    marginBottom: 12,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  documentMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 4,
  },
  documentMetaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  bookmarkIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bookmarkText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#F59E0B',
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
  },
  importButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  pdfHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.3)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(51, 65, 85, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  pdfInfo: {
    flex: 1,
  },
  pdfTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  pdfSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  pdfActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(51, 65, 85, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.3)',
  },
  searchInput: {
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  pdfContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 12,
  },
  pdfPlaceholder: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#64748B',
    marginBottom: 8,
  },
  pdfPlaceholderSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  pdfControls: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.3)',
  },
  navigationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(51, 65, 85, 0.3)',
  },
  pageInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(51, 65, 85, 0.3)',
    borderRadius: 8,
  },
  pageInfoText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  zoomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  zoomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(51, 65, 85, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    minWidth: 40,
    textAlign: 'center',
  },
  noteLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  noteInput: {
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  addNoteButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  addNoteButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
});

export default PDFReader; 