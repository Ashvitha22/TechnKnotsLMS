
#include <bits/stdc++.h>
using namespace std;

#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map; // value -> index

        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];

            if (map.find(complement) != map.end()) {
                return { map[complement], i };
            }

            map[nums[i]] = i;
        }

        // If no solution is found
        return {};
    }
};

int main(){
    vector<int> nums = {3,3};
    int target = 6;
    Solution s;
    auto res = s.twoSum(nums, target);

    cout << "[";
    for(int i=0;i<res.size();i++){
        cout<<res[i];
        if(i+1<res.size()) cout<<",";
    }
    cout<<"]";
    return 0;
}
