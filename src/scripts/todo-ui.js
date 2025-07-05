import Todo from "./todo"
import TaskUI from './todo-ui-tasks'
import ProjectUI from './todo-ui-projects'
import FilterUI from './todo-ui-task-filters'
import MessageUI from './todo-ui-message'
const projectActions = document.getElementById('project-actions')
const projectActionsEdit = document.getElementById('project-actions-edit')
const projectActionsDelete = document.getElementById('project-actions-delete')
const projectEditContainer = document.getElementById('projectEditContainer')
const projectEditName = document.getElementById('projectEditName')

function initPopups() {
    const taskInputContainer = document.getElementById('taskInputContainer')
    const projectInputContainer = document.getElementById('projectInputContainer')
    const projectEditContainer = document.getElementById('projectEditContainer')
    const projectEditName = document.getElementById('projectEditName')
    const projectEditColor = document.getElementById('projectEditColor')
    const projectEditCancel = document.getElementById('projectEditCancel')
    const projectEditConfirm = document.getElementById('projectEditConfirm')
    const taskMessageContainer = document.getElementById('taskMessageContainer')
    taskInputContainer.classList.remove('displayNone')
    projectInputContainer.classList.remove('displayNone')
    projectEditContainer.classList.remove('displayNone')
    projectEditCancel.addEventListener('click', ()=>{
        projectEditContainer.classList.remove('visible')
        projectEditName.value = ''
        projectEditColor.removeAttribute('value')
        projectActions.removeAttribute('data-projecttitle')
        projectActions.removeAttribute('data-projectid')
    })
    projectEditConfirm.addEventListener('click', ()=>{
        if(projectEditName.value.trim() === ""){
            alert("Project name can't be empty!")
            return
        }else{
            projectEditContainer.classList.remove('visible')
            const selectedProject = Todo.Find.Project(projectActions.dataset.projectid)
            selectedProject.name = projectEditName.value
            selectedProject.color = projectEditColor.value
            ProjectUI.init()
            projectEditColor.removeAttribute('value')
            projectActions.removeAttribute('data-projecttitle')
            projectActions.removeAttribute('data-projectid')
            Todo.Save()
        }
    })
    taskMessageContainer.classList.remove('displayNone')
}
function initSortListener() {
    const sidebar = document.getElementById('sidebar')
    const sortSelect = document.getElementById("sort")
    if (sortSelect) {
        sortSelect.addEventListener("change", () => {
            if (sidebar.dataset.category === "filter") {
                FilterUI.load.selected()
            } else if (sidebar.dataset.category === "project") {
                const selectedProject = document.getElementById('all-projects-container').getElementsByClassName('project selected')[ 0 ]
                ProjectUI.load(selectedProject, true)
            }
        })
    }
}
function initSidebarToggle() {
    const content = document.getElementById('content')
    const toggleSidebarButton = document.getElementById('button-toggle-sidebar')
    toggleSidebarButton.addEventListener('click', e => {
        if (content.classList.contains('sidebarExpanded')) {
            content.classList.remove('sidebarExpanded')
        } else {
            content.classList.add('sidebarExpanded')
        }
    })
}
function initTaskInputPopup() {
    const filtersContainer = document.getElementById('filtered-tasks')
    const showAddTaskButton = document.getElementById('button-add-task')
    const taskInputContainer = document.getElementById('taskInputContainer')
    const taskInputTitle = document.getElementById('taskInputTitle')
    const taskInputDescription = document.getElementById('taskInputDescription')
    const taskInputNote = document.getElementById('taskInputNote')
    const taskInputPriority = document.getElementById('taskInputPriority')
    const taskInputDueDateTime = document.getElementById('taskInputDueDateTime')
    const taskInputs = [ taskInputTitle, taskInputDescription, taskInputNote, taskInputPriority, taskInputDueDateTime ]
    const discardTaskButton = document.getElementById('taskInputDiscardButton')
    const addTaskButton = document.getElementById('taskInputAddButton')

    showAddTaskButton.addEventListener('click', () => {
        const currentDate = new Date()
        let localDate = currentDate.toLocaleDateString().split("/")[ 1 ]
        if (localDate.split('').length === 1) {
            localDate = "0" + localDate
        }
        let [ currentHour, currentMinute ] = currentDate.toLocaleTimeString().split(":")
        if (currentHour.split('').length === 1) {
            currentHour = "0" + currentHour
        }
        let currentHourMinute = currentHour + ":" + currentMinute
        taskInputDueDateTime.value = `${currentDate.toISOString().slice(0, 7)}-${localDate}T${currentHourMinute}`
        taskInputContainer.classList.add('visible')

        const taskInputProject = document.getElementById('taskInputProject')
        taskInputProject.innerHTML = ''
        Todo.Projects.forEach(project => {
            const projectName = document.createElement('option')
            projectName.value = project.ID
            projectName.textContent = project.name
            taskInputProject.appendChild(projectName)
        })
    })
    discardTaskButton.addEventListener('click', () => {
        taskInputs.forEach(input => {
            if (input.id === "taskInputPriority") { } else { input.value = '' }
            if (input.id === "taskInputDueDateTime") taskInputDueDateTime.value = ""
        })
        taskInputContainer.classList.remove('visible')
    })
    addTaskButton.addEventListener('click', () => {
        if (taskInputTitle.value.trim() === "") {
            alert("Title can't be empty!")
            return
        }
        if (taskInputDueDateTime.value.trim() === "") {
            alert("You must select due date & time!")
            return
        }
        Todo.AddTask(taskInputTitle.value.trim(), taskInputDescription.value.trim(), taskInputNote.value.trim(), Number(taskInputPriority.value), new Date(taskInputDueDateTime.value), taskInputProject.value)
        taskInputs.forEach(input => {
            if (input.id === "taskInputPriority") { } else { input.value = '' }
        })
        taskInputContainer.classList.remove('visible')
        if (filtersContainer.dataset.filter === '') {
            ProjectUI.load()
        } else {
            FilterUI.load.selected()
        }
        ProjectUI.refreshTaskCounter()
        TaskUI.init.listeners.all()
    })
    const taskInput = document.getElementById('taskInput')
    taskInput.classList.add('taskInputTransiton')
    const taskInputOverlay = document.getElementById('taskInputOverlay')
    taskInputOverlay.classList.add('taskInputOverlayTransiton')
}
function initProjetcsToggle(){
    const projectDropdownButton = document.getElementById('project-dropdown-button')
    projectDropdownButton.addEventListener('click', e=>{
        if(e.target.classList.contains('add-project') || e.target.classList.contains('add-project-icon')) return
        const caretIcon = projectDropdownButton.getElementsByClassName('projects-toggle-icon')[0]
        const allProjectsContainer = document.getElementById('all-projects-container')
        if(!caretIcon.classList.contains('collapsed')){
            caretIcon.classList.add('collapsed')
            allProjectsContainer.style.maxHeight = 0
        }else{
            caretIcon.classList.remove('collapsed')
            allProjectsContainer.style.maxHeight = "100%"
        }
    })
}
function initProjectActionsListeners() {
    projectActionsEdit.addEventListener('click', e => {
        hideProjectActions()
        projectEditContainer.classList.add('visible')
        projectEditName.value = Todo.Find.Project(projectActions.dataset.projectid).name
        projectEditName.select()
        projectEditColor.value = Todo.Find.Project(projectActions.dataset.projectid).color
    })
    projectActionsDelete.addEventListener('click', () => {
        hideProjectActions()
        const selectedProject = Todo.Find.Project(projectActions.dataset.projectid)
        MessageUI.confirm.delete(`Project "${selectedProject.name}" will be deleted permanently with all of its tasks.`, null, selectedProject)
        projectEditContainer.classList.remove('visible')
        projectActions.removeAttribute('data-projecttitle')
        projectActions.removeAttribute('data-projectid')
    })
}
function hideProjectActions() {
    projectActions.classList.remove('active')
}
function initWindowListeners() {
    window.addEventListener('click', e => {
        if (e.target.id === "project-actions-rename" || e.target.id === "project-actions-delete") { } else { hideProjectActions() }
    })
}
function showManualSortOption() {
    const manualOption = document.querySelector('#sort option[value="manual"]')
    if (manualOption) manualOption.hidden = false
}
function hideManualSortOption() {
    const manualOption = document.querySelector('#sort option[value="manual"]')
    if (manualOption) manualOption.hidden = true
}

function init() {
    ProjectUI.init()
    initSidebarToggle()
    initTaskInputPopup()
    initSortListener()
    TaskUI.init.listeners.all()
    FilterUI.init.listeners()
    initWindowListeners()
    initProjectActionsListeners()
    initProjetcsToggle()
}

const todoUI = {
    init: {
        all: init,
        sidebar: initSidebarToggle,
        taskInput: initTaskInputPopup,
        popup: initPopups
    },
    manualSort: {
        show: showManualSortOption,
        hide: hideManualSortOption
    }
}
export default todoUI