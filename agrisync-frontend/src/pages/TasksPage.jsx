import React from 'react';
import CrudResourcePage from '../components/CrudResourcePage';
import { useAuth } from '../hooks/useAuth';

const TasksPage = () => {
    const { user } = useAuth(); // Get current user

    // TaskSerializer has read_only `assigned_to` and write_only `assigned_to_id`.
    // The `assigned_to_id` field in the form will use `/api/auth/users/` to list users.
    const taskFormFields = [
        { name: 'title', label: 'Task Title', placeholder: 'e.g., Water the tomatoes', required: true },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Detailed instructions for the task' },
        // Only admins can assign tasks to others. Workers can only see tasks assigned to them.
        // We might hide this field for workers or make it read-only pointing to themselves.
        // For simplicity, if worker creates a task, it's auto-assigned to them (backend logic needed or frontend default).
        ...(user?.role === 'admin' ? [{ 
            name: 'assigned_to_id', 
            label: 'Assign To', 
            type: 'select_related', 
            endpoint: '/auth/users/', // Ensure this endpoint lists users (id, username)
            placeholder: 'Select User (Optional)', 
            optionValue: 'id', 
            optionLabel: 'username', // Make sure your UserSerializer for /auth/users/ returns username
            required: false 
        }] : []),
        { name: 'due_date', label: 'Due Date', type: 'date', required: true },
        { 
            name: 'status', 
            label: 'Status', 
            type: 'select', 
            required: true,
            options: [
                { value: 'todo', label: 'To Do' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'done', label: 'Done' },
            ],
            placeholder: 'Select Status'
        },
    ];
    
    const initialTaskFormData = { 
        title: '', 
        description: '', 
        due_date: '', 
        status: 'todo' 
    };

    if (user?.role === 'admin') {
        initialTaskFormData.assigned_to_id = ''; // Add if admin
    } else if (user?.role === 'worker') {
        // For worker, if they can create tasks, auto-assign to themselves.
        // This can be handled by setting formData.assigned_to_id = user.id before POST
        // or backend logic. For now, we assume admins create/assign.
        // Workers will primarily update status of their tasks.
    }


    // Data transformer to format date for display
    const dataTransformer = (task) => ({
        ...task,
        created_at_display: new Date(task.created_at).toLocaleDateString(),
        assigned_to_username: task.assigned_to?.username || 'Unassigned',
    });


    return (
        <CrudResourcePage
            resourceName="Tasks"
            apiEndpoint="/tasks/tasks/" // Make sure this endpoint is correct
            columns={[
                { key: 'title', header: 'Title', accessor: 'title' },
                { key: 'assigned_to_username', header: 'Assigned To', accessor: 'assigned_to_username' },
                { key: 'due_date', header: 'Due Date', accessor: 'due_date' },
                { key: 'status', header: 'Status', accessor: 'status' },
                { key: 'created_at_display', header: 'Created', accessor: 'created_at_display' },
            ]}
            formFields={taskFormFields}
            initialFormData={initialTaskFormData}
            dataTransformer={dataTransformer}
            // TODO: For workers, we might want to filter tasks to only show their own.
            // This could be done by modifying apiEndpoint: `/tasks/tasks/?assigned_to=${user.id}`
            // Or by filtering on the frontend if all tasks are fetched (less ideal).
            // Also, workers should perhaps only be able to edit the 'status' of their tasks.
            // This requires more granular control in CrudResourcePage or a custom page for workers.
        />
    );
};

export default TasksPage;