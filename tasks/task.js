
        // Wait for the DOM to be fully loaded before running the script
        document.addEventListener("DOMContentLoaded", () => {
            // Get references to important DOM elements
            const tasksContainer = document.getElementById("tasks-list");
            const loadingIndicator = document.getElementById("loading");
            const taskForm = document.getElementById("task-form");
            const searchTitleInput = document.getElementById("search-title");
            const searchStatusSelect = document.getElementById("search-status");
            const searchButton = document.getElementById("search-btn");

            // Attach an event listener to the form to handle task submission
            taskForm.addEventListener("submit", (event) => {
                event.preventDefault(); // Prevent the default form submission behavior
                addTask(); // Call the function to add a new task
            });

            // Attach an event listener to the search button to handle task search
            searchButton.addEventListener("click", () => {
                searchTasks(); // Call the function to search tasks
            });

            // Function to fetch tasks from local storage and display them
            function fetchTasks() {
                loadingIndicator.style.display = "block"; // Show the loading indicator
                try {
                    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || []; // Get tasks from local storage
                    displayTasks(storedTasks); // Display the tasks
                } catch (error) {
                    console.error("Error fetching tasks:", error); // Log an error if fetching tasks fails
                    alert("Failed to fetch tasks."); // Show an alert if fetching tasks fails
                } finally {
                    loadingIndicator.style.display = "none"; // Hide the loading indicator
                }
            }

            // Function to display a list of tasks in the DOM
            function displayTasks(tasks) {
                tasksContainer.innerHTML = ""; // Clear the current tasks list
                tasks.forEach((task) => {
                    const taskElement = createTaskElement(task); // Create a task element
                    tasksContainer.appendChild(taskElement); // Add the task element to the list
                });
            }

            // Function to create a DOM element for a task
            function createTaskElement(task) {
                const taskElement = document.createElement("li");
                taskElement.className = `task ${task.completed ? "completed" : ""}`; // Add appropriate classes
                taskElement.setAttribute("data-id", task.id); // Add a data attribute with the task's ID
                taskElement.innerHTML = `
                    <h3>${task.title}</h3>
                    <p>${task.description || "No description"}</p>
                    <p>Status: ${task.completed ? "Completed" : "Not Completed"}</p>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                `;

                // Attach event listeners to the edit and delete buttons
                const editButton = taskElement.querySelector(".edit-btn");
                editButton.addEventListener("click", () => editTask(task.id));

                const deleteButton = taskElement.querySelector(".delete-btn");
                deleteButton.addEventListener("click", () => deleteTask(task.id));

                return taskElement; // Return the created task element
            }

            // Function to generate a unique ID for a new task
            function generateUniqueId() {
                return "task-" + Math.random().toString(36).substr(2, 9); // Generate a random ID
            }

            // Function to add a new task
            async function addTask() {
                const title = document.getElementById("title").value;
                const description = document.getElementById("description").value;
                const completed = document.getElementById("completed").checked;

                if (!title) {
                    alert("Title is required"); // Alert if title is missing
                    return;
                }

                const newTask = {
                    id: generateUniqueId(), // Generate a unique ID for the new task
                    title,
                    description,
                    completed,
                };

                loadingIndicator.style.display = "block"; // Show the loading indicator
                try {
                    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
                    storedTasks.unshift(newTask); // Add new task to the beginning of the list
                    localStorage.setItem("tasks", JSON.stringify(storedTasks)); // Save updated tasks list to local storage

                    // Insert new task at the top in the DOM
                    const taskElement = createTaskElement(newTask);
                    tasksContainer.prepend(taskElement); // Prepend the task element to the list
                } catch (error) {
                    console.error("Error adding task:", error); // Log an error if adding task fails
                    alert("Failed to add task."); // Show an alert if adding task fails
                } finally {
                    loadingIndicator.style.display = "none"; // Hide the loading indicator
                }

                // Clear form
                taskForm.reset(); // Reset the form fields
            }

            // Function to edit an existing task
            async function editTask(id) {
                const taskElement = tasksContainer.querySelector(`li[data-id='${id}']`);
                if (!taskElement) {
                    console.error(`Task with id ${id} not found.`); // Log an error if task is not found
                    return;
                }

                // Get current task details
                const currentTitle = taskElement.querySelector("h3").innerText;
                const currentDescription = taskElement.querySelector("p").innerText;
                const currentStatusText = taskElement.querySelector("p:nth-child(3)").innerText;
                const currentStatus = currentStatusText.includes("Completed");

                // Prompt the user to enter new task details
                const title = prompt("Enter new title:", currentTitle);
                const description = prompt("Enter new description:", currentDescription);
                const completed = confirm("Mark as completed?");

                if (!title) return; // If title is missing, return early

                const updatedTask = {
                    id,
                    title,
                    description,
                    completed,
                };

                loadingIndicator.style.display = "block"; // Show the loading indicator
                try {
                    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
                    const updatedIndex = storedTasks.findIndex((task) => task.id === id);
                    if (updatedIndex !== -1) {
                        storedTasks[updatedIndex] = updatedTask; // Update the task in the list
                        localStorage.setItem("tasks", JSON.stringify(storedTasks)); // Save updated tasks list to local storage
                    }

                    updateTaskInDOM(updatedTask); // Update the task in the DOM
                } catch (error) {
                    console.error("Error editing task:", error); // Log an error if editing task fails
                    alert("Failed to edit task."); // Show an alert if editing task fails
                } finally {
                    loadingIndicator.style.display = "none"; // Hide the loading indicator
                }
            }

            // Function to update the task in the DOM
            function updateTaskInDOM(task) {
                const taskElement = tasksContainer.querySelector(`li[data-id='${task.id}']`);
                if (taskElement) {
                    taskElement.querySelector("h3").innerText = task.title;
                    taskElement.querySelector("p").innerText = task.description || "No description";
                    taskElement.querySelector("p:nth-child(3)").innerText = `Status: ${task.completed ? "Completed" : "Not Completed"}`;
                    taskElement.className = `task ${task.completed ? "completed" : ""}`; // Update the class name based on task status
                }
            }

            // Function to delete an existing task
            async function deleteTask(id) {
                if (!confirm("Are you sure you want to delete this task?")) return; // Confirm before deleting

                loadingIndicator.style.display = "block"; // Show the loading indicator
                try {
                    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
                    const updatedTasks = storedTasks.filter((task) => task.id !== id); // Filter out the task to be deleted
                    localStorage.setItem("tasks", JSON.stringify(updatedTasks)); // Save updated tasks list to local storage

                    const taskElement = tasksContainer.querySelector(`li[data-id='${id}']`);
                    if (taskElement) {
                        tasksContainer.removeChild(taskElement); // Remove the task element from the DOM
                    }
                } catch (error) {
                    console.error("Error deleting task:", error); // Log an error if deleting task fails
                    alert("Failed to delete task."); // Show an alert if deleting task fails
                } finally {
                    loadingIndicator.style.display = "none"; // Hide the loading indicator
                }
            }

            // Function to search tasks by title and status
            function searchTasks() {
                const title = searchTitleInput.value.toLowerCase();
                const status = searchStatusSelect.value;

                loadingIndicator.style.display = "block"; // Show the loading indicator
                try {
                    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || []; // Get tasks from local storage
                    const filteredTasks = storedTasks.filter((task) => {
                        const matchesTitle = task.title.toLowerCase().includes(title);
                        const matchesStatus = (status === "completed" && task.completed) ||
                            (status === "not_completed" && !task.completed) || status === "";
                        return matchesTitle && matchesStatus;
                    });
                    displayTasks(filteredTasks); // Display the filtered tasks
                } catch (error) {
                    console.error("Error searching tasks:", error); // Log an error if searching tasks fails
                    alert("Failed to search tasks."); // Show an alert if searching tasks fails
                } finally {
                    loadingIndicator.style.display = "none"; // Hide the loading indicator
                }
            }

            fetchTasks(); // Fetch tasks when the page loads
        });
    