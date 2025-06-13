import FilterUI from './todo-ui-task-filters'
import Todo from "./todo"

const taskMessageContainer = document.getElementById('taskMessageContainer')
const taskMessage = document.getElementById('taskMessage')
const taskMessageCancelButton = document.getElementById('taskMessageCancel')
const taskMessageConfirmButton = document.getElementById('taskMessageConfirm')

function taskMessageCancelListener() {
    taskMessageContainer.classList.remove('visible')
}
function initTaskMessageCancelListener() {
    taskMessageCancelButton.addEventListener('click', taskMessageCancelListener)
}
function taskMessageConfirmListener() {
    taskMessageContainer.classList.remove('visible')
    Todo.Delete.Task(taskMessageContainer.dataset.taskid)
    FilterUI.load.selected()
}
function initTaskMessageConfirmListener() {
    taskMessageConfirmButton.addEventListener('click', taskMessageConfirmListener)
}
function initAll() {
    initTaskMessageCancelListener()
    initTaskMessageConfirmListener()
}

function showConfirmationMessage(task) {
    taskMessageContainer.dataset.taskid = task.dataset.id
    const taskTitleText = task.getElementsByClassName('title-text')[ 0 ].textContent
    taskMessage.textContent = `Task: "${taskTitleText}" will be deleted permanently.`
    taskMessageContainer.classList.add('visible')
}
const message = {
    confirm: showConfirmationMessage,
    init: {
        all: initAll,
        buttonCancel: initTaskMessageCancelListener,
        buttonConfirm: initTaskMessageConfirmListener
    }
}
export default message