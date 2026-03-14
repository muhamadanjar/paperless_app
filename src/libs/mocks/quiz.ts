// Mock data for UI demonstration
export const MOCK_QUIZZES = [
  {
    id: "1",
    name: "Advanced React Patterns",
    slug: "advanced-react-patterns",
    description: "Test your knowledge of hooks, context, higher-order components, and performance optimization techniques in React.",
    createdAt: new Date(),
    questionCount: 15,
  },
  {
    id: "2",
    name: "Data Structures & Algorithms",
    slug: "dsa-basics",
    description: "A comprehensive assessment covering arrays, trees, graphs, dynamic programming, and common sorting algorithms.",
    createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    questionCount: 25,
  },
  {
    id: "3",
    name: "TypeScript Fundamentals",
    slug: "ts-fundamentals",
    description: "Evaluate your understanding of typing features, interfaces, generics, and configuration options in TypeScript.",
    createdAt: new Date(Date.now() - 86400000 * 5),
    questionCount: 10,
  }
];
