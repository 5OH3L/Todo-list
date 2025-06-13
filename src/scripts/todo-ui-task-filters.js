import iconTaskDelete from '../icons/iconCross.svg'
import iconTaskReOrder from '../icons/iconHorizontalDrag.svg'
import TaskUI from './todo-ui-tasks'
import Todo from "./todo"


function taskFilterListeners(filter) {
    const filtersContainer = document.getElementById('filtered-tasks')
    const filters = Array.from(document.getElementsByClassName('filtered-task'))
    const currentTabLabel = document.getElementById('currentTab')
    filters.forEach(filter => {
        filter.classList.remove('selected')
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
    currentTabLabel.textContent = filter.dataset.filter
}

function initTaskFilterListeners() {
    const filters = Array.from(document.getElementsByClassName('filtered-task'))
    filters.forEach(filter => {
        filter.addEventListener('click', taskFilterListeners)
    })
}

function loadTask(task, includeCompleted = false) {
    const taskSection = document.getElementById('tasks-section')
    const taskContainer = document.createElement('div')
    if(task.isChecked && !includeCompleted) return
    taskContainer.dataset.id = task.ID
    if (task.isChecked) { taskContainer.classList.add('checked') }
    taskContainer.classList.add('task')
    if(task.isTrashed) {taskContainer.classList.add('trashed')}

    const taskDetails = document.createElement('div')
    taskDetails.classList.add('details')
    taskContainer.appendChild(taskDetails)

    const taskTitle = document.createElement('div')
    taskTitle.classList.add('title')
    taskDetails.appendChild(taskTitle)

    const taskPriorityIndicator = document.createElement('div')
    taskPriorityIndicator.classList.add('priority-indicator')
    taskPriorityIndicator.style.borderColor = task.priority === 3 ? 'red' : task.priority === 2 ? 'orange' : task.priority === 1 ? 'greenyellow' : 'black'
    if (taskContainer.classList.contains('checked')) { taskPriorityIndicator.style.backgroundColor = taskPriorityIndicator.style.borderColor }
    taskTitle.appendChild(taskPriorityIndicator)

    const taskTitleText = document.createElement('div')
    taskTitleText.classList.add('title-text')
    taskTitleText.textContent = task.title
    taskTitle.appendChild(taskTitleText)

    const taskSeparator = document.createElement('div')
    taskSeparator.classList.add('separator')
    taskTitle.appendChild(taskSeparator)

    const taskDescription = document.createElement('div')
    taskDescription.classList.add('description')
    taskDetails.appendChild(taskDescription)

    const taskDescriptionText = document.createElement('textarea')
    taskDescriptionText.name = "description-text"
    taskDescriptionText.classList.add('description-text')
    taskDescriptionText.value = task.description
    taskDescriptionText.spellcheck = false
    taskDescriptionText.addEventListener('input', e => {
        task.description = e.target.value
        Todo.Save()
    })
    taskDescription.appendChild(taskDescriptionText)

    const taskNote = document.createElement('div')
    taskNote.classList.add('note', 'non-collapsible')
    taskDetails.appendChild(taskNote)

    const taskNoteLabel = document.createElement('div')
    taskNoteLabel.classList.add('note-label')
    taskNoteLabel.textContent = "Note:"
    taskNote.appendChild(taskNoteLabel)

    const taskNoteText = document.createElement('textarea')
    taskNoteText.name = "note-text"
    taskNoteText.classList.add('note-text')
    taskNoteText.value = task.note
    taskNoteText.spellcheck = false
    taskNoteText.addEventListener('input', e => {
        task.note = e.target.value
        Todo.Save()
    })
    taskNote.appendChild(taskNoteText)

    const taskPriorityDueDateTime = document.createElement('div')
    taskPriorityDueDateTime.classList.add('priority-due-date-time')
    taskDetails.appendChild(taskPriorityDueDateTime)

    const taskPriority = document.createElement('div')
    taskPriority.classList.add('priority', 'non-collapsible')
    taskPriorityDueDateTime.appendChild(taskPriority)

    const taskPriorityInput = document.createElement('select')
    taskPriorityInput.classList.add("priority-input")
    taskPriorityInput.name = "priority-input"
    taskPriorityInput.addEventListener('input', e => {
        const priority = Number(e.target.value)
        taskPriorityText.textContent = priority === 3 ? "High" : priority === 2 ? "Medium" : priority === 1 ? "Low" : null
        taskPriorityIndicator.style.borderColor = priority === 3 ? "red" : priority === 2 ? "orange" : priority === 1 ? "greenyellow" : "black"
        Todo.Save()
    })
    taskPriority.appendChild(taskPriorityInput)

    const taskPriorityHigh = document.createElement('option')
    taskPriorityHigh.value = "3"
    taskPriorityHigh.textContent = "High"
    taskPriorityInput.appendChild(taskPriorityHigh)
    const taskPriorityMedium = document.createElement('option')
    taskPriorityMedium.value = "2"
    taskPriorityMedium.textContent = "Medium"
    taskPriorityInput.appendChild(taskPriorityMedium)
    const taskPriorityLow = document.createElement('option')
    taskPriorityLow.value = "1"
    taskPriorityLow.textContent = "Low"
    taskPriorityInput.appendChild(taskPriorityLow)
    if (task.priority === 3) {
        taskPriorityHigh.selected = true
    } else if (task.priority === 2) {
        taskPriorityMedium.selected = true
    } else if (task.priority === 1) {
        taskPriorityLow.selected = true
    }

    const taskPriorityLabel = document.createElement('div')
    taskPriorityLabel.classList.add('priority-label')
    taskPriorityLabel.textContent = "Priority:"
    taskPriority.appendChild(taskPriorityLabel)

    const taskPriorityText = document.createElement('div')
    taskPriorityText.classList.add('priority-text')
    taskPriorityText.textContent = task.priority === 3 ? "High" : task.priority === 2 ? "Medium" : task.priority === 1 ? "Low" : null
    taskPriority.appendChild(taskPriorityText)

    const taskDueDateTime = document.createElement('div')
    taskDueDateTime.classList.add('due-date-time')
    taskPriorityDueDateTime.appendChild(taskDueDateTime)

    const taskDueDateTimeInput = document.createElement('input')
    taskDueDateTimeInput.type = "datetime-local"
    const taskDate = task.dueDateTime.toISOString().slice(0, 10)
    const taskTime = task.dueDateTime.toTimeString().slice(0, 5)
    taskDueDateTimeInput.value = taskDate + 'T' + taskTime
    taskDueDateTimeInput.classList.add('input-date-time')
    taskDueDateTimeInput.name = "input-date-time"
    taskDueDateTimeInput.onclick = function () { this.showPicker() }
    taskDueDateTimeInput.addEventListener('input', e => {
        const dateTime = e.target.value
        const year = Number(dateTime.slice(0, 4))
        const month = Number(dateTime.slice(5, 7)) - 1
        const date = Number(dateTime.slice(8, 10))
        const hour = Number(dateTime.slice(11, 13))
        const second = Number(dateTime.slice(14, 16))
        task.dueDateTime.setFullYear(year, month, date)
        task.dueDateTime.setHours(hour, second)
        taskDueDate.textContent = task.dueDateTime.toLocaleDateString()
        taskDueTime.textContent = task.dueDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        Todo.Save()
    })
    taskDueDateTime.appendChild(taskDueDateTimeInput)

    const taskDueDateTimeLabel = document.createElement('div')
    taskDueDateTimeLabel.classList.add('due-date-time-label')
    taskDueDateTimeLabel.textContent = "Due:"
    taskDueDateTime.appendChild(taskDueDateTimeLabel)

    const taskDueDate = document.createElement('div')
    taskDueDate.classList.add('due-date')
    taskDueDate.textContent = task.dueDateTime.toLocaleDateString()
    taskDueDateTime.appendChild(taskDueDate)

    const taskDueDateSeparator = document.createElement('div')
    taskDueDateSeparator.classList.add('separator', 'non-collapsible')
    taskDueDateSeparator.textContent = "-"
    taskDueDateTime.appendChild(taskDueDateSeparator)

    const taskDueTime = document.createElement('div')
    taskDueTime.classList.add('due-time', 'non-collapsible')
    taskDueTime.textContent = task.dueDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    taskDueDateTime.appendChild(taskDueTime)

    const taskActions = document.createElement('div')
    taskActions.classList.add('actions')
    taskContainer.appendChild(taskActions)

    const taskDeleteButton = document.createElement('button')
    taskDeleteButton.classList.add('delete', 'non-collapsible')
    taskActions.appendChild(taskDeleteButton)

    const taskDeleteButtonIcon = document.createElement('img')
    taskDeleteButtonIcon.src = iconTaskDelete
    taskDeleteButtonIcon.alt = "Cross Icon"
    taskDeleteButton.appendChild(taskDeleteButtonIcon)

    const taskReOrderButton = document.createElement('button')
    taskReOrderButton.classList.add('re-order')
    taskActions.appendChild(taskReOrderButton)

    const taskReOrderButtonIcon = document.createElement('img')
    taskReOrderButtonIcon.src = iconTaskReOrder
    taskReOrderButtonIcon.alt = "Horizontal Drag Icon"
    taskReOrderButton.appendChild(taskReOrderButtonIcon)

    taskSection.appendChild(taskContainer)
}
function loadAllTasks() {
    const taskSection = document.getElementById('tasks-section')
    taskSection.innerHTML = ""
    Todo.Projects.forEach(project => {
        project.tasks.forEach(task => {
            loadTask(task)
        })
    })
}
function loadCompletedTasks() {
    const taskSection = document.getElementById('tasks-section')
    taskSection.innerHTML = ""
    Todo.Projects.forEach(project => {
        project.tasks.forEach(task => {
            if (task.isChecked === true) { loadTask(task, true) }
        })
        Todo.Trash.forEach(task => {
            if (task.isChecked === true) { loadTask(task, true) }
        })
    })
}
function loadTodayTasks() {
    const taskSection = document.getElementById('tasks-section')
    taskSection.innerHTML = ""

    Todo.Projects.forEach(project => {
        project.tasks.forEach(task => {
            if (task.dueDateTime.toLocaleDateString() === new Date().toLocaleDateString()) { loadTask(task) }
        })
    })
}
function loadUpcomingTasks() {
    const taskSection = document.getElementById('tasks-section')
    taskSection.innerHTML = ""

    Todo.Projects.forEach(project => {
        project.tasks.forEach(task => {
            if (task.dueDateTime > new Date()) { loadTask(task) }
        })
    })
}
function loadMissedTasks() {
    const taskSection = document.getElementById('tasks-section')
    taskSection.innerHTML = ""

    Todo.Projects.forEach(project => {
        project.tasks.forEach(task => {
            if (task.dueDateTime < new Date()) { loadTask(task) }
        })
    })
}
function loadTrashedTasks() {
    const taskSection = document.getElementById('tasks-section')
    taskSection.innerHTML = ""

    Todo.Trash.forEach(task => {
            if (task.isTrashed) { loadTask(task) }
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