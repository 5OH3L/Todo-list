import "../styles/style.css"
import Todo from './todo.js'
import Modify from './todo-modify.js'
import MessageUI from './todo-ui-message.js'
import TodoUI from './todo-ui.js'
import FilterUI from './todo-ui-task-filters.js'
import "../fonts/montserrat/Montserrat-Bold.ttf"
Todo.Load()
document.addEventListener("DOMContentLoaded", () => {
    FilterUI.load.all()
    TodoUI.init.all()
    MessageUI.init.all()
})
window.onload = () => {
    TodoUI.init.popup()
}