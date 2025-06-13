import Todo from "./todo"
import TaskUI from './todo-ui-tasks'
import FilterUI from './todo-ui-task-filters'

function initProjects() {
    const projectsContainer = document.getElementById('all-projects-container')
    Todo.Projects.forEach(project => {
        projectsContainer.innerHTML = ''
        const DOMProject = document.createElement('div')
        DOMProject.classList.add('project')
        DOMProject.dataset.ID = project.ID
        projectsContainer.appendChild(DOMProject)

        const DOMProjectLabelColor = document.createElement('div')
        DOMProjectLabelColor.classList.add('project-label-color')
        DOMProject.appendChild(DOMProjectLabelColor)

        const DOMProjectTitle = document.createElement('div')
        DOMProjectTitle.classList.add('project-title')
        DOMProjectTitle.textContent = project.name
        DOMProject.appendChild(DOMProjectTitle)

        const DOMProjectTotalTasksCounter = document.createElement('div')
        DOMProjectTotalTasksCounter.classList.add('total-tasks-counter')
        DOMProjectTotalTasksCounter.textContent = project.tasks.length
        DOMProject.appendChild(DOMProjectTotalTasksCounter)
    })
}
function initSidebarToggle() {
    const content = document.getElementById('content')
    const toggleSidebarButton = document.getElementById('button-toggle-sidebar')
    toggleSidebarButton.addEventListener('click', e => {
        if (content.classList.contains('sidebarExpanded')) {
            content.classList.remove('sidebarExpanded')
        } else {
            content.classList.add('sidebarExpanded')
        }
    })
}
function initTaskInputPopup() {
    const showAddTaskButton = document.getElementById('button-add-task')
    const taskInputContainer = document.getElementById('taskInputContainer')
    const taskInputTitle = document.getElementById('taskInputTitle')
    const taskInputDescription = document.getElementById('taskInputDescription')
    const taskInputNote = document.getElementById('taskInputNote')
    const taskInputPriority = document.getElementById('taskInputPriority')
    const taskInputDueDateTime = document.getElementById('taskInputDueDateTime')
    const taskInputs = [ taskInputTitle, taskInputDescription, taskInputNote, taskInputPriority, taskInputDueDateTime ]
    const discardTaskButton = document.getElementById('taskInputDiscardButton')
    const addTaskButton = document.getElementById('taskInputAddButton')
    const taskInputProject = document.getElementById('taskInputProject')
    Todo.Projects.forEach(project => {
        const projectName = document.createElement('option')
        projectName.value = project.ID
        projectName.textContent = project.name
        taskInputProject.appendChild(projectName)
    })

    showAddTaskButton.addEventListener('click', () => {
        const currentDate = new Date()
        taskInputDueDateTime.value = currentDate.toISOString().slice(0, 10) + 'T' + currentDate.toTimeString().slice(0, 5)
        taskInputContainer.classList.add('visible')
    })
    discardTaskButton.addEventListener('click', () => {
        taskInputs.forEach(input => {
            if (input.id === "taskInputPriority") { } else { input.value = '' }
            if (input.id === "taskInputDueDateTime") taskInputDueDateTime.value = ""
        })
        taskInputContainer.classList.remove('visible')
    })
    addTaskButton.addEventListener('click', () => {
        if (taskInputTitle.value.trim() === "") {
            alert("Title can't be empty!")
            return
        }
        if (taskInputDueDateTime.value.trim() === "") {
            alert("You must select due date & time!")
            return
        }
        Todo.AddTask(taskInputTitle.value.trim(), taskInputDescription.value.trim(), taskInputNote.value.trim(), Number(taskInputPriority.value), new Date(taskInputDueDateTime.value), taskInputProject.value)
        taskInputs.forEach(input => {
            if (input.id === "taskInputPriority") { } else { input.value = '' }
        })
        taskInputContainer.classList.remove('visible')
        FilterUI.load.selected()
        TaskUI.init.listeners.all()
    })
    const taskInput = document.getElementById('taskInput')
    taskInput.classList.add('taskInputTransiton')
    const taskInputOverlay = document.getElementById('taskInputOverlay')
    taskInputOverlay.classList.add('taskInputOverlayTransiton')
}
function init() {
    initProjects()
    initSidebarToggle()
    initTaskInputPopup()
    TaskUI.init.listeners.all()
    FilterUI.init.listeners()
}

const todoUI = {
    init: {
        all: init,
        projects: initProjects,
        sidebar: initSidebarToggle,
        taskInput: initTaskInputPopup,
    }
}
export default todoUI