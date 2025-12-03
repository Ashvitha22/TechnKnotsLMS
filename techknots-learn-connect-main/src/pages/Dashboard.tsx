import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Code2, BookOpen, Trophy, Video, CheckCircle2, Clock } from "lucide-react";
import DailyChallenge from "@/components/DailyChallenge";
import { CourseRecommendations } from "@/components/CourseRecommendations";
import { generateRecommendations, getUserLearningPattern, Course } from "@/lib/recommendationEngine";

const Dashboard = () => {
  // Mock user's course data
  const userCourses: Course[] = [
    {
      id: 1,
      title: "Complete JavaScript Masterclass",
      category: "Web Development",
      level: "Beginner",
      tags: ["JavaScript", "Frontend", "ES6"],
      rating: 4.8,
      students: 15420,
      isEnrolled: true,
      progress: 100,
    },
    {
      id: 2,
      title: "Python Data Structures & Algorithms",
      category: "Programming",
      level: "Intermediate",
      tags: ["Python", "Algorithms", "Data Structures"],
      rating: 4.9,
      students: 12350,
      isEnrolled: true,
      progress: 40,
    },
  ];

  const allAvailableCourses: Course[] = [
    ...userCourses,
    {
      id: 3,
      title: "Advanced React Patterns",
      category: "Web Development",
      level: "Advanced",
      tags: ["React", "JavaScript", "Frontend"],
      rating: 4.7,
      students: 8920,
    },
    {
      id: 4,
      title: "Node.js Backend Development",
      category: "Web Development",
      level: "Intermediate",
      tags: ["Node.js", "Backend", "JavaScript"],
      rating: 4.8,
      students: 11230,
    },
    {
      id: 5,
      title: "TypeScript Fundamentals",
      category: "Web Development",
      level: "Intermediate",
      tags: ["TypeScript", "JavaScript", "Frontend"],
      rating: 4.9,
      students: 9500,
    },
    {
      id: 6,
      title: "Machine Learning with Python",
      category: "AI/ML",
      level: "Advanced",
      tags: ["Python", "Machine Learning", "AI"],
      rating: 4.8,
      students: 9850,
    },
    {
      id: 7,
      title: "Advanced Python Programming",
      category: "Programming",
      level: "Advanced",
      tags: ["Python", "Advanced", "OOP"],
      rating: 4.7,
      students: 8200,
    },
    {
      id: 8,
      title: "Full Stack JavaScript",
      category: "Web Development",
      level: "Advanced",
      tags: ["JavaScript", "Full Stack", "MERN"],
      rating: 4.9,
      students: 12100,
    },
  ];

  const userPattern = getUserLearningPattern(userCourses);
  const recommendations = generateRecommendations(allAvailableCourses, userPattern, 6);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">TechKnots</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/courses">
              <Button variant="ghost">Courses</Button>
            </Link>
            <Link to="/problems">
              <Button variant="ghost">Practice</Button>
            </Link>
            <Link to="/leaderboard">
              <Button variant="ghost">Leaderboard</Button>
            </Link>
            <Link to="/achievements">
              <Button variant="ghost">
                <Trophy className="h-4 w-4 mr-2" />
                Achievements
              </Button>
            </Link>
            <Button variant="outline">Profile</Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, Student!
          </h1>
          <p className="text-muted-foreground">
            Continue your learning journey where you left off
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<BookOpen className="h-6 w-6" />}
            label="Courses Enrolled"
            value="5"
            color="text-primary"
          />
          <StatCard
            icon={<CheckCircle2 className="h-6 w-6" />}
            label="Problems Solved"
            value="127"
            color="text-success"
          />
          <StatCard
            icon={<Trophy className="h-6 w-6" />}
            label="Global Rank"
            value="#234"
            color="text-warning"
          />
          <StatCard
            icon={<Clock className="h-6 w-6" />}
            label="Learning Hours"
            value="48h"
            color="text-info"
          />
        </div>

        {/* Daily Challenge */}
        <section className="mb-8">
          <DailyChallenge currentStreak={7} completed={false} />
        </section>

        {/* Continue Learning */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Continue Learning</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <CourseCard
              title="Advanced JavaScript"
              instructor="Sarah Johnson"
              progress={65}
              nextLesson="Async/Await Patterns"
              thumbnail="js"
            />
            <CourseCard
              title="Python Data Structures"
              instructor="Mike Chen"
              progress={40}
              nextLesson="Trees and Graphs"
              thumbnail="python"
            />
          </div>
        </section>

        {/* Upcoming Live Sessions */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Live Sessions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <LiveSessionCard
              title="System Design Fundamentals"
              instructor="Alex Kumar"
              time="Today, 3:00 PM"
              duration="2 hours"
            />
            <LiveSessionCard
              title="React Advanced Patterns"
              instructor="Emma Watson"
              time="Tomorrow, 10:00 AM"
              duration="1.5 hours"
            />
            <LiveSessionCard
              title="Database Optimization"
              instructor="David Park"
              time="Friday, 4:00 PM"
              duration="2 hours"
            />
          </div>
        </section>

        {/* Recommended Challenges */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Recommended Challenges</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <ChallengeCard
              title="Two Sum Problem"
              difficulty="Easy"
              acceptance="45%"
              tags={["Array", "Hash Table"]}
            />
            <ChallengeCard
              title="Binary Tree Traversal"
              difficulty="Medium"
              acceptance="62%"
              tags={["Tree", "DFS"]}
            />
            <ChallengeCard
              title="Dynamic Programming Classic"
              difficulty="Hard"
              acceptance="28%"
              tags={["DP", "Algorithm"]}
            />
          </div>
        </section>

        {/* Personalized Recommendations */}
        <section className="mb-8">
          <CourseRecommendations 
            recommendations={recommendations}
            reason="Based on your completed JavaScript course and current Python progress"
          />
        </section>
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={color}>{icon}</div>
      </div>
    </CardContent>
  </Card>
);

const CourseCard = ({
  title,
  instructor,
  progress,
  nextLesson,
  thumbnail,
}: {
  title: string;
  instructor: string;
  progress: number;
  nextLesson: string;
  thumbnail: string;
}) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <CardTitle className="text-xl">{title}</CardTitle>
      <CardDescription>by {instructor}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Next: {nextLesson}
      </p>
      <Button className="w-full">Continue Learning</Button>
    </CardContent>
  </Card>
);

const LiveSessionCard = ({
  title,
  instructor,
  time,
  duration,
}: {
  title: string;
  instructor: string;
  time: string;
  duration: string;
}) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <div className="flex items-start justify-between mb-2">
        <Video className="h-6 w-6 text-primary" />
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Live</span>
      </div>
      <CardTitle className="text-lg">{title}</CardTitle>
      <CardDescription>with {instructor}</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-1">{time}</p>
      <p className="text-sm text-muted-foreground mb-4">Duration: {duration}</p>
      <Button variant="outline" className="w-full">Set Reminder</Button>
    </CardContent>
  </Card>
);

const ChallengeCard = ({
  title,
  difficulty,
  acceptance,
  tags,
}: {
  title: string;
  difficulty: string;
  acceptance: string;
  tags: string[];
}) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy":
        return "text-success bg-success/10";
      case "Medium":
        return "text-warning bg-warning/10";
      case "Hard":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted bg-muted";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Code2 className="h-6 w-6 text-primary" />
          <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>Acceptance: {acceptance}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <Button className="w-full">Solve Challenge</Button>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
