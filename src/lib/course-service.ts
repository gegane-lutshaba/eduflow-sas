import { useAuth } from '@clerk/nextjs';

interface CourseGenerationRequest {
  user_id: string;
  profile_data: any;
  track: 'ai' | 'cybersecurity';
  specific_topics?: string[];
  learning_style_preferences?: any;
  time_constraints?: any;
}

interface Course {
  id: string;
  title: string;
  description: string;
  track: 'ai' | 'cybersecurity';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration: number;
  learning_objectives: string[];
  tags: string[];
  is_personalized: boolean;
  created_at: string;
  modules: CourseModule[];
  progress?: CourseProgress;
  module_progress?: ModuleProgress[];
}

interface CourseModule {
  id: string;
  title: string;
  description: string;
  content: any;
  module_type: 'micro-learning' | 'deep-dive' | 'hands-on-lab' | 'assessment';
  order_index: number;
  estimated_duration: number;
  learning_objectives: string[];
}

interface CourseProgress {
  id: string;
  completion_percentage: number;
  current_module_id?: string;
  time_spent: number;
  started_at: string;
  completed_at?: string;
  last_accessed_at: string;
}

interface ModuleProgress {
  id: string;
  module_id: string;
  completion_percentage: number;
  time_spent: number;
  assessment_score?: number;
  completed_at?: string;
  bookmarked: boolean;
}

class CourseService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    try {
      // Get auth token from Clerk
      const token = await (window as any).Clerk?.session?.getToken();
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };
    } catch (error) {
      console.error('Error getting auth headers:', error);
      return {
        'Content-Type': 'application/json',
      };
    }
  }

  async generatePersonalizedCourse(request: CourseGenerationRequest): Promise<Course> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/courses/generate`, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to generate course');
      }

      const data = await response.json();
      return data.course;
    } catch (error) {
      console.error('Error generating course:', error);
      throw error;
    }
  }

  async getUserCourses(userId: string): Promise<Course[]> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/courses/user/${userId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch courses');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user courses:', error);
      throw error;
    }
  }

  async getCourseModules(courseId: string): Promise<CourseModule[]> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/courses/${courseId}/modules`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch course modules');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching course modules:', error);
      throw error;
    }
  }

  async updateCourseProgress(
    courseId: string, 
    progressUpdate: {
      completion_percentage?: number;
      current_module_id?: string;
      completed_at?: string;
      time_spent?: number;
    }
  ): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/courses/${courseId}/progress`, {
        method: 'POST',
        headers,
        body: JSON.stringify(progressUpdate),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update course progress');
      }
    } catch (error) {
      console.error('Error updating course progress:', error);
      throw error;
    }
  }

  async updateModuleProgress(
    moduleId: string,
    progressUpdate: {
      completion_percentage?: number;
      completed_at?: string;
      time_spent?: number;
      assessment_score?: number;
      notes?: string;
      bookmarked?: boolean;
    }
  ): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/courses/modules/${moduleId}/progress`, {
        method: 'POST',
        headers,
        body: JSON.stringify(progressUpdate),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update module progress');
      }
    } catch (error) {
      console.error('Error updating module progress:', error);
      throw error;
    }
  }

  async getCourseRecommendations(userId: string, track?: string, limit: number = 5): Promise<Course[]> {
    try {
      const headers = await this.getAuthHeaders();
      
      const params = new URLSearchParams();
      if (track) params.append('track', track);
      params.append('limit', limit.toString());
      
      const response = await fetch(`${this.baseUrl}/courses/recommendations/${userId}?${params}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch course recommendations');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching course recommendations:', error);
      throw error;
    }
  }

  async getLearningPath(userId: string, track: string): Promise<{
    user_id: string;
    track: string;
    recommended_courses: Course[];
    current_course?: Course;
    next_course?: Course;
    completion_percentage: number;
    estimated_completion_time: number;
    skill_progression: Record<string, number>;
  }> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/courses/learning-path/${userId}?track=${track}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch learning path');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching learning path:', error);
      throw error;
    }
  }

  async searchCourses(searchRequest: {
    query?: string;
    track?: 'ai' | 'cybersecurity';
    difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
    tags?: string[];
    duration_min?: number;
    duration_max?: number;
    user_id?: string;
  }, page: number = 1, pageSize: number = 10): Promise<{
    courses: Course[];
    total_count: number;
    page: number;
    page_size: number;
    filters_applied: any;
  }> {
    try {
      const headers = await this.getAuthHeaders();
      
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('page_size', pageSize.toString());
      
      const response = await fetch(`${this.baseUrl}/courses/search?${params}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(searchRequest),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to search courses');
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching courses:', error);
      throw error;
    }
  }

  // Helper method to generate courses based on user profile
  async generateCoursesForProfile(userId: string, profileData: any): Promise<Course[]> {
    try {
      const courses: Course[] = [];
      
      // Determine which tracks to generate based on career goals
      const careerGoal = profileData.careerGoals?.toLowerCase() || '';
      const tracks: ('ai' | 'cybersecurity')[] = [];
      
      if (careerGoal.includes('ai') || careerGoal.includes('machine learning') || careerGoal.includes('data science')) {
        tracks.push('ai');
      }
      
      if (careerGoal.includes('security') || careerGoal.includes('cyber') || careerGoal.includes('penetration')) {
        tracks.push('cybersecurity');
      }
      
      // If no specific track identified, generate both
      if (tracks.length === 0) {
        tracks.push('ai', 'cybersecurity');
      }
      
      // Generate courses for each track
      for (const track of tracks) {
        const request: CourseGenerationRequest = {
          user_id: userId,
          profile_data: profileData,
          track,
          learning_style_preferences: {
            modality: profileData.learningStyle?.modality,
            pace: profileData.learningStyle?.pace,
            support: profileData.learningStyle?.support
          },
          time_constraints: {
            timeline: profileData.timeline,
            availability: profileData.timeAvailability
          }
        };
        
        const course = await this.generatePersonalizedCourse(request);
        courses.push(course);
      }
      
      return courses;
    } catch (error) {
      console.error('Error generating courses for profile:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const courseService = new CourseService();

// Export types
export type {
  Course,
  CourseModule,
  CourseProgress,
  ModuleProgress,
  CourseGenerationRequest
};
