const Projects = [
    {
        name: "Default Project",
        ID: crypto.randomUUID(),
        tasks: []
    }
]
const Trash = []

function saveToLocalStorage() {
    const data = Projects.map(project => ({
        ...project,
        tasks: project.tasks.map(task => ({
            ...task,
            creationDateTime: task.creationDateTime.toISOString(),
            dueDateTime: task.dueDateTime.toISOString()
        }))
    }))
    const trashData = Trash.map(task => ({
        ...task,
        creationDateTime: task.creationDateTime.toISOString(),
        dueDateTime: task.dueDateTime.toISOString()
    }))
    localStorage.setItem("todoProjects", JSON.stringify(data))
    localStorage.setItem("todoTrash", JSON.stringify(trashData))
}
function loadFromLocalStorage() {
    const projectData = JSON.parse(localStorage.getItem("todoProjects"))
    const trashData = JSON.parse(localStorage.getItem("todoTrash"))
    if (projectData) {
        Projects.length = 0
        projectData.forEach(data => {
            const project = new Project(data.name)
            project.ID = data.ID

            project.tasks = data.tasks.map(taskData => {
                const task = new Task(
                    taskData.title,
                    taskData.description,
                    taskData.note,
                    taskData.priority,
                    new Date(taskData.dueDateTime),
                    taskData.projectID
                )
                task.ID = taskData.ID
                task.creationDateTime = new Date(taskData.creationDateTime)
                task.isChecked = taskData.isChecked
                return task
            })

            Projects.push(project)
        })
    }

    if (trashData) {
        Trash.length = 0
        trashData.forEach(taskData => {
            const task = new Task(
                taskData.title,
                taskData.description,
                taskData.note,
                taskData.priority,
                new Date(taskData.dueDateTime),
                taskData.projectID
            )
            task.ID = taskData.ID
            task.creationDateTime = new Date(taskData.creationDateTime)
            task.isChecked = taskData.isChecked
            task.isTrashed = taskData.isTrashed
            Trash.push(task)
        })
    }
}


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
    saveToLocalStorage()
}

class Task {
    constructor(title, description, note, priority, dueDateTime, projectID = null) {
        this.title = title
        this.description = description
        this.note = note
        this.priority = priority
        this.creationDateTime = new Date()
        this.dueDateTime = dueDateTime
        this.projectID = projectID
        this.ID = crypto.randomUUID()
        this.isChecked = false
        this.isTrashed = false
    }
}
function createTask(title, description, note, priority, dueDateTime, projectID = null) {
    return new Task(title, description, note, priority, dueDateTime, projectID)
}
function addTaskToTheProject(title, description, note, priority, dueDateTime, projectID = Projects[ 0 ].ID) {
    const project = Projects.find(project => project.ID === projectID)
    project.tasks.push(createTask(title, description, note, priority, dueDateTime, projectID))
    saveToLocalStorage()
}

function findProject(ID) {
    const project = Projects.find(project => project.ID === ID)
    if (project) {
        return project
    } else {
        return null
    }
}
function findTask(ID) {
    for (let project of Projects) {
        const task = project.tasks.find(task => task.ID === ID)
        if (task) return task
    }
    const trashedTask = Trash.find(task => task.ID === ID)
    if (trashedTask) return trashedTask
    return null
}
function deleteProject(ID) {
    if (Projects[ 0 ].ID === ID) return
    const project = findProject(ID)
    if (project) {
        const projectIndex = Projects.indexOf(project)
        Projects.splice(1, projectIndex)
    }
    saveToLocalStorage()
}
function deleteTask(ID) {
    const task = findTask(ID)
    if (task) {
        const taskIndex = Trash.indexOf(task)
        Trash.splice(taskIndex, 1)
    }
    saveToLocalStorage()
}
function moveTask(taskId, projectID) {
    const task = findTask(taskId)
    const taskProject = findProject(task.projectID)
    const removedTask = taskProject.tasks.splice(taskProject.tasks.indexOf(taskId), 1)[ 0 ]
    const newProject = findProject(projectID)
    removedTask.projectID = newProject.ID
    newProject.tasks.splice(0, 0, removedTask)
}
function moveTaskToTrash(taskId) {
    const task = findTask(taskId)
    if(task.isTrashed) return
    const taskProject = findProject(task.projectID)
    const taskIndex = taskProject.tasks.indexOf(task)
    if (taskIndex < 0) return
    const removedTask = taskProject.tasks.splice(taskIndex, 1)[ 0 ]
    removedTask.isTrashed = true
    Trash.splice(0, 0, removedTask)
    saveToLocalStorage()
}
function restoreTaskFromTrash(taskId) {
    const task = Trash.find(task => task.ID === taskId)
    if (!task) return
    const taskProject = findProject(task.projectID)
    if (!(taskProject === null)) {
        const removedTask = Trash.splice(Trash.indexOf(task.ID), 1)[ 0 ]
        taskProject.tasks.splice(0, 0, removedTask)
    }
}

const Todo = {
    AddProject: addProject,
    AddTask: addTaskToTheProject,
    MoveTask: moveTask,
    TrashTask: moveTaskToTrash,
    RestoreTask: restoreTaskFromTrash,
    Find: {
        Project: findProject,
        Task: findTask
    },
    Delete: {
        Project: deleteProject,
        Task: deleteTask
    },
    Projects,
    Trash,
    Save: saveToLocalStorage,
    Load: loadFromLocalStorage
}

export default Todo