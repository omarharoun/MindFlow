import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Upload, MessageCircle, FileText, X, Send } from 'lucide-react-native';
import { useStore } from '../../src/store/useStore';

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

export default function ReadScreen() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const { addExperience } = useStore();

  const handleUploadDocument = () => {
    // Placeholder for file upload functionality
    const newDocument: Document = {
      id: Date.now().toString(),
      name: 'Sample Document.pdf',
      type: 'pdf',
      uploadedAt: new Date(),
    };
    
    setDocuments([newDocument, ...documents]);
    setShowUploadModal(false);
    addExperience(10);
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
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Read & Analyze</Text>
          <Text style={styles.subtitle}>Upload documents and chat with AI</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
              {documents.map(doc => (
                <TouchableOpacity 
                  key={doc.id} 
                  style={styles.documentCard}
                  onPress={() => handleChatWithDocument(doc)}
                >
                  <View style={styles.documentInfo}>
                    <FileText size={24} color="#007AFF" />
                    <View style={styles.documentDetails}>
                      <Text style={styles.documentName}>{doc.name}</Text>
                      <Text style={styles.documentDate}>{formatDate(doc.uploadedAt)}</Text>
                    </View>
                  </View>
                  <MessageCircle size={20} color="#007AFF" />
                </TouchableOpacity>
              ))}
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

              <View style={styles.chatInput}>
                <TextInput
                  style={styles.input}
                  value={chatInput}
                  onChangeText={setChatInput}
                  placeholder="Ask about your document..."
                  placeholderTextColor="#888"
                  multiline
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                  <Send size={20} color="#fff" />
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  uploadCard: {
    backgroundColor: '#334155',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginTop: 16,
    marginBottom: 4,
  },
  uploadSubtext: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  documentCard: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  documentName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  documentDate: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadModal: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  chatModal: {
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
  uploadPreview: {
    alignItems: 'center',
    padding: 32,
  },
  uploadPreviewText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginTop: 16,
    marginBottom: 8,
  },
  uploadPreviewSubtext: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
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
  chatMessages: {
    maxHeight: 300,
    marginBottom: 16,
  },
  emptyChat: {
    alignItems: 'center',
    padding: 32,
  },
  emptyChatText: {
    color: '#CCCCCC',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginTop: 16,
    textAlign: 'center',
  },
  message: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#334155',
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  messageTime: {
    color: '#CCCCCC',
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#334155',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 