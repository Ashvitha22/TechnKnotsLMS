// backend/src/judgeController.js
// @ts-nocheck
import { runJS } from "./executor/runJS.js";
import { runPython } from "./executor/runPython.js";
import { runJava } from "./executor/runJava.js";
import { runCpp } from "./executor/runCpp.js";

// Exported judge function
export async function judge(req, res) {
  const { code, language, tests, entryFn } = req.body;

  // basic validation
  if (!code || !language || !Array.isArray(tests)) {
    return res
      .status(400)
      .json({ error: "code, language, tests are required" });
  }

  // which function name to call from user code
  const funcName = entryFn || (language === "python" ? "two_sum" : "twoSum");

  const engines = {
    javascript: runJS,
    python: runPython,
    java: runJava,
    cpp: runCpp,
  };

  const execute = engines[language];
  if (!execute) {
    return res.status(400).json({ error: "Language not supported" });
  }

  console.log("──── New judge request ────");
  console.log("Language:", language);
  console.log("Entry function:", funcName);
  console.log("Tests:", tests.length);

  const results = [];

  try {
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      const { input, expected } = test;

      console.log(`Running test ${i + 1}…`);

      let stdout = "";
      let stderr = "";
      try {
        // executors take (code, input, funcName)
        const execResult = await execute(code, input, funcName);
        stdout = execResult.stdout ?? "";
        stderr = execResult.stderr ?? "";
      } catch (e) {
        console.error(`Executor error on test ${i + 1}:`, e);
        stderr = String(e);
      }

      const output = (stdout ?? "").trim() || (stderr ?? "").trim();

      let passed = false;
      try {
        // try JSON compare first
        passed =
          JSON.stringify(JSON.parse(output)) === JSON.stringify(expected);
      } catch {
        // fall back to string compare against JSON of expected
        passed = output === JSON.stringify(expected);
      }

      console.log(
        `Test ${i + 1} result:`,
        passed ? "PASSED" : "FAILED",
        "| output:",
        output
      );

      results.push({
        input,
        expected,
        output,
        passed,
        error: stderr || null,
      });
    }

    const passedCount = results.filter((r) => r.passed).length;
    console.log(
      `Judge finished: ${passedCount}/${results.length} tests passed`
    );
    console.log("──── End judge request ────");

    return res.json({ results });
  } catch (err) {
    console.error("Judge crashed:", err);
    return res.status(500).json({
      error: "Internal judge error",
      details: String(err),
    });
  }
}
