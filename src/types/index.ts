// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  role: 'individual' | 'organization';
  createdAt: Date;
  updatedAt: Date;
}

// Assessment Types
export interface AssessmentResult {
  id: string;
  userId: string;
  technicalAptitude: number;
  learningStyle: LearningStyle;
  careerReadiness: number;
  personalityProfile: PersonalityProfile;
  recommendedPaths: CareerPath[];
  completedAt: Date;
}

export interface LearningStyle {
  visual: number;
  auditory: number;
  kinesthetic: number;
  readingWriting: number;
}

export interface PersonalityProfile {
  achievementOriented: number;
  autonomyPreference: number;
  masteryFocused: number;
  purposeDriven: number;
  socialRecognition: number;
}

export interface CareerPath {
  id: string;
  title: string;
  track: 'ai' | 'cybersecurity';
  salaryRange: {
    min: number;
    max: number;
  };
  fitScore: number;
  description: string;
  requiredSkills: string[];
  timeToComplete: number; // in months
}

// Learning Content Types
export interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  track: 'ai' | 'cybersecurity';
  content: ModuleContent;
  prerequisites: string[];
  learningObjectives: string[];
}

export interface ModuleContent {
  hook: ContentSection;
  coreContent: ContentSection;
  application: ContentSection;
  reinforcement: ContentSection;
}

export interface ContentSection {
  type: 'text' | 'video' | 'interactive' | '3d-visualization';
  content: string;
  duration: number;
  interactiveElements?: InteractiveElement[];
}

export interface InteractiveElement {
  id: string;
  type: 'quiz' | 'code-editor' | '3d-model' | 'simulation';
  data: any;
}

// 3D Environment Types
export interface Avatar {
  id: string;
  userId: string;
  appearance: AvatarAppearance;
  animations: AvatarAnimation[];
  voiceSettings: VoiceSettings;
}

export interface AvatarAppearance {
  faceFeatures: Record<string, number>;
  bodyType: string;
  hairStyle: string;
  hairColor: string;
  clothing: ClothingItem[];
  accessories: AccessoryItem[];
}

export interface ClothingItem {
  id: string;
  type: 'shirt' | 'pants' | 'jacket' | 'shoes';
  style: string;
  color: string;
}

export interface AccessoryItem {
  id: string;
  type: 'glasses' | 'watch' | 'jewelry';
  style: string;
}

export interface AvatarAnimation {
  name: string;
  type: 'idle' | 'walking' | 'talking' | 'gesture';
  duration: number;
}

export interface VoiceSettings {
  teacherId: string;
  speed: number;
  pitch: number;
  volume: number;
}

// Virtual Environment Types
export interface VirtualEnvironment {
  id: string;
  name: string;
  type: 'campus' | 'classroom' | 'lab' | 'assessment';
  track?: 'ai' | 'cybersecurity';
  assets: EnvironmentAsset[];
  interactiveObjects: InteractiveObject[];
  lighting: LightingConfig;
  audio: AudioConfig;
}

export interface EnvironmentAsset {
  id: string;
  type: '3d-model' | 'texture' | 'animation';
  url: string;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
}

export interface InteractiveObject {
  id: string;
  name: string;
  position: Vector3;
  actions: ObjectAction[];
  voiceCommands: string[];
}

export interface ObjectAction {
  type: 'click' | 'voice' | 'proximity';
  action: string;
  parameters?: Record<string, any>;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface LightingConfig {
  ambientLight: {
    color: string;
    intensity: number;
  };
  directionalLight: {
    color: string;
    intensity: number;
    position: Vector3;
  };
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface AudioConfig {
  ambientSounds: AudioTrack[];
  spatialAudio: boolean;
  volume: number;
}

export interface AudioTrack {
  id: string;
  url: string;
  loop: boolean;
  volume: number;
}

// AI Teacher Types
export interface AITeacher {
  id: string;
  name: string;
  specialty: 'ai' | 'cybersecurity';
  personality: TeacherPersonality;
  appearance: TeacherAppearance;
  voiceProfile: VoiceProfile;
  teachingStyle: TeachingStyle;
}

export interface TeacherPersonality {
  formality: number; // 0-100
  encouragement: number; // 0-100
  patience: number; // 0-100
  humor: number; // 0-100
  challengeLevel: number; // 0-100
}

export interface TeacherAppearance {
  gender: 'male' | 'female' | 'non-binary';
  ethnicity: string;
  age: number;
  clothing: ClothingItem[];
  accessories: AccessoryItem[];
}

export interface VoiceProfile {
  gender: 'male' | 'female';
  accent: string;
  speed: number;
  pitch: number;
  emotionalRange: number;
}

export interface TeachingStyle {
  method: 'socratic' | 'direct' | 'collaborative' | 'experiential';
  adaptability: number;
  interactionFrequency: number;
  feedbackStyle: 'immediate' | 'delayed' | 'milestone-based';
}

// Progress and Analytics Types
export interface UserProgress {
  userId: string;
  currentModule: string;
  completedModules: string[];
  skillLevels: Record<string, number>;
  timeSpent: number; // in minutes
  streakDays: number;
  achievements: Achievement[];
  lastActive: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'learning' | 'assessment' | 'social' | 'milestone';
}

// Organization Types
export interface Organization {
  id: string;
  name: string;
  domain: string;
  plan: 'team' | 'enterprise' | 'enterprise-plus';
  settings: OrganizationSettings;
  members: OrganizationMember[];
  customContent: CustomContent[];
}

export interface OrganizationSettings {
  branding: BrandingConfig;
  ssoEnabled: boolean;
  customDomains: string[];
  reportingFrequency: 'daily' | 'weekly' | 'monthly';
  privacySettings: PrivacySettings;
}

export interface BrandingConfig {
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

export interface PrivacySettings {
  dataRetention: number; // in days
  analyticsEnabled: boolean;
  thirdPartyIntegrations: boolean;
}

export interface OrganizationMember {
  userId: string;
  role: 'admin' | 'manager' | 'learner';
  department: string;
  joinedAt: Date;
  permissions: Permission[];
}

export interface Permission {
  resource: string;
  actions: string[];
}

export interface CustomContent {
  id: string;
  title: string;
  type: 'module' | 'assessment' | 'environment';
  content: any;
  createdBy: string;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface AssessmentFormData {
  personalInfo: {
    currentRole: string;
    experience: string;
    education: string;
    goals: string[];
  };
  preferences: {
    learningStyle: string[];
    timeAvailability: number;
    preferredSchedule: string[];
  };
  accessibility: {
    visualNeeds: boolean;
    audioNeeds: boolean;
    motorNeeds: boolean;
    cognitiveNeeds: boolean;
    specificRequirements: string;
  };
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  timezone: string;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  types: string[];
}
