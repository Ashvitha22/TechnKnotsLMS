import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Trophy, Medal, Award } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Leaderboard = () => {
  const globalLeaders = [
    { rank: 1, name: "Alice Johnson", score: 2450, solved: 347, avatar: "AJ" },
    { rank: 2, name: "Bob Smith", score: 2380, solved: 329, avatar: "BS" },
    { rank: 3, name: "Carol Davis", score: 2310, solved: 315, avatar: "CD" },
    { rank: 4, name: "David Wilson", score: 2250, solved: 298, avatar: "DW" },
    { rank: 5, name: "Emma Brown", score: 2190, solved: 285, avatar: "EB" },
    { rank: 6, name: "Frank Miller", score: 2120, solved: 271, avatar: "FM" },
    { rank: 7, name: "Grace Lee", score: 2050, solved: 256, avatar: "GL" },
    { rank: 8, name: "Henry Taylor", score: 1980, solved: 242, avatar: "HT" },
  ];

  const weeklyLeaders = [
    { rank: 1, name: "Emma Brown", score: 450, solved: 45, avatar: "EB" },
    { rank: 2, name: "David Wilson", score: 420, solved: 42, avatar: "DW" },
    { rank: 3, name: "Alice Johnson", score: 390, solved: 39, avatar: "AJ" },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-warning" />;
      case 2:
        return <Medal className="h-6 w-6 text-muted-foreground" />;
      case 3:
        return <Award className="h-6 w-6 text-warning/60" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
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

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Trophy className="h-8 w-8 text-primary" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground">
            Compete with learners from around the world
          </p>
        </div>

        {/* Your Rank Card */}
        <Card className="mb-8 bg-gradient-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Your Global Rank</p>
                <p className="text-4xl font-bold">#234</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90 mb-1">Total Score</p>
                <p className="text-2xl font-bold">1,845</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90 mb-1">Problems Solved</p>
                <p className="text-2xl font-bold">127</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="weekly">This Week</TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Global Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Rank</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead className="text-right">Problems Solved</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {globalLeaders.map((leader) => (
                      <TableRow key={leader.rank} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {getRankIcon(leader.rank) || `#${leader.rank}`}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {leader.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{leader.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {leader.score.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {leader.solved}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Rank</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead className="text-right">Problems Solved</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weeklyLeaders.map((leader) => (
                      <TableRow key={leader.rank} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {getRankIcon(leader.rank) || `#${leader.rank}`}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {leader.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{leader.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {leader.score.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {leader.solved}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Leaderboard;
