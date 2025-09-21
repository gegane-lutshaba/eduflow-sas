'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Plus,
  Search,
  Filter,
  BookOpen,
  Video,
  FileText,
  Mic,
  Image as ImageIcon,
  CheckCircle,
  Star,
  Copy,
  Edit3,
  Trash2,
  Eye,
  Save,
  X,
  Grid,
  List,
  Clock,
  User,
  Tag
} from 'lucide-react';

interface ContentTemplate {
  id: string;
  title: string;
  description: string;
  category: 'lesson' | 'assessment' | 'activity' | 'project' | 'presentation';
  contentType: 'core_content' | 'bite_sized' | 'video_script' | 'image_prompts' | 'voice_script' | 'assessments';
  subject: string;
  level: 'primary' | 'secondary' | 'undergraduate' | 'graduate';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // in minutes
  tags: string[];
  template: string; // HTML/Markdown template content
  variables: TemplateVariable[];
  isPublic: boolean;
  isFavorite: boolean;
  usageCount: number;
  rating: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface TemplateVariable {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'date';
  required: boolean;
  defaultValue?: string;
  options?: string[]; // for select type
  placeholder?: string;
  description?: string;
}

interface ContentTemplatesProps {
  onSelectTemplate?: (template: ContentTemplate, variables: Record<string, any>) => void;
  onCreateTemplate?: (template: Partial<ContentTemplate>) => void;
  className?: string;
}

const ContentTemplates: React.FC<ContentTemplatesProps> = ({
  onSelectTemplate,
  onCreateTemplate,
  className = ''
}) => {
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<ContentTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [templateVariables, setTemplateVariables] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sample templates data
  React.useEffect(() => {
    const sampleTemplates: ContentTemplate[] = [
      {
        id: '1',
        title: 'Interactive Math Lesson',
        description: 'A comprehensive template for teaching mathematical concepts with examples and practice problems',
        category: 'lesson',
        contentType: 'core_content',
        subject: 'Mathematics',
        level: 'secondary',
        difficulty: 'intermediate',
        estimatedDuration: 45,
        tags: ['interactive', 'examples', 'practice'],
        template: `# {{lesson_title}}

## Learning Objectives
- {{objective_1}}
- {{objective_2}}
- {{objective_3}}

## Introduction
{{introduction_text}}

## Main Content
### Concept Explanation
{{concept_explanation}}

### Examples
{{example_1}}
{{example_2}}

### Practice Problems
{{practice_problems}}

## Summary
{{summary_text}}

## Assessment
{{assessment_questions}}`,
        variables: [
          { id: 'lesson_title', name: 'lesson_title', label: 'Lesson Title', type: 'text', required: true, placeholder: 'Enter lesson title' },
          { id: 'objective_1', name: 'objective_1', label: 'Learning Objective 1', type: 'text', required: true },
          { id: 'objective_2', name: 'objective_2', label: 'Learning Objective 2', type: 'text', required: false },
          { id: 'objective_3', name: 'objective_3', label: 'Learning Objective 3', type: 'text', required: false },
          { id: 'introduction_text', name: 'introduction_text', label: 'Introduction', type: 'textarea', required: true },
          { id: 'concept_explanation', name: 'concept_explanation', label: 'Concept Explanation', type: 'textarea', required: true },
          { id: 'example_1', name: 'example_1', label: 'Example 1', type: 'textarea', required: true },
          { id: 'example_2', name: 'example_2', label: 'Example 2', type: 'textarea', required: false },
          { id: 'practice_problems', name: 'practice_problems', label: 'Practice Problems', type: 'textarea', required: true },
          { id: 'summary_text', name: 'summary_text', label: 'Summary', type: 'textarea', required: true },
          { id: 'assessment_questions', name: 'assessment_questions', label: 'Assessment Questions', type: 'textarea', required: false }
        ],
        isPublic: true,
        isFavorite: false,
        usageCount: 156,
        rating: 4.8,
        createdBy: 'System',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        title: 'Science Experiment Guide',
        description: 'Template for creating structured science experiment instructions with safety guidelines',
        category: 'activity',
        contentType: 'core_content',
        subject: 'Science',
        level: 'secondary',
        difficulty: 'beginner',
        estimatedDuration: 60,
        tags: ['experiment', 'safety', 'hands-on'],
        template: `# {{experiment_title}}

## Objective
{{experiment_objective}}

## Materials Needed
{{materials_list}}

## Safety Precautions
{{safety_guidelines}}

## Procedure
{{step_by_step_procedure}}

## Observations
{{observation_template}}

## Results & Analysis
{{results_analysis}}

## Conclusion
{{conclusion_template}}

## Extension Activities
{{extension_activities}}`,
        variables: [
          { id: 'experiment_title', name: 'experiment_title', label: 'Experiment Title', type: 'text', required: true },
          { id: 'experiment_objective', name: 'experiment_objective', label: 'Objective', type: 'textarea', required: true },
          { id: 'materials_list', name: 'materials_list', label: 'Materials List', type: 'textarea', required: true },
          { id: 'safety_guidelines', name: 'safety_guidelines', label: 'Safety Guidelines', type: 'textarea', required: true },
          { id: 'step_by_step_procedure', name: 'step_by_step_procedure', label: 'Procedure Steps', type: 'textarea', required: true },
          { id: 'observation_template', name: 'observation_template', label: 'Observation Template', type: 'textarea', required: true },
          { id: 'results_analysis', name: 'results_analysis', label: 'Results & Analysis', type: 'textarea', required: true },
          { id: 'conclusion_template', name: 'conclusion_template', label: 'Conclusion', type: 'textarea', required: false },
          { id: 'extension_activities', name: 'extension_activities', label: 'Extension Activities', type: 'textarea', required: false }
        ],
        isPublic: true,
        isFavorite: true,
        usageCount: 89,
        rating: 4.6,
        createdBy: 'System',
        createdAt: '2024-01-10T14:30:00Z',
        updatedAt: '2024-01-10T14:30:00Z'
      },
      {
        id: '3',
        title: 'Quick Assessment Quiz',
        description: 'Template for creating short quizzes with multiple choice and short answer questions',
        category: 'assessment',
        contentType: 'assessments',
        subject: 'General',
        level: 'secondary',
        difficulty: 'beginner',
        estimatedDuration: 15,
        tags: ['quiz', 'assessment', 'quick'],
        template: `# {{quiz_title}}

## Instructions
{{quiz_instructions}}

## Questions

### Question 1
{{question_1}}

A) {{option_1a}}
B) {{option_1b}}
C) {{option_1c}}
D) {{option_1d}}

**Correct Answer:** {{correct_1}}

### Question 2
{{question_2}}

A) {{option_2a}}
B) {{option_2b}}
C) {{option_2c}}
D) {{option_2d}}

**Correct Answer:** {{correct_2}}

### Question 3 (Short Answer)
{{question_3}}

**Sample Answer:** {{sample_answer_3}}

## Answer Key
{{answer_explanations}}`,
        variables: [
          { id: 'quiz_title', name: 'quiz_title', label: 'Quiz Title', type: 'text', required: true },
          { id: 'quiz_instructions', name: 'quiz_instructions', label: 'Instructions', type: 'textarea', required: true },
          { id: 'question_1', name: 'question_1', label: 'Question 1', type: 'textarea', required: true },
          { id: 'option_1a', name: 'option_1a', label: 'Option A', type: 'text', required: true },
          { id: 'option_1b', name: 'option_1b', label: 'Option B', type: 'text', required: true },
          { id: 'option_1c', name: 'option_1c', label: 'Option C', type: 'text', required: true },
          { id: 'option_1d', name: 'option_1d', label: 'Option D', type: 'text', required: true },
          { id: 'correct_1', name: 'correct_1', label: 'Correct Answer 1', type: 'select', required: true, options: ['A', 'B', 'C', 'D'] },
          { id: 'question_2', name: 'question_2', label: 'Question 2', type: 'textarea', required: true },
          { id: 'option_2a', name: 'option_2a', label: 'Option A', type: 'text', required: true },
          { id: 'option_2b', name: 'option_2b', label: 'Option B', type: 'text', required: true },
          { id: 'option_2c', name: 'option_2c', label: 'Option C', type: 'text', required: true },
          { id: 'option_2d', name: 'option_2d', label: 'Option D', type: 'text', required: true },
          { id: 'correct_2', name: 'correct_2', label: 'Correct Answer 2', type: 'select', required: true, options: ['A', 'B', 'C', 'D'] },
          { id: 'question_3', name: 'question_3', label: 'Question 3 (Short Answer)', type: 'textarea', required: true },
          { id: 'sample_answer_3', name: 'sample_answer_3', label: 'Sample Answer 3', type: 'textarea', required: false },
          { id: 'answer_explanations', name: 'answer_explanations', label: 'Answer Explanations', type: 'textarea', required: false }
        ],
        isPublic: true,
        isFavorite: false,
        usageCount: 234,
        rating: 4.4,
        createdBy: 'System',
        createdAt: '2024-01-05T09:15:00Z',
        updatedAt: '2024-01-05T09:15:00Z'
      }
    ];

    setTemplates(sampleTemplates);
    setFilteredTemplates(sampleTemplates);
  }, []);

  // Filter templates based on search and filters
  React.useEffect(() => {
    let filtered = templates.filter(template => {
      const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
      const matchesSubject = subjectFilter === 'all' || template.subject === subjectFilter;
      const matchesLevel = levelFilter === 'all' || template.level === levelFilter;
      
      return matchesSearch && matchesCategory && matchesSubject && matchesLevel;
    });

    setFilteredTemplates(filtered);
  }, [templates, searchQuery, categoryFilter, subjectFilter, levelFilter]);

  const handleTemplateSelect = useCallback((template: ContentTemplate) => {
    setSelectedTemplate(template);
    // Initialize template variables with default values
    const initialVariables: Record<string, any> = {};
    template.variables.forEach(variable => {
      initialVariables[variable.name] = variable.defaultValue || '';
    });
    setTemplateVariables(initialVariables);
  }, []);

  const handleVariableChange = useCallback((variableName: string, value: any) => {
    setTemplateVariables(prev => ({
      ...prev,
      [variableName]: value
    }));
  }, []);

  const handleUseTemplate = useCallback(() => {
    if (selectedTemplate) {
      onSelectTemplate?.(selectedTemplate, templateVariables);
      setSelectedTemplate(null);
      setTemplateVariables({});
    }
  }, [selectedTemplate, templateVariables, onSelectTemplate]);

  const toggleFavorite = useCallback((templateId: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, isFavorite: !template.isFavorite }
        : template
    ));
  }, []);

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'core_content': return <BookOpen className="w-4 h-4" />;
      case 'video_script': return <Video className="w-4 h-4" />;
      case 'voice_script': return <Mic className="w-4 h-4" />;
      case 'image_prompts': return <ImageIcon className="w-4 h-4" />;
      case 'assessments': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'lesson': return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      case 'assessment': return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'activity': return 'bg-purple-500/20 text-purple-400 border-purple-400/30';
      case 'project': return 'bg-orange-500/20 text-orange-400 border-orange-400/30';
      case 'presentation': return 'bg-pink-500/20 text-pink-400 border-pink-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  const renderTemplateCard = (template: ContentTemplate) => (
    <motion.div
      key={template.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card border-gray-600 hover:border-gray-500 transition-all duration-200 cursor-pointer"
      onClick={() => handleTemplateSelect(template)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getContentTypeIcon(template.contentType)}
            <CardTitle className="text-white text-sm">{template.title}</CardTitle>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(template.id);
              }}
              className={`p-1 rounded ${
                template.isFavorite 
                  ? 'text-yellow-400 hover:text-yellow-300' 
                  : 'text-gray-400 hover:text-yellow-400'
              }`}
            >
              <Star className={`w-4 h-4 ${template.isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
        
        <CardDescription className="text-xs text-gray-400 line-clamp-2">
          {template.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`text-xs ${getCategoryColor(template.category)}`}>
              {template.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {template.subject}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {template.level}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{template.estimatedDuration}min</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{template.usageCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-current text-yellow-400" />
                <span>{template.rating}</span>
              </div>
            </div>
          </div>
          
          {template.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              <Tag className="w-3 h-3 text-gray-500" />
              {template.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {template.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{template.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </motion.div>
  );

  const renderTemplateListItem = (template: ContentTemplate) => (
    <motion.div
      key={template.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card border-gray-600 hover:border-gray-500 transition-all duration-200 cursor-pointer"
      onClick={() => handleTemplateSelect(template)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              {getContentTypeIcon(template.contentType)}
              <div>
                <h3 className="text-white font-medium">{template.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-1">{template.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={`text-xs ${getCategoryColor(template.category)}`}>
                {template.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {template.subject}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {template.level}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{template.estimatedDuration}min</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{template.usageCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-current text-yellow-400" />
              <span>{template.rating}</span>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(template.id);
              }}
              className={`p-1 rounded ${
                template.isFavorite 
                  ? 'text-yellow-400 hover:text-yellow-300' 
                  : 'text-gray-400 hover:text-yellow-400'
              }`}
            >
              <Star className={`w-4 h-4 ${template.isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </CardContent>
    </motion.div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="glass-card border-gray-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Content Templates</CardTitle>
              <CardDescription>
                Choose from pre-built templates to quickly create educational content
              </CardDescription>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(true)}
                className="text-gray-300 hover:text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
              >
                <option value="all">All Categories</option>
                <option value="lesson">Lessons</option>
                <option value="assessment">Assessments</option>
                <option value="activity">Activities</option>
                <option value="project">Projects</option>
                <option value="presentation">Presentations</option>
              </select>
              
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
              >
                <option value="all">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="History">History</option>
                <option value="General">General</option>
              </select>
              
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
              >
                <option value="all">All Levels</option>
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="undergraduate">Undergraduate</option>
                <option value="graduate">Graduate</option>
              </select>
              
              <div className="flex border border-gray-600 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid/List */}
      {filteredTemplates.length === 0 ? (
        <Card className="glass-card border-gray-600">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No templates found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
            : 'space-y-3'
        }>
          {filteredTemplates.map(template => 
            viewMode === 'grid' 
              ? renderTemplateCard(template)
              : renderTemplateListItem(template)
          )}
        </div>
      )}

      {/* Template Configuration Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedTemplate(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card border-gray-600 w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">{selectedTemplate.title}</CardTitle>
                    <CardDescription>{selectedTemplate.description}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedTemplate(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-800 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Category</div>
                      <Badge className={`text-xs ${getCategoryColor(selectedTemplate.category)}`}>
                        {selectedTemplate.category}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Subject</div>
                      <div className="text-white">{selectedTemplate.subject}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Level</div>
                      <div className="text-white">{selectedTemplate.level}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Duration</div>
                      <div className="text-white">{selectedTemplate.estimatedDuration}min</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Configure Template Variables</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTemplate.variables.map((variable) => (
                        <div key={variable.id} className="space-y-2">
                          <label className="text-sm font-medium text-white flex items-center gap-2">
                            {variable.label}
                            {variable.required && <span className="text-red-400">*</span>}
                          </label>
                          
                          {variable.description && (
                            <p className="text-xs text-gray-400">{variable.description}</p>
                          )}

                          {variable.type === 'text' && (
                            <input
                              type="text"
                              value={templateVariables[variable.name] || ''}
                              onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                              placeholder={variable.placeholder}
                              required={variable.required}
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                            />
                          )}

                          {variable.type === 'textarea' && (
                            <textarea
                              value={templateVariables[variable.name] || ''}
                              onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                              placeholder={variable.placeholder}
                              required={variable.required}
                              rows={3}
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
                            />
                          )}

                          {variable.type === 'select' && variable.options && (
                            <select
                              value={templateVariables[variable.name] || ''}
                              onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                              required={variable.required}
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                            >
                              <option value="">Select an option...</option>
                              {variable.options.map((option, index) => (
                                <option key={index} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          )}

                          {variable.type === 'number' && (
                            <input
                              type="number"
                              value={templateVariables[variable.name] || ''}
                              onChange={(e) => handleVariableChange(variable.name, parseInt(e.target.value) || 0)}
                              placeholder={variable.placeholder}
                              required={variable.required}
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                            />
                          )}

                          {variable.type === 'date' && (
                            <input
                              type="date"
                              value={templateVariables[variable.name] || ''}
                              onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                              required={variable.required}
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-600">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedTemplate(null)}
                      className="text-gray-300 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUseTemplate}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Use Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContentTemplates;
