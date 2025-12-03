import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Award, BookOpen, Crown, Palette, Lock, Check, Coins, ArrowLeft } from "lucide-react";

interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  category: "courses" | "badges" | "content" | "customization";
  icon: typeof Award;
  purchased?: boolean;
}

const rewards: Reward[] = [
  // Premium Courses
  { id: "course-1", name: "Advanced Algorithms Masterclass", description: "Deep dive into complex algorithms and optimization techniques", points: 500, category: "courses", icon: BookOpen },
  { id: "course-2", name: "System Design Interview Prep", description: "Learn to ace system design interviews at top tech companies", points: 750, category: "courses", icon: BookOpen },
  { id: "course-3", name: "Competitive Programming Pro", description: "Master competitive programming strategies and techniques", points: 600, category: "courses", icon: BookOpen },
  
  // Badges
  { id: "badge-1", name: "Code Warrior Badge", description: "Show off your coding prowess with this exclusive badge", points: 200, category: "badges", icon: Award },
  { id: "badge-2", name: "Streak Master Badge", description: "Earned by dedicated daily challenge completers", points: 300, category: "badges", icon: Award },
  { id: "badge-3", name: "Algorithm Expert Badge", description: "Display your algorithm expertise on your profile", points: 400, category: "badges", icon: Award },
  { id: "badge-4", name: "Elite Coder Crown", description: "The ultimate status symbol for top performers", points: 1000, category: "badges", icon: Crown },
  
  // Exclusive Content
  { id: "content-1", name: "Interview Questions Database", description: "Access 500+ curated interview questions from FAANG companies", points: 450, category: "content", icon: Lock },
  { id: "content-2", name: "Solution Video Library", description: "Expert walkthroughs of 100+ hard problems", points: 550, category: "content", icon: Lock },
  { id: "content-3", name: "Weekly Live Coding Sessions", description: "Join exclusive live sessions with industry experts", points: 800, category: "content", icon: Lock },
  
  // Profile Customization
  { id: "custom-1", name: "Custom Profile Theme", description: "Unlock premium color themes for your profile", points: 250, category: "customization", icon: Palette },
  { id: "custom-2", name: "Animated Avatar Border", description: "Add stunning animations to your profile picture", points: 350, category: "customization", icon: Palette },
  { id: "custom-3", name: "Profile Banner Collection", description: "Choose from 20+ premium profile banners", points: 300, category: "customization", icon: Palette },
];

export default function RewardsShop() {
  const navigate = useNavigate();
  const [userPoints, setUserPoints] = useState(0);
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  useEffect(() => {
    const points = localStorage.getItem("userPoints") || "850";
    const purchased = JSON.parse(localStorage.getItem("purchasedRewards") || "[]");
    setUserPoints(parseInt(points));
    setPurchasedItems(purchased);
  }, []);

  const handlePurchase = (reward: Reward) => {
    if (purchasedItems.includes(reward.id)) {
      toast({
        title: "Already Owned",
        description: "You already own this reward!",
      });
      return;
    }

    if (userPoints < reward.points) {
      toast({
        title: "Insufficient Points",
        description: `You need ${reward.points - userPoints} more points to purchase this reward.`,
        variant: "destructive",
      });
      return;
    }

    const newPoints = userPoints - reward.points;
    const newPurchased = [...purchasedItems, reward.id];
    
    setUserPoints(newPoints);
    setPurchasedItems(newPurchased);
    
    localStorage.setItem("userPoints", newPoints.toString());
    localStorage.setItem("purchasedRewards", JSON.stringify(newPurchased));

    toast({
      title: "Purchase Successful!",
      description: `You've unlocked ${reward.name}!`,
    });
  };

  const RewardCard = ({ reward }: { reward: Reward }) => {
    const isPurchased = purchasedItems.includes(reward.id);
    const canAfford = userPoints >= reward.points;
    const Icon = reward.icon;

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{reward.name}</CardTitle>
              </div>
            </div>
            {isPurchased && (
              <Badge variant="secondary" className="gap-1">
                <Check className="h-3 w-3" />
                Owned
              </Badge>
            )}
          </div>
          <CardDescription className="mt-2">{reward.description}</CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Coins className="h-5 w-5 text-primary" />
            {reward.points}
          </div>
          <Button
            onClick={() => handlePurchase(reward)}
            disabled={isPurchased || !canAfford}
            variant={isPurchased ? "secondary" : "default"}
          >
            {isPurchased ? "Owned" : canAfford ? "Redeem" : "Locked"}
          </Button>
        </CardFooter>
      </Card>
    );
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
              <h1 className="text-2xl font-bold">Rewards Shop</h1>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
              <Coins className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg">{userPoints}</span>
              <span className="text-sm text-muted-foreground">Points</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Redeem your hard-earned points from daily challenges and problem solving to unlock premium content, 
            exclusive badges, and customization options!
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5 max-w-3xl mx-auto mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="customization">Themes</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.filter(r => r.category === "courses").map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.filter(r => r.category === "badges").map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.filter(r => r.category === "content").map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="customization" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.filter(r => r.category === "customization").map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
