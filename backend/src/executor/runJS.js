import fs from "fs";
import { exec } from "child_process";

export function runJS(code, input, funcName) {
  return new Promise((resolve) => {
    const wrapper = `
${code}
console.log(JSON.stringify(${funcName}(...${JSON.stringify(input)})));
`;
    fs.writeFileSync("user.js", wrapper);
    exec(`node user.js`, (err, stdout, stderr) => resolve({ stdout, stderr }));
  });
}
