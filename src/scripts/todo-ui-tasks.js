import FilterUI from './todo-ui-task-filters'
import Message from './todo-ui-message'
import Todo from './todo'

function taskCheckListener(pointerEvent) {
    if(!pointerEvent.target.classList.contains('priority-indicator')) return
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
    const task = pointerEvent.currentTarget
    if (!task || !(pointerEvent.target.classList.contains('delete'))) return
    if(task.classList.contains('trashed')){
        Message.confirm(task)
    }else{
        Todo.TrashTask(task.dataset.id)
        FilterUI.load.selected()
    }
}
function taskCheckAndDeleteListener(pointerEvent) {
    taskCheckListener(pointerEvent)
    taskDeleteListener(pointerEvent)
}
function taskExpandListener(pointerEvent) {
    if (pointerEvent.target.classList.contains('priority-indicator')) return
    const task = pointerEvent.currentTarget
    task.classList.add("expanded")
    const taskDescriptionText = task.getElementsByClassName('description-text')[ 0 ]
    const taskNoteText = task.getElementsByClassName('note-text')[ 0 ]
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
const taskUI = {
    init: {
        collapse: initTaskCollapse,
        listeners: {
            all: initAllListeners,
            action: initTaskEventListeners,
            collapse: initTaskCollapse
        }
    }
}
export default taskUI