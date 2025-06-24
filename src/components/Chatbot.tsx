import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { MessageCircle, X, Send } from 'lucide-react-native';
import { useStore } from '../store/useStore';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { openAIApiKey } = useStore();
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!input.trim() || !openAIApiKey) return;
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant for learning and productivity.' },
            ...newMessages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
          ],
          max_tokens: 200,
        }),
      });
      const data = await response.json();
      if (data.choices && data.choices[0]?.message?.content) {
        setMessages([...newMessages, { role: 'assistant', content: data.choices[0].message.content.trim() }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I could not generate a response.' }]);
      }
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: 'Error contacting OpenAI.' }]);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.fab} onPress={() => setVisible(true)}>
        <MessageCircle size={32} color="#fff" />
      </TouchableOpacity>
      <Modal visible={visible} animationType="slide" transparent onRequestClose={() => setVisible(false)}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.headerText}>AI Chatbot</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <X size={28} color="#fff" />
              </TouchableOpacity>
            </View>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <View style={[styles.message, item.role === 'user' ? styles.userMsg : styles.assistantMsg]}>
                  <Text style={styles.messageText}>{item.content}</Text>
                </View>
              )}
              contentContainerStyle={{ padding: 12 }}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Type your message..."
                placeholderTextColor="#888"
                editable={!loading}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
              />
              <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} disabled={loading || !input.trim()}>
                {loading ? <ActivityIndicator color="#fff" /> : <Send size={24} color="#fff" />}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    backgroundColor: '#007AFF',
    borderRadius: 32,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    zIndex: 1000,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: '50%',
    maxHeight: '90%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Inter-Bold',
  },
  message: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  userMsg: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  assistantMsg: {
    alignSelf: 'flex-start',
    backgroundColor: '#334155',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#334155',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Chatbot; 