import Todo from './todo.js'

const Modify = (function () {
    function updateProjectName(newName, projectID) {
        const project = Todo.Find.Project(projectID)
        if (project) project.newName = newName
    }
    function updateTaskTitle(newTitle, taskID) {
        const task = Todo.Find.Task(taskID)
        if (task) task.title = newTitle
    }
    function updateTaskDescription(newDescription, taskID) {
        const task = Todo.Find.Task(taskID)
        if (task) task.description = newDescription
    }
    function updateTaskNote(newNote, taskID) {
        const task = Todo.Find.Task(taskID)
        if (task) task.note = newNote
    }
    function updateTaskDueDate(newDueDate, taskID) {
        const task = Todo.Find.Task(taskID)
        if (task) {
            const [year, month, day] = newDueDate.split('-')
            task.dueDateTime.setFullYear(year)
            task.dueDateTime.setMonth(month - 1)
            task.dueDateTime.setDate(day)
            Todo.Save()
        }
    }
    function updateTaskDueTime(newDueTime, taskID) {
        const task = Todo.Find.Task(taskID)
        if (task) {
            const [hour, minute] = newDueTime.split(':')
            task.dueDateTime.setHours(hour)
            task.dueDateTime.setMinutes(minute)
            task.dueDateTime.setSeconds(0)
            Todo.Save()
        }
    }
    function updateTaskPriority(newPriority, taskID) {
        const task = Todo.Find.Task(taskID)
        if (task) task.priority = newPriority
    }
    function updateTaskIsChecked(isChecked, taskID) {
        const task = Todo.Find.Task(taskID)
        if (task) task.isChecked = isChecked
    }
    return {
        Project: {
            Name: updateProjectName
        },
        Task: {
            Title: updateTaskTitle,
            Description: updateTaskDescription,
            Note: updateTaskNote,
            DueDate: updateTaskDueDate,
            DueTime: updateTaskDueTime,
            Priority: updateTaskPriority,
            Checked: updateTaskIsChecked
        }
    }
})()

export default Modify