import iconTaskDelete from '../icons/iconCross.svg'
import iconTaskReOrder from '../icons/iconHorizontalDrag.svg'
import Todo from "./todo"

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
function initTaskCollapse() {
    const tasks = Array.from(document.getElementsByClassName('task'))
    const mainSection = document.getElementById('main')
    mainSection.addEventListener('click', e => {
        const clickedElement = e.target
        if (clickedElement.id == 'main' || clickedElement.id == 'sort-section' || clickedElement.id == 'tasks-section') {
            tasks.forEach(task => {
                if (task.classList.contains('expanded')) {
                    const taskDescription = task.getElementsByClassName('description-text')[ 0 ]
                    taskDescription.classList.add('show')
                    setTimeout(() => {
                        taskDescription.classList.remove('show')
                    }, 1000)
                    const taskNonCollapsible = Array.from(task.getElementsByClassName('non-collapsible'))
                    const taskSeparator = task.getElementsByClassName('separator')[ 0 ]
                    taskSeparator.classList.add('show')
                    setTimeout(() => {
                        taskSeparator.classList.remove('show')
                    }, 1000)

                    taskNonCollapsible.forEach(element => {
                        if (
                            element.classList.contains('note') ||
                            element.classList.contains('priority') ||
                            element.classList.contains('separator') ||
                            element.classList.contains('due-time')
                        ) return
                        if (element.classList.contains('delete')) {
                            element.parentElement.classList.add('centerToSpaceBetween')
                            setTimeout(() => {
                                element.parentElement.classList.remove('centerToSpaceBetween')
                            }, 1000);
                        }
                        element.classList.add('hide')
                        setTimeout(() => {
                            element.classList.remove('hide')
                        }, 1000);
                    })
                    task.classList.remove('expanded')
                }
            })
        }
    })
}
function taskCheckListener(pointerEvent) {
    const task = pointerEvent.target.closest('.task')
    const taskCheckbox = pointerEvent.target
    if (task.classList.contains('checked')) {
        Todo.Find.Task(task.dataset.id).isChecked = false
        task.classList.remove('checked')
        taskCheckbox.style.backgroundColor = ''
    } else {
        Todo.Find.Task(task.dataset.id).isChecked = true
        task.classList.add('checked')
        taskCheckbox.style.backgroundColor = taskCheckbox.style.borderColor
    }
    Todo.Save()
}
function taskExpandListener(pointerEvent) {
    if (pointerEvent.target.classList.contains('priority-indicator')) return
    const task = pointerEvent.target.closest('.task')
    task.closest('.task').classList.add("expanded")
    const taskDescriptionText = task.getElementsByClassName('description-text')[ 0 ]
    const taskNoteText = task.getElementsByClassName('note-text')[ 0 ]
    taskDescriptionText.readOnly = false
    taskNoteText.readOnly = false
}
function taskDeleteListener(pointerEvent){
    const task = pointerEvent.target.closest('.task')
    Todo.TrashTask(task.dataset.id)
    loadAllTasks()
}
function initTaskEventListeners() {
    const tasks = Array.from(document.getElementsByClassName('task'))
    tasks.forEach(task => {
        task.addEventListener('click', taskExpandListener)
        // Check Task
        const taskCheckbox = task.getElementsByClassName('priority-indicator')[ 0 ]
        taskCheckbox.addEventListener('click', taskCheckListener)
        // Delete Task
        const taskDeleteButton = task.getElementsByClassName('delete')[0]
        taskDeleteButton.addEventListener('click', taskDeleteListener)
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
        loadAllTasks()
        initTaskEventListeners()
    })
    const taskInput = document.getElementById('taskInput')
    taskInput.classList.add('taskInputTransiton')
    const taskInputOverlay = document.getElementById('taskInputOverlay')
    taskInputOverlay.classList.add('taskInputOverlayTransiton')
}
function init() {
    initProjects()
    initTaskCollapse()
    initTaskEventListeners()
    initSidebarToggle()
    initTaskInputPopup()
}

function loadAllTasks() {
    const taskSection = document.getElementById('tasks-section')
    taskSection.innerHTML = ""

    Todo.Projects.forEach(project => {
        project.tasks.forEach(task => {
            const taskContainer = document.createElement('div')
            taskContainer.dataset.id = task.ID
            if (task.isChecked) { taskContainer.classList.add('checked') }
            taskContainer.classList.add('task')

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
        })
    })
}

const todoUI = {
    init: {
        all: init,
        projects: initProjects,
        taskCollapse: initTaskCollapse,
        taskEventListener: initTaskEventListeners,
        sidebar: initSidebarToggle,
        taskInput: initTaskInputPopup,
    },
    load: {
        allTasks: loadAllTasks
    }
}
export default todoUI