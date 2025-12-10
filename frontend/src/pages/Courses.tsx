import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Code2, Search, Clock, Users, Star, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Courses = () => {
  const allCourses = [
    {
      id: 1,
      title: "Complete JavaScript Masterclass",
      instructor: "Sarah Johnson",
      level: "Beginner",
      students: 15420,
      rating: 4.8,
      duration: "42 hours",
      lessons: 156,
      category: "Web Development",
      enrolled: true,
      progress: 65,
    },
    {
      id: 2,
      title: "Python Data Structures & Algorithms",
      instructor: "Mike Chen",
      level: "Intermediate",
      students: 12350,
      rating: 4.9,
      duration: "35 hours",
      lessons: 128,
      category: "Programming",
      enrolled: true,
      progress: 40,
    },
    {
      id: 3,
      title: "Advanced React Patterns",
      instructor: "Emma Watson",
      level: "Advanced",
      students: 8920,
      rating: 4.7,
      duration: "28 hours",
      lessons: 98,
      category: "Web Development",
      enrolled: false,
      progress: 0,
    },
    {
      id: 4,
      title: "System Design Interview Prep",
      instructor: "Alex Kumar",
      level: "Advanced",
      students: 11230,
      rating: 4.9,
      duration: "30 hours",
      lessons: 85,
      category: "Interview Prep",
      enrolled: false,
      progress: 0,
    },
    {
      id: 5,
      title: "SQL Database Fundamentals",
      instructor: "David Park",
      level: "Beginner",
      students: 18500,
      rating: 4.6,
      duration: "20 hours",
      lessons: 72,
      category: "Database",
      enrolled: false,
      progress: 0,
    },
    {
      id: 6,
      title: "Machine Learning with Python",
      instructor: "Lisa Anderson",
      level: "Intermediate",
      students: 9850,
      rating: 4.8,
      duration: "45 hours",
      lessons: 165,
      category: "AI/ML",
      enrolled: false,
      progress: 0,
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-success/10 text-success";
      case "Intermediate":
        return "bg-warning/10 text-warning";
      case "Advanced":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

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
            <Link to="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link to="/problems">
              <Button variant="ghost">Practice</Button>
            </Link>
            <Link to="/leaderboard">
              <Button variant="ghost">Leaderboard</Button>
            </Link>
            <Button variant="outline">Profile</Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Explore Courses
          </h1>
          <p className="text-muted-foreground">
            Master new skills with expert-led courses
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search courses by title, instructor, or topic..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="enrolled">My Courses</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCourses.map((course) => (
                <CourseCard key={course.id} course={course} getLevelColor={getLevelColor} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="enrolled" className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCourses
                .filter((c) => c.enrolled)
                .map((course) => (
                  <CourseCard key={course.id} course={course} getLevelColor={getLevelColor} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="popular" className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCourses
                .sort((a, b) => b.students - a.students)
                .map((course) => (
                  <CourseCard key={course.id} course={course} getLevelColor={getLevelColor} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="new" className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCourses.map((course) => (
                <CourseCard key={course.id} course={course} getLevelColor={getLevelColor} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const CourseCard = ({
  course,
  getLevelColor,
}: {
  course: any;
  getLevelColor: (level: string) => string;
}) => {
  return (
    <Card className="hover:shadow-lg transition-all hover:-translate-y-1 group cursor-pointer">
      <Link to={`/courses/${course.id}`} className="block">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <Badge variant="secondary">{course.category}</Badge>
            <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
          </div>
          <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </CardTitle>
          <CardDescription>by {course.instructor}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{course.lessons} lessons</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{course.students.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-warning">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-medium">{course.rating}</span>
              </div>
            </div>

            {/* Progress for enrolled courses */}
            {course.enrolled && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} />
              </div>
            )}

            {/* Action Button */}
            <div onClick={(e) => e.preventDefault()}>
              {course.enrolled ? (
                <Link to={`/code-editor/${course.id}`}>
                  <Button className="w-full">Continue Learning</Button>
                </Link>
              ) : (
                <Button className="w-full" variant="outline">
                  View Course
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default Courses;
