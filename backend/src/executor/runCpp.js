// @ts-nocheck
import fs from "fs";
import { exec } from "child_process";

export function runCpp(code, input, entryFn) {
  return new Promise(resolve => {
    const nums = input[0].join(",");
    const target = input[1];

    const wrapped = `
#include <bits/stdc++.h>
using namespace std;

${code}

int main(){
    vector<int> nums = {${nums}};
    int target = ${target};
    Solution s;
    auto res = s.${entryFn}(nums, target);

    cout << "[";
    for(int i=0;i<res.size();i++){
        cout<<res[i];
        if(i+1<res.size()) cout<<",";
    }
    cout<<"]";
    return 0;
}
`;

    fs.writeFileSync("main.cpp", wrapped);

    exec(`g++ main.cpp -o run && ./run`, (err, stdout, stderr) => {
      resolve({ stdout, stderr });
    });
  });
}
