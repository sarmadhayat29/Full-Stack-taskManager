document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const errorMessage = document.getElementById('error-message');

    // Fetch and display tasks on load
    fetchTasks();

    // Handle form submission
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const taskName = taskInput.value.trim();
        
        if (!taskName) {
            showError('Please enter a task name.');
            return;
        }

        hideError();
        
        try {
            const response = await fetch('/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: taskName })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to add task');
            }

            const newTask = await response.json();
            taskInput.value = '';
            
            // Add new task to the top of the list
            // If the list is empty/showing a message, clear it first
            if (taskList.querySelector('.empty-state') || taskList.querySelector('.loading')) {
                taskList.innerHTML = '';
            }
            
            const li = createTaskElement(newTask);
            taskList.prepend(li);

        } catch (error) {
            showError(error.message);
        }
    });

    async function fetchTasks() {
        try {
            const response = await fetch('/api/items');
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            const tasks = await response.json();
            
            taskList.innerHTML = '';
            
            if (tasks.length === 0) {
                taskList.innerHTML = '<li class="empty-state">No tasks yet. Add one above!</li>';
                return;
            }

            tasks.forEach(task => {
                const li = createTaskElement(task);
                taskList.appendChild(li);
            });

        } catch (error) {
            taskList.innerHTML = `<li class="error">Error loading tasks: ${error.message}</li>`;
        }
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        
        const span = document.createElement('span');
        span.className = 'task-name';
        span.textContent = task.name;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteTask(task.id, li);
        
        li.appendChild(span);
        li.appendChild(deleteBtn);
        
        return li;
    }

    async function deleteTask(id, liElement) {
        // Disable button while deleting
        const btn = liElement.querySelector('.delete-btn');
        btn.disabled = true;
        btn.textContent = '...';

        try {
            const response = await fetch(`/api/items/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to delete task');
            }

            // Remove from DOM
            liElement.style.opacity = '0';
            liElement.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                liElement.remove();
                if (taskList.children.length === 0) {
                    taskList.innerHTML = '<li class="empty-state">No tasks yet. Add one above!</li>';
                }
            }, 300);

        } catch (error) {
            btn.disabled = false;
            btn.textContent = 'Delete';
            showError(error.message);
        }
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.classList.remove('hidden');
    }

    function hideError() {
        errorMessage.classList.add('hidden');
        errorMessage.textContent = '';
    }
});
