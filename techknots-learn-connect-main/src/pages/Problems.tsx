import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import problemsData from "@/data/problems.json";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Code2, Search, CheckCircle2, Circle } from "lucide-react";

interface Problem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topics: string[];
  tags?: string[];
  category: string;
  acceptance: number;
  completed: boolean;
  createdAt: string;
}

const STORAGE_KEY = "tk.problems.completed";

export default function Problems() {
  // load problems (defensive)
  const allProblemsRaw: Problem[] = Array.isArray(problemsData) ? (problemsData as any) : [];

  // persisted completed state override (local only)
  const [completedState, setCompletedState] = useState<Record<number, boolean>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedState));
    } catch {}
  }, [completedState]);

  // merge computed completed into problems list
  const allProblems = useMemo(() => {
    return allProblemsRaw.map((p) => ({ ...p, completed: completedState[p.id] ?? p.completed }));
  }, [allProblemsRaw, completedState]);

  // filters / controls
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // multi
  const [sortBy, setSortBy] = useState<string>("default");

  // pagination
  const [perPage, setPerPage] = useState<number>(6);
  const [page, setPage] = useState<number>(1);

  // derived sets
  const allTopics = useMemo(() => Array.from(new Set(allProblems.flatMap((p) => p.topics))).sort(), [allProblems]);
  const allCategories = useMemo(() => Array.from(new Set(allProblems.map((p) => p.category))).sort(), [allProblems]);
  const allTags = useMemo(() =>
    Array.from(new Set(allProblems.flatMap((p) => (p.tags && p.tags.length ? p.tags : p.topics)))).sort(),
    [allProblems]
  );

  // filtered + sorted list
  const filteredProblems = useMemo(() => {
    let filtered = allProblems.slice();

    // search across title + topics + tags + description if present
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((p) => {
        if (String(p.title).toLowerCase().includes(q)) return true;
        if (p.topics.some((t) => t.toLowerCase().includes(q))) return true;
        if ((p.tags || []).some((t) => t.toLowerCase().includes(q))) return true;
        return false;
      });
    }

    if (selectedDifficulty !== "all") filtered = filtered.filter((p) => p.difficulty === selectedDifficulty);
    if (selectedTopic !== "all") filtered = filtered.filter((p) => p.topics.includes(selectedTopic));
    if (selectedCategory !== "all") filtered = filtered.filter((p) => p.category === selectedCategory);

    // tags multi-select: require that problem contains ALL selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((p) => {
        const source = (p.tags && p.tags.length ? p.tags : p.topics).map((s) => s.toLowerCase());
        return selectedTags.every((t) => source.includes(t.toLowerCase()));
      });
    }

    // sort
    filtered.sort((a, b) => {
      if (sortBy === "acceptance") return b.acceptance - a.acceptance;
      if (sortBy === "difficulty") {
        const order: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 };
        return order[a.difficulty] - order[b.difficulty];
      }
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return a.id - b.id;
    });

    return filtered;
  }, [allProblems, searchQuery, selectedDifficulty, selectedTopic, selectedCategory, selectedTags, sortBy]);

  const totalResults = filteredProblems.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / perPage));
  const pageSafe = Math.min(Math.max(1, page), totalPages);
  const visibleProblems = filteredProblems.slice((pageSafe - 1) * perPage, pageSafe * perPage);

  // stats
  const stats = useMemo(() => ({
    total: allProblems.length,
    completed: allProblems.filter((p) => p.completed).length,
    easy: allProblems.filter((p) => p.difficulty === "Easy").length,
    medium: allProblems.filter((p) => p.difficulty === "Medium").length,
    hard: allProblems.filter((p) => p.difficulty === "Hard").length,
  }), [allProblems]);

  function getDifficultyColor(d: string) {
    switch (d) {
      case "Easy": return "text-green-600 bg-green-50 border-green-200";
      case "Medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Hard": return "text-red-600 bg-red-50 border-red-200";
      default: return "";
    }
  }

  function clearAllFilters() {
    setSearchQuery("");
    setSelectedDifficulty("all");
    setSelectedTopic("all");
    setSelectedCategory("all");
    setSelectedTags([]);
    setSortBy("default");
    setPerPage(6);
    setPage(1);
  }

  function toggleCompleted(id: number) {
    setCompletedState((prev) => {
      const next = { ...prev, [id]: !(prev[id] ?? allProblemsRaw.find((p) => p.id === id)?.completed) };
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">TechKnots</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="p-4 text-center border rounded bg-card">
            <div className="text-2xl font-bold text-primary">{stats.completed}/{stats.total}</div>
            <div className="text-sm text-muted-foreground">Solved</div>
          </div>
          <div className="p-4 text-center border rounded bg-card">
            <div className="text-2xl font-bold text-green-600">{stats.easy}</div>
            <div className="text-sm text-muted-foreground">Easy</div>
          </div>
          <div className="p-4 text-center border rounded bg-card">
            <div className="text-2xl font-bold text-yellow-600">{stats.medium}</div>
            <div className="text-sm text-muted-foreground">Medium</div>
          </div>
          <div className="p-4 text-center border rounded bg-card">
            <div className="text-2xl font-bold text-red-600">{stats.hard}</div>
            <div className="text-sm text-muted-foreground">Hard</div>
          </div>
          <div className="p-4 text-center border rounded bg-card">
            <div className="text-2xl font-bold text-primary">{Math.round((stats.completed / stats.total) * 100) || 0}%</div>
            <div className="text-sm text-muted-foreground">Progress</div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-4">
          <Tabs value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v); setPage(1); }}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              {allCategories.map((cat) => (
                <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Search + Difficulty + Sort + Clear */}
        <div className="mb-4">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="flex-1 relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search problems by title/topic/tag..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="pl-10 w-full"
              />
            </div>

            <div>
              <Tabs value={selectedDifficulty} onValueChange={(v) => { setSelectedDifficulty(v); setPage(1); }}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="Easy">Easy</TabsTrigger>
                  <TabsTrigger value="Medium">Medium</TabsTrigger>
                  <TabsTrigger value="Hard">Hard</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div>
              <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setPage(1); }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="difficulty">Difficulty (E → H)</SelectItem>
                  <SelectItem value="acceptance">Acceptance (High → Low)</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" onClick={clearAllFilters}>Clear all filters</Button>
            </div>
          </div>

          {/* Topics / Tags quick filters */}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant={selectedTopic === "all" ? "default" : "outline"} size="sm" onClick={() => { setSelectedTopic("all"); setPage(1); }}>
              All Topics
            </Button>
            {allTopics.map((topic) => (
              <Button key={topic} variant={selectedTopic === topic ? "default" : "outline"} size="sm" onClick={() => { setSelectedTopic(topic); setPage(1); }}>
                {topic}
              </Button>
            ))}
          </div>

          {/* Tags multi-select */}
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <div className="text-xs text-muted-foreground mr-2">Tags:</div>
            <Button size="sm" variant={selectedTags.length === 0 ? "default" : "ghost"} onClick={() => { setSelectedTags([]); setPage(1); }}>All</Button>
            {allTags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <Button key={tag} size="sm" variant={active ? "default" : "outline"} onClick={() => {
                  setSelectedTags((prev) => {
                    if (prev.includes(tag)) return prev.filter((t) => t !== tag);
                    return [...prev, tag];
                  });
                  setPage(1);
                }}>{tag}</Button>
              );
            })}
          </div>
        </div>

        {/* Results count + per-page */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground">{totalResults} problems found</div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Per page:</div>
            <Select value={String(perPage)} onValueChange={(v) => { setPerPage(Number(v)); setPage(1); }}>
              <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Problems List */}
        <div className="space-y-2">
          {visibleProblems.map((problem) => (
            <div key={problem.id} className="hover:shadow-lg transition cursor-pointer">
              <Card>
                <CardContent className="p-4 flex items-center justify-between">

                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-8">
                      {problem.completed ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Link to={`/code-editor/${problem.id}`} className="font-medium hover:underline">{problem.id}. {problem.title}</Link>
                        {problem.completed && <Badge variant="outline" className="text-primary border-primary">Solved</Badge>}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {(problem.tags && problem.tags.length ? problem.tags : problem.topics).map((t) => (
                          <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center hidden md:block">
                      <div className="text-sm text-muted-foreground">Acceptance</div>
                      <div className="font-medium">{problem.acceptance}%</div>
                    </div>
                    <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                    <div className="flex flex-col gap-1">
                      <Button size="sm" variant="outline" onClick={() => toggleCompleted(problem.id)}>{problem.completed ? 'Mark Unsolved' : 'Mark Solved'}</Button>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {totalResults === 0 && (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground">No problems match your filters.</div>
          </Card>
        )}

        {/* Pagination controls */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            <Button variant="outline" size="sm" onClick={() => { setPage(1); }} disabled={pageSafe === 1}>First</Button>
            <Button variant="outline" size="sm" onClick={() => { setPage((p) => Math.max(1, p - 1)); }} disabled={pageSafe === 1} className="ml-2">Prev</Button>
          </div>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNumber = idx + 1;
              return (
                <Button key={pageNumber} size="sm" variant={pageNumber === pageSafe ? "default" : "ghost"} onClick={() => setPage(pageNumber)}>
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          <div>
            <Button variant="outline" size="sm" onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); }} disabled={pageSafe === totalPages}>Next</Button>
            <Button variant="outline" size="sm" onClick={() => { setPage(totalPages); }} disabled={pageSafe === totalPages} className="ml-2">Last</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
