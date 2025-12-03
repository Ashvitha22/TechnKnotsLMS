// src/pages/CodeEditor.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code2, Play, CheckCircle2, X, Loader2 } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useToast } from "@/hooks/use-toast";
import problemsData from "@/data/problems.json";

/**
 * Code editor page:
 * - loads problem by route param id
 * - autosave per-problem & per-language (debounced)
 * - quick-run for JS (local)
 * - remote-run for python/java/cpp via Piston API wrapper (with timeout)
 * - submit -> fake judge queue + polling
 *
 * Important: This file does NOT embed a raw worker script string,
 * so it won't trigger unterminated-string/template parsing errors.
 */

/* ---------------- fake judge (demo only) ---------------- */
const fakeJudgeStore: Record<string, { status: string; results: any[] }> = {};
function createFakeSubmission(results: any[]) {
  const submissionId = "sub_" + Math.random().toString(36).slice(2, 9);
  fakeJudgeStore[submissionId] = { status: "Processing", results: [] };
  setTimeout(() => {
    fakeJudgeStore[submissionId] = { status: "Done", results };
  }, 2500);
  return submissionId;
}
function getFakeSubmission(submissionId: string) {
  return fakeJudgeStore[submissionId] ?? null;
}

/* ---------- safe localStorage helpers ---------- */
function safeGet(key: string) {
  try {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, value: string) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}
function codeStorageKey(problemId = "default", language = "javascript") {
  return `code.problem.${problemId}.lang.${language}`;
}

/* ---------- helpers ---------- */
function deepEqual(a: any, b: any) {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return a === b;
  }
}

function getStarterCode(lang: string) {
  const starters: Record<string, string> = {
    javascript: `// implement function named 'twoSum'\nfunction twoSum(nums, target) {\n  // return indices\n  return [];\n}\n`,
    python: `# implement function named 'two_sum'\ndef two_sum(nums, target):\n    # return indices\n    return []\n`,
    java: `// implement a method public int[] twoSum(int[] nums, int target) in class Solution\npublic class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // return indices\n        return new int[]{};\n    }\n}\n`,
    cpp: `// implement vector<int> twoSum(vector<int>& nums, int target) in class Solution\n#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // return indices\n        return {};\n    }\n};\n`,
  };
  return starters[lang] ?? starters.javascript;
}

/* ---------- default tests (Two Sum) ---------- */
const DEFAULT_TESTS = [
  { input: [[2, 7, 11, 15], 9], expected: [0, 1], name: "Example 1" },
  { input: [[3, 2, 4], 6], expected: [1, 2], name: "Example 2" },
  { input: [[3, 3], 6], expected: [0, 1], name: "Example 3" },
];

export default function CodeEditor() {
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();

  // find problem by id from problems.json (safe fallback)
  const problem = React.useMemo(() => {
    if (!id) return undefined;
    if (!Array.isArray(problemsData)) return undefined;
    return (problemsData as any[]).find((p) => String((p as any).id) === String(id));
  }, [id]);

  // use publicTests from problem JSON if present
  const publicTests = React.useMemo(() => {
    if (problem && Array.isArray((problem as any).publicTests)) return (problem as any).publicTests;
    if (problem && String((problem as any).id) === "1") return DEFAULT_TESTS;
    return [];
  }, [problem]);

  const [language, setLanguage] = useState<"javascript" | "python" | "java" | "cpp">("javascript");

  // compute the configured entry point name for the selected problem & language
  const solutionFunctionName = React.useMemo(() => {
    try {
      const map = (problem as any)?.solutionFunction ?? {};
      return map?.[language] ?? (language === "python" ? "two_sum" : "twoSum");
    } catch {
      return language === "python" ? "two_sum" : "twoSum";
    }
  }, [problem, language]);

  const [code, setCode] = useState<string>(() => {
    const pid = id ?? "default";
    const saved = safeGet(codeStorageKey(pid, "javascript"));
    if (saved) return saved;
    if (problem && (problem as any).starterCode && (problem as any).starterCode.javascript) {
      return (problem as any).starterCode.javascript;
    }
    return getStarterCode("javascript");
  });

  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const editorRef = useRef<any>(null);

  const problemId = id ?? "default";

  // load code when language or problem changes
  useEffect(() => {
    const saved = safeGet(codeStorageKey(problemId, language));
    if (saved) {
      setCode(saved);
    } else if (problem && (problem as any).starterCode && (problem as any).starterCode[language]) {
      setCode((problem as any).starterCode[language]);
    } else {
      setCode(getStarterCode(language));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, id]);

  // debounced autosave
  const saveDebounceRef = useRef<number | null>(null);
  useEffect(() => {
    if (saveDebounceRef.current) window.clearTimeout(saveDebounceRef.current);
    saveDebounceRef.current = window.setTimeout(() => {
      safeSet(codeStorageKey(problemId, language), code);
    }, 600);
    return () => {
      if (saveDebounceRef.current) window.clearTimeout(saveDebounceRef.current);
    };
  }, [code, language, problemId]);

  // keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (!isRunning) void handleRunCode();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, language, isRunning, id]);

  function addLog(line: string) {
    setLogs((s) => [...s, `[${new Date().toLocaleTimeString()}] ${line}`]);
  }

  /* ---------- execution helpers ---------- */
  function runSingleTestLocalJS(userCode: string, testCase: { input: any[] }) {
    try {
      // NOTE: running user code in the page is potentially unsafe. For demo purposes we keep this,
      // but prefer running inside a Worker or server-side sandbox for production.
      const funcName = solutionFunctionName;
      // eslint-disable-next-line no-new-func
      const userFn = new Function(`${userCode}; return ${funcName};`)();
      const actual = userFn(...testCase.input);
      return { ok: true, actual, error: null };
    } catch (err: any) {
      return { ok: false, actual: null, error: String(err) };
    }
  }

  async function runSingleTestRemoteViaPiston(lang: string, userCode: string, testCase: { input: any[] }) {
    const entry = solutionFunctionName;

    if (lang === "javascript") {
      const wrapper = `${userCode}\nconsole.log(JSON.stringify(${entry}(${JSON.stringify(testCase.input[0])}, ${JSON.stringify(testCase.input[1])})));`;
      return await callPiston("javascript", wrapper, "main.js");
    }

    if (lang === "python") {
      const wrapper = `${userCode}\nimport json\nprint(json.dumps(${entry}(${JSON.stringify(testCase.input[0])}, ${JSON.stringify(testCase.input[1])})))`;
      return await callPiston("python", wrapper, "main.py");
    }

    if (lang === "java") {
      const arrLiteral = JSON.stringify(testCase.input[0]).replace(/\[/g, "{").replace(/\]/g, "}");
      const target = JSON.stringify(testCase.input[1]);
      const wrapper = `${userCode}\nimport java.util.*;\npublic class Main {\n  public static void main(String[] args) {\n    Solution s = new Solution();\n    int[] res = s.${entry}(new int[]${arrLiteral}, ${target});\n    System.out.print(Arrays.toString(res));\n  }\n}`;
      return await callPiston("java", wrapper, "Main.java");
    }

    if (lang === "cpp") {
      const numsArr = (testCase.input[0] as number[]).join(", ");
      const target = testCase.input[1];
      const wrapper = `#include <bits/stdc++.h>\nusing namespace std;\n${userCode}\nint main() {\n  vector<int> nums = {${numsArr}};\n  int target = ${target};\n  Solution s;\n  vector<int> res = s.${entry}(nums, target);\n  cout << "[";\n  for (size_t i = 0; i < res.size(); ++i) {\n    cout << res[i];\n    if (i + 1 < res.size()) cout << ",";\n  }\n  cout << "]";\n  return 0;\n}\n`;
      return await callPiston("cpp", wrapper, "main.cpp");
    }

    return { ok: false, actual: null, error: `Remote run for ${lang} not implemented.` };
  }

  async function callPiston(languageName: string, content: string, filename = "main.txt") {
    const timeout = 12000; // 12s default
    const controller = new AbortController();
    const id = window.setTimeout(() => controller.abort(), timeout);
    try {
      const resp = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: languageName,
          version: "*",
          files: [{ name: filename, content }],
        }),
        signal: controller.signal,
      });
      clearTimeout(id);

      if (!resp.ok) {
        const text = await resp.text();
        return { ok: false, actual: null, error: `Piston returned ${resp.status}: ${text}` };
      }

      const body = await resp.json();
      const output = body.run?.output ?? "";
      const stderr = body.run?.stderr ?? "";
      const text = Array.isArray(output) ? output.join("") : String(output);
      const trimmed = (text || "").trim();

      if (!trimmed && stderr) {
        return { ok: false, actual: null, error: stderr };
      }

      try {
        return { ok: true, actual: JSON.parse(trimmed), error: null };
      } catch { /* ignore */ }

      try {
        const normalized = trimmed.replace(/,\s+/g, ",");
        return { ok: true, actual: JSON.parse(normalized), error: null };
      } catch { /* ignore */ }

      return { ok: true, actual: trimmed, error: null };
    } catch (err: any) {
      if (err.name === "AbortError") return { ok: false, actual: null, error: "Execution timed out" };
      return { ok: false, actual: null, error: String(err) };
    }
  }

  /* ---------- Run (quick run) ---------- */
  async function handleRunCode() {
    setIsRunning(true);
    setTestResults([]);
    setLogs([]);
    addLog("Running tests...");

    const testsToRun = publicTests.length ? publicTests : [];

    if (!testsToRun.length) {
      toast({ title: "No public tests", description: "This problem has no public tests configured.", variant: "destructive" });
      setIsRunning(false);
      return;
    }

    const results: any[] = [];

    if (language === "java" || language === "cpp") {
      toast({
        title: "Quick run not supported for this language",
        description: `Use Submit to run ${language.toUpperCase()} tests.`,
        variant: "default",
      });
      setIsRunning(false);
      return;
    }

    for (let i = 0; i < testsToRun.length; i++) {
      const tc = testsToRun[i];
      if (language === "javascript") {
        const r = runSingleTestLocalJS(code, tc);
        if (r.ok) {
          const passed = deepEqual(r.actual, tc.expected);
          results.push({ name: tc.name, input: tc.input, expected: tc.expected, actual: r.actual, passed, error: null });
          addLog(`Test ${i + 1}: ${passed ? "passed" : "failed"}`);
        } else {
          results.push({ name: tc.name, input: tc.input, expected: tc.expected, actual: null, passed: false, error: r.error });
          addLog(`Test ${i + 1}: runtime error`);
        }
      } else {
        addLog(`Running test ${i + 1} remotely...`);
        const r = await runSingleTestRemoteViaPiston(language, code, tc);
        if (r.ok) {
          const passed = deepEqual(r.actual, tc.expected);
          results.push({ name: tc.name, input: tc.input, expected: tc.expected, actual: r.actual, passed, error: null });
          addLog(`Test ${i + 1}: ${passed ? "passed" : "failed"}`);
        } else {
          results.push({ name: tc.name, input: tc.input, expected: tc.expected, actual: r.actual, passed: false, error: r.error });
          addLog(`Test ${i + 1}: error -> ${String(r.error).slice(0, 200)}`);
        }
      }
    }

    setTestResults(results);
    const passedCount = results.filter((r) => r.passed).length;
    toast({ title: "Run finished", description: `${passedCount}/${results.length} tests passed` });
    setIsRunning(false);
  }

  /* ---------- Submit (fake judge) ---------- */
  async function handleSubmit() {
    setIsRunning(true);
    setTestResults([]);
    setLogs([]);
    addLog("Submitting solution to judge...");

    const testsToRun = publicTests.length ? publicTests : [];

    const localResults: any[] = [];

    for (let i = 0; i < testsToRun.length; i++) {
      const tc = testsToRun[i];

      if (language === "javascript") {
        const r = runSingleTestLocalJS(code, tc);
        if (r.ok) {
          const passed = deepEqual(r.actual, tc.expected);
          localResults.push({ name: tc.name, input: tc.input, expected: tc.expected, actual: r.actual, passed, error: null });
        } else {
          localResults.push({ name: tc.name, input: tc.input, expected: tc.expected, actual: null, passed: false, error: r.error });
        }
      } else {
        addLog(`Running ${language} test ${i + 1} via remote executor...`);
        try {
          const r = await runSingleTestRemoteViaPiston(language, code, tc);
          if (r.ok) {
            const passed = deepEqual(r.actual, tc.expected);
            localResults.push({ name: tc.name, input: tc.input, expected: tc.expected, actual: r.actual, passed, error: null });
          } else {
            localResults.push({ name: tc.name, input: tc.input, expected: tc.expected, actual: r.actual, passed: false, error: r.error });
          }
        } catch (err: any) {
          localResults.push({ name: tc.name, input: tc.input, expected: tc.expected, actual: null, passed: false, error: String(err) });
        }
      }
    }

    addLog("Submission added to judge queue...");
    const submissionId = createFakeSubmission(localResults);
    pollSubmission(submissionId);
  }

  function pollSubmission(submissionId: string) {
    addLog("Waiting for judge results...");
    const pollInterval = window.setInterval(() => {
      const res = getFakeSubmission(submissionId);
      if (!res) return;
      if (res.status === "Done") {
        clearInterval(pollInterval);
        addLog("Judge finished: " + res.status);
        setTestResults(res.results);
        const passedCount = res.results.filter((r) => r.passed).length;
        toast({ title: "Submission Complete", description: passedCount === res.results.length ? "Accepted ✓" : "Wrong Answer ❌" });
        setIsRunning(false);
      }
    }, 1200);
  }

  /* ---------- UI mapping ---------- */
  const languageMap: Record<string, string> = {
    javascript: "javascript",
    python: "python",
    java: "java",
    cpp: "cpp",
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">TechKnots</span>
          </Link>
          <div className="flex items-center gap-4">
            <Select value={language} onValueChange={(v) => setLanguage(v as any)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => void handleRunCode()} className="gap-2" disabled={isRunning}>
              {isRunning ? (<><Loader2 className="h-4 w-4 animate-spin" /> Running...</>) : (<><Play className="h-4 w-4" /> Run</>)}
            </Button>

            <Button onClick={() => void handleSubmit()} variant="outline" disabled={isRunning}>
              Submit
            </Button>
          </div>
        </div>
      </nav>

      <div className="h-[calc(100vh-73px)] flex">
        {/* Left: problem description */}
        <div className="w-1/2 border-r border-border overflow-y-auto p-6">
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-2xl font-bold">{problem ? (problem as any).title : "Problem"}</h1>
            <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">{problem ? (problem as any).difficulty : "—"}</span>
          </div>

          <div className="prose max-w-none">
            <p>{problem && (problem as any).description ? (problem as any).description : "Problem description will appear here if it's defined in the JSON."}</p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Public Tests</h3>
            <div className="space-y-2">
              {publicTests.length === 0 && <div className="text-sm text-muted-foreground">No public tests available.</div>}
              {publicTests.map((t: any, i: number) => (
                <Card key={i}><CardContent className="p-3 text-sm">
                  <div><strong>{t.name ?? `Test ${i + 1}`}</strong></div>
                  <div><strong>Input:</strong> {JSON.stringify(t.input)}</div>
                  <div><strong>Expected:</strong> {JSON.stringify(t.expected)}</div>
                </CardContent></Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right: editor + results */}
        <div className="w-1/2 flex flex-col">
          <div className="flex-1 border-b border-border">
            <Editor
              height="100%"
              language={languageMap[language]}
              value={code}
              onChange={(v) => setCode(v ?? "")}
              theme="vs-dark"
              onMount={(ed) => (editorRef.current = ed)}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                automaticLayout: true,
                tabSize: language === "python" ? 4 : 2,
                wordWrap: "off",
              }}
              loading={
                <div className="flex items-center justify-center h-full bg-[#1e1e1e]">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              }
            />
          </div>

          <div className="border-t border-border p-4 max-h-[320px] overflow-y-auto">
            <div className="mb-3">
              <h3 className="font-semibold">Logs</h3>
              <div className="bg-black text-white text-xs p-2 rounded h-20 overflow-auto">
                {logs.length === 0 ? <div className="text-gray-400">No logs yet. Run tests to see output.</div> : logs.map((l, i) => <div key={i}>{l}</div>)}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Test Results</h3>
              <div className="space-y-2">
                {testResults.length === 0 && <div className="text-muted-foreground text-sm">No results yet.</div>}
                {testResults.map((result, idx) => (
                  <Card key={idx} className={result.passed ? "border-success" : "border-destructive"}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm flex items-center gap-2">
                        {result.passed ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-success" />
                            <span className="text-success">Test Case {idx + 1} Passed</span>
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4 text-destructive" />
                            <span className="text-destructive">Test Case {idx + 1} Failed</span>
                          </>
                        )}
                        <span className="ml-2 text-xs text-muted-foreground">{result.name ?? ""}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-sm">
                      <div className="mb-1"><strong>Input:</strong> {JSON.stringify(result.input)}</div>
                      <div className="mb-1"><strong>Expected:</strong> {JSON.stringify(result.expected)}</div>
                      <div className="mb-1"><strong>Actual:</strong> {JSON.stringify(result.actual)}</div>
                      {result.error && <div className="mt-2 text-destructive text-xs"><strong>Error:</strong> {String(result.error)}</div>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
