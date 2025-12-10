import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, Printer, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CertificateGeneratorProps {
  courseTitle: string;
  courseId: string;
  completionDate?: Date;
}

export const CertificateGenerator = ({
  courseTitle,
  courseId,
  completionDate = new Date(),
}: CertificateGeneratorProps) => {
  const [studentName, setStudentName] = useState("");
  const { toast } = useToast();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSave = () => {
    if (!studentName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name first.",
        variant: "destructive",
      });
      return;
    }

    const certificates = JSON.parse(localStorage.getItem("certificates") || "[]");
    certificates.push({
      courseId,
      courseTitle,
      studentName: studentName.trim(),
      completionDate: completionDate.toISOString(),
      savedAt: new Date().toISOString(),
    });
    localStorage.setItem("certificates", JSON.stringify(certificates));

    toast({
      title: "Certificate Saved!",
      description: "Your certificate has been saved to your records.",
    });
  };

  const handlePrint = () => {
    if (!studentName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to print.",
        variant: "destructive",
      });
      return;
    }
    window.print();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-warning" />
            Certificate of Completion
          </CardTitle>
          <CardDescription>
            Congratulations! Enter your name to generate your certificate.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="studentName">Your Name</Label>
            <Input
              id="studentName"
              placeholder="Enter your full name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handlePrint} disabled={!studentName.trim()} className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              Print Certificate
            </Button>
            <Button onClick={handleSave} disabled={!studentName.trim()} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            💡 Use "Print to PDF" to save a digital copy
          </p>
        </CardContent>
      </Card>

      {/* Certificate */}
      <div className="print:fixed print:inset-0 print:z-50 print:bg-white print:flex print:items-center print:justify-center">
        <div
          className="relative bg-gradient-to-br from-background via-muted/30 to-background border-8 border-primary/20 rounded-lg p-12 aspect-[1.414/1] max-w-4xl mx-auto shadow-2xl print:max-w-none print:w-full print:h-full print:border-primary/40"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, hsl(var(--primary) / 0.03) 10px, hsl(var(--primary) / 0.03) 20px)`,
          }}
        >
          <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-primary/40 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-primary/40 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-primary/40 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-primary/40 rounded-br-lg" />

          <div className="flex flex-col items-center justify-center h-full space-y-8 relative z-10">
            <div className="text-center space-y-2">
              <Award className="h-20 w-20 mx-auto text-warning" />
              <h1 className="text-5xl font-bold text-primary">Certificate of Completion</h1>
              <div className="h-1 w-32 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
            </div>

            <div className="text-center space-y-6 max-w-2xl">
              <p className="text-xl text-muted-foreground">This is to certify that</p>
              <p className="text-4xl font-bold text-foreground border-b-2 border-primary/30 pb-2 px-8 inline-block">
                {studentName.trim() || "Your Name"}
              </p>
              <p className="text-xl text-muted-foreground">has successfully completed</p>
              <p className="text-3xl font-semibold text-primary">{courseTitle}</p>
              <p className="text-lg text-muted-foreground pt-4">
                Completion Date: {formatDate(completionDate)}
              </p>
            </div>

            <div className="pt-8 flex items-center justify-center gap-32">
              <div className="text-center">
                <div className="border-t-2 border-foreground/30 w-48 mb-2" />
                <p className="text-sm text-muted-foreground font-medium">Course Instructor</p>
              </div>
              <div className="text-center">
                <div className="border-t-2 border-foreground/30 w-48 mb-2" />
                <p className="text-sm text-muted-foreground font-medium">TechKnots Platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@media print{@page{size:landscape;margin:0}body *{visibility:hidden}.print\\:fixed,.print\\:fixed *{visibility:visible}.print\\:fixed{position:fixed!important;top:0!important;left:0!important;right:0!important;bottom:0!important;z-index:50!important;background:white!important}}`}</style>
    </div>
  );
};
