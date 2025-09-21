'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Upload,
  Image as ImageIcon,
  Video,
  FileAudio,
  FileText,
  X,
  Check,
  AlertCircle,
  Loader2,
  Eye,
  Download,
  Trash2,
  Copy,
  Search,
  Filter,
  Grid,
  List
} from 'lucide-react';

interface MediaFile {
  id: string;
  filename: string;
  originalFilename: string;
  fileType: 'image' | 'video' | 'audio' | 'document';
  mimeType: string;
  fileSize: number;
  storageUrl: string;
  thumbnailUrl?: string;
  altText?: string;
  description?: string;
  tags: string[];
  isPublic: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  result?: MediaFile;
}

interface MediaUploaderProps {
  onFileSelect?: (file: MediaFile) => void;
  onMultipleSelect?: (files: MediaFile[]) => void;
  allowMultiple?: boolean;
  acceptedTypes?: string[];
  maxFileSize?: number; // in MB
  className?: string;
  mode?: 'upload' | 'select' | 'manage';
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  onFileSelect,
  onMultipleSelect,
  allowMultiple = false,
  acceptedTypes = ['image/*', 'video/*', 'audio/*', '.pdf', '.doc', '.docx'],
  maxFileSize = 50,
  className = '',
  mode = 'upload'
}) => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [uploadQueue, setUploadQueue] = useState<UploadProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dragActive, setDragActive] = useState(false);

  // Load existing media files
  React.useEffect(() => {
    if (mode !== 'upload') {
      loadMediaFiles();
    }
  }, [mode]);

  const loadMediaFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/teacher/media');
      const data = await response.json();
      
      if (data.success) {
        setMediaFiles(data.files);
      } else {
        setError(data.message || 'Failed to load media files');
      }
    } catch (error) {
      console.error('Error loading media files:', error);
      setError('Failed to load media files');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter(file => {
      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        setError(`File ${file.name} is too large. Maximum size is ${maxFileSize}MB.`);
        return false;
      }
      
      // Check file type
      const isValidType = acceptedTypes.some(type => {
        if (type.includes('*')) {
          return file.type.startsWith(type.replace('*', ''));
        }
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      });
      
      if (!isValidType) {
        setError(`File ${file.name} is not a supported file type.`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    // Initialize upload progress
    const newUploads: UploadProgress[] = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploadQueue(prev => [...prev, ...newUploads]);

    // Upload files one by one
    for (let i = 0; i < validFiles.length; i++) {
      await uploadFile(validFiles[i], i);
    }
  };

  const uploadFile = async (file: File, index: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', getFileType(file.type));
    formData.append('altText', '');
    formData.append('description', '');
    formData.append('tags', JSON.stringify([]));
    formData.append('isPublic', 'false');

    try {
      const response = await fetch('/api/v1/teacher/media/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Update upload progress to completed
        setUploadQueue(prev => prev.map((upload, i) => 
          upload.file === file ? {
            ...upload,
            progress: 100,
            status: 'completed',
            result: data.file
          } : upload
        ));

        // Add to media files if in manage mode
        if (mode === 'manage') {
          setMediaFiles(prev => [data.file, ...prev]);
        }

        // Auto-select if in upload mode
        if (mode === 'upload' && onFileSelect) {
          onFileSelect(data.file);
        }
      } else {
        setUploadQueue(prev => prev.map((upload, i) => 
          upload.file === file ? {
            ...upload,
            status: 'error',
            error: data.message || 'Upload failed'
          } : upload
        ));
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadQueue(prev => prev.map((upload, i) => 
        upload.file === file ? {
          ...upload,
          status: 'error',
          error: 'Upload failed'
        } : upload
      ));
    }
  };

  const getFileType = (mimeType: string): 'image' | 'video' | 'audio' | 'document' => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image': return <ImageIcon className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'audio': return <FileAudio className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (file: MediaFile) => {
    if (allowMultiple) {
      const newSelected = new Set(selectedFiles);
      if (newSelected.has(file.id)) {
        newSelected.delete(file.id);
      } else {
        newSelected.add(file.id);
      }
      setSelectedFiles(newSelected);
    } else {
      onFileSelect?.(file);
    }
  };

  const handleMultipleConfirm = () => {
    const selected = mediaFiles.filter(file => selectedFiles.has(file.id));
    onMultipleSelect?.(selected);
  };

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || file.fileType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const clearUploadQueue = () => {
    setUploadQueue(prev => prev.filter(upload => upload.status === 'uploading'));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Area */}
      {(mode === 'upload' || mode === 'manage') && (
        <Card className="glass-card border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Media Files
            </CardTitle>
            <CardDescription>
              Drag and drop files here or click to browse. Max file size: {maxFileSize}MB
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-400 bg-blue-500/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-2">
                Drag and drop your files here, or{' '}
                <label className="text-blue-400 hover:text-blue-300 cursor-pointer underline">
                  browse
                  <input
                    type="file"
                    multiple={allowMultiple}
                    accept={acceptedTypes.join(',')}
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: {acceptedTypes.join(', ')}
              </p>
            </div>

            {/* Upload Progress */}
            <AnimatePresence>
              {uploadQueue.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-white">Upload Progress</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearUploadQueue}
                      className="text-gray-400 hover:text-white"
                    >
                      Clear Completed
                    </Button>
                  </div>
                  
                  {uploadQueue.map((upload, index) => (
                    <div key={index} className="glass-card p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300 truncate flex-1">
                          {upload.file.name}
                        </span>
                        <div className="flex items-center gap-2">
                          {upload.status === 'uploading' && (
                            <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                          )}
                          {upload.status === 'completed' && (
                            <Check className="w-4 h-4 text-green-400" />
                          )}
                          {upload.status === 'error' && (
                            <AlertCircle className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      </div>
                      
                      {upload.status === 'uploading' && (
                        <Progress value={upload.progress} className="h-2" />
                      )}
                      
                      {upload.status === 'error' && (
                        <p className="text-xs text-red-400 mt-1">{upload.error}</p>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      )}

      {/* Media Library */}
      {(mode === 'select' || mode === 'manage') && (
        <Card className="glass-card border-gray-600">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Media Library</CardTitle>
                <CardDescription>
                  {filteredFiles.length} files available
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-400"
                  />
                </div>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-400"
                >
                  <option value="all">All Types</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="audio">Audio</option>
                  <option value="document">Documents</option>
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
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">No media files found</p>
                <p className="text-sm text-gray-500">
                  {searchQuery || filterType !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Upload some files to get started'
                  }
                </p>
              </div>
            ) : (
              <div className={`${
                viewMode === 'grid' 
                  ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' 
                  : 'space-y-2'
              }`}>
                {filteredFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`${
                      viewMode === 'grid'
                        ? 'glass-card p-4 cursor-pointer hover:shadow-lg transition-all duration-200'
                        : 'glass-card p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-700/50'
                    } ${
                      selectedFiles.has(file.id) ? 'ring-2 ring-blue-400' : ''
                    }`}
                    onClick={() => handleFileSelect(file)}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        {/* Grid View */}
                        <div className="aspect-square bg-gray-800 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                          {file.fileType === 'image' && file.thumbnailUrl ? (
                            <img
                              src={file.thumbnailUrl}
                              alt={file.altText || file.filename}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-gray-400">
                              {getFileIcon(file.fileType)}
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-white truncate" title={file.originalFilename}>
                            {file.originalFilename}
                          </h4>
                          
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>{formatFileSize(file.fileSize)}</span>
                            <Badge variant="outline" className="text-xs">
                              {file.fileType}
                            </Badge>
                          </div>
                          
                          {file.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {file.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {file.tags.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{file.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {allowMultiple && (
                          <div className="absolute top-2 right-2">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              selectedFiles.has(file.id)
                                ? 'bg-blue-500 border-blue-500'
                                : 'border-gray-400 bg-gray-800'
                            }`}>
                              {selectedFiles.has(file.id) && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {/* List View */}
                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          {file.fileType === 'image' && file.thumbnailUrl ? (
                            <img
                              src={file.thumbnailUrl}
                              alt={file.altText || file.filename}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-gray-400">
                              {getFileIcon(file.fileType)}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-white truncate">
                            {file.originalFilename}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                            <span>{formatFileSize(file.fileSize)}</span>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">
                              {file.fileType}
                            </Badge>
                            <span>•</span>
                            <span>Used {file.usageCount} times</span>
                          </div>
                          {file.description && (
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {file.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(file.storageUrl, '_blank');
                            }}
                            className="text-gray-400 hover:text-white"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(file.storageUrl);
                            }}
                            className="text-gray-400 hover:text-white"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          
                          {allowMultiple && (
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              selectedFiles.has(file.id)
                                ? 'bg-blue-500 border-blue-500'
                                : 'border-gray-400 bg-gray-800'
                            }`}>
                              {selectedFiles.has(file.id) && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Multiple Selection Actions */}
            {allowMultiple && selectedFiles.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
              >
                <div className="glass-card px-6 py-3 flex items-center gap-4">
                  <span className="text-sm text-white">
                    {selectedFiles.size} file{selectedFiles.size !== 1 ? 's' : ''} selected
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFiles(new Set())}
                      className="text-gray-300 hover:text-white"
                    >
                      Clear
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleMultipleConfirm}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Select Files
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card border-red-400/30 bg-red-500/10 p-4"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-red-400 font-medium">Error</h4>
                <p className="text-red-300 text-sm mt-1">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaUploader;
