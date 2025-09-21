'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Plus,
  Trash2,
  Edit3,
  Save,
  Eye,
  Copy,
  Move,
  CheckCircle,
  Circle,
  Square,
  Type,
  ToggleLeft,
  Star,
  ArrowUp,
  ArrowDown,
  Settings,
  X
} from 'lucide-react';

interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'fill_blank' | 'matching' | 'rating';
  title: string;
  content: string;
  options?: QuestionOption[];
  correctAnswer?: string;
  points: number;
  timeLimit?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  explanation?: string;
  required: boolean;
}

interface Assessment {
  id?: string;
  title: string;
  description: string;
  instructions: string;
  questions: Question[];
  timeLimit?: number;
  passingScore: number;
  allowRetakes: boolean;
  showResults: boolean;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AssessmentBuilderProps {
  assessment?: Assessment;
  onSave?: (assessment: Assessment) => void;
  onPreview?: (assessment: Assessment) => void;
  className?: string;
}

const AssessmentBuilder: React.FC<AssessmentBuilderProps> = ({
  assessment,
  onSave,
  onPreview,
  className = ''
}) => {
  const [currentAssessment, setCurrentAssessment] = useState<Assessment>(
    assessment || {
      title: '',
      description: '',
      instructions: '',
      questions: [],
      passingScore: 70,
      allowRetakes: true,
      showResults: true,
      randomizeQuestions: false,
      randomizeOptions: false
    }
  );

  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const questionTypes: Array<{ type: Question['type']; label: string; icon: any }> = [
    { type: 'multiple_choice', label: 'Multiple Choice', icon: Circle },
    { type: 'true_false', label: 'True/False', icon: ToggleLeft },
    { type: 'short_answer', label: 'Short Answer', icon: Type },
    { type: 'essay', label: 'Essay', icon: Edit3 },
    { type: 'fill_blank', label: 'Fill in the Blank', icon: Square },
    { type: 'rating', label: 'Rating Scale', icon: Star }
  ];

  const addQuestion = useCallback((type: Question['type']) => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type,
      title: `Question ${currentAssessment.questions.length + 1}`,
      content: '',
      points: 1,
      difficulty: 'medium',
      tags: [],
      required: true,
      options: type === 'multiple_choice' || type === 'true_false' ? [
        { id: 'opt_1', text: '', isCorrect: false },
        { id: 'opt_2', text: '', isCorrect: false }
      ] : undefined
    };

    setCurrentAssessment(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    setActiveQuestion(newQuestion.id);
  }, [currentAssessment.questions.length]);

  const updateQuestion = useCallback((questionId: string, updates: Partial<Question>) => {
    setCurrentAssessment(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
  }, []);

  const deleteQuestion = useCallback((questionId: string) => {
    setCurrentAssessment(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
    if (activeQuestion === questionId) {
      setActiveQuestion(null);
    }
  }, [activeQuestion]);

  const moveQuestion = useCallback((questionId: string, direction: 'up' | 'down') => {
    setCurrentAssessment(prev => {
      const questions = [...prev.questions];
      const index = questions.findIndex(q => q.id === questionId);
      
      if (direction === 'up' && index > 0) {
        [questions[index], questions[index - 1]] = [questions[index - 1], questions[index]];
      } else if (direction === 'down' && index < questions.length - 1) {
        [questions[index], questions[index + 1]] = [questions[index + 1], questions[index]];
      }
      
      return { ...prev, questions };
    });
  }, []);

  const duplicateQuestion = useCallback((questionId: string) => {
    const question = currentAssessment.questions.find(q => q.id === questionId);
    if (question) {
      const duplicated: Question = {
        ...question,
        id: `q_${Date.now()}`,
        title: `${question.title} (Copy)`
      };
      
      setCurrentAssessment(prev => ({
        ...prev,
        questions: [...prev.questions, duplicated]
      }));
    }
  }, [currentAssessment.questions]);

  const addOption = useCallback((questionId: string) => {
    const question = currentAssessment.questions.find(q => q.id === questionId);
    if (question && question.options) {
      const newOption: QuestionOption = {
        id: `opt_${Date.now()}`,
        text: '',
        isCorrect: false
      };
      
      updateQuestion(questionId, {
        options: [...question.options, newOption]
      });
    }
  }, [currentAssessment.questions, updateQuestion]);

  const updateOption = useCallback((questionId: string, optionId: string, updates: Partial<QuestionOption>) => {
    const question = currentAssessment.questions.find(q => q.id === questionId);
    if (question && question.options) {
      const updatedOptions = question.options.map(opt =>
        opt.id === optionId ? { ...opt, ...updates } : opt
      );
      
      updateQuestion(questionId, { options: updatedOptions });
    }
  }, [currentAssessment.questions, updateQuestion]);

  const deleteOption = useCallback((questionId: string, optionId: string) => {
    const question = currentAssessment.questions.find(q => q.id === questionId);
    if (question && question.options && question.options.length > 2) {
      const updatedOptions = question.options.filter(opt => opt.id !== optionId);
      updateQuestion(questionId, { options: updatedOptions });
    }
  }, [currentAssessment.questions, updateQuestion]);

  const handleSave = useCallback(() => {
    onSave?.(currentAssessment);
  }, [currentAssessment, onSave]);

  const handlePreview = useCallback(() => {
    onPreview?.(currentAssessment);
  }, [currentAssessment, onPreview]);

  const renderQuestionEditor = (question: Question) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Question Header */}
        <div className="space-y-3">
          <input
            type="text"
            value={question.title}
            onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
            placeholder="Question title..."
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
          />
          
          <textarea
            value={question.content}
            onChange={(e) => updateQuestion(question.id, { content: e.target.value })}
            placeholder="Enter your question here..."
            rows={3}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
          />
        </div>

        {/* Question Options */}
        {(question.type === 'multiple_choice' || question.type === 'true_false') && question.options && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white">Answer Options</h4>
              {question.type === 'multiple_choice' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addOption(question.id)}
                  className="text-gray-300 hover:text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Option
                </Button>
              )}
            </div>
            
            {question.options.map((option, index) => (
              <div key={option.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <button
                  onClick={() => updateOption(question.id, option.id, { isCorrect: !option.isCorrect })}
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    option.isCorrect 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-400 hover:border-gray-300'
                  }`}
                >
                  {option.isCorrect && <CheckCircle className="w-3 h-3 text-white" />}
                </button>
                
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => updateOption(question.id, option.id, { text: e.target.value })}
                  placeholder={`Option ${index + 1}...`}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
                
                {question.type === 'multiple_choice' && question.options!.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteOption(question.id, option.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Short Answer / Essay */}
        {(question.type === 'short_answer' || question.type === 'essay') && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Sample Answer (Optional)</label>
            <textarea
              value={question.correctAnswer || ''}
              onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
              placeholder="Provide a sample answer or key points..."
              rows={question.type === 'essay' ? 4 : 2}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
            />
          </div>
        )}

        {/* Question Settings */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-800 rounded-lg">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Points</label>
            <input
              type="number"
              value={question.points}
              onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) || 1 })}
              min="1"
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Difficulty</label>
            <select
              value={question.difficulty}
              onChange={(e) => updateQuestion(question.id, { difficulty: e.target.value as Question['difficulty'] })}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-400"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Time Limit (min)</label>
            <input
              type="number"
              value={question.timeLimit || ''}
              onChange={(e) => updateQuestion(question.id, { timeLimit: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="No limit"
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center gap-2 text-xs text-gray-400">
              <input
                type="checkbox"
                checked={question.required}
                onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                className="rounded"
              />
              Required
            </label>
          </div>
        </div>

        {/* Explanation */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Explanation (Optional)</label>
          <textarea
            value={question.explanation || ''}
            onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
            placeholder="Provide an explanation for the correct answer..."
            rows={2}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
          />
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Assessment Header */}
      <Card className="glass-card border-gray-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Assessment Builder</CardTitle>
              <CardDescription>
                Create and customize your assessment with various question types
              </CardDescription>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowSettings(!showSettings)}
                className="text-gray-300 hover:text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="outline"
                onClick={handlePreview}
                className="text-gray-300 hover:text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Assessment
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Assessment Title</label>
              <input
                type="text"
                value={currentAssessment.title}
                onChange={(e) => setCurrentAssessment(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter assessment title..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Passing Score (%)</label>
              <input
                type="number"
                value={currentAssessment.passingScore}
                onChange={(e) => setCurrentAssessment(prev => ({ ...prev, passingScore: parseInt(e.target.value) || 70 }))}
                min="0"
                max="100"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-white mb-2 block">Description</label>
            <textarea
              value={currentAssessment.description}
              onChange={(e) => setCurrentAssessment(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this assessment covers..."
              rows={2}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-white mb-2 block">Instructions</label>
            <textarea
              value={currentAssessment.instructions}
              onChange={(e) => setCurrentAssessment(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Provide instructions for students taking this assessment..."
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
            />
          </div>

          {/* Assessment Settings */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-800 rounded-lg"
              >
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Time Limit (min)</label>
                  <input
                    type="number"
                    value={currentAssessment.timeLimit || ''}
                    onChange={(e) => setCurrentAssessment(prev => ({ 
                      ...prev, 
                      timeLimit: e.target.value ? parseInt(e.target.value) : undefined 
                    }))}
                    placeholder="No limit"
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-400"
                  />
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center gap-2 text-xs text-gray-400">
                    <input
                      type="checkbox"
                      checked={currentAssessment.allowRetakes}
                      onChange={(e) => setCurrentAssessment(prev => ({ ...prev, allowRetakes: e.target.checked }))}
                      className="rounded"
                    />
                    Allow Retakes
                  </label>
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center gap-2 text-xs text-gray-400">
                    <input
                      type="checkbox"
                      checked={currentAssessment.showResults}
                      onChange={(e) => setCurrentAssessment(prev => ({ ...prev, showResults: e.target.checked }))}
                      className="rounded"
                    />
                    Show Results
                  </label>
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center gap-2 text-xs text-gray-400">
                    <input
                      type="checkbox"
                      checked={currentAssessment.randomizeQuestions}
                      onChange={(e) => setCurrentAssessment(prev => ({ ...prev, randomizeQuestions: e.target.checked }))}
                      className="rounded"
                    />
                    Randomize Questions
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Question Types */}
      <Card className="glass-card border-gray-600">
        <CardHeader>
          <CardTitle className="text-white">Add Questions</CardTitle>
          <CardDescription>
            Choose a question type to add to your assessment
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {questionTypes.map(({ type, label, icon: Icon }) => (
              <Button
                key={type}
                variant="outline"
                onClick={() => addQuestion(type)}
                className="h-auto p-4 flex flex-col items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs text-center">{label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Questions Sidebar */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">
            Questions ({currentAssessment.questions.length})
          </h3>
          
          {currentAssessment.questions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Circle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No questions added yet</p>
              <p className="text-sm">Add questions using the buttons above</p>
            </div>
          ) : (
            <div className="space-y-2">
              {currentAssessment.questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    activeQuestion === question.id
                      ? 'bg-blue-500/20 border-blue-400'
                      : 'bg-gray-800 border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setActiveQuestion(question.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                        Q{index + 1}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {question.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveQuestion(question.id, 'up');
                        }}
                        disabled={index === 0}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveQuestion(question.id, 'down');
                        }}
                        disabled={index === currentAssessment.questions.length - 1}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateQuestion(question.id);
                        }}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteQuestion(question.id);
                        }}
                        className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <h4 className="text-sm font-medium text-white truncate">
                    {question.title || 'Untitled Question'}
                  </h4>
                  
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                    <span>{question.points} point{question.points !== 1 ? 's' : ''}</span>
                    <Badge variant="secondary" className="text-xs">
                      {question.difficulty}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Question Editor */}
        <div className="lg:col-span-2">
          {activeQuestion ? (
            <Card className="glass-card border-gray-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Edit Question</CardTitle>
                  <Button
                    variant="ghost"
                    onClick={() => setActiveQuestion(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                {(() => {
                  const question = currentAssessment.questions.find(q => q.id === activeQuestion);
                  return question ? renderQuestionEditor(question) : null;
                })()}
              </CardContent>
            </Card>
          ) : (
            <Card className="glass-card border-gray-600">
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-gray-400">
                  <Edit3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a question to edit</p>
                  <p className="text-sm">Or add a new question to get started</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentBuilder;
