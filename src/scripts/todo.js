const Projects = [
    {
        name: "Default Project",
        ID: 0,
        tasks: []
    }
]

class Project {
    constructor(name) {
        this.name = name
        this.ID = crypto.randomUUID()
        this.tasks = []
    }
}
function createProject(name) {
    return new Project(name)
}
function addProject(name) {
    Projects.push(createProject(name))
}

class Task {
    constructor(title, description, note, dueDate, dueTime, priority) {
        this.title = title
        this.description = description
        this.note = note
        this.dueDate = dueDate
        this.dueTime = dueTime
        this.priority = priority
        this.isChecked = false
        this.ID = crypto.randomUUID()
    }
}
function createTask(title, description, note, dueDate, dueTime, priority) {
    return new Task(title, description, note, dueDate, dueTime, priority)
}
function addTaskToTheProject(title, description, note, dueDate, dueTime, priority, projectID = 0) {
    Projects.find(project => project.ID === projectID).tasks.push(createTask(title, description, note, dueDate, dueTime, priority))
}

function findProject(ID){
    return Projects.find(project => project.ID === ID)
}
function findTask(ID){
    return Projects.filter(project => project.tasks.some(task => task.ID === ID))[0].tasks.filter(task => task.ID === ID)[0]
}

const Todo = {
    AddProject: addProject,
    AddTask: addTaskToTheProject,
    Find: {
        Project: findProject,
        Task: findTask
    },
    Projects
}

export default Todo