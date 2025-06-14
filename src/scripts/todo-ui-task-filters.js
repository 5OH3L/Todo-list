import TaskUI from './todo-ui-tasks'
import Todo from "./todo"


function taskFilterListeners(filter) {
    const filtersContainer = document.getElementById('filtered-tasks')
    const filters = Array.from(document.getElementsByClassName('filtered-task'))
    const projects = Array.from(document.getElementsByClassName('project'))
    const currentTabCategory = document.getElementById('currentTabCategory')
    const currentTabLabel = document.getElementById('currentTab')
    filters.forEach(filter => {
        filter.classList.remove('selected')
    })
    projects.forEach(project => {
        project.classList.remove('selected')
    })
    filter = filter.currentTarget
    filter.classList.add('selected')
    if (filter.dataset.filter === "all" && filtersContainer.dataset.filter !== "all") {
        filtersContainer.dataset.filter = "all"
        loadAllTasks()

    } else if (filter.dataset.filter === "completed" && filtersContainer.dataset.filter !== "completed") {
        filtersContainer.dataset.filter = "completed"
        loadCompletedTasks()

    } else if (filter.dataset.filter === "today" && filtersContainer.dataset.filter !== "today") {
        filtersContainer.dataset.filter = "today"
        loadTodayTasks()

    } else if (filter.dataset.filter === "upcoming" && filtersContainer.dataset.filter !== "upcoming") {
        filtersContainer.dataset.filter = "upcoming"
        loadUpcomingTasks()

    } else if (filter.dataset.filter === "missed" && filtersContainer.dataset.filter !== "missed") {
        filtersContainer.dataset.filter = "missed"
        loadMissedTasks()

    } else if (filter.dataset.filter === "trash" && filtersContainer.dataset.filter !== "trash") {
        filtersContainer.dataset.filter = "trash"
        loadTrashedTasks()

    }
    TaskUI.init.listeners.all()
    currentTabCategory.textContent = "Tasks:"
    currentTabLabel.textContent = filter.dataset.filter
}

function initTaskFilterListeners() {
    const filters = Array.from(document.getElementsByClassName('filtered-task'))
    filters.forEach(filter => {
        filter.addEventListener('click', taskFilterListeners)
    })
}


function loadAllTasks() {
    const taskSection = document.getElementById('tasks-section')
    taskSection.innerHTML = ""
    Todo.Projects.forEach(project => {
        project.tasks.forEach(task => {
            TaskUI.load(task)
        })
    })
}
function loadCompletedTasks() {
    const taskSection = document.getElementById('tasks-section')
    taskSection.innerHTML = ""
    Todo.Projects.forEach(project => {
        project.tasks.forEach(task => {
            if (task.isChecked === true) { TaskUI.load(task, true) }
        })
        Todo.Trash.forEach(task => {
            if (task.isChecked === true) { TaskUI.load(task, true) }
        })
    })
}
function loadTodayTasks() {
    const taskSection = document.getElementById('tasks-section')
    taskSection.innerHTML = ""

    Todo.Projects.forEach(project => {
        project.tasks.forEach(task => {
            if (task.dueDateTime.toLocaleDateString() === new Date().toLocaleDateString()) { TaskUI.load(task) }
        })
    })
}
function loadUpcomingTasks() {
    const taskSection = document.getElementById('tasks-section')
    taskSection.innerHTML = ""

    Todo.Projects.forEach(project => {
        project.tasks.forEach(task => {
            if (task.dueDateTime > new Date()) { TaskUI.load(task) }
        })
    })
}
function loadMissedTasks() {
    const taskSection = document.getElementById('tasks-section')
    taskSection.innerHTML = ""

    Todo.Projects.forEach(project => {
        project.tasks.forEach(task => {
            if (task.dueDateTime < new Date()) { TaskUI.load(task) }
        })
    })
}
function loadTrashedTasks() {
    const taskSection = document.getElementById('tasks-section')
    taskSection.innerHTML = ""

    Todo.Trash.forEach(task => {
            if (task.isTrashed) { TaskUI.load(task) }
        })
}
function loadSelectedFilterTasks(){
    const filtersContainer = document.getElementById('filtered-tasks')
    if(filtersContainer.dataset.filter === "all"){loadAllTasks()}
    else if (filtersContainer.dataset.filter === "completed"){loadCompletedTasks()}
    else if (filtersContainer.dataset.filter === "today"){loadTodayTasks()}
    else if (filtersContainer.dataset.filter === "upcoming"){loadUpcomingTasks()}
    else if (filtersContainer.dataset.filter === "missed"){loadMissedTasks()}
    else if (filtersContainer.dataset.filter === "trash"){loadTrashedTasks()}
    TaskUI.init.listeners.all()
}

const todoTaskFilter = {
    load: {
        selected:loadSelectedFilterTasks,
        all: loadAllTasks,
        completed: loadCompletedTasks,
        today: loadTodayTasks,
        trash: loadTrashedTasks
    },
    init: {
        listeners: initTaskFilterListeners
    }
}
export default todoTaskFilter