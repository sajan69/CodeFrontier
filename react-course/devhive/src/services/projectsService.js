const MOCK_PROJECTS = [
  {
    id: '1',
    title: 'React E-commerce Platform',
    description: 'Building a modern e-commerce platform using React and Node.js',
    status: 'active',
    tags: ['React', 'Node.js', 'MongoDB'],
    collaborators: [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' },
    ],
  },
  {
    id: '2',
    title: 'AI Image Recognition App',
    description: 'Developing an AI-powered image recognition application',
    status: 'active',
    tags: ['Python', 'TensorFlow', 'React'],
    collaborators: [
      { id: '3', name: 'Mike Johnson' },
    ],
  },
  {
    id: '3',
    title: 'DevHive Mobile App',
    description: 'Creating a mobile version of DevHive platform',
    status: 'completed',
    tags: ['React Native', 'Firebase'],
    collaborators: [
      { id: '4', name: 'Sarah Wilson' },
      { id: '5', name: 'Tom Brown' },
    ],
  },
];

export const projectsService = {
  async getProjects() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return MOCK_PROJECTS;
  },

  async getProjectById(id) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_PROJECTS.find(project => project.id === id);
  },

  async createProject(projectData) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newProject = {
      id: Date.now().toString(),
      ...projectData,
      createdAt: new Date().toISOString(),
    };
    MOCK_PROJECTS.push(newProject);
    return newProject;
  }
}; 