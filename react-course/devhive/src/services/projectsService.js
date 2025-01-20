import { validate } from './validators';
import { projectSchema } from './validators';

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
    // Validate project data
    const errors = {};
    Object.keys(projectSchema).forEach(field => {
      const error = validate(field, projectData[field], projectSchema);
      if (error) errors[field] = error;
    });

    if (Object.keys(errors).length > 0) {
      throw new Error('Invalid project data: ' + Object.values(errors).join(', '));
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newProject = {
      id: Date.now().toString(),
      ...projectData,
      createdAt: new Date().toISOString(),
    };

    MOCK_PROJECTS.push(newProject);
    return newProject;
  },

  async updateProject(id, updates) {
    const projectIndex = MOCK_PROJECTS.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    // Validate updates
    const errors = {};
    Object.keys(updates).forEach(field => {
      if (projectSchema[field]) {
        const error = validate(field, updates[field], projectSchema);
        if (error) errors[field] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      throw new Error('Invalid project data: ' + Object.values(errors).join(', '));
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    MOCK_PROJECTS[projectIndex] = {
      ...MOCK_PROJECTS[projectIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return MOCK_PROJECTS[projectIndex];
  },
}; 