import Todo from "./todo"
import TaskUI from './todo-ui-tasks'
import ProjectUI from './todo-ui-projects'
import FilterUI from './todo-ui-task-filters'

function initPopups() {
    const taskInputContainer = document.getElementById('taskInputContainer')
    const projectInputContainer = document.getElementById('projectInputContainer')
    const taskMessageContainer = document.getElementById('taskMessageContainer')
    taskInputContainer.classList.remove('displayNone')
    projectInputContainer.classList.remove('displayNone')
    taskMessageContainer.classList.remove('displayNone')
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
    const filtersContainer = document.getElementById('filtered-tasks')
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

    showAddTaskButton.addEventListener('click', () => {
        const currentDate = new Date()
        let localDate = currentDate.toLocaleDateString().split("/")[ 1 ]
        if (localDate.split('').length === 1) {
            localDate = "0" + localDate
        }
        let [ currentHour, currentMinute ] = currentDate.toLocaleTimeString().split(":")
        if (currentHour.split('').length === 1) {
            currentHour = "0" + currentHour
        }
        let currentHourMinute = currentHour + ":" + currentMinute
        taskInputDueDateTime.value = `${currentDate.toISOString().slice(0, 7)}-${localDate}T${currentHourMinute}`
        taskInputContainer.classList.add('visible')

        const taskInputProject = document.getElementById('taskInputProject')
        taskInputProject.innerHTML = ''
        Todo.Projects.forEach(project => {
            const projectName = document.createElement('option')
            projectName.value = project.ID
            projectName.textContent = project.name
            taskInputProject.appendChild(projectName)
        })
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
        if (filtersContainer.dataset.filter === '') {
            ProjectUI.load()
        } else {
            FilterUI.load.selected()
        }
        ProjectUI.refreshTaskCounter()
        TaskUI.init.listeners.all()
    })
    const taskInput = document.getElementById('taskInput')
    taskInput.classList.add('taskInputTransiton')
    const taskInputOverlay = document.getElementById('taskInputOverlay')
    taskInputOverlay.classList.add('taskInputOverlayTransiton')
}
function init() {
    ProjectUI.init()
    initSidebarToggle()
    initTaskInputPopup()
    TaskUI.init.listeners.all()
    FilterUI.init.listeners()
}

const todoUI = {
    init: {
        all: init,
        sidebar: initSidebarToggle,
        taskInput: initTaskInputPopup,
        popup:initPopups
    }
}
export default todoUI