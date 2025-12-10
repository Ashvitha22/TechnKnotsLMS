
def two_sum(nums, target):
    seen = {}  # value -> index
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in seen:
            return [seen[complement], i]
        
        seen[num] = i

    return []


import json
if __name__ == "__main__":
    data = json.loads('[[3,3],6]')
    result = two_sum(*data)
    print(json.dumps(result))
