import { projectsService } from '../services/projectsService';

export async function projectLoader() {
  try {
    const projects = await projectsService.getProjects();
    return { projects };
  } catch (error) {
    throw new Response('Failed to load projects', { status: 500 });
  }
}

export async function projectDetailsLoader({ params }) {
  try {
    const project = await projectsService.getProjectById(params.id);
    if (!project) {
      throw new Response('Project not found', { status: 404 });
    }
    return { project };
  } catch (error) {
    throw new Response(error.message, { 
      status: error.status || 500 
    });
  }
} 