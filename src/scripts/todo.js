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
            dueDateTime: task.dueDateTime.toISOString()
        }))
    }))
    localStorage.setItem("todoProjects", JSON.stringify(data))
}
function loadFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem("todoProjects"))
    if (!data) return

    Projects.length = 0

    data.forEach(projectData => {
        const project = new Project(projectData.name)
        project.ID = projectData.ID

        project.tasks = projectData.tasks.map(taskData => {
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
        this.creationDateTime = new Date().toISOString()
        this.dueDateTime = dueDateTime
        this.projectID = projectID
        this.ID = crypto.randomUUID()
        this.isChecked = false
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
        const project = Projects.find(project => project.ID === task.projectID)
        if (project) {
            const taskIndex = project.tasks.indexOf(task)
            project.tasks.splice(taskIndex, 1)
        }
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
    const taskProject = findProject(task.projectID)
    const removedTask = taskProject.tasks.splice(taskProject.tasks.indexOf(taskId), 1)[ 0 ]
    Trash.splice(0, 0, removedTask)
}
function restoreTaskFromTrash(taskId){
    const task = Trash.find(task => task.ID === taskId)
    if(!task) return
    const taskProject = findProject(task.projectID)
    if(!(taskProject === null)){
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