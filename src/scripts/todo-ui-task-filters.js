import TaskUI from './todo-ui-tasks'
import Todo from "./todo"


function taskFilterListeners(filter) {
    const sidebar = document.getElementById('sidebar')
    filter = filter.currentTarget
    if (sidebar.dataset.filter === filter.dataset.filter) return

    const sortSelect = document.getElementById('sort')
    if (sortSelect) {
        const currentSort = sortSelect.value
        const manualOption = sortSelect.querySelector('option[value="manual"]')
        if (manualOption) manualOption.hidden = true

        if (currentSort === "manual") {
            sortSelect.value = "due"
        }
    }
    sidebar.dataset.category = "filter"
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
    filter.classList.add('selected')
    if (filter.dataset.filter === "all") {
        sidebar.dataset.filter = "all"
        loadAllTasks()

    } else if (filter.dataset.filter === "completed") {
        sidebar.dataset.filter = "completed"
        loadCompletedTasks()

    } else if (filter.dataset.filter === "today") {
        sidebar.dataset.filter = "today"
        loadTodayTasks()

    } else if (filter.dataset.filter === "upcoming") {
        sidebar.dataset.filter = "upcoming"
        loadUpcomingTasks()

    } else if (filter.dataset.filter === "missed") {
        sidebar.dataset.filter = "missed"
        loadMissedTasks()

    } else if (filter.dataset.filter === "trash") {
        sidebar.dataset.filter = "trash"
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

    const sortSelect = document.getElementById('sort')
    const sortOption = sortSelect.value

    let tasks = []
    Todo.Projects.forEach(project => {
        tasks.push(...project.tasks)
    })

    const sortedTasks = TaskUI.sort(tasks, sortOption)
    sortedTasks.forEach(task => {
        TaskUI.load(task)
    })
}
function loadCompletedTasks() {
    const taskSection = document.getElementById('tasks-section')
    taskSection.innerHTML = ""

    const sortSelect = document.getElementById('sort')
    const sortOption = sortSelect.value

    let tasks = []
    Todo.Projects.forEach(project => {
        project.tasks.forEach(task => {
            if (task.isChecked === true) { tasks.push(task) }
        })
    })

    const sortedTasks = TaskUI.sort(tasks, sortOption)
    sortedTasks.forEach(task => {
        TaskUI.load(task, true)
    })
}
function loadTodayTasks() {
    const taskSection = document.getElementById('tasks-section')
    taskSection.innerHTML = ""

    const sortSelect = document.getElementById('sort')
    const sortOption = sortSelect.value

    let tasks = []
    Todo.Projects.forEach(project => {
        project.tasks.forEach(task => {
            if (task.dueDateTime.toLocaleDateString() === new Date().toLocaleDateString()) { tasks.push(task) }
        })
    })

    const sortedTasks = TaskUI.sort(tasks, sortOption)
    sortedTasks.forEach(task => {
        TaskUI.load(task)
    })
}
function loadUpcomingTasks() {
    const taskSection = document.getElementById('tasks-section')
    taskSection.innerHTML = ""

    const sortSelect = document.getElementById('sort')
    const sortOption = sortSelect.value

    let tasks = []
    Todo.Projects.forEach(project => {
        project.tasks.forEach(task => {
            if (task.dueDateTime > new Date()) { tasks.push(task) }
        })
    })

    const sortedTasks = TaskUI.sort(tasks, sortOption)
    sortedTasks.forEach(task => {
        TaskUI.load(task)
    })
}
function loadMissedTasks() {
    const taskSection = document.getElementById('tasks-section')
    taskSection.innerHTML = ""

    const sortSelect = document.getElementById('sort')
    const sortOption = sortSelect.value

    let tasks = []
    Todo.Projects.forEach(project => {
        project.tasks.forEach(task => {
            if (task.dueDateTime < new Date()) { tasks.push(task) }
        })
    })

    const sortedTasks = TaskUI.sort(tasks, sortOption)
    sortedTasks.forEach(task => {
        TaskUI.load(task)
    })
}
function loadTrashedTasks() {
    const taskSection = document.getElementById('tasks-section')
    taskSection.innerHTML = ""

    const sortSelect = document.getElementById('sort')
    const sortOption = sortSelect.value

    let tasks = []
    Todo.Trash.forEach(task => {
        if (task.isTrashed) { tasks.push(task) }
    })

    const sortedTasks = TaskUI.sort(tasks, sortOption)
    sortedTasks.forEach(task => {
        TaskUI.load(task, true)
    })
}
function loadSelectedFilterTasks() {
    const sidebar = document.getElementById('sidebar')
    if (sidebar.dataset.filter === "all") { loadAllTasks() }
    else if (sidebar.dataset.filter === "completed") { loadCompletedTasks() }
    else if (sidebar.dataset.filter === "today") { loadTodayTasks() }
    else if (sidebar.dataset.filter === "upcoming") { loadUpcomingTasks() }
    else if (sidebar.dataset.filter === "missed") { loadMissedTasks() }
    else if (sidebar.dataset.filter === "trash") { loadTrashedTasks() }
    TaskUI.init.listeners.all()
}

const todoTaskFilter = {
    load: {
        selected: loadSelectedFilterTasks,
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