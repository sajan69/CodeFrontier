// Simulated API calls with random data
export const analyticsService = {
  async getMetrics(timeRange) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      activeProjects: Math.floor(Math.random() * 100),
      completedProjects: Math.floor(Math.random() * 50),
      totalCollaborators: Math.floor(Math.random() * 500),
      averageCompletionTime: Math.floor(Math.random() * 30),
      popularTags: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS'].slice(0, 3),
    };
  },

  async getProjectTrends() {
    await new Promise(resolve => setTimeout(resolve, 800));

    return Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      newProjects: Math.floor(Math.random() * 10),
      activeCollaborators: Math.floor(Math.random() * 100),
    }));
  }
}; 