function init() {
    const tasks = Array.from(document.getElementsByClassName('task'))
    const mainSection = document.getElementById('main')
    mainSection.addEventListener('click', e => {
        const clickedElement = e.target
        if (clickedElement.id == 'main' || clickedElement.id == 'sort-section' || clickedElement.id == 'tasks-section') {
            tasks.forEach(task => {
                if (task.classList.contains('expanded')) {
                    const nonCollapsible = Array.from(document.getElementsByClassName('non-collapsible'))
                    const separators = Array.from(document.getElementsByClassName('separator'))
                    separators.forEach(separator => {
                        separator.classList.add('show')
                        setTimeout(() => {
                            separator.classList.remove('show')
                        }, 1000);
                    })
                    nonCollapsible.forEach(element => {
                        if (
                            element.classList.contains('note') ||
                            element.classList.contains('priority') ||
                            element.classList.contains('separator') ||
                            element.classList.contains('due-time')
                        ) return
                        console.log(element)
                        if (element.classList.contains('delete')) {
                            element.parentElement.classList.add('centerToSpaceBetween')
                            setTimeout(() => {
                                element.parentElement.classList.remove('centerToSpaceBetween')
                            }, 1000);
                        }
                        element.classList.add('hide')
                        setTimeout(() => {
                            element.classList.remove('hide')
                        }, 1000);
                    })
                    task.classList.remove('expanded')
                }
            })
        }
    })
    tasks.forEach(task => {
        task.addEventListener('click', e => {
            task.classList.add("expanded")
        })
    })
}

const todoUI = {
    init
}
export default todoUI