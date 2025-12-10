import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Target, 
  Flame, 
  Code, 
  Award, 
  Star, 
  Zap,
  Lock,
  Check,
  ArrowLeft,
  TrendingUp
} from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: "challenges" | "problems" | "streaks" | "milestones" | "points";
  icon: typeof Trophy;
  points: number;
  requirement: number;
  currentProgress: number;
  unlocked: boolean;
  tier: "bronze" | "silver" | "gold" | "platinum";
}

const tierColors = {
  bronze: "text-orange-700 bg-orange-100 border-orange-300",
  silver: "text-gray-700 bg-gray-100 border-gray-300",
  gold: "text-yellow-700 bg-yellow-100 border-yellow-300",
  platinum: "text-purple-700 bg-purple-100 border-purple-300",
};

const tierGradients = {
  bronze: "from-orange-500 to-orange-700",
  silver: "from-gray-400 to-gray-600",
  gold: "from-yellow-500 to-yellow-600",
  platinum: "from-purple-500 to-purple-700",
};

export default function Achievements() {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [unlockedCount, setUnlockedCount] = useState(0);

  useEffect(() => {
    // Load user stats from localStorage
    const stats = {
      challengesCompleted: parseInt(localStorage.getItem("challengesCompleted") || "12"),
      problemsSolved: parseInt(localStorage.getItem("problemsSolved") || "45"),
      currentStreak: parseInt(localStorage.getItem("currentStreak") || "7"),
      longestStreak: parseInt(localStorage.getItem("longestStreak") || "15"),
      totalPoints: parseInt(localStorage.getItem("userPoints") || "850"),
    };

    // Define all achievements
    const allAchievements: Achievement[] = [
      // Challenge Achievements
      {
        id: "challenge-1",
        name: "First Steps",
        description: "Complete your first daily challenge",
        category: "challenges",
        icon: Target,
        points: 50,
        requirement: 1,
        currentProgress: Math.min(stats.challengesCompleted, 1),
        unlocked: stats.challengesCompleted >= 1,
        tier: "bronze",
      },
      {
        id: "challenge-2",
        name: "Challenge Enthusiast",
        description: "Complete 10 daily challenges",
        category: "challenges",
        icon: Target,
        points: 100,
        requirement: 10,
        currentProgress: Math.min(stats.challengesCompleted, 10),
        unlocked: stats.challengesCompleted >= 10,
        tier: "silver",
      },
      {
        id: "challenge-3",
        name: "Challenge Master",
        description: "Complete 50 daily challenges",
        category: "challenges",
        icon: Target,
        points: 300,
        requirement: 50,
        currentProgress: Math.min(stats.challengesCompleted, 50),
        unlocked: stats.challengesCompleted >= 50,
        tier: "gold",
      },
      {
        id: "challenge-4",
        name: "Challenge Legend",
        description: "Complete 100 daily challenges",
        category: "challenges",
        icon: Target,
        points: 500,
        requirement: 100,
        currentProgress: Math.min(stats.challengesCompleted, 100),
        unlocked: stats.challengesCompleted >= 100,
        tier: "platinum",
      },

      // Problem Solving Achievements
      {
        id: "problem-1",
        name: "Problem Solver",
        description: "Solve your first problem",
        category: "problems",
        icon: Code,
        points: 50,
        requirement: 1,
        currentProgress: Math.min(stats.problemsSolved, 1),
        unlocked: stats.problemsSolved >= 1,
        tier: "bronze",
      },
      {
        id: "problem-2",
        name: "Code Warrior",
        description: "Solve 25 problems",
        category: "problems",
        icon: Code,
        points: 150,
        requirement: 25,
        currentProgress: Math.min(stats.problemsSolved, 25),
        unlocked: stats.problemsSolved >= 25,
        tier: "silver",
      },
      {
        id: "problem-3",
        name: "Algorithm Expert",
        description: "Solve 100 problems",
        category: "problems",
        icon: Code,
        points: 400,
        requirement: 100,
        currentProgress: Math.min(stats.problemsSolved, 100),
        unlocked: stats.problemsSolved >= 100,
        tier: "gold",
      },
      {
        id: "problem-4",
        name: "Coding Grandmaster",
        description: "Solve 500 problems",
        category: "problems",
        icon: Code,
        points: 1000,
        requirement: 500,
        currentProgress: Math.min(stats.problemsSolved, 500),
        unlocked: stats.problemsSolved >= 500,
        tier: "platinum",
      },

      // Streak Achievements
      {
        id: "streak-1",
        name: "On Fire",
        description: "Maintain a 3-day streak",
        category: "streaks",
        icon: Flame,
        points: 75,
        requirement: 3,
        currentProgress: Math.min(stats.currentStreak, 3),
        unlocked: stats.currentStreak >= 3,
        tier: "bronze",
      },
      {
        id: "streak-2",
        name: "Consistency Champion",
        description: "Maintain a 7-day streak",
        category: "streaks",
        icon: Flame,
        points: 150,
        requirement: 7,
        currentProgress: Math.min(stats.currentStreak, 7),
        unlocked: stats.currentStreak >= 7,
        tier: "silver",
      },
      {
        id: "streak-3",
        name: "Dedication Master",
        description: "Maintain a 30-day streak",
        category: "streaks",
        icon: Flame,
        points: 500,
        requirement: 30,
        currentProgress: Math.min(stats.currentStreak, 30),
        unlocked: stats.currentStreak >= 30,
        tier: "gold",
      },
      {
        id: "streak-4",
        name: "Unstoppable Force",
        description: "Maintain a 100-day streak",
        category: "streaks",
        icon: Flame,
        points: 1500,
        requirement: 100,
        currentProgress: Math.min(stats.currentStreak, 100),
        unlocked: stats.currentStreak >= 100,
        tier: "platinum",
      },

      // Milestone Achievements
      {
        id: "milestone-1",
        name: "Getting Started",
        description: "Complete your profile setup",
        category: "milestones",
        icon: Star,
        points: 25,
        requirement: 1,
        currentProgress: 1,
        unlocked: true,
        tier: "bronze",
      },
      {
        id: "milestone-2",
        name: "First Purchase",
        description: "Redeem your first reward",
        category: "milestones",
        icon: Award,
        points: 100,
        requirement: 1,
        currentProgress: JSON.parse(localStorage.getItem("purchasedRewards") || "[]").length > 0 ? 1 : 0,
        unlocked: JSON.parse(localStorage.getItem("purchasedRewards") || "[]").length > 0,
        tier: "silver",
      },
      {
        id: "milestone-3",
        name: "Social Butterfly",
        description: "Share your first achievement",
        category: "milestones",
        icon: Star,
        points: 50,
        requirement: 1,
        currentProgress: 0,
        unlocked: false,
        tier: "bronze",
      },

      // Points Achievements
      {
        id: "points-1",
        name: "Point Collector",
        description: "Earn 500 total points",
        category: "points",
        icon: Zap,
        points: 100,
        requirement: 500,
        currentProgress: Math.min(stats.totalPoints, 500),
        unlocked: stats.totalPoints >= 500,
        tier: "bronze",
      },
      {
        id: "points-2",
        name: "Point Hoarder",
        description: "Earn 2,000 total points",
        category: "points",
        icon: Zap,
        points: 250,
        requirement: 2000,
        currentProgress: Math.min(stats.totalPoints, 2000),
        unlocked: stats.totalPoints >= 2000,
        tier: "silver",
      },
      {
        id: "points-3",
        name: "Point Millionaire",
        description: "Earn 10,000 total points",
        category: "points",
        icon: Zap,
        points: 1000,
        requirement: 10000,
        currentProgress: Math.min(stats.totalPoints, 10000),
        unlocked: stats.totalPoints >= 10000,
        tier: "gold",
      },
    ];

    setAchievements(allAchievements);
    setUnlockedCount(allAchievements.filter(a => a.unlocked).length);
    setTotalPoints(allAchievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0));
  }, []);

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
    const Icon = achievement.icon;
    const progress = (achievement.currentProgress / achievement.requirement) * 100;

    return (
      <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${
        achievement.unlocked ? "border-2" : "opacity-75"
      }`}>
        {achievement.unlocked && (
          <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${tierGradients[achievement.tier]} opacity-10 rounded-bl-full`} />
        )}
        
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${
                achievement.unlocked 
                  ? `bg-gradient-to-br ${tierGradients[achievement.tier]} text-white` 
                  : "bg-muted text-muted-foreground"
              }`}>
                {achievement.unlocked ? (
                  <Icon className="h-6 w-6" />
                ) : (
                  <Lock className="h-6 w-6" />
                )}
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  {achievement.name}
                  {achievement.unlocked && (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                </CardTitle>
                <CardDescription>{achievement.description}</CardDescription>
              </div>
            </div>
            <Badge className={tierColors[achievement.tier]}>
              {achievement.tier}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {achievement.currentProgress} / {achievement.requirement}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="font-bold text-primary">+{achievement.points}</span>
              <span className="text-sm text-muted-foreground">points</span>
            </div>
            {achievement.unlocked && (
              <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-green-200">
                Unlocked
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const categoryData = {
    challenges: { name: "Challenges", icon: Target, color: "text-blue-500" },
    problems: { name: "Problems", icon: Code, color: "text-green-500" },
    streaks: { name: "Streaks", icon: Flame, color: "text-orange-500" },
    milestones: { name: "Milestones", icon: Star, color: "text-yellow-500" },
    points: { name: "Points", icon: Zap, color: "text-purple-500" },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Achievements</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="font-bold">{unlockedCount}</span>
                <span className="text-sm text-muted-foreground">/ {achievements.length}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Stats Overview */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Achievements</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unlockedCount} / {achievements.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((unlockedCount / achievements.length) * 100)}% completed
              </p>
              <Progress 
                value={(unlockedCount / achievements.length) * 100} 
                className="mt-2 h-2" 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievement Points</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPoints.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                From unlocked achievements
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((unlockedCount / achievements.length) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Keep going!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Grid */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-6 max-w-4xl mx-auto mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            {Object.entries(categoryData).map(([key, data]) => {
              const Icon = data.icon;
              return (
                <TabsTrigger key={key} value={key} className="gap-2">
                  <Icon className={`h-4 w-4 ${data.color}`} />
                  {data.name}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </TabsContent>

          {Object.keys(categoryData).map((category) => (
            <TabsContent key={category} value={category} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements
                  .filter((a) => a.category === category)
                  .map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
