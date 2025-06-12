import "../styles/style.css"
import Todo from './todo.js'
import Modify from './todo-modify.js'
import TodoUI from './todo-ui.js'
import "../fonts/montserrat/Montserrat-Bold.ttf"
Todo.Load()
document.addEventListener("DOMContentLoaded", ()=>{
    TodoUI.load.allTasks()
    TodoUI.init.all()
})