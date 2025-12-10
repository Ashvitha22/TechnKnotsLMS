// @ts-nocheck
import fs from "fs";
import { exec } from "child_process";

export function runJava(code, input, entryFn) {
  return new Promise(resolve => {
    const nums = input[0];
    const target = input[1];

    const wrapped = `
${code}

public class Main {
  public static void main(String[] args) {
    Solution s = new Solution();
    int[] res = s.${entryFn}(new int[]{${nums}}, ${target});
    System.out.println(java.util.Arrays.toString(res));
  }
}
`;

    fs.writeFileSync("Main.java", wrapped);

    exec(`javac Main.java && java Main`, (err, stdout, stderr) => {
      resolve({ stdout, stderr });
    });
  });
}
