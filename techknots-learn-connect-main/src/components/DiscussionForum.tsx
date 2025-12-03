import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Reply {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  likes: number;
}

interface Discussion {
  id: string;
  author: string;
  title: string;
  content: string;
  timestamp: number;
  replies: Reply[];
  likes: number;
  category: string;
}

interface DiscussionForumProps {
  courseId: string;
}

export const DiscussionForum = ({ courseId }: DiscussionForumProps) => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [showReplyForm, setShowReplyForm] = useState<{ [key: string]: boolean }>({});
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const stored = localStorage.getItem(`discussions-${courseId}`);
    if (stored) {
      setDiscussions(JSON.parse(stored));
    }
  }, [courseId]);

  const saveDiscussions = (data: Discussion[]) => {
    localStorage.setItem(`discussions-${courseId}`, JSON.stringify(data));
    setDiscussions(data);
  };

  const handlePostDiscussion = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter both title and content",
        variant: "destructive",
      });
      return;
    }

    const newDiscussion: Discussion = {
      id: Date.now().toString(),
      author: "Current User",
      title: newTitle,
      content: newContent,
      timestamp: Date.now(),
      replies: [],
      likes: 0,
      category: filter === "all" ? "general" : filter,
    };

    saveDiscussions([newDiscussion, ...discussions]);
    setNewTitle("");
    setNewContent("");
    toast({
      title: "Success",
      description: "Your discussion has been posted",
    });
  };

  const handleReply = (discussionId: string) => {
    const content = replyContent[discussionId];
    if (!content?.trim()) return;

    const updatedDiscussions = discussions.map((disc) => {
      if (disc.id === discussionId) {
        const newReply: Reply = {
          id: Date.now().toString(),
          author: "Current User",
          content,
          timestamp: Date.now(),
          likes: 0,
        };
        return { ...disc, replies: [...disc.replies, newReply] };
      }
      return disc;
    });

    saveDiscussions(updatedDiscussions);
    setReplyContent({ ...replyContent, [discussionId]: "" });
    setShowReplyForm({ ...showReplyForm, [discussionId]: false });
    toast({
      title: "Success",
      description: "Your reply has been posted",
    });
  };

  const handleLike = (discussionId: string, replyId?: string) => {
    const updatedDiscussions = discussions.map((disc) => {
      if (disc.id === discussionId) {
        if (replyId) {
          return {
            ...disc,
            replies: disc.replies.map((reply) =>
              reply.id === replyId ? { ...reply, likes: reply.likes + 1 } : reply
            ),
          };
        }
        return { ...disc, likes: disc.likes + 1 };
      }
      return disc;
    });
    saveDiscussions(updatedDiscussions);
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const filteredDiscussions = discussions.filter(
    (d) => filter === "all" || d.category === filter
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-4">
        {["all", "general", "homework", "project", "question"].map((cat) => (
          <Button
            key={cat}
            variant={filter === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Button>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Start a Discussion</h3>
        <div className="space-y-4">
          <Input
            placeholder="Discussion title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Textarea
            placeholder="Share your thoughts, ask a question, or start a discussion..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={4}
          />
          <Button onClick={handlePostDiscussion}>
            <Send className="w-4 h-4 mr-2" />
            Post Discussion
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        {filteredDiscussions.map((discussion) => (
          <Card key={discussion.id} className="p-6">
            <div className="flex gap-4">
              <Avatar>
                <AvatarFallback>{discussion.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{discussion.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {discussion.author} · {formatTime(discussion.timestamp)}
                    </p>
                  </div>
                  <Badge variant="secondary">{discussion.category}</Badge>
                </div>
                <p className="text-foreground">{discussion.content}</p>
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(discussion.id)}
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {discussion.likes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setShowReplyForm({
                        ...showReplyForm,
                        [discussion.id]: !showReplyForm[discussion.id],
                      })
                    }
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    {discussion.replies.length} Replies
                  </Button>
                </div>

                {discussion.replies.length > 0 && (
                  <div className="mt-4 space-y-3 pl-4 border-l-2 border-border">
                    {discussion.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {reply.author[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{reply.author}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatTime(reply.timestamp)}
                          </p>
                          <p className="text-sm mt-1">{reply.content}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-1"
                            onClick={() => handleLike(discussion.id, reply.id)}
                          >
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {reply.likes}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showReplyForm[discussion.id] && (
                  <div className="flex gap-2 mt-4">
                    <Textarea
                      placeholder="Write a reply..."
                      value={replyContent[discussion.id] || ""}
                      onChange={(e) =>
                        setReplyContent({
                          ...replyContent,
                          [discussion.id]: e.target.value,
                        })
                      }
                      rows={2}
                    />
                    <Button onClick={() => handleReply(discussion.id)}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}

        {filteredDiscussions.length === 0 && (
          <Card className="p-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              No discussions yet. Be the first to start one!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
