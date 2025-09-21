'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Database, 
  TrendingUp, 
  Download,
  Search,
  Filter,
  Calendar,
  BookOpen,
  Brain,
  Target
} from 'lucide-react';

export default function ResearcherDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="h-8 w-8 text-green-600 mr-3" />
                Research Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Access learning analytics and educational research tools
              </p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Researcher
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Studies</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Points</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45.2K</div>
              <p className="text-xs text-muted-foreground">
                Anonymized learning records
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">
                Across all studies
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Publications</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Published this year
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Research Tools */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Research Tools</CardTitle>
                <CardDescription>
                  Access powerful analytics and research capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  Learning Analytics
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Database className="h-6 w-6 mb-2" />
                  Data Export
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Trend Analysis
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Brain className="h-6 w-6 mb-2" />
                  Cognitive Patterns
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Studies</CardTitle>
                <CardDescription>
                  Your active and completed research studies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">AI Learning Effectiveness Study</h3>
                        <p className="text-sm text-gray-600">Analyzing the impact of AI-powered personalization on learning outcomes</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>342 participants</span>
                      <span>Started: Jan 2025</span>
                      <span>Duration: 6 months</span>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">Cognitive Assessment Validation</h3>
                        <p className="text-sm text-gray-600">Validating new cognitive assessment tools for educational contexts</p>
                      </div>
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>156 participants</span>
                      <span>Completed: Dec 2024</span>
                      <span>Published: Yes</span>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">Multi-Modal Learning Preferences</h3>
                        <p className="text-sm text-gray-600">Investigating how students prefer to consume educational content</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Planning</Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>Target: 500 participants</span>
                      <span>Start: Mar 2025</span>
                      <span>Duration: 4 months</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Search className="h-4 w-4 mr-2" />
                  Search Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Dataset
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Study
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Research Ethics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    IRB Approval: Current
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Data Privacy: Compliant
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Anonymization: Active
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    Consent Forms: 2 pending
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium">Dr. Sarah Johnson</div>
                    <div className="text-gray-600">Stanford University</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Prof. Michael Chen</div>
                    <div className="text-gray-600">MIT</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Dr. Emily Rodriguez</div>
                    <div className="text-gray-600">UC Berkeley</div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Invite Collaborator
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-12">
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Advanced Research Features Coming Soon
              </h3>
              <p className="text-gray-600 mb-4">
                We&apos;re building powerful research tools including advanced analytics, 
                machine learning insights, and collaborative research environments.
              </p>
              <Button variant="outline">
                Join Beta Program
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
