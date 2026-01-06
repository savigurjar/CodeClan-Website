react-hook-form validate data from frontend taki backend me faltu me sb nhi bhre

npm install @react-oauth/google
 


 {
  "title": "Maximum Subarray Sum",
  "description": "Given an array of integers, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
  "difficulty": "medium",
  "tags": ["array", "dynamicProgramming"],
  "visibleTestCases": [
    {
      "input": "1 -2 3 4 -1 2 1 -5 4",
      "output": "9",
      "explanation": "The subarray [3,4,-1,2,1] has the maximum sum 9"
    },
    {
      "input": "-3 -1 -2",
      "output": "-1",
      "explanation": "The subarray [-1] has the maximum sum -1"
    }
  ],
  "hiddenTestCases": [
    {
      "input": "5 -2 3 1 2 -1 4 -5",
      "output": "9"
    },
    {
      "input": "0 -1 0 1 0",
      "output": "1"
    }
  ],
  "startCode": [
    {
      "language": "Python",
      "initialCode": "# Read input and find max subarray sum\ninput_str = input()\n# TODO: Implement the algorithm"
    },
    {
      "language": "JavaScript",
      "initialCode": "const readline = require('readline');\nconst rl = readline.createInterface({ input: process.stdin, output: process.stdout });\nrl.on('line', (line) => {\n    // TODO: Implement max subarray sum\n    rl.close();\n});"
    },
    {
      "language": "Java",
      "initialCode": "import java.util.*;\nclass Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line = sc.nextLine();\n        // TODO: Implement max subarray sum\n    }\n}"
    },
    {
      "language": "C",
      "initialCode": "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    char input[10000];\n    fgets(input, sizeof(input), stdin);\n    // TODO: Implement max subarray sum\n    return 0;\n}"
    },
    {
      "language": "C++",
      "initialCode": "#include <iostream>\n#include <sstream>\nusing namespace std;\nint main() {\n    string line;\n    getline(cin, line);\n    // TODO: Implement max subarray sum\n    return 0;\n}"
    }
  ],
  "referenceSolution": [
    {
      "language": "Python",
      "completeCode": "input_str = input()\narr = list(map(int, input_str.strip().split()))\nmax_sum = curr = arr[0]\nfor num in arr[1:]:\n    curr = max(num, curr+num)\n    max_sum = max(max_sum, curr)\nprint(max_sum)"
    },
    {
      "language": "JavaScript",
      "completeCode": "const readline = require('readline');\nconst rl = readline.createInterface({ input: process.stdin, output: process.stdout });\nrl.on('line', (line) => {\n    const arr = line.trim().split(' ').map(Number);\n    let maxSum = arr[0], curr = arr[0];\n    for(let i=1;i<arr.length;i++){\n        curr = Math.max(arr[i], curr+arr[i]);\n        maxSum = Math.max(maxSum, curr);\n    }\n    console.log(maxSum);\n    rl.close();\n});"
    },
    {
      "language": "Java",
      "completeCode": "import java.util.*;\nclass Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line = sc.nextLine();\n        String[] parts = line.trim().split(\" \");\n        int[] arr = new int[parts.length];\n        for(int i=0;i<parts.length;i++) arr[i] = Integer.parseInt(parts[i]);\n        int maxSum = arr[0], curr = arr[0];\n        for(int i=1;i<arr.length;i++) {\n            curr = Math.max(arr[i], curr+arr[i]);\n            maxSum = Math.max(maxSum, curr);\n        }\n        System.out.println(maxSum);\n    }\n}"
    },
    {
      "language": "C",
      "completeCode": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\nint main() {\n    char input[10000];\n    fgets(input, sizeof(input), stdin);\n    int arr[1000], n=0;\n    char *token = strtok(input, \" \\n\");\n    while(token != NULL){ arr[n++] = atoi(token); token = strtok(NULL, \" \\n\"); }\n    int maxSum = arr[0], curr = arr[0];\n    for(int i=1;i<n;i++){\n        curr = arr[i] > curr+arr[i] ? arr[i] : curr+arr[i];\n        maxSum = maxSum > curr ? maxSum : curr;\n    }\n    printf(\"%d\", maxSum);\n    return 0;\n}"
    },
    {
      "language": "C++",
      "completeCode": "#include <iostream>\n#include <sstream>\n#include <vector>\nusing namespace std;\nint main() {\n    string line;\n    getline(cin, line);\n    istringstream iss(line);\n    vector<int> arr;\n    int num;\n    while(iss >> num) arr.push_back(num);\n    int maxSum = arr[0], curr = arr[0];\n    for(int i=1;i<arr.size();i++){\n        curr = max(arr[i], curr+arr[i]);\n        maxSum = max(maxSum, curr);\n    }\n    cout << maxSum;\n    return 0;\n}"
    }
  ],
  "constraints": [
    "1 <= number of elements <= 10^5",
    "-10^9 <= elements <= 10^9"
  ],
  "examples": [
    {
      "input": "1 -2 3 4 -1 2 1 -5 4",
      "output": "9",
      "explanation": "The subarray [3,4,-1,2,1] has the maximum sum 9"
    }
  ],
  "complexity": {
    "time": "O(n)",
    "space": "O(1)"
  },
  "companies": ["Amazon", "Google", "Microsoft"],
  "isPremium": false,
  "points": 300
}
