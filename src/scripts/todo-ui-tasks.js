import iconTaskDelete from '../icons/iconCross.svg'
import iconTaskReOrder from '../icons/iconHorizontalDrag.svg'
import FilterUI from './todo-ui-task-filters'
import ProjectUI from './todo-ui-projects'
import MessageUI from './todo-ui-message'
import Todo from './todo'

function loadTask(task, includeCompleted = false, disableDrag = false) {
    const taskSection = document.getElementById('tasks-section')
    const taskContainer = document.createElement('div')
    if (task.isChecked && !includeCompleted) return
    taskContainer.dataset.id = task.ID
    if (task.isChecked) { taskContainer.classList.add('checked') }
    taskContainer.classList.add('task')
    if (task.isTrashed) { taskContainer.classList.add('trashed') }

    taskContainer.addEventListener('dragstart', () => {
        taskContainer.classList.add('dragging')
        taskContainer.style.animation = 'none'
    })
    taskContainer.addEventListener('dragend', () => {
        taskContainer.classList.remove('dragging')
        taskContainer.removeAttribute('style')
    })

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
    taskDescriptionText.readOnly = true
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
        const priority = Number(taskPriorityInput.value)
        task.priority = priority
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

    if (disableDrag) { } else {
        const taskReOrderButton = document.createElement('button')
        taskReOrderButton.classList.add('re-order')
        taskActions.appendChild(taskReOrderButton)

        taskReOrderButton.addEventListener('mousedown', () => {
            taskContainer.setAttribute('draggable', true)
        })
        taskReOrderButton.addEventListener('mouseup', () => {
            taskContainer.removeAttribute('draggable')
        })
        taskReOrderButton.addEventListener('mouseleave', () => {
            taskContainer.removeAttribute('draggable')
        })

        const taskReOrderButtonIcon = document.createElement('img')
        taskReOrderButtonIcon.src = iconTaskReOrder
        taskReOrderButtonIcon.alt = "Horizontal Drag Icon"
        taskReOrderButton.appendChild(taskReOrderButtonIcon)
    }

    taskSection.appendChild(taskContainer)
}
function taskCheckListener(pointerEvent) {
    if (!pointerEvent.target.classList.contains('priority-indicator')) return
    const task = pointerEvent.currentTarget
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
function taskDeleteListener(pointerEvent) {
    const sidebar = document.getElementById('sidebar')
    const projectsContainer = document.getElementById('all-projects-container')
    const task = pointerEvent.currentTarget
    if (!(pointerEvent.target.classList.contains('delete'))) return
    if (task.classList.contains('trashed')) {
        MessageUI.confirm.delete(null, task)
    } else {
        Todo.TrashTask(task.dataset.id)
        if (sidebar.dataset.category === "filter") {
            FilterUI.load.selected()
        } else if (sidebar.dataset.category === "project") {
            console.log(projectsContainer.querySelector(`[data-id="${sidebar.dataset.filter}"]`))
            ProjectUI.load(projectsContainer.querySelector(`[data-id="${sidebar.dataset.filter}"]`), true)
        }
        ProjectUI.refreshTaskCounter()
    }
}
function taskCheckAndDeleteListener(pointerEvent) {
    taskCheckListener(pointerEvent)
    taskDeleteListener(pointerEvent)
}
function taskExpandListener(pointerEvent) {
    const clickedTask = pointerEvent.currentTarget
    const clickedElement = pointerEvent.target
    if (clickedElement.classList.contains('priority-indicator') ||
        clickedElement.classList.contains('re-order') ||
        clickedTask.classList.contains('expanded')) return
    const allTasks = Array.from(document.getElementsByClassName('task'))
    if (allTasks.some(task => task.classList.contains('expanded'))) { allTasks.forEach(task => { task.classList.remove('expanded') }) }
    clickedTask.classList.add('expanded')
    const taskDescriptionText = clickedTask.getElementsByClassName('description-text')[ 0 ]
    const taskNoteText = clickedTask.getElementsByClassName('note-text')[ 0 ]
    taskDescriptionText.readOnly = false
    taskNoteText.readOnly = false
}
function initTaskCollapse() {
    const tasks = Array.from(document.getElementsByClassName('task'))
    const mainSection = document.getElementById('main')
    mainSection.addEventListener('click', e => {
        const clickedElement = e.target
        if (clickedElement.id === 'main' || clickedElement.id === 'sort-section' || clickedElement.id === 'tasks-section') {
            tasks.forEach(task => {
                if (task.classList.contains('expanded')) {
                    const taskDescription = task.getElementsByClassName('description-text')[ 0 ]
                    taskDescription.readOnly = true
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
function initTaskEventListeners() {
    const tasks = Array.from(document.getElementsByClassName('task'))
    tasks.forEach(task => {
        task.addEventListener('click', taskExpandListener)
        // Check & Delete Task Listener
        task.addEventListener('click', taskCheckAndDeleteListener)
    })
}
function initAllListeners() {
    initTaskEventListeners()
    initTaskCollapse()
}
function sortTasks(tasks, sortOption) {
    if (sortOption === "manual") {
        return tasks
    }
    if ([ "high", "medium", "low" ].includes(sortOption)) {
        const selectedPriority = { high: 3, medium: 2, low: 1 }[ sortOption ]
        return tasks.sort((a, b) => {
            if (a.priority === b.priority) {
                return a.dueDateTime - b.dueDateTime
            }
            if (a.priority === selectedPriority) return -1
            if (b.priority === selectedPriority) return 1
            return b.priority - a.priority
        })
    } else if (sortOption === "due") {
        return tasks.sort((a, b) => a.dueDateTime - b.dueDateTime)
    }
    return tasks
}
// Drag-ang-drop
const tasksContainer = document.getElementById('tasks-section')
tasksContainer.addEventListener('dragover', e => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    const afterElement = getDragAfterElement(e.clientY)
    const dragging = document.getElementsByClassName('task dragging')[ 0 ]
    const sidebar = document.getElementById('sidebar')
    const sort = document.getElementById('sort')
    const allTasks = [ ...tasksContainer.getElementsByClassName('task') ]
    if (((afterElement == null && allTasks.indexOf(dragging) !== allTasks.length - 1) || (afterElement !== dragging.nextElementSibling && afterElement != null)) && allTasks.length > 1) {
        if (afterElement == null) { tasksContainer.appendChild(dragging) } else { tasksContainer.insertBefore(dragging, afterElement) }
        if (sidebar.dataset.category === "project" && sort.value === "manual") {
            const selectedProject = Todo.Find.Project(sidebar.dataset.filter)
            const updatedAllTasks = [ ...tasksContainer.getElementsByClassName('task') ]
            selectedProject.tasks = updatedAllTasks.map(taskElement => {
                return Todo.Find.Task(taskElement.dataset.id)
            })
            Todo.Save()
        }
        if (sidebar.dataset.category === "filter") { sort.value = "manual" }
        if (sidebar.dataset.category === "project" && sort.value === "manual") { }
    }
})

function getDragAfterElement(y) {
    const draggableElements = [ ...tasksContainer.querySelectorAll('.task:not(.dragging)') ]
    return draggableElements.reduce((closest, element) => {
        const box = element.getBoundingClientRect()
        const offset = y - box.top - (box.height / 2)
        if (offset < 0 && offset > closest.offset) {
            return { offset, element }
        } else {
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}


const taskUI = {
    init: {
        collapse: initTaskCollapse,
        listeners: {
            all: initAllListeners,
            action: initTaskEventListeners,
            collapse: initTaskCollapse
        }
    },
    load: loadTask,
    sort: sortTasks
}
export default taskUI