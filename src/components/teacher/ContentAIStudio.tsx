'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { 
  BookOpen, 
  Edit3, 
  Eye, 
  Play, 
  Image, 
  Video, 
  Mic, 
  FileText, 
  CheckCircle,
  Clock,
  Users,
  Star,
  TrendingUp,
  Settings,
  Download,
  Share2
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  estimatedDuration: number;
  contentType: string;
  status: string;
  enrollmentCount: number;
  averageRating: string;
  totalRatings: number;
  aiContentStatus: {
    text: string;
    images: string;
    videos: string;
    voice: string;
    assessments: string;
  };
  generatedContent: any;
  createdAt: string;
  updatedAt: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  contentType: string;
  contentData: any;
  aiGenerated: boolean;
  estimatedDuration: number;
  learningObjectives: string[];
  isPublished: boolean;
}

interface ContentAIStudioProps {
  className?: string;
}

export default function ContentAIStudio({ className }: ContentAIStudioProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/teacher/courses');
      const data = await response.json();
      
      if (data.success) {
        setCourses(data.courses);
        console.log('Loaded courses:', data.courses);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCourseDetails = async (courseId: string) => {
    try {
      const response = await fetch(`/api/v1/teacher/courses/${courseId}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedCourse(data.course);
        setModules(data.modules);
        console.log('Loaded course details:', data);
      }
    } catch (error) {
      console.error('Error loading course details:', error);
    }
  };

  const getContentStatusColor = (status: string) => {
    switch (status) {
      case 'generated': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-yellow-100 text-yellow-800';
      case 'not_requested': return 'bg-gray-100 text-gray-600';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="w-4 h-4" />;
      case 'images': return <Image className="w-4 h-4" />;
      case 'videos': return <Video className="w-4 h-4" />;
      case 'voice': return <Mic className="w-4 h-4" />;
      case 'assessments': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content AI Studio</h1>
          <p className="text-gray-600 mt-1">Manage and edit your AI-generated courses</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Course Selection */}
      {!selectedCourse ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card 
              key={course.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => loadCourseDetails(course.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {course.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Content Status */}
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(course.aiContentStatus).map(([type, status]) => (
                      <Badge 
                        key={type} 
                        variant="secondary" 
                        className={`text-xs ${getContentStatusColor(status)}`}
                      >
                        <span className="mr-1">{getContentIcon(type)}</span>
                        {type}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDuration(course.estimatedDuration)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      {course.enrollmentCount} enrolled
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Star className="w-4 h-4 mr-1" />
                      {course.averageRating} ({course.totalRatings})
                    </div>
                    <div className="flex items-center text-gray-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Level {course.difficulty}
                    </div>
                  </div>

                  <Button className="w-full" size="sm">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {courses.length === 0 && (
            <div className="col-span-full text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-4">Create your first course to get started with the Content AI Studio</p>
              <Button>Create New Course</Button>
            </div>
          )}
        </div>
      ) : (
        /* Course Detail View */
        <div className="space-y-6">
          {/* Course Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedCourse(null)}
              >
                ← Back to Courses
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.title}</h2>
                <p className="text-gray-600">{selectedCourse.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button size="sm">
                <Play className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>

          {/* Course Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Course Info */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Duration</label>
                          <p className="text-lg">{formatDuration(selectedCourse.estimatedDuration)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Difficulty</label>
                          <p className="text-lg">Level {selectedCourse.difficulty}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Status</label>
                          <Badge variant="outline">{selectedCourse.status}</Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Content Type</label>
                          <p className="text-lg capitalize">{selectedCourse.contentType}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Content Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>AI Content Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(selectedCourse.aiContentStatus).map(([type, status]) => (
                        <div key={type} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getContentIcon(type)}
                            <span className="capitalize">{type}</span>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getContentStatusColor(status)}`}
                          >
                            {status.replace('_', ' ')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Content</CardTitle>
                  <CardDescription>
                    AI-generated content for your course
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedCourse.generatedContent && Object.keys(selectedCourse.generatedContent).length > 0 ? (
                      Object.entries(selectedCourse.generatedContent).map(([type, content]) => (
                        <div key={type} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {getContentIcon(type)}
                              <h4 className="font-medium capitalize">{type} Content</h4>
                            </div>
                            <Button variant="outline" size="sm">
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                          <div className="bg-gray-50 rounded p-3 max-h-40 overflow-y-auto">
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                              {JSON.stringify(content, null, 2)}
                            </pre>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No generated content available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="modules" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Course Modules ({modules.length})</h3>
                <Button size="sm">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Add Module
                </Button>
              </div>

              <div className="space-y-4">
                {modules.map((module, index) => (
                  <Card key={module.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                              Module {index + 1}
                            </span>
                            <h4 className="font-medium">{module.title}</h4>
                            {module.aiGenerated && (
                              <Badge variant="secondary" className="text-xs">
                                AI Generated
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatDuration(module.estimatedDuration)}
                            </span>
                            <span className="flex items-center gap-1">
                              {getContentIcon(module.contentType)}
                              {module.contentType}
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              {module.learningObjectives.length} objectives
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {modules.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No modules found for this course</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedCourse.enrollmentCount}</div>
                    <p className="text-xs text-gray-600">+12% from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedCourse.averageRating}</div>
                    <p className="text-xs text-gray-600">{selectedCourse.totalRatings} reviews</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">78%</div>
                    <Progress value={78} className="mt-2" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
