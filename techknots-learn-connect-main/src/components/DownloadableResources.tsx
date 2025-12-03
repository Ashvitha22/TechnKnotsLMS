import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Code, FolderArchive, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Resource {
  id: string;
  title: string;
  type: "pdf" | "code" | "archive";
  size: string;
  description: string;
  downloadUrl: string;
}

interface DownloadableResourcesProps {
  courseId: string;
  lessonId?: string;
}

export const DownloadableResources = ({ courseId, lessonId }: DownloadableResourcesProps) => {
  const [downloadedItems, setDownloadedItems] = useState<Set<string>>(new Set());

  // Mock resources data - in a real app, this would come from a backend
  const resources: Resource[] = [
    {
      id: "1",
      title: "Complete Course Notes",
      type: "pdf",
      size: "2.4 MB",
      description: "Comprehensive PDF notes covering all course topics",
      downloadUrl: "#"
    },
    {
      id: "2",
      title: "JavaScript Cheat Sheet",
      type: "pdf",
      size: "850 KB",
      description: "Quick reference guide for JavaScript syntax and methods",
      downloadUrl: "#"
    },
    {
      id: "3",
      title: "Code Examples - All Lessons",
      type: "archive",
      size: "5.2 MB",
      description: "ZIP file containing all code examples from the course",
      downloadUrl: "#"
    },
    {
      id: "4",
      title: "Practice Exercises",
      type: "code",
      size: "1.1 MB",
      description: "Hands-on coding exercises with solutions",
      downloadUrl: "#"
    },
    {
      id: "5",
      title: "Project Starter Files",
      type: "archive",
      size: "3.7 MB",
      description: "Starter code for all course projects",
      downloadUrl: "#"
    },
    {
      id: "6",
      title: "ES6+ Features Guide",
      type: "pdf",
      size: "1.3 MB",
      description: "In-depth guide to modern JavaScript features",
      downloadUrl: "#"
    }
  ];

  const handleDownload = (resource: Resource) => {
    // Simulate download
    const blob = new Blob([`Sample content for ${resource.title}`], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resource.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    // Mark as downloaded
    setDownloadedItems(prev => new Set([...prev, resource.id]));

    toast({
      title: "Download Started",
      description: `${resource.title} is being downloaded`,
    });
  };

  const getIcon = (type: Resource["type"]) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-5 h-5 text-destructive" />;
      case "code":
        return <Code className="w-5 h-5 text-primary" />;
      case "archive":
        return <FolderArchive className="w-5 h-5 text-warning" />;
    }
  };

  const getTypeColor = (type: Resource["type"]) => {
    switch (type) {
      case "pdf":
        return "destructive";
      case "code":
        return "default";
      case "archive":
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Downloadable Resources
        </CardTitle>
        <CardDescription>
          Access course materials, code samples, and practice files
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="p-2 rounded-md bg-background">
                  {getIcon(resource.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{resource.title}</h4>
                    <Badge variant={getTypeColor(resource.type)} className="text-xs">
                      {resource.type.toUpperCase()}
                    </Badge>
                    {downloadedItems.has(resource.id) && (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {resource.description}
                  </p>
                  <p className="text-xs text-muted-foreground">{resource.size}</p>
                </div>
              </div>
              <Button
                variant={downloadedItems.has(resource.id) ? "outline" : "default"}
                size="sm"
                onClick={() => handleDownload(resource)}
              >
                <Download className="w-4 h-4 mr-2" />
                {downloadedItems.has(resource.id) ? "Re-download" : "Download"}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm mb-1">Download All Resources</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Get all course materials in one convenient package
              </p>
              <Button
                onClick={() => {
                  toast({
                    title: "Preparing Download",
                    description: "Your complete resource package is being prepared...",
                  });
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download All (14.5 MB)
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
