import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Clock, StickyNote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  timestamp: number;
  content: string;
  lessonId: string;
  lessonTitle: string;
  createdAt: string;
}

interface CourseNotesProps {
  courseId: string;
  currentLessonId?: string;
  currentLessonTitle?: string;
  currentVideoTime?: number;
  onSeekToTimestamp?: (timestamp: number) => void;
}

export const CourseNotes = ({
  courseId,
  currentLessonId,
  currentLessonTitle,
  currentVideoTime = 0,
  onSeekToTimestamp,
}: CourseNotesProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem(`course-notes-${courseId}`);
    if (stored) {
      setNotes(JSON.parse(stored));
    }
  }, [courseId]);

  const saveNotes = (updatedNotes: Note[]) => {
    localStorage.setItem(`course-notes-${courseId}`, JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const formatTimestamp = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addNote = () => {
    if (!newNote.trim()) {
      toast({
        title: "Error",
        description: "Please enter a note before saving.",
        variant: "destructive",
      });
      return;
    }

    if (!currentLessonId || !currentLessonTitle) {
      toast({
        title: "No video playing",
        description: "Please select a video lesson to add notes.",
        variant: "destructive",
      });
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      timestamp: currentVideoTime,
      content: newNote.trim(),
      lessonId: currentLessonId,
      lessonTitle: currentLessonTitle,
      createdAt: new Date().toISOString(),
    };

    const updatedNotes = [note, ...notes];
    saveNotes(updatedNotes);
    setNewNote("");
    
    toast({
      title: "Note saved!",
      description: `Note added at ${formatTimestamp(currentVideoTime)}`,
    });
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    saveNotes(updatedNotes);
    
    toast({
      title: "Note deleted",
      description: "Your note has been removed.",
    });
  };

  const groupNotesByLesson = () => {
    const grouped: Record<string, Note[]> = {};
    notes.forEach((note) => {
      if (!grouped[note.lessonId]) {
        grouped[note.lessonId] = [];
      }
      grouped[note.lessonId].push(note);
    });
    return grouped;
  };

  const groupedNotes = groupNotesByLesson();

  return (
    <div className="space-y-6">
      {/* Add New Note */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-primary" />
            Add Note
          </CardTitle>
          <CardDescription>
            {currentLessonTitle ? (
              <>
                Currently watching: <span className="font-medium text-foreground">{currentLessonTitle}</span>
                {currentVideoTime > 0 && (
                  <span className="ml-2 text-muted-foreground">
                    at {formatTimestamp(currentVideoTime)}
                  </span>
                )}
              </>
            ) : (
              "Start watching a video to add timestamped notes"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Type your note here... This will be saved with the current timestamp."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[100px]"
            disabled={!currentLessonId}
          />
          <Button 
            onClick={addNote} 
            className="w-full" 
            disabled={!currentLessonId || !newNote.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Save Note at {formatTimestamp(currentVideoTime)}
          </Button>
        </CardContent>
      </Card>

      {/* Notes List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Notes</CardTitle>
          <CardDescription>
            {notes.length === 0 
              ? "No notes yet. Start watching videos and take notes!"
              : `${notes.length} note${notes.length !== 1 ? 's' : ''} saved`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <StickyNote className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notes yet. Start taking notes while watching!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedNotes).map(([lessonId, lessonNotes]) => (
                <div key={lessonId} className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    {lessonNotes[0].lessonTitle}
                  </h3>
                  <div className="space-y-3">
                    {lessonNotes
                      .sort((a, b) => a.timestamp - b.timestamp)
                      .map((note) => (
                        <div
                          key={note.id}
                          className="p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <Badge
                              variant="secondary"
                              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                              onClick={() => onSeekToTimestamp?.(note.timestamp)}
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTimestamp(note.timestamp)}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNote(note.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(note.createdAt).toLocaleDateString()} at{" "}
                            {new Date(note.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
