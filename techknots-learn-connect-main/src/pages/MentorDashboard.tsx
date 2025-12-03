import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Code2, Users, MessageSquare, Calendar, LogOut, Home } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const MentorDashboard = () => {
  const navigate = useNavigate();
  const { user, role, loading, signOutUser } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    if (role && role !== "mentor") {
      navigate(`/${role}-dashboard`);
    }
  }, [loading, navigate, role, user]);

  const handleLogout = async () => {
    await signOutUser();
    navigate("/");
  };

  if (loading || !user || role !== "mentor") return null;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">TechKnots</span>
          </Link>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">Mentor</Badge>
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <Home className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Mentor Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">+5 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">3 upcoming</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Respond to students</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>Your scheduled mentoring sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { student: "Alice Johnson", topic: "React Hooks Deep Dive", time: "Today, 2:00 PM" },
                { student: "Bob Smith", topic: "Career Guidance", time: "Tomorrow, 10:00 AM" },
                { student: "Carol Davis", topic: "Algorithm Review", time: "Tomorrow, 3:00 PM" },
              ].map((session, i) => (
                <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                  <Avatar>
                    <AvatarFallback>{session.student[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{session.student}</h4>
                    <p className="text-sm text-muted-foreground">{session.topic}</p>
                    <p className="text-xs text-muted-foreground mt-1">{session.time}</p>
                  </div>
                  <Button size="sm">Join</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Student Progress</CardTitle>
              <CardDescription>Track your students' achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { student: "Alice Johnson", achievement: "Completed JavaScript Fundamentals", time: "2 hours ago" },
                { student: "David Lee", achievement: "Solved 10 coding challenges", time: "5 hours ago" },
                { student: "Emma Wilson", achievement: "Started React Mastery course", time: "1 day ago" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                  <Avatar>
                    <AvatarFallback>{item.student[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.student}</h4>
                    <p className="text-sm text-muted-foreground">{item.achievement}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
