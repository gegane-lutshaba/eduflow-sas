'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  DollarSign, 
  Star, 
  Clock,
  Target,
  Award,
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

interface TeacherStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalStudents: number;
  activeStudents: number;
  totalCourses: number;
  publishedCourses: number;
  averageRating: number;
  totalRatings: number;
  completionRate: number;
  engagementScore: number;
}

interface CourseAnalytics {
  id: string;
  title: string;
  enrollments: number;
  completions: number;
  revenue: number;
  rating: number;
  lastUpdated: string;
  status: 'published' | 'draft' | 'archived';
}

interface RevenueData {
  month: string;
  revenue: number;
  enrollments: number;
}

interface StudentEngagement {
  date: string;
  activeStudents: number;
  completions: number;
  newEnrollments: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function TeacherAnalyticsDashboard() {
  const [stats, setStats] = useState<TeacherStats>({
    totalRevenue: 12450.00,
    monthlyRevenue: 2340.00,
    totalStudents: 1247,
    activeStudents: 892,
    totalCourses: 12,
    publishedCourses: 8,
    averageRating: 4.7,
    totalRatings: 324,
    completionRate: 78.5,
    engagementScore: 85.2
  });

  const [courseAnalytics, setCourseAnalytics] = useState<CourseAnalytics[]>([
    {
      id: '1',
      title: 'Advanced Machine Learning Fundamentals',
      enrollments: 234,
      completions: 187,
      revenue: 3420.00,
      rating: 4.8,
      lastUpdated: '2025-09-15',
      status: 'published'
    },
    {
      id: '2',
      title: 'Cybersecurity for Beginners',
      enrollments: 189,
      completions: 142,
      revenue: 2890.00,
      rating: 4.6,
      lastUpdated: '2025-09-12',
      status: 'published'
    },
    {
      id: '3',
      title: 'Data Science with Python',
      enrollments: 156,
      completions: 98,
      revenue: 2140.00,
      rating: 4.5,
      lastUpdated: '2025-09-10',
      status: 'published'
    }
  ]);

  const [revenueData, setRevenueData] = useState<RevenueData[]>([
    { month: 'Jan', revenue: 1200, enrollments: 45 },
    { month: 'Feb', revenue: 1800, enrollments: 67 },
    { month: 'Mar', revenue: 2100, enrollments: 78 },
    { month: 'Apr', revenue: 1950, enrollments: 72 },
    { month: 'May', revenue: 2400, enrollments: 89 },
    { month: 'Jun', revenue: 2800, enrollments: 102 },
    { month: 'Jul', revenue: 2340, enrollments: 95 }
  ]);

  const [engagementData, setEngagementData] = useState<StudentEngagement[]>([
    { date: '2025-09-01', activeStudents: 120, completions: 15, newEnrollments: 8 },
    { date: '2025-09-02', activeStudents: 135, completions: 18, newEnrollments: 12 },
    { date: '2025-09-03', activeStudents: 142, completions: 22, newEnrollments: 9 },
    { date: '2025-09-04', activeStudents: 156, completions: 19, newEnrollments: 14 },
    { date: '2025-09-05', activeStudents: 148, completions: 25, newEnrollments: 11 },
    { date: '2025-09-06', activeStudents: 162, completions: 21, newEnrollments: 16 },
    { date: '2025-09-07', activeStudents: 171, completions: 28, newEnrollments: 13 }
  ]);

  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const exportData = () => {
    // Implement data export functionality
    console.log('Exporting analytics data...');
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    format = 'number',
    trend = 'up' 
  }: {
    title: string;
    value: number;
    change?: number;
    icon: any;
    format?: 'number' | 'currency' | 'percentage';
    trend?: 'up' | 'down' | 'neutral';
  }) => {
    const formatValue = (val: number) => {
      switch (format) {
        case 'currency':
          return `$${val.toLocaleString()}`;
        case 'percentage':
          return `${val}%`;
        default:
          return val.toLocaleString();
      }
    };

    const getTrendColor = () => {
      switch (trend) {
        case 'up': return 'text-green-600';
        case 'down': return 'text-red-600';
        default: return 'text-gray-600';
      }
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatValue(value)}</div>
          {change !== undefined && (
            <p className={`text-xs ${getTrendColor()}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track your teaching performance and revenue
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {['7d', '30d', '90d', '1y'].map((range) => (
          <Button
            key={range}
            variant={selectedTimeRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange(range)}
          >
            {range === '7d' ? '7 Days' : 
             range === '30d' ? '30 Days' : 
             range === '90d' ? '90 Days' : '1 Year'}
          </Button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          change={15.2}
          icon={DollarSign}
          format="currency"
          trend="up"
        />
        <StatCard
          title="Active Students"
          value={stats.activeStudents}
          change={8.1}
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Published Courses"
          value={stats.publishedCourses}
          change={12.5}
          icon={BookOpen}
          trend="up"
        />
        <StatCard
          title="Average Rating"
          value={stats.averageRating}
          change={2.3}
          icon={Star}
          trend="up"
        />
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="engagement">Student Engagement</TabsTrigger>
          <TabsTrigger value="courses">Course Performance</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enrollment Trends</CardTitle>
                <CardDescription>New enrollments per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="enrollments" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>Revenue by course category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">AI/ML Courses</span>
                    <span className="text-sm font-medium">$7,200</span>
                  </div>
                  <Progress value={58} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Cybersecurity</span>
                    <span className="text-sm font-medium">$3,450</span>
                  </div>
                  <Progress value={28} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Data Science</span>
                    <span className="text-sm font-medium">$1,800</span>
                  </div>
                  <Progress value={14} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Engagement</CardTitle>
              <CardDescription>Daily active students and completions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="activeStudents" 
                    stroke="#8884d8" 
                    name="Active Students"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completions" 
                    stroke="#82ca9d" 
                    name="Completions"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="newEnrollments" 
                    stroke="#ffc658" 
                    name="New Enrollments"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              title="Completion Rate"
              value={stats.completionRate}
              change={5.2}
              icon={Target}
              format="percentage"
              trend="up"
            />
            <StatCard
              title="Engagement Score"
              value={stats.engagementScore}
              change={3.1}
              icon={Activity}
              format="percentage"
              trend="up"
            />
            <StatCard
              title="Avg. Study Time"
              value={42}
              change={-2.3}
              icon={Clock}
              trend="down"
            />
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Performance</CardTitle>
              <CardDescription>Individual course analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courseAnalytics.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{course.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{course.enrollments} enrollments</span>
                          <span>{course.completions} completions</span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {course.rating}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          ${course.revenue.toLocaleString()}
                        </div>
                        <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                          {course.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completion Rate</span>
                        <span>{Math.round((course.completions / course.enrollments) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(course.completions / course.enrollments) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>Personalized insights to improve performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-blue-700">Optimize Course Pricing</h4>
                  <p className="text-sm text-muted-foreground">
                    Your ML course could increase revenue by 23% with a $20 price increase based on market analysis.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-700">Content Gap Opportunity</h4>
                  <p className="text-sm text-muted-foreground">
                    High demand for "Computer Vision" content. Creating this course could generate $3,200+ monthly.
                  </p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-orange-700">Engagement Alert</h4>
                  <p className="text-sm text-muted-foreground">
                    Module 3 in your Cybersecurity course has 40% drop-off. Consider adding interactive elements.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Goals</CardTitle>
                <CardDescription>Track your progress towards targets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Monthly Revenue Goal</span>
                    <span className="text-sm font-medium">$2,340 / $3,000</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Student Satisfaction</span>
                    <span className="text-sm font-medium">4.7 / 5.0</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Course Completion Rate</span>
                    <span className="text-sm font-medium">78.5% / 85%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Active Students</span>
                    <span className="text-sm font-medium">892 / 1,000</span>
                  </div>
                  <Progress value={89} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
