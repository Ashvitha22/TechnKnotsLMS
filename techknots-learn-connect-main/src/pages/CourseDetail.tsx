import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Code2, 
  ArrowLeft, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  CheckCircle2, 
  PlayCircle,
  Download,
  Award,
  Target,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import VideoPlayer from "@/components/VideoPlayer";
import { DiscussionForum } from "@/components/DiscussionForum";
import { DownloadableResources } from "@/components/DownloadableResources";
import { CourseNotes } from "@/components/CourseNotes";
import { CertificateGenerator } from "@/components/CertificateGenerator";

const CourseDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [activeLesson, setActiveLesson] = useState<{
    title: string;
    sectionIndex: number;
    lessonIndex: number;
  } | null>(null);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [seekToTime, setSeekToTime] = useState<number | undefined>(undefined);

  const courseData: Record<string, any> = {
    "1": {
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
      price: 0,
      description: "Master JavaScript from the ground up with this comprehensive course. Learn modern ES6+ features, asynchronous programming, DOM manipulation, and much more. Perfect for beginners who want to become proficient JavaScript developers.",
      whatYouLearn: [
        "Modern JavaScript ES6+ syntax and features",
        "Asynchronous programming with Promises and Async/Await",
        "DOM manipulation and event handling",
        "Object-oriented programming in JavaScript",
        "Functional programming concepts",
        "Working with APIs and fetch",
        "Error handling and debugging techniques",
        "Best practices and design patterns"
      ],
      requirements: [
        "Basic understanding of HTML and CSS",
        "A computer with internet connection",
        "Willingness to learn and practice"
      ],
      curriculum: [
        {
          section: "Introduction to JavaScript",
          duration: "5 hours",
          lessons: [
            { title: "Welcome to the Course", duration: "10:30", type: "video", completed: true },
            { title: "Setting Up Your Development Environment", duration: "15:45", type: "video", completed: true },
            { title: "JavaScript Basics: Variables and Data Types", duration: "25:20", type: "video", completed: true },
            { title: "Operators and Expressions", duration: "20:15", type: "video", completed: true },
            { title: "Quiz: JavaScript Fundamentals", duration: "10:00", type: "quiz", completed: false }
          ]
        },
        {
          section: "Control Flow and Functions",
          duration: "8 hours",
          lessons: [
            { title: "Conditional Statements", duration: "30:45", type: "video", completed: true },
            { title: "Loops and Iteration", duration: "35:20", type: "video", completed: true },
            { title: "Functions: Declaration and Expression", duration: "28:15", type: "video", completed: false },
            { title: "Arrow Functions and Callbacks", duration: "32:10", type: "video", completed: false },
            { title: "Scope and Closures", duration: "40:30", type: "video", completed: false },
            { title: "Practice: Building a Calculator", duration: "45:00", type: "project", completed: false }
          ]
        },
        {
          section: "Objects and Arrays",
          duration: "7 hours",
          lessons: [
            { title: "Working with Objects", duration: "35:20", type: "video", completed: false },
            { title: "Object Methods and This Keyword", duration: "30:45", type: "video", completed: false },
            { title: "Arrays and Array Methods", duration: "40:15", type: "video", completed: false },
            { title: "Destructuring and Spread Operator", duration: "25:30", type: "video", completed: false },
            { title: "Map, Filter, and Reduce", duration: "38:20", type: "video", completed: false }
          ]
        },
        {
          section: "Asynchronous JavaScript",
          duration: "9 hours",
          lessons: [
            { title: "Understanding Callbacks", duration: "28:15", type: "video", completed: false },
            { title: "Promises and Promise Chaining", duration: "42:30", type: "video", completed: false },
            { title: "Async/Await Syntax", duration: "35:45", type: "video", completed: false },
            { title: "Error Handling in Async Code", duration: "30:20", type: "video", completed: false },
            { title: "Working with APIs", duration: "50:15", type: "video", completed: false }
          ]
        },
        {
          section: "DOM Manipulation",
          duration: "6 hours",
          lessons: [
            { title: "Introduction to the DOM", duration: "25:30", type: "video", completed: false },
            { title: "Selecting and Modifying Elements", duration: "32:45", type: "video", completed: false },
            { title: "Event Listeners and Event Handling", duration: "38:20", type: "video", completed: false },
            { title: "Creating and Removing Elements", duration: "28:15", type: "video", completed: false },
            { title: "Project: Interactive To-Do List", duration: "60:00", type: "project", completed: false }
          ]
        },
        {
          section: "Advanced Topics",
          duration: "7 hours",
          lessons: [
            { title: "Object-Oriented Programming", duration: "45:30", type: "video", completed: false },
            { title: "Classes and Inheritance", duration: "40:20", type: "video", completed: false },
            { title: "Modules and Import/Export", duration: "35:15", type: "video", completed: false },
            { title: "Error Handling Best Practices", duration: "30:45", type: "video", completed: false },
            { title: "Final Project: Building a Web Application", duration: "90:00", type: "project", completed: false }
          ]
        }
      ],
      instructor_bio: "Sarah Johnson is a senior software engineer with over 10 years of experience in web development. She has worked with major tech companies and has taught programming to thousands of students worldwide.",
      certificates: true,
      lifetime_access: true,
      downloadable_resources: 45
    },
    "2": {
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
      price: 0,
      description: "Deep dive into data structures and algorithms using Python. Master the fundamental concepts that will make you a better programmer and ace your technical interviews.",
      whatYouLearn: [
        "Core data structures: Arrays, Linked Lists, Stacks, Queues",
        "Trees and Graph algorithms",
        "Sorting and searching algorithms",
        "Dynamic programming techniques",
        "Time and space complexity analysis",
        "Hash tables and hash functions",
        "Algorithm design patterns",
        "Interview problem-solving strategies"
      ],
      requirements: [
        "Basic Python programming knowledge",
        "Understanding of basic programming concepts",
        "Mathematical reasoning skills"
      ],
      curriculum: [
        {
          section: "Introduction & Complexity Analysis",
          duration: "4 hours",
          lessons: [
            { title: "Course Overview", duration: "12:30", type: "video", completed: true },
            { title: "Big O Notation", duration: "35:20", type: "video", completed: true },
            { title: "Time Complexity Analysis", duration: "40:15", type: "video", completed: true },
            { title: "Space Complexity", duration: "28:30", type: "video", completed: false }
          ]
        },
        {
          section: "Arrays and Strings",
          duration: "6 hours",
          lessons: [
            { title: "Array Fundamentals", duration: "30:45", type: "video", completed: false },
            { title: "Two Pointer Technique", duration: "35:20", type: "video", completed: false },
            { title: "Sliding Window Pattern", duration: "42:15", type: "video", completed: false },
            { title: "String Manipulation", duration: "38:30", type: "video", completed: false },
            { title: "Practice Problems", duration: "45:00", type: "coding", completed: false }
          ]
        }
      ],
      instructor_bio: "Mike Chen is a principal engineer at a leading tech company and has been interviewing candidates for over 8 years. He specializes in algorithm optimization and system design.",
      certificates: true,
      lifetime_access: true,
      downloadable_resources: 60
    }
  };

  const course = courseData[id || "1"] || courseData["1"];

  const getNextLesson = (currentSectionIndex: number, currentLessonIndex: number) => {
    const currentSection = course.curriculum[currentSectionIndex];
    
    // Check if there's a next lesson in the current section
    if (currentLessonIndex + 1 < currentSection.lessons.length) {
      return {
        title: currentSection.lessons[currentLessonIndex + 1].title,
        sectionIndex: currentSectionIndex,
        lessonIndex: currentLessonIndex + 1,
      };
    }
    
    // Check if there's a next section
    if (currentSectionIndex + 1 < course.curriculum.length) {
      return {
        title: course.curriculum[currentSectionIndex + 1].lessons[0].title,
        sectionIndex: currentSectionIndex + 1,
        lessonIndex: 0,
      };
    }
    
    return null;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-success/10 text-success border-success/20";
      case "Intermediate":
        return "bg-warning/10 text-warning border-warning/20";
      case "Advanced":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const handleEnrollment = () => {
    toast({
      title: "Enrollment Successful!",
      description: `You've enrolled in ${course.title}`,
    });
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
            <Link to="/courses">
              <Button variant="ghost">Courses</Button>
            </Link>
            <Link to="/problems">
              <Button variant="ghost">Practice</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <Link to="/courses">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </Button>
          </Link>
        </div>
      </div>

      {/* Course Header */}
      <div className="bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Badge variant="secondary" className="mb-4">
                {course.category}
              </Badge>
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg opacity-90 mb-6">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="opacity-75">({course.students.toLocaleString()} students)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{course.lessons} lessons</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm opacity-75">Created by {course.instructor}</span>
                <Badge className={getLevelColor(course.level)} variant="outline">
                  {course.level}
                </Badge>
              </div>

              {course.enrolled && (
                <div className="bg-background/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Your Progress</span>
                    <span className="text-sm font-semibold">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              )}
            </div>

            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>
                    {course.price === 0 ? "Free Course" : `$${course.price}`}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {course.enrolled ? (
                    <Link to={`/code-editor/${course.id}`}>
                      <Button className="w-full" size="lg">
                        Continue Learning
                      </Button>
                    </Link>
                  ) : (
                    <Button className="w-full" size="lg" onClick={handleEnrollment}>
                      Enroll Now
                    </Button>
                  )}
                  
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Download className="h-5 w-5 text-primary" />
                      <span>{course.downloadable_resources} downloadable resources</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Award className="h-5 w-5 text-warning" />
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Video Player */}
            {activeLesson && course.enrolled && (
              <div className="mb-8">
                <VideoPlayer
                  lessonTitle={activeLesson.title}
                  lessonId={`${activeLesson.sectionIndex}-${activeLesson.lessonIndex}`}
                  courseId={course.id.toString()}
                  onProgress={(progress) => {
                    console.log(`Lesson progress: ${progress}%`);
                  }}
                  onComplete={() => {
                    toast({
                      title: "Lesson Complete!",
                      description: "Great job! Moving to the next lesson.",
                    });
                    
                    // Auto-play next lesson
                    const nextLesson = getNextLesson(
                      activeLesson.sectionIndex,
                      activeLesson.lessonIndex
                    );
                    if (nextLesson) {
                      setActiveLesson(nextLesson);
                    }
                  }}
                  onTimeUpdate={setCurrentVideoTime}
                  seekToTime={seekToTime}
                />
              </div>
            )}

            <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-8 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            {course.progress === 100 && (
              <TabsTrigger value="certificate" className="relative">
                Certificate
                <Award className="h-3 w-3 ml-1 text-warning" />
              </TabsTrigger>
            )}
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  What You'll Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.whatYouLearn.map((item: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {course.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="curriculum">
            <Card>
              <CardHeader>
                <CardTitle>Course Curriculum</CardTitle>
                <CardDescription>
                  {course.lessons} lessons • {course.duration} total length
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {course.curriculum.map((section: any, sectionIndex: number) => (
                    <AccordionItem key={sectionIndex} value={`section-${sectionIndex}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <span className="font-semibold text-left">{section.section}</span>
                          <span className="text-sm text-muted-foreground">
                            {section.lessons.length} lessons • {section.duration}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-2">
                          {section.lessons.map((lesson: any, lessonIndex: number) => (
                            <div
                              key={lessonIndex}
                              className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors cursor-pointer group"
                              onClick={() => {
                                if (lesson.type === "video" && course.enrolled) {
                                  setActiveLesson({
                                    title: lesson.title,
                                    sectionIndex,
                                    lessonIndex,
                                  });
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }
                              }}
                            >
                              <div className="flex items-center gap-3">
                                {lesson.completed ? (
                                  <CheckCircle2 className="h-5 w-5 text-success" />
                                ) : lesson.type === "video" ? (
                                  <PlayCircle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                ) : (
                                  <PlayCircle className="h-5 w-5 text-muted-foreground" />
                                )}
                                <div>
                                  <div className="font-medium text-sm group-hover:text-primary transition-colors">
                                    {lesson.title}
                                  </div>
                                  <div className="text-xs text-muted-foreground capitalize">
                                    {lesson.type}
                                  </div>
                                </div>
                              </div>
                              <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <CourseNotes 
              courseId={id || "1"}
              currentLessonId={activeLesson ? `${activeLesson.sectionIndex}-${activeLesson.lessonIndex}` : undefined}
              currentLessonTitle={activeLesson?.title}
              currentVideoTime={currentVideoTime}
              onSeekToTimestamp={(timestamp) => {
                setSeekToTime(timestamp);
                setTimeout(() => setSeekToTime(undefined), 100);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </TabsContent>

          <TabsContent value="resources">
            <DownloadableResources courseId={id || "1"} />
          </TabsContent>

          {course.progress === 100 && (
            <TabsContent value="certificate">
              <CertificateGenerator
                courseTitle={course.title}
                courseId={course.id.toString()}
                completionDate={new Date()}
              />
            </TabsContent>
          )}


          <TabsContent value="instructor">
            <Card>
              <CardHeader>
                <CardTitle>About the Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-24 w-24 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-3xl font-bold flex-shrink-0">
                      {course.instructor.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{course.instructor}</h3>
                      <p className="text-muted-foreground">{course.instructor_bio}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{course.rating}</div>
                      <div className="text-sm text-muted-foreground">Instructor Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {course.students.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {Object.keys(courseData).filter((k) => courseData[k].instructor === course.instructor).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Courses</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Student Reviews</CardTitle>
                <CardDescription>
                  See what students are saying about this course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Reviews coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discussions">
            <DiscussionForum courseId={id || "1"} />
          </TabsContent>
        </Tabs>
          </div>

          {/* Sidebar with lesson list */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Course Lessons</CardTitle>
                <CardDescription>Click any video lesson to start learning</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                {course.enrolled ? (
                  <div className="space-y-4">
                    {course.curriculum.map((section: any, sectionIndex: number) => (
                      <div key={sectionIndex}>
                        <h4 className="font-semibold text-sm mb-2">{section.section}</h4>
                        <div className="space-y-1">
                          {section.lessons
                            .filter((lesson: any) => lesson.type === "video")
                            .map((lesson: any, lessonIndex: number) => {
                              const actualLessonIndex = section.lessons.indexOf(lesson);
                              return (
                                <button
                                  key={actualLessonIndex}
                                  onClick={() => {
                                    setActiveLesson({
                                      title: lesson.title,
                                      sectionIndex,
                                      lessonIndex: actualLessonIndex,
                                    });
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                  }}
                                  className="w-full text-left p-2 rounded-md hover:bg-muted transition-colors text-sm flex items-center gap-2"
                                >
                                  {lesson.completed ? (
                                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                                  ) : (
                                    <PlayCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                  )}
                                  <span className="truncate">{lesson.title}</span>
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm mb-4">
                      Enroll in this course to access all lessons
                    </p>
                    <Button onClick={handleEnrollment}>Enroll Now</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
