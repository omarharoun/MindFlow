import React, { useState, useRef } from 'react';
import { StyleSheet, SafeAreaView, TouchableOpacity, Modal, TextInput, Alert, ScrollView, View, Text, Platform, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Award, X, Plus } from 'lucide-react-native';
import KnowledgeMap from '../../src/components/KnowledgeMap';
import { useStore } from '../../src/store/useStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

let BlurView: any = View;
if (Platform.OS !== 'web') {
  try {
    BlurView = require('expo-blur').BlurView;
  } catch (e) {
    BlurView = View;
  }
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export default function LearnScreen() {
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentOptions, setCurrentOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const { addExperience } = useStore();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [fabOpen, setFabOpen] = useState(false);
  const fabSize = Math.min(Math.round(width * 0.11), 56);
  const iconSize = Math.min(Math.round(width * 0.06), 28);
  const buttonGap = Math.round(width * 0.03);
  const bottomOffset = insets.bottom + 80;
  const rightOffset = insets.right + 24;
  const knowledgeMapRef = useRef<any>(null);

  const fabActions = [
    { icon: <Plus size={iconSize} color="#3B82F6" />, label: 'Add Node', onPress: () => setShowAddNodeModal(true) },
    { icon: <Award size={iconSize} color="#FFD700" />, label: 'Quiz', onPress: () => setShowQuizModal(true) },
  ];

  const handleAddQuestion = () => {
    if (!currentQuestion.trim() || !correctAnswer.trim()) {
      Alert.alert('Error', 'Please fill in the question and correct answer.');
      return;
    }

    const validOptions = currentOptions.filter(option => option.trim() !== '');
    if (validOptions.length < 2) {
      Alert.alert('Error', 'Please provide at least 2 options.');
      return;
    }

    const newQuestion: Question = {
      id: Date.now().toString(),
      question: currentQuestion,
      options: validOptions,
      correctAnswer: correctAnswer,
    };

    setQuestions([...questions, newQuestion]);
    setCurrentQuestion('');
    setCurrentOptions(['', '', '', '']);
    setCorrectAnswer('');
    Alert.alert('Question Added', 'Question added successfully!');
  };

  const handleSaveQuiz = () => {
    if (!quizTitle.trim()) {
      Alert.alert('Error', 'Please enter a quiz title.');
      return;
    }

    if (questions.length === 0) {
      Alert.alert('Error', 'Please add at least one question.');
      return;
    }

    // Here you would save the quiz to your store
    addExperience(20);
    setQuizTitle('');
    setQuizDescription('');
    setQuestions([]);
    setShowQuizModal(false);
    Alert.alert('Quiz Created', 'Your quiz has been created successfully!');
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...currentOptions];
    newOptions[index] = value;
    setCurrentOptions(newOptions);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
        style={styles.background}
      >
        <KnowledgeMap setShowQuizModal={setShowQuizModal} hideFab={true} showAddNodeModal={showAddNodeModal} setShowAddNodeModal={setShowAddNodeModal} />
        <View
          style={{
            position: 'absolute',
            bottom: bottomOffset,
            right: rightOffset,
            alignItems: 'flex-end',
            zIndex: 1000,
          }}
          pointerEvents="box-none"
        >
          {fabOpen && (
            <>
              {fabActions.map((action, i) => (
                <TouchableOpacity
                  key={action.label}
                  style={{
                    width: fabSize,
                    height: fabSize,
                    borderRadius: 1000,
                    position: 'absolute',
                    right: 0,
                    bottom: (fabSize + buttonGap) * (i + 1),
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 3,
                    elevation: 6,
                  }}
                  activeOpacity={0.8}
                  onPress={action.onPress}
                >
                  {action.icon}
                </TouchableOpacity>
              ))}
            </>
          )}
          <TouchableOpacity
            style={{
              width: fabSize,
              height: fabSize,
              borderRadius: 1000,
              backgroundColor: 'rgba(30, 41, 59, 0.7)',
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              right: 0,
              bottom: 0,
              zIndex: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 8,
              borderWidth: 3,
              borderColor: '#fff',
            }}
            onPress={() => setFabOpen(!fabOpen)}
            activeOpacity={0.8}
          >
            <BlurView intensity={40} tint="light" style={{ flex: 1, width: '100%', height: '100%', borderRadius: 1000, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {fabOpen ? <X size={iconSize + 4} color="#fff" /> : <Plus size={iconSize + 4} color="#fff" />}
            </BlurView>
          </TouchableOpacity>
        </View>
        <Modal visible={showQuizModal} animationType="slide" transparent onRequestClose={() => setShowQuizModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.quizModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Quiz</Text>
                <TouchableOpacity onPress={() => setShowQuizModal(false)}>
                  <X size={28} color="#fff" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalContent}>
                <TextInput
                  style={styles.quizInput}
                  placeholder="Quiz title..."
                  value={quizTitle}
                  onChangeText={setQuizTitle}
                  placeholderTextColor="#888"
                />
                <TextInput
                  style={[styles.quizInput, styles.quizDescriptionInput]}
                  placeholder="Quiz description (optional)..."
                  value={quizDescription}
                  onChangeText={setQuizDescription}
                  multiline
                  placeholderTextColor="#888"
                />

                <Text style={styles.sectionTitle}>Questions ({questions.length})</Text>
                
                {questions.map((q, index) => (
                  <View key={q.id} style={styles.questionCard}>
                    <Text style={styles.questionText}>Q{index + 1}: {q.question}</Text>
                    <Text style={styles.correctAnswer}>Correct: {q.correctAnswer}</Text>
                  </View>
                ))}

                <Text style={styles.sectionTitle}>Add New Question</Text>
                <TextInput
                  style={[styles.quizInput, styles.questionInput]}
                  placeholder="Enter your question..."
                  value={currentQuestion}
                  onChangeText={setCurrentQuestion}
                  multiline
                  placeholderTextColor="#888"
                />

                <Text style={styles.optionLabel}>Options:</Text>
                {currentOptions.map((option, index) => (
                  <TextInput
                    key={index}
                    style={styles.optionInput}
                    placeholder={`Option ${index + 1}...`}
                    value={option}
                    onChangeText={(value) => updateOption(index, value)}
                    placeholderTextColor="#888"
                  />
                ))}

                <TextInput
                  style={styles.quizInput}
                  placeholder="Correct answer..."
                  value={correctAnswer}
                  onChangeText={setCorrectAnswer}
                  placeholderTextColor="#888"
                />

                <TouchableOpacity style={styles.addQuestionButton} onPress={handleAddQuestion}>
                  <Text style={styles.addQuestionButtonText}>Add Question</Text>
                </TouchableOpacity>
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setShowQuizModal(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveQuiz}>
                  <Text style={styles.saveButtonText}>Create Quiz</Text>
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
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    borderRadius: 1000,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
  },
  fabBlur: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizModal: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '50%',
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
    maxHeight: 200,
  },
  quizInput: {
    backgroundColor: '#334155',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  quizDescriptionInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  questionInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  questionCard: {
    backgroundColor: '#334155',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  correctAnswer: {
    color: '#34C759',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  optionLabel: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  optionInput: {
    backgroundColor: '#334155',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  addQuestionButton: {
    backgroundColor: '#32D74B',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  addQuestionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
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
    backgroundColor: '#32D74B',
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