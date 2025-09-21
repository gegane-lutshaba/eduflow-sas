import { db } from '../src/lib/db/connection';
import * as schema from '../src/lib/db/schema';

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Seed Education Levels
    console.log('📚 Seeding education levels...');
    const educationLevels = await db.insert(schema.educationLevels).values([
      {
        name: 'primary',
        displayName: 'Primary School',
        description: 'Elementary education (Ages 6-11)',
      },
      {
        name: 'o_level',
        displayName: 'O Level',
        description: 'Ordinary Level (Ages 14-16)',
      },
      {
        name: 'a_level',
        displayName: 'A Level',
        description: 'Advanced Level (Ages 16-18)',
      },
      {
        name: 'undergraduate',
        displayName: 'Undergraduate',
        description: 'Bachelor\'s degree level',
      },
      {
        name: 'postgraduate',
        displayName: 'Postgraduate',
        description: 'Master\'s and PhD level',
      },
    ]).returning();

    console.log(`✅ Created ${educationLevels.length} education levels`);

    // Seed STEM Subjects
    console.log('🔬 Seeding STEM subjects...');
    const subjects = await db.insert(schema.subjects).values([
      {
        name: 'mathematics',
        displayName: 'Mathematics',
        description: 'Pure and applied mathematics',
        category: 'STEM',
      },
      {
        name: 'physics',
        displayName: 'Physics',
        description: 'Physical sciences and mechanics',
        category: 'STEM',
      },
      {
        name: 'chemistry',
        displayName: 'Chemistry',
        description: 'Chemical sciences and reactions',
        category: 'STEM',
      },
      {
        name: 'biology',
        displayName: 'Biology',
        description: 'Life sciences and biological systems',
        category: 'STEM',
      },
      {
        name: 'computer_science',
        displayName: 'Computer Science',
        description: 'Programming, algorithms, and computing',
        category: 'STEM',
      },
      {
        name: 'engineering',
        displayName: 'Engineering',
        description: 'Applied sciences and engineering principles',
        category: 'STEM',
      },
      {
        name: 'data_science',
        displayName: 'Data Science',
        description: 'Statistics, machine learning, and data analysis',
        category: 'STEM',
      },
      {
        name: 'artificial_intelligence',
        displayName: 'Artificial Intelligence',
        description: 'Machine learning, neural networks, and AI systems',
        category: 'STEM',
      },
      {
        name: 'cybersecurity',
        displayName: 'Cybersecurity',
        description: 'Information security and digital protection',
        category: 'STEM',
      },
      {
        name: 'environmental_science',
        displayName: 'Environmental Science',
        description: 'Earth systems and environmental studies',
        category: 'STEM',
      },
    ]).returning();

    console.log(`✅ Created ${subjects.length} subjects`);

    // Seed Sample Topics for Mathematics at O Level
    const mathSubject = subjects.find(s => s.name === 'mathematics');
    const oLevel = educationLevels.find(l => l.name === 'o_level');

    if (mathSubject && oLevel) {
      console.log('📖 Seeding sample mathematics topics...');
      const mathTopics = await db.insert(schema.topics).values([
        {
          name: 'Algebra',
          description: 'Linear equations, quadratic equations, and algebraic manipulation',
          subjectId: mathSubject.id,
          educationLevelId: oLevel.id,
          difficulty: 6,
          estimatedDuration: 120,
          learningObjectives: [
            'Solve linear equations',
            'Factor quadratic expressions',
            'Manipulate algebraic expressions'
          ],
        },
        {
          name: 'Geometry',
          description: 'Shapes, angles, area, and volume calculations',
          subjectId: mathSubject.id,
          educationLevelId: oLevel.id,
          difficulty: 5,
          estimatedDuration: 100,
          learningObjectives: [
            'Calculate areas and perimeters',
            'Understand geometric properties',
            'Apply Pythagoras theorem'
          ],
        },
        {
          name: 'Statistics',
          description: 'Data collection, analysis, and probability',
          subjectId: mathSubject.id,
          educationLevelId: oLevel.id,
          difficulty: 4,
          estimatedDuration: 80,
          learningObjectives: [
            'Interpret statistical data',
            'Calculate probability',
            'Create and read graphs'
          ],
        },
      ]).returning();

      console.log(`✅ Created ${mathTopics.length} mathematics topics`);
    }

    // Seed Career Paths
    console.log('💼 Seeding career paths...');
    const careerPaths = await db.insert(schema.careerPaths).values([
      {
        title: 'Software Engineer',
        description: 'Design, develop, and maintain software applications and systems',
        category: 'Technology',
        requiredSkills: [
          'Programming languages (Python, JavaScript, Java)',
          'Problem-solving',
          'Software architecture',
          'Version control (Git)',
          'Database management'
        ],
        salaryRange: {
          min: 60000,
          max: 150000,
          currency: 'USD'
        },
        growthOutlook: 'high',
        educationRequirements: [
          'Bachelor\'s degree in Computer Science or related field',
          'Strong programming portfolio',
          'Continuous learning mindset'
        ],
        certifications: [
          'AWS Certified Developer',
          'Google Cloud Professional',
          'Microsoft Azure Developer'
        ],
        workEnvironment: 'Office or remote, collaborative team environment',
      },
      {
        title: 'Data Scientist',
        description: 'Analyze complex data to extract insights and drive business decisions',
        category: 'Technology',
        requiredSkills: [
          'Statistics and mathematics',
          'Python/R programming',
          'Machine learning',
          'Data visualization',
          'SQL and databases'
        ],
        salaryRange: {
          min: 70000,
          max: 180000,
          currency: 'USD'
        },
        growthOutlook: 'high',
        educationRequirements: [
          'Bachelor\'s degree in Statistics, Mathematics, or Computer Science',
          'Master\'s degree preferred',
          'Strong analytical background'
        ],
        certifications: [
          'Certified Analytics Professional (CAP)',
          'Google Data Analytics Certificate',
          'IBM Data Science Professional Certificate'
        ],
        workEnvironment: 'Office or remote, cross-functional collaboration',
      },
      {
        title: 'Cybersecurity Analyst',
        description: 'Protect organizations from cyber threats and security breaches',
        category: 'Technology',
        requiredSkills: [
          'Network security',
          'Risk assessment',
          'Security tools and software',
          'Incident response',
          'Compliance frameworks'
        ],
        salaryRange: {
          min: 55000,
          max: 130000,
          currency: 'USD'
        },
        growthOutlook: 'very high',
        educationRequirements: [
          'Bachelor\'s degree in Cybersecurity or IT',
          'Security certifications',
          'Hands-on security experience'
        ],
        certifications: [
          'CompTIA Security+',
          'Certified Information Systems Security Professional (CISSP)',
          'Certified Ethical Hacker (CEH)'
        ],
        workEnvironment: 'Office environment, 24/7 monitoring responsibilities',
      },
      {
        title: 'Biomedical Engineer',
        description: 'Apply engineering principles to solve problems in medicine and biology',
        category: 'Engineering',
        requiredSkills: [
          'Engineering design',
          'Biology and physiology',
          'Medical device development',
          'Problem-solving',
          'Regulatory compliance'
        ],
        salaryRange: {
          min: 65000,
          max: 140000,
          currency: 'USD'
        },
        growthOutlook: 'high',
        educationRequirements: [
          'Bachelor\'s degree in Biomedical Engineering',
          'Strong foundation in biology and engineering',
          'Laboratory experience'
        ],
        certifications: [
          'Professional Engineer (PE) license',
          'Certified Biomedical Equipment Technician (CBET)',
          'FDA regulatory training'
        ],
        workEnvironment: 'Laboratories, hospitals, or manufacturing facilities',
      },
      {
        title: 'Environmental Scientist',
        description: 'Study the environment and solve environmental problems',
        category: 'Science',
        requiredSkills: [
          'Environmental monitoring',
          'Data analysis',
          'Research methodology',
          'Environmental regulations',
          'Field work techniques'
        ],
        salaryRange: {
          min: 50000,
          max: 120000,
          currency: 'USD'
        },
        growthOutlook: 'moderate',
        educationRequirements: [
          'Bachelor\'s degree in Environmental Science or related field',
          'Field research experience',
          'Understanding of environmental laws'
        ],
        certifications: [
          'Professional Geologist (PG)',
          'Certified Environmental Professional (CEP)',
          'HAZWOPER certification'
        ],
        workEnvironment: 'Mix of office work and outdoor fieldwork',
      },
      {
        title: 'Machine Learning Engineer',
        description: 'Design and implement machine learning systems and algorithms',
        category: 'Technology',
        requiredSkills: [
          'Machine learning algorithms',
          'Python/R programming',
          'Deep learning frameworks',
          'Cloud platforms',
          'Software engineering'
        ],
        salaryRange: {
          min: 90000,
          max: 200000,
          currency: 'USD'
        },
        growthOutlook: 'very high',
        educationRequirements: [
          'Bachelor\'s degree in Computer Science or Mathematics',
          'Master\'s degree in AI/ML preferred',
          'Strong programming background'
        ],
        certifications: [
          'Google Cloud ML Engineer',
          'AWS Certified Machine Learning',
          'TensorFlow Developer Certificate'
        ],
        workEnvironment: 'Tech companies, research labs, remote work options',
      },
    ]).returning();

    console.log(`✅ Created ${careerPaths.length} career paths`);

    // Seed Sample Achievements
    console.log('🏆 Seeding achievements...');
    const achievements = await db.insert(schema.achievements).values([
      {
        name: 'First Steps',
        description: 'Complete your first assessment',
        category: 'assessment',
        xpReward: 100,
        requirements: {
          type: 'assessment_completion',
          count: 1
        },
      },
      {
        name: 'Profile Master',
        description: 'Complete your full profile',
        category: 'profile',
        xpReward: 150,
        requirements: {
          type: 'profile_completion',
          completeness: 100
        },
      },
      {
        name: 'Learning Streak',
        description: 'Study for 7 consecutive days',
        category: 'streak',
        xpReward: 200,
        requirements: {
          type: 'daily_streak',
          days: 7
        },
      },
      {
        name: 'Course Creator',
        description: 'Generate your first personalized course',
        category: 'learning',
        xpReward: 75,
        requirements: {
          type: 'course_generation',
          count: 1
        },
      },
      {
        name: 'Knowledge Seeker',
        description: 'Complete 5 learning modules',
        category: 'learning',
        xpReward: 300,
        requirements: {
          type: 'module_completion',
          count: 5
        },
      },
      {
        name: 'STEM Explorer',
        description: 'Study topics from 3 different STEM subjects',
        category: 'learning',
        xpReward: 250,
        requirements: {
          type: 'subject_diversity',
          subjects: 3
        },
      },
    ]).returning();

    console.log(`✅ Created ${achievements.length} achievements`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Education Levels: ${educationLevels.length}`);
    console.log(`- Subjects: ${subjects.length}`);
    console.log(`- Career Paths: ${careerPaths.length}`);
    console.log(`- Achievements: ${achievements.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seeding function
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;
