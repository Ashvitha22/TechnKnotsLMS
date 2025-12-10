import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, Clock, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Course } from "@/lib/recommendationEngine";

interface CourseRecommendationsProps {
  recommendations: Course[];
  reason?: string;
}

export const CourseRecommendations = ({ recommendations, reason }: CourseRecommendationsProps) => {
  if (recommendations.length === 0) {
    return null;
  }

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'intermediate':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'advanced':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'expert':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">Recommended for You</h2>
      </div>
      {reason && (
        <p className="text-muted-foreground">{reason}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((course) => (
          <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-4xl">📚</span>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary">{course.category}</Badge>
                  <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {course.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span>{course.rating}</span>
                  </div>
                )}
                {course.students && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                )}
              </div>
              
              <Link to={`/courses/${course.id}`}>
                <Button className="w-full">View Course</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
