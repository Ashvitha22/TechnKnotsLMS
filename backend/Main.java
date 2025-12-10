
import java.util.*;

public class Solution {
    public List<Integer> mergeTwoLists(List<Integer> l1, List<Integer> l2) {
        List<Integer> merged = new ArrayList<>();
        int i = 0, j = 0;

        while (i < l1.size() && j < l2.size()) {
            if (l1.get(i) < l2.get(j)) {
                merged.add(l1.get(i++));
            } else {
                merged.add(l2.get(j++));
            }
        }

        while (i < l1.size()) merged.add(l1.get(i++));
        while (j < l2.size()) merged.add(l2.get(j++));

        return merged;
    }
}

public class Main {
  public static void main(String[] args) {
    Solution s = new Solution();
    int[] res = s.mergeTwoLists(new int[]{}, 0);
    System.out.println(java.util.Arrays.toString(res));
  }
}
