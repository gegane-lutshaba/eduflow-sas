/**
 * Nova Audio Service - ElevenLabs Integration for Premium Voice Experience
 * Manages pre-generated audio clips and dynamic audio generation
 */

export interface AudioClip {
  id: string;
  text: string;
  emotion: 'excited' | 'encouraging' | 'celebratory' | 'thoughtful' | 'warm';
  category: 'welcome' | 'step-intro' | 'encouragement' | 'achievement' | 'results';
  filename: string;
  duration?: number;
}

export interface AudioPreferences {
  enabled: boolean;
  volume: number;
  autoPlay: boolean;
  skipLongNarrations: boolean;
}

class NovaAudioService {
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private currentAudio: HTMLAudioElement | null = null;
  private preferences: AudioPreferences = {
    enabled: true,
    volume: 0.8,
    autoPlay: true,
    skipLongNarrations: false
  };

  // Pre-defined audio library mapping
  private audioLibrary: AudioClip[] = [
    // Welcome & Introduction
    {
      id: 'welcome-intro',
      text: "Hey there! I'm Nova, your AI career guide! I'm absolutely thrilled to help you discover your perfect tech career path!",
      emotion: 'excited',
      category: 'welcome',
      filename: 'welcome-intro.mp3'
    },
    {
      id: 'welcome-excited-response',
      text: "I LOVE that energy! You're going to absolutely crush this! Your enthusiasm tells me you're ready for big things!",
      emotion: 'excited',
      category: 'welcome',
      filename: 'welcome-excited.mp3'
    },
    {
      id: 'welcome-nervous-support',
      text: "Hey, no worries at all! Feeling nervous is totally normal. I'm here to support you every step of the way!",
      emotion: 'warm',
      category: 'welcome',
      filename: 'welcome-support.mp3'
    },

    // Step Introductions
    {
      id: 'basic-info-intro',
      text: "Perfect! Let's start getting to know the amazing person behind the screen! First up - what's your current situation?",
      emotion: 'encouraging',
      category: 'step-intro',
      filename: 'basic-info-intro.mp3'
    },
    {
      id: 'technical-interests-intro',
      text: "Now for my favorite part - let's explore what makes your tech heart beat faster! I want you to be completely honest about what excites you!",
      emotion: 'excited',
      category: 'step-intro',
      filename: 'technical-interests-intro.mp3'
    },
    {
      id: 'cognitive-games-intro',
      text: "Time for some brain games! Don't worry - these are actually fun! I've designed them to feel like games rather than tests!",
      emotion: 'excited',
      category: 'step-intro',
      filename: 'cognitive-games-intro.mp3'
    },
    {
      id: 'personality-intro',
      text: "Now for the personality exploration! This is where we discover what makes you uniquely YOU!",
      emotion: 'thoughtful',
      category: 'step-intro',
      filename: 'personality-intro.mp3'
    },
    {
      id: 'learning-preferences-intro',
      text: "Almost there! Let's talk about how you learn best. This helps me recommend the perfect learning path for you!",
      emotion: 'encouraging',
      category: 'step-intro',
      filename: 'learning-preferences-intro.mp3'
    },

    // Progress Encouragement
    {
      id: 'great-progress',
      text: "You're doing fantastic! I'm impressed by your thoughtful answers!",
      emotion: 'encouraging',
      category: 'encouragement',
      filename: 'great-progress.mp3'
    },
    {
      id: 'halfway-celebration',
      text: "Halfway there! You're doing amazing. I'm already seeing some exciting patterns in your responses!",
      emotion: 'celebratory',
      category: 'encouragement',
      filename: 'halfway-celebration.mp3'
    },
    {
      id: 'almost-complete',
      text: "You're almost at the finish line! Your dedication is inspiring. Just a little more and we'll have your complete career profile!",
      emotion: 'encouraging',
      category: 'encouragement',
      filename: 'almost-complete.mp3'
    },

    // Achievement Celebrations
    {
      id: 'first-achievement',
      text: "Achievement unlocked! You're off to a fantastic start!",
      emotion: 'celebratory',
      category: 'achievement',
      filename: 'first-achievement.mp3'
    },
    {
      id: 'cognitive-complete',
      text: "Brilliant work on those cognitive games! Your thinking skills are definitely showing!",
      emotion: 'celebratory',
      category: 'achievement',
      filename: 'cognitive-complete.mp3'
    },
    {
      id: 'assessment-master',
      text: "WOW! Assessment complete! You are officially an Assessment Master! Your results are incredible!",
      emotion: 'celebratory',
      category: 'achievement',
      filename: 'assessment-master.mp3'
    },

    // Results & Career Excitement
    {
      id: 'analyzing-profile',
      text: "This is so exciting! I'm analyzing all your responses to create your personalized career roadmap!",
      emotion: 'excited',
      category: 'results',
      filename: 'analyzing-profile.mp3'
    },
    {
      id: 'results-ready',
      text: "Your results are absolutely amazing! I've found some fantastic career paths that are perfect for you!",
      emotion: 'celebratory',
      category: 'results',
      filename: 'results-ready.mp3'
    },
    {
      id: 'career-match-ai',
      text: "You're a perfect match for AI and Machine Learning! Your analytical thinking and creativity will take you far!",
      emotion: 'excited',
      category: 'results',
      filename: 'career-match-ai.mp3'
    },
    {
      id: 'career-match-cybersecurity',
      text: "Cybersecurity is calling your name! Your systematic thinking and attention to detail are exactly what this field needs!",
      emotion: 'excited',
      category: 'results',
      filename: 'career-match-cybersecurity.mp3'
    }
  ];

  constructor() {
    this.loadPreferences();
    this.preloadCriticalAudio();
  }

  // Play audio with smart selection
  async playAudio(
    audioId: string, 
    fallbackText?: string, 
    options?: { 
      emotion?: string; 
      skipIfLong?: boolean;
      onComplete?: () => void;
    }
  ): Promise<void> {
    if (!this.preferences.enabled) return;

    try {
      // Stop any currently playing audio
      this.stopCurrentAudio();

      // Find the audio clip
      const clip = this.audioLibrary.find(c => c.id === audioId);
      
      if (clip) {
        const audio = await this.loadAudio(clip.filename);
        if (audio) {
          audio.volume = this.preferences.volume;
          this.currentAudio = audio;
          
          // Add completion handler
          if (options?.onComplete) {
            audio.addEventListener('ended', options.onComplete, { once: true });
          }
          
          await audio.play();
          return;
        }
      }

      // Fallback to text-to-speech if audio clip not found
      if (fallbackText && 'speechSynthesis' in window) {
        this.speakText(fallbackText, options?.emotion);
      }
    } catch (error) {
      console.warn('Audio playback failed:', error);
      
      // Final fallback to TTS
      if (fallbackText && 'speechSynthesis' in window) {
        this.speakText(fallbackText, options?.emotion);
      }
    }
  }

  // Load and cache audio files
  private async loadAudio(filename: string): Promise<HTMLAudioElement | null> {
    const cacheKey = filename;
    
    // Return cached audio if available
    if (this.audioCache.has(cacheKey)) {
      const cachedAudio = this.audioCache.get(cacheKey)!;
      cachedAudio.currentTime = 0; // Reset to beginning
      return cachedAudio;
    }

    try {
      const audio = new Audio(`/audio/nova/${filename}`);
      
      // Wait for audio to be ready
      await new Promise((resolve, reject) => {
        audio.addEventListener('canplaythrough', resolve, { once: true });
        audio.addEventListener('error', reject, { once: true });
        audio.load();
      });

      // Cache the audio
      this.audioCache.set(cacheKey, audio);
      return audio;
    } catch (error) {
      console.warn(`Failed to load audio: ${filename}`, error);
      return null;
    }
  }

  // Preload critical audio clips
  private async preloadCriticalAudio(): void {
    const criticalClips = [
      'welcome-intro.mp3',
      'welcome-excited.mp3',
      'basic-info-intro.mp3',
      'great-progress.mp3',
      'first-achievement.mp3'
    ];

    for (const filename of criticalClips) {
      try {
        await this.loadAudio(filename);
      } catch (error) {
        console.warn(`Failed to preload: ${filename}`);
      }
    }
  }

  // Fallback text-to-speech
  private speakText(text: string, emotion?: string): void {
    if (!('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = emotion === 'excited' ? 1.1 : 0.9;
    utterance.pitch = emotion === 'excited' ? 1.2 : 1.0;
    utterance.volume = this.preferences.volume;
    
    window.speechSynthesis.speak(utterance);
  }

  // Stop currently playing audio
  stopCurrentAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    
    // Stop any TTS
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Audio preference management
  setPreferences(newPreferences: Partial<AudioPreferences>): void {
    this.preferences = { ...this.preferences, ...newPreferences };
    this.savePreferences();
  }

  getPreferences(): AudioPreferences {
    return { ...this.preferences };
  }

  private loadPreferences(): void {
    try {
      const saved = localStorage.getItem('nova-audio-preferences');
      if (saved) {
        this.preferences = { ...this.preferences, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Failed to load audio preferences:', error);
    }
  }

  private savePreferences(): void {
    try {
      localStorage.setItem('nova-audio-preferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.warn('Failed to save audio preferences:', error);
    }
  }

  // Smart audio selection based on context
  selectAudioForContext(
    context: {
      step: string;
      userResponse?: string;
      achievement?: string;
      emotion?: string;
    }
  ): string | null {
    const { step, userResponse, achievement, emotion } = context;

    // Achievement audio
    if (achievement) {
      if (achievement.includes('Assessment Master')) return 'assessment-master';
      if (achievement.includes('first') || achievement.includes('start')) return 'first-achievement';
      return 'first-achievement'; // Default achievement audio
    }

    // Step-specific audio
    switch (step) {
      case 'welcome':
        if (userResponse?.toLowerCase().includes('excited')) return 'welcome-excited-response';
        if (userResponse?.toLowerCase().includes('nervous')) return 'welcome-nervous-support';
        return 'welcome-intro';
      
      case 'basic-info':
        return 'basic-info-intro';
      
      case 'technical-interests':
        return 'technical-interests-intro';
      
      case 'cognitive-assessment':
        return 'cognitive-games-intro';
      
      case 'personality-assessment':
        return 'personality-intro';
      
      case 'learning-preferences':
        return 'learning-preferences-intro';
      
      case 'results':
        return 'results-ready';
      
      case 'analyzing':
        return 'analyzing-profile';
    }

    // Emotion-based fallback
    switch (emotion) {
      case 'celebration':
      case 'excited':
        return 'great-progress';
      case 'encouragement':
        return 'halfway-celebration';
      default:
        return null;
    }
  }

  // Generate audio content list for ElevenLabs
  generateAudioContentList(): { text: string; filename: string; emotion: string }[] {
    return this.audioLibrary.map(clip => ({
      text: clip.text,
      filename: clip.filename,
      emotion: clip.emotion
    }));
  }

  // Dynamic audio generation (for personalized content)
  async generatePersonalizedAudio(
    text: string, 
    emotion: 'excited' | 'encouraging' | 'celebratory' | 'thoughtful' | 'warm' = 'encouraging'
  ): Promise<string | null> {
    // This would integrate with ElevenLabs API for dynamic generation
    // For now, return null to fallback to TTS
    try {
      // TODO: Implement ElevenLabs API integration
      // const response = await fetch('/api/elevenlabs/generate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ text, emotion })
      // });
      // const audioBlob = await response.blob();
      // return URL.createObjectURL(audioBlob);
      
      return null; // Fallback to TTS for now
    } catch (error) {
      console.warn('Dynamic audio generation failed:', error);
      return null;
    }
  }

  // Cleanup
  destroy(): void {
    this.stopCurrentAudio();
    this.audioCache.clear();
  }
}

export const novaAudioService = new NovaAudioService();

// Audio content for ElevenLabs generation
export const NOVA_AUDIO_SCRIPTS = [
  // Welcome Scripts
  {
    id: 'welcome-intro',
    text: "Hey there! I'm Nova, your AI career guide! I'm absolutely thrilled to help you discover your perfect tech career path! Think of me as your personal career detective - I'll ask engaging questions, we'll play some brain games, and together we'll uncover what makes you uniquely awesome! Ready to start this exciting journey?",
    emotion: 'excited',
    category: 'welcome'
  },
  {
    id: 'welcome-excited',
    text: "I LOVE that energy! You're going to absolutely crush this! Your enthusiasm tells me you're ready for big things. Let's dive right in and start discovering what makes you special!",
    emotion: 'excited',
    category: 'welcome'
  },
  {
    id: 'welcome-support',
    text: "Hey, no worries at all! Feeling nervous is totally normal - it just shows you care about your future! I'm here to support you every step of the way. There are no wrong answers, and we'll go at your pace.",
    emotion: 'warm',
    category: 'welcome'
  },

  // Step Introduction Scripts
  {
    id: 'basic-info-intro',
    text: "Perfect! Let's start getting to know the amazing person behind the screen! I'll ask you about your background and experience so I can tailor everything perfectly for you.",
    emotion: 'encouraging',
    category: 'step-intro'
  },
  {
    id: 'technical-interests-intro',
    text: "Now for my favorite part - let's explore what makes your tech heart beat faster! I'm going to ask about different areas, and I want you to be completely honest about what genuinely excites you. Passion is the best predictor of success in tech!",
    emotion: 'excited',
    category: 'step-intro'
  },
  {
    id: 'cognitive-games-intro',
    text: "Time for some brain games! Don't worry - these are actually fun! I've designed them to feel like games rather than tests. Based on your education level, I'll make sure they're challenging but fair. Ready to show off those thinking skills?",
    emotion: 'excited',
    category: 'step-intro'
  },
  {
    id: 'personality-intro',
    text: "Now for the personality exploration! This is where we discover what makes you uniquely YOU! I'll present some work scenarios, and you just pick what feels most natural. There's no right or wrong - just authentic!",
    emotion: 'thoughtful',
    category: 'step-intro'
  },
  {
    id: 'learning-preferences-intro',
    text: "Almost there! Let's talk about how you learn best. This helps me recommend the perfect learning path for your unique style! We're so close to creating your personalized roadmap!",
    emotion: 'encouraging',
    category: 'step-intro'
  },

  // Progress & Encouragement Scripts
  {
    id: 'great-progress',
    text: "You're doing fantastic! I'm impressed by your thoughtful answers. Your potential is really showing!",
    emotion: 'encouraging',
    category: 'encouragement'
  },
  {
    id: 'halfway-celebration',
    text: "Halfway there! You're doing amazing. I'm already seeing some exciting patterns in your responses! Keep going - you're going to love what we discover about you!",
    emotion: 'celebratory',
    category: 'encouragement'
  },
  {
    id: 'almost-complete',
    text: "You're almost at the finish line! Your dedication is inspiring. Just a little more and we'll have your complete career profile ready!",
    emotion: 'encouraging',
    category: 'encouragement'
  },

  // Achievement Scripts
  {
    id: 'first-achievement',
    text: "Achievement unlocked! You're off to a fantastic start! Every answer helps me understand you better.",
    emotion: 'celebratory',
    category: 'achievement'
  },
  {
    id: 'tech-visionary',
    text: "Tech Visionary achievement unlocked! I can see you're really passionate about technology and innovation!",
    emotion: 'celebratory',
    category: 'achievement'
  },
  {
    id: 'cognitive-master',
    text: "Cognitive Master! Brilliant work on those brain games! Your thinking skills are definitely impressive!",
    emotion: 'celebratory',
    category: 'achievement'
  },
  {
    id: 'assessment-master',
    text: "WOW! Assessment Master achievement unlocked! You've completed the full assessment and your results are incredible! I'm so excited to show you what we've discovered!",
    emotion: 'celebratory',
    category: 'achievement'
  },

  // Results Scripts
  {
    id: 'analyzing-profile',
    text: "This is so exciting! I'm analyzing all your responses to create your personalized career roadmap. My AI brain is working overtime to find the perfect matches for your unique combination of skills and personality!",
    emotion: 'excited',
    category: 'results'
  },
  {
    id: 'results-ready',
    text: "INCREDIBLE! Your results are absolutely amazing! I've found some fantastic career paths that are perfect for your unique combination of skills, personality, and interests. Ready to see your personalized roadmap to success?",
    emotion: 'celebratory',
    category: 'results'
  },
  {
    id: 'career-match-ai',
    text: "You're a perfect match for AI and Machine Learning careers! Your analytical thinking, creativity, and passion for innovation will take you far in this exciting field!",
    emotion: 'excited',
    category: 'results'
  },
  {
    id: 'career-match-cybersecurity',
    text: "Cybersecurity is calling your name! Your systematic thinking, attention to detail, and desire to protect others are exactly what this field needs!",
    emotion: 'excited',
    category: 'results'
  }
];
