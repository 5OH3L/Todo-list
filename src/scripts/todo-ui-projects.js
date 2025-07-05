import TaskUI from "./todo-ui-tasks"
import Todo from "./todo"

function loadProjects() {
    const projectsContainer = document.getElementById('all-projects-container')
    projectsContainer.innerHTML = ''
    Todo.Projects.forEach(project => {
        const DOMProject = document.createElement('div')
        DOMProject.classList.add('project')
        DOMProject.dataset.id = project.ID
        DOMProject.dataset.title = project.name
        DOMProject.addEventListener('click', () => { if (DOMProject.dataset.id !== document.getElementById('sidebar').dataset.filter) { document.getElementById('sort').value = 'manual' } })
        DOMProject.addEventListener('contextmenu', e =>{
            e.preventDefault()
            if(DOMProject.dataset.id === Todo.Projects[0].ID){}else{
                const projectActions = document.getElementById('project-actions')
                projectActions.classList.add('active')
                const topPosition = (e.clientY - projectActions.clientHeight)
                const leftPosition = e.clientX
                projectActions.style.top = topPosition + "px"
                projectActions.style.left = leftPosition + "px"
                projectActions.dataset.projecttitle = DOMProject.dataset.title
                projectActions.dataset.projectid = DOMProject.dataset.id
            }
        })
        projectsContainer.appendChild(DOMProject)

        const DOMProjectLabelColor = document.createElement('div')
        DOMProjectLabelColor.classList.add('project-label-color')
        DOMProjectLabelColor.style.backgroundColor = project.color
        DOMProject.appendChild(DOMProjectLabelColor)

        const DOMProjectTitle = document.createElement('div')
        DOMProjectTitle.classList.add('project-title')
        DOMProjectTitle.textContent = project.name
        DOMProject.appendChild(DOMProjectTitle)

        const DOMProjectTotalTasksCounter = document.createElement('div')
        DOMProjectTotalTasksCounter.classList.add('total-tasks-counter')
        DOMProjectTotalTasksCounter.textContent = project.tasks.length
        DOMProject.appendChild(DOMProjectTotalTasksCounter)
    })
}
function loadSelectedProjectTasks(DOMProject, force = false) {
    if (DOMProject instanceof PointerEvent) { DOMProject = DOMProject.currentTarget }
    const sidebar = document.getElementById('sidebar')
    if ((sidebar.dataset.filter === DOMProject.dataset.id) && !force) return
    const deleteAllTasksButton = document.getElementById('delete-all-tasks')
    deleteAllTasksButton.classList.remove('visible')

    const allProjects = Array.from(document.getElementsByClassName('project'))
    allProjects.forEach(project => { if (project.classList.contains('selected')) { project.classList.remove('selected') } })
    DOMProject.classList.add('selected')
    const currentTabCategory = document.getElementById('currentTabCategory')
    const currentTabLabel = document.getElementById('currentTab')
    const tasksContainer = document.getElementById('tasks-section')
    tasksContainer.innerHTML = ""
    const filters = Array.from(document.getElementsByClassName('filtered-task'))
    filters.forEach(filter => {
        if (filter.classList.contains('selected')) filter.classList.remove('selected')
    })
    sidebar.dataset.category = 'project'
    const selectedProject = Todo.Find.Project(DOMProject.dataset.id)
    const sortSelect = document.getElementById('sort')
    const sortOption = sortSelect.value
    if (sortSelect) {
        const manualOption = sortSelect.querySelector('option[value="manual"]')
        if (manualOption) manualOption.hidden = false
    }
    const disableDrag = sortOption !== "manual" ? true : false

    let tasks = []
    selectedProject.tasks.forEach(task => { tasks.push(task) })

    const sortedTasks = TaskUI.sort(tasks, sortOption)
    sortedTasks.forEach(task => {
        TaskUI.load(task, true, disableDrag)
    })

    TaskUI.init.listeners.all()
    currentTabCategory.textContent = "Project:"
    sidebar.dataset.filter = selectedProject.ID
    currentTabLabel.textContent = selectedProject.name
}
function initProjectListener() {
    const DOMProjects = Array.from(document.getElementsByClassName('project'))
    DOMProjects.forEach(DOMProject => {
        DOMProject.addEventListener('click', loadSelectedProjectTasks)
    })
}
function initProjects() {
    loadProjects()
    const addProjectButton = document.getElementById('add-project')
    const projectInputContainer = document.getElementById('projectInputContainer')
    const projectInputName = document.getElementById('projectInputName')
    const projectInputColor = document.getElementById('projectInputColor')
    const projectInputCancelButton = document.getElementById('projectInputCancel')
    const projectInputCreateButton = document.getElementById('projectInputCreate')
    addProjectButton.addEventListener('click', () => {
        projectInputContainer.classList.add('visible')
    })
    projectInputCancelButton.addEventListener('click', () => {
        projectInputContainer.classList.remove('visible')
    })
    projectInputCreateButton.addEventListener('click', () => {
        if (projectInputName.value.trim() === '') {
            alert("Project name can't be empty!")
            return
        }else{
            const inputName = projectInputName.value
            const inputColor = projectInputColor.value
            projectInputName.value = ''
            projectInputColor.value = "#ffffff"
            projectInputContainer.classList.remove('visible')
            Todo.AddProject(inputName, inputColor)
            loadProjects()
            initProjectListener()
        }
    })
    initProjectListener()
}
function updateProjectTasksCounter() {
    const projects = Array.from(document.getElementsByClassName('project'))
    projects.forEach(project => {
        const storedProject = Todo.Find.Project(project.dataset.id)
        const taskCounter = project.getElementsByClassName('total-tasks-counter')[ 0 ]
        taskCounter.textContent = 0
        storedProject.tasks.forEach(task => {
            taskCounter.textContent = Number(taskCounter.textContent) + 1
        })
    })
}


const projectUI = {
    init: initProjects,
    refreshTaskCounter: updateProjectTasksCounter,
    load: loadSelectedProjectTasks
}
export default projectUI