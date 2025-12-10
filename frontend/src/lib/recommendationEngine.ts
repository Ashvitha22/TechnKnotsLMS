// Client-side recommendation engine
export interface Course {
  id: number;
  title: string;
  category: string;
  level: string;
  tags?: string[];
  rating?: number;
  students?: number;
  isEnrolled?: boolean;
  progress?: number;
}

export interface UserLearningPattern {
  completedCourses: Course[];
  enrolledCourses: Course[];
  preferredCategories: string[];
  currentLevel: string;
}

export function generateRecommendations(
  allCourses: Course[],
  userPattern: UserLearningPattern,
  limit: number = 6
): Course[] {
  const completed = userPattern.completedCourses || [];
  const enrolled = userPattern.enrolledCourses || [];
  
  // Extract learning patterns
  const categoryScores = new Map<string, number>();
  const tagScores = new Map<string, number>();
  
  completed.forEach(course => {
    categoryScores.set(course.category, (categoryScores.get(course.category) || 0) + 2);
    course.tags?.forEach(tag => {
      tagScores.set(tag, (tagScores.get(tag) || 0) + 1);
    });
  });
  
  enrolled.forEach(course => {
    categoryScores.set(course.category, (categoryScores.get(course.category) || 0) + 1);
    course.tags?.forEach(tag => {
      tagScores.set(tag, (tagScores.get(tag) || 0) + 0.5);
    });
  });
  
  // Determine next difficulty level
  const levelProgression: Record<string, string[]> = {
    'Beginner': ['Beginner', 'Intermediate'],
    'Intermediate': ['Intermediate', 'Advanced'],
    'Advanced': ['Advanced', 'Expert'],
    'Expert': ['Expert', 'Advanced']
  };
  
  const targetLevels = levelProgression[userPattern.currentLevel] || ['Beginner'];
  
  // Score all non-enrolled courses
  const enrolledIds = new Set([...completed.map(c => c.id), ...enrolled.map(c => c.id)]);
  
  const scoredCourses = allCourses
    .filter(course => !enrolledIds.has(course.id))
    .map(course => {
      let score = 0;
      
      // Category match
      score += (categoryScores.get(course.category) || 0) * 3;
      
      // Tag match
      course.tags?.forEach(tag => {
        score += (tagScores.get(tag) || 0) * 2;
      });
      
      // Level appropriateness
      if (targetLevels.includes(course.level)) {
        score += 5;
      }
      
      // Quality indicators
      score += (course.rating || 0) * 0.5;
      score += Math.log(course.students || 1) * 0.1;
      
      return { course, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.course);
  
  return scoredCourses;
}

export function getUserLearningPattern(courses: Course[]): UserLearningPattern {
  const completed = courses.filter(c => c.progress === 100);
  const enrolled = courses.filter(c => c.isEnrolled && c.progress !== 100);
  
  const categories = new Set(completed.map(c => c.category));
  
  // Determine current level based on completed courses
  const levels = completed.map(c => c.level);
  let currentLevel = 'Beginner';
  if (levels.includes('Advanced') || levels.includes('Expert')) {
    currentLevel = 'Advanced';
  } else if (levels.includes('Intermediate')) {
    currentLevel = 'Intermediate';
  }
  
  return {
    completedCourses: completed,
    enrolledCourses: enrolled,
    preferredCategories: Array.from(categories),
    currentLevel
  };
}
