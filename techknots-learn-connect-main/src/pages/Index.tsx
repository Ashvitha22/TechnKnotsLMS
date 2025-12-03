import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Code2, Trophy, Video, Users, Zap } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import SiteNav from "@/components/SiteNav";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user, role } = useAuth();
  const dashboardPath = role ? `/${role}-dashboard` : "/login";

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <img src={heroImage} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Master Coding & Technology with{" "}
              <span className="text-primary">TechKnots</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Learn through interactive courses, solve coding challenges, and join
              live sessions with expert instructors. Your complete learning platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={user && role ? dashboardPath : "/signup"}>
                <Button size="lg" className="w-full sm:w-auto">
                  {user && role ? "Continue to Dashboard" : "Start Learning Free"}
                </Button>
              </Link>
              <Link to="/courses">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Combining the best features from top learning platforms into one
              powerful experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BookOpen className="h-8 w-8" />}
              title="Interactive Courses"
              description="Learn from expertly crafted courses with hands-on projects and real-world applications"
            />
            <FeatureCard
              icon={<Code2 className="h-8 w-8" />}
              title="Coding Challenges"
              description="Sharpen your skills with coding problems from beginner to advanced levels"
            />
            <FeatureCard
              icon={<Video className="h-8 w-8" />}
              title="Live Sessions"
              description="Join live classes with Google Meet integration and access recorded sessions anytime"
            />
            <FeatureCard
              icon={<Trophy className="h-8 w-8" />}
              title="Leaderboards"
              description="Track your progress and compete with peers on global leaderboards"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Community"
              description="Connect with learners worldwide and collaborate on projects"
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8" />}
              title="Instant Feedback"
              description="Get immediate feedback on your code with our advanced testing system"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard number="10,000+" label="Active Learners" />
            <StatCard number="500+" label="Courses" />
            <StatCard number="1,000+" label="Coding Challenges" />
            <StatCard number="50+" label="Expert Instructors" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of learners mastering technology with TechKnots today
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">TechKnots</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 TechKnots. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all hover:-translate-y-1">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-card-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const StatCard = ({ number, label }: { number: string; label: string }) => {
  return (
    <div>
      <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{number}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
};

export default Index;
