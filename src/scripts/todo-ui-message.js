import Todo from "./todo"
import FilterUI from './todo-ui-task-filters'
import ProjectUI from './todo-ui-projects'

const sidebar = document.getElementById('sidebar')
const taskMessageContainer = document.getElementById('taskMessageContainer')
const taskMessage = document.getElementById('taskMessage')
const taskMessageCancelButton = document.getElementById('taskMessageCancel')
const taskMessageConfirmButton = document.getElementById('taskMessageConfirm')

function messageCancelListener() {
    taskMessageContainer.classList.remove('visible')
    taskMessageContainer.removeAttribute('data-category')
    taskMessageContainer.removeAttribute('data-id')
}
function initMessageCancelListener() {
    taskMessageCancelButton.addEventListener('click', messageCancelListener)
}
function messageConfirmListener() {
    taskMessageContainer.classList.remove('visible')
    if (taskMessageContainer.getAttribute('data-category') === 'task' && taskMessageContainer.getAttribute('data-id') === "all") {
        Todo.Delete.Trashed()
        FilterUI.load.selected()
    } else if (taskMessageContainer.getAttribute('data-category') === 'project') {
        const projetcID = taskMessageContainer.getAttribute('data-id')
        if (sidebar.dataset.category === "project" && sidebar.dataset.filter === projetcID) {
            sidebar.dataset.category === "filter"
            sidebar.dataset.filter = 'all'
            sidebar.querySelector('[data-filter="all"]').classList.add('selected')
            document.getElementById('currentTabCategory').textContent = "Tasks:"
            document.getElementById('currentTab').textContent = "All"
            document.getElementById('sort').value = "high"
            FilterUI.load.selected()
        }
        Todo.Delete.Project(projetcID)
        ProjectUI.init.projects()
        taskMessageContainer.removeAttribute('data-category')
        taskMessageContainer.removeAttribute('data-id')
    } else {
        Todo.Delete.Task(taskMessageContainer.dataset.taskid)
        FilterUI.load.selected()
        taskMessageContainer.removeAttribute('data-taskid')
    }
}
function initmessageConfirmListener() {
    taskMessageConfirmButton.addEventListener('click', messageConfirmListener)
}
function initAll() {
    initMessageCancelListener()
    initmessageConfirmListener()
}
function showConfirmationMessage(message, task = null, project = null) {
    if (task) {
        const taskTitleText = task.getElementsByClassName('title-text')[ 0 ].textContent
        taskMessage.textContent = `Task: "${taskTitleText}" will be deleted permanently.`
        taskMessageContainer.setAttribute('data-taskid', task.dataset.id)
    } else {
        if (project) {
            taskMessageContainer.setAttribute('data-category', "project")
            taskMessageContainer.setAttribute('data-id', project.ID)
        }
        taskMessage.textContent = `${message}`
    }
    taskMessageContainer.classList.add('visible')
}
function confirmDeleteAll() {
    taskMessageContainer.setAttribute('data-category', "task")
    taskMessageContainer.setAttribute('data-id', "all")
    taskMessage.textContent = `All trashed tasks will be deleted permanently.`
    taskMessageContainer.classList.add('visible')
}
const message = {
    confirm: {
        delete: showConfirmationMessage,
        allTrashedTask: confirmDeleteAll,
    },
    init: {
        all: initAll,
        buttonCancel: initMessageCancelListener,
        buttonConfirm: initmessageConfirmListener
    }
}
export default message