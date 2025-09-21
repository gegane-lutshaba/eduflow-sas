'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import RichTextEditor from '../editor/RichTextEditor';
import { 
  ArrowLeft,
  Save,
  Eye,
  Wand2,
  RefreshCw,
  Clock,
  User,
  FileText,
  Layers,
  Video,
  Image as ImageIcon,
  Mic,
  Target,
  CheckCircle,
  AlertCircle,
  Loader2,
  History,
  Settings,
  Download,
  Upload
} from 'lucide-react';

interface ContentVersion {
  id: string;
  version: number;
  content: string;
  createdAt: string;
  createdBy: string;
  creationMethod: 'ai' | 'manual' | 'hybrid';
  isCurrent: boolean;
  isPublished: boolean;
  changeSummary?: string;
}

interface ContentEditorProps {
  moduleId: string;
  contentType: 'core' | 'bite-sized' | 'video-script' | 'image-prompts' | 'voice-script' | 'assessments';
  initialContent?: string;
  onBack: () => void;
  onSave?: (content: string) => void;
  className?: string;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  moduleId,
  contentType,
  initialContent = '',
  onBack,
  onSave,
  className = ''
}) => {
  const [content, setContent] = useState(initialContent);
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [currentVersion, setCurrentVersion] = useState<ContentVersion | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    loadVersions();
  }, [moduleId, contentType]);

  useEffect(() => {
    setHasUnsavedChanges(content !== initialContent);
  }, [content, initialContent]);

  const loadVersions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/teacher/modules/${moduleId}/content/${contentType}/versions`);
      const data = await response.json();
      
      if (data.success) {
        setVersions(data.versions);
        const current = data.versions.find((v: ContentVersion) => v.isCurrent);
        if (current) {
          setCurrentVersion(current);
          setContent(current.content);
        }
      }
    } catch (error) {
      console.error('Error loading versions:', error);
      setError('Failed to load content versions');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (contentToSave?: string) => {
    const finalContent = contentToSave || content;
    
    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/api/v1/teacher/modules/${moduleId}/content/${contentType}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: finalContent,
          creationMethod: 'manual',
          changeSummary: 'Manual content update'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        setSuccess('Content saved successfully!');
        onSave?.(finalContent);
        
        // Reload versions to get the updated list
        await loadVersions();
        
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'Failed to save content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      setError('An unexpected error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateAI = async () => {
    try {
      setGenerating(true);
      setError(null);

      const response = await fetch(`/api/v1/teacher/modules/${moduleId}/generate-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType,
          enhanceExisting: content.length > 0
        }),
      });

      const data = await response.json();

      if (data.success) {
        setContent(data.content);
        setSuccess('AI content generated successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'Failed to generate AI content');
      }
    } catch (error) {
      console.error('Error generating AI content:', error);
      setError('An unexpected error occurred during AI generation');
    } finally {
      setGenerating(false);
    }
  };

  const handleVersionRestore = async (version: ContentVersion) => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to restore this version?');
      if (!confirmed) return;
    }

    setContent(version.content);
    setCurrentVersion(version);
    setSuccess(`Restored to version ${version.version}`);
    setTimeout(() => setSuccess(null), 3000);
  };

  const getContentTypeInfo = () => {
    const types = {
      'core': {
        title: 'Core Content',
        description: 'Main educational content aligned with learning objectives',
        icon: FileText,
        placeholder: 'Write your main educational content here...'
      },
      'bite-sized': {
        title: 'Bite-sized Content',
        description: 'Summarized, digestible chunks for quick learning',
        icon: Layers,
        placeholder: 'Create concise, easy-to-digest content...'
      },
      'video-script': {
        title: 'Video Script',
        description: 'Optimized script for video content generation',
        icon: Video,
        placeholder: 'Write your video script with scene descriptions...'
      },
      'image-prompts': {
        title: 'Image Prompts',
        description: 'DALL-E prompts for visual educational content',
        icon: ImageIcon,
        placeholder: 'Describe the images you want to generate...'
      },
      'voice-script': {
        title: 'Voice Script',
        description: 'Audio-optimized content for voice agents',
        icon: Mic,
        placeholder: 'Write content optimized for audio delivery...'
      },
      'assessments': {
        title: 'Assessments',
        description: 'Quizzes and evaluation materials',
        icon: Target,
        placeholder: 'Create assessment questions and activities...'
      }
    };

    return types[contentType] || types.core;
  };

  const typeInfo = getContentTypeInfo();
  const IconComponent = typeInfo.icon;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Error/Success Notifications */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className="fixed top-4 right-4 z-50 max-w-md"
          >
            <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-400 font-medium">Error</h4>
                  <p className="text-red-300 text-sm mt-1">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-300 ml-auto"
                >
                  ×
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className="fixed top-4 right-4 z-50 max-w-md"
          >
            <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-green-400 font-medium">Success</h4>
                  <p className="text-green-300 text-sm mt-1">{success}</p>
                </div>
                <button
                  onClick={() => setSuccess(null)}
                  className="text-green-400 hover:text-green-300 ml-auto"
                >
                  ×
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onBack}
            className="glass-card border-gray-600 hover:border-blue-400 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{typeInfo.title}</h1>
              <p className="text-gray-400 text-sm">{typeInfo.description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {lastSaved && (
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Saved {lastSaved.toLocaleTimeString()}
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleGenerateAI}
            disabled={generating}
            className="glass-card border-gray-600 hover:border-purple-400 text-gray-300 hover:text-white"
          >
            {generating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4 mr-2" />
            )}
            {generating ? 'Generating...' : 'AI Enhance'}
          </Button>
          
          <Button 
            size="sm"
            onClick={() => handleSave()}
            disabled={saving || !hasUnsavedChanges}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="glass-card border-gray-600">
          <TabsTrigger value="editor" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            <FileText className="w-4 h-4 mr-2" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="preview" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="versions" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            <History className="w-4 h-4 mr-2" />
            Versions ({versions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <Card className="glass-card border-gray-600">
            <CardContent className="p-0">
              <RichTextEditor
                content={content}
                onChange={setContent}
                onSave={handleSave}
                placeholder={typeInfo.placeholder}
                autoSave={false}
                className="border-0"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card className="glass-card border-gray-600">
            <CardHeader>
              <CardTitle className="text-white">Content Preview</CardTitle>
              <CardDescription>How your content will appear to students</CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-sm max-w-none text-gray-300 prose-headings:text-white prose-links:text-blue-400 prose-code:text-green-400"
                dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-500">No content to preview</p>' }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="space-y-4">
          <div className="space-y-4">
            {versions.length === 0 ? (
              <Card className="glass-card border-gray-600">
                <CardContent className="p-8 text-center">
                  <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No versions yet</h3>
                  <p className="text-gray-400">Save your content to create the first version</p>
                </CardContent>
              </Card>
            ) : (
              versions.map((version) => (
                <Card key={version.id} className="glass-card border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge 
                            variant={version.isCurrent ? "default" : "secondary"}
                            className={version.isCurrent ? "bg-blue-500/20 text-blue-400 border-blue-400/30" : ""}
                          >
                            Version {version.version}
                          </Badge>
                          <Badge 
                            variant="outline"
                            className={`border-${version.creationMethod === 'ai' ? 'purple' : version.creationMethod === 'manual' ? 'green' : 'yellow'}-400/30 text-${version.creationMethod === 'ai' ? 'purple' : version.creationMethod === 'manual' ? 'green' : 'yellow'}-400`}
                          >
                            {version.creationMethod.toUpperCase()}
                          </Badge>
                          {version.isPublished && (
                            <Badge variant="outline" className="border-green-400/30 text-green-400">
                              Published
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-2">
                          {version.changeSummary || 'No description provided'}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {version.createdBy}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(version.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {!version.isCurrent && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVersionRestore(version)}
                            className="glass-card border-gray-600 hover:border-blue-400 text-gray-300 hover:text-white"
                          >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Restore
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="glass-card border-gray-600 hover:border-blue-400 text-gray-300 hover:text-white"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentEditor;
