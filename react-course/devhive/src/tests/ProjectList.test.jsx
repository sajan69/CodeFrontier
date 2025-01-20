import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectList } from '../components/projects/ProjectList';

describe('ProjectList Component', () => {
  const mockProjects = [
    { id: '1', title: 'Project 1', status: 'active' },
    { id: '2', title: 'Project 2', status: 'completed' },
  ];

  it('renders all projects', () => {
    render(<ProjectList projects={mockProjects} />);
    
    expect(screen.getByText('Project 1')).toBeInTheDocument();
    expect(screen.getByText('Project 2')).toBeInTheDocument();
  });

  it('filters projects by status', () => {
    render(<ProjectList projects={mockProjects} />);
    
    fireEvent.click(screen.getByText('Active'));
    expect(screen.getByText('Project 1')).toBeInTheDocument();
    expect(screen.queryByText('Project 2')).not.toBeInTheDocument();
  });

  it('handles project selection', () => {
    const onSelect = jest.fn();
    render(<ProjectList projects={mockProjects} onSelect={onSelect} />);
    
    fireEvent.click(screen.getByText('Project 1'));
    expect(onSelect).toHaveBeenCalledWith('1');
  });
}); 