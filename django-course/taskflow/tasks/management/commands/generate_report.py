from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from django.db.models import Q
from tasks.models import Project, Task
import csv
import os
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Generate project status report with task details'

    def add_arguments(self, parser):
        parser.add_argument('project_id', type=int, help='Project ID')
        parser.add_argument(
            '--output',
            type=str,
            help='Output file path (default: project_report_<id>_<date>.csv)'
        )
        parser.add_argument(
            '--format',
            type=str,
            choices=['csv', 'txt'],
            default='csv',
            help='Output format (default: csv)'
        )
        parser.add_argument(
            '--include-completed',
            action='store_true',
            help='Include completed tasks in the report'
        )

    def handle(self, *args, **options):
        try:
            # Get project
            project = Project.objects.get(id=options['project_id'])
            
            # Build query for tasks
            tasks_query = project.tasks.all()
            if not options['include_completed']:
                tasks_query = tasks_query.exclude(status='done')
            
            # Generate output filename if not provided
            if not options['output']:
                date_str = timezone.now().strftime('%Y%m%d_%H%M%S')
                options['output'] = f'project_report_{project.id}_{date_str}.{options["format"]}'
            
            # Ensure output directory exists
            os.makedirs(os.path.dirname(options['output'] or '.'), exist_ok=True)
            
            if options['format'] == 'csv':
                self.generate_csv_report(project, tasks_query, options['output'])
            else:
                self.generate_txt_report(project, tasks_query, options['output'])
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully generated report: {options["output"]}')
            )
            
        except Project.DoesNotExist:
            raise CommandError(f'Project with ID {options["project_id"]} does not exist')
        except Exception as e:
            logger.error(f'Error generating report: {str(e)}')
            raise CommandError(f'Failed to generate report: {str(e)}')

    def generate_csv_report(self, project, tasks, output_file):
        """Generate report in CSV format."""
        with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            
            # Write header
            writer.writerow([
                'Project Name:', project.name,
                'Generated:', timezone.now().strftime('%Y-%m-%d %H:%M:%S')
            ])
            writer.writerow([])  # Empty row for spacing
            
            # Write project summary
            writer.writerow(['Project Summary'])
            writer.writerow(['Total Tasks:', tasks.count()])
            writer.writerow(['Owner:', project.owner.username])
            writer.writerow(['Created:', project.created_at.strftime('%Y-%m-%d')])
            writer.writerow([])
            
            # Write task details
            writer.writerow([
                'Task ID',
                'Title',
                'Status',
                'Priority',
                'Assignee',
                'Due Date',
                'Category',
                'Comments',
                'Created',
                'Last Updated'
            ])
            
            for task in tasks:
                writer.writerow([
                    task.id,
                    task.title,
                    task.get_status_display(),
                    task.get_priority_display(),
                    task.assignee.username if task.assignee else 'Unassigned',
                    task.due_date.strftime('%Y-%m-%d') if task.due_date else 'No due date',
                    task.category.name if task.category else 'No category',
                    task.comments.count(),
                    task.created_at.strftime('%Y-%m-%d'),
                    task.updated_at.strftime('%Y-%m-%d')
                ])

    def generate_txt_report(self, project, tasks, output_file):
        """Generate report in text format."""
        with open(output_file, 'w', encoding='utf-8') as txtfile:
            # Write header
            txtfile.write(f"Project Report: {project.name}\n")
            txtfile.write(f"Generated: {timezone.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            txtfile.write("=" * 80 + "\n\n")
            
            # Write project summary
            txtfile.write("Project Summary:\n")
            txtfile.write(f"Total Tasks: {tasks.count()}\n")
            txtfile.write(f"Owner: {project.owner.username}\n")
            txtfile.write(f"Created: {project.created_at.strftime('%Y-%m-%d')}\n")
            txtfile.write("\n" + "=" * 80 + "\n\n")
            
            # Write task details
            txtfile.write("Task Details:\n\n")
            
            for task in tasks:
                txtfile.write(f"Task ID: {task.id}\n")
                txtfile.write(f"Title: {task.title}\n")
                txtfile.write(f"Status: {task.get_status_display()}\n")
                txtfile.write(f"Priority: {task.get_priority_display()}\n")
                txtfile.write(f"Assignee: {task.assignee.username if task.assignee else 'Unassigned'}\n")
                txtfile.write(f"Due Date: {task.due_date.strftime('%Y-%m-%d') if task.due_date else 'No due date'}\n")
                txtfile.write(f"Category: {task.category.name if task.category else 'No category'}\n")
                txtfile.write(f"Comments: {task.comments.count()}\n")
                txtfile.write(f"Created: {task.created_at.strftime('%Y-%m-%d')}\n")
                txtfile.write(f"Last Updated: {task.updated_at.strftime('%Y-%m-%d')}\n")
                txtfile.write("-" * 40 + "\n\n") 