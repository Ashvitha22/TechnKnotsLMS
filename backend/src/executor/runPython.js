import fs from "fs";
import { exec } from "child_process";
import path from "path";

export function runPython(code, input, funcName) {
  return new Promise((resolve) => {
    const file = path.join(process.cwd(), "user.py");

    const wrapper = `
${code}

import json
if __name__ == "__main__":
    data = json.loads('${JSON.stringify(input)}')
    result = ${funcName}(*data)
    print(json.dumps(result))
`;

    fs.writeFileSync(file, wrapper);

    exec(`python user.py`, (err, stdout, stderr) => {
      resolve({ stdout, stderr });
    });
  });
}
