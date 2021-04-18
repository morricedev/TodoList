const inputItem = document.getElementById('item-input')
const formSubmit = document.getElementById('todo-add')
const ul = document.getElementById('todo-list')
const lis = ul.getElementsByTagName('li')

const LocalStorage = {
    getSavedData() {
        let tasksData = localStorage.getItem('tasks')
        tasksData = JSON.parse(tasksData)

        return tasksData && tasksData.length ? tasksData : [
            {
                name: "Example",
                createAt: Date.now(),
                completed: false
            }
        ]
    },

    setNewData() {
        localStorage.setItem("tasks", JSON.stringify(tasksList))
    }
}

const tasksList = LocalStorage.getSavedData()

const Form = {
    addItem(task) {
        Form.verifyInput(task)
        tasksList.push({
            name: task,
            createAt: Date.now(),
            completed: false
        })
        App.refresh()
        inputItem.value = ""
        inputItem.focus()
    },
    verifyInput(value) {
        if (!value) {
            throw new Error(alert("Task must be specified"))
        }
    }
}

const DOM = {
    generateTasks(obj) {
        const li = document.createElement('li')
        li.className = 'todo-item'

        const checkButton = document.createElement('button')
        checkButton.className = 'button-check'
        checkButton.innerHTML = `<i class="fas fa-check ${obj.completed ? "" : "displayNone"}" data-action="checkButton"></i>`
        checkButton.setAttribute('data-action', 'checkButton')
        li.appendChild(checkButton)

        const p = document.createElement('p')
        p.className = 'task-name'
        p.textContent = obj.name
        li.appendChild(p)

        const editButton = document.createElement('i')
        editButton.className = 'fas fa-edit'
        editButton.setAttribute('data-action', 'editButton')
        li.appendChild(editButton)

        const editContainer = document.createElement('div')
        editContainer.className = 'editContainer'
        const editInput = document.createElement("input")
        editInput.className = 'editInput'
        editInput.value = obj.name
        editContainer.appendChild(editInput)

        const editButtonContainer = document.createElement("button")
        editButtonContainer.className = 'editButton'
        editButtonContainer.textContent = "Edit"
        editButtonContainer.setAttribute('data-action', 'editButtonContainer')
        editContainer.appendChild(editButtonContainer)

        const cancelButtonContainer = document.createElement("button")
        cancelButtonContainer.className = 'cancelButton'
        cancelButtonContainer.textContent = "Cancel"
        cancelButtonContainer.setAttribute('data-action', 'cancelButtonContainer')
        editContainer.appendChild(cancelButtonContainer)
        li.appendChild(editContainer)

        const deleteButton = document.createElement('i')
        deleteButton.className = 'fas fa-trash-alt'
        deleteButton.setAttribute('data-action', 'deleteButton')
        li.appendChild(deleteButton)

        return li
    },
    renderTask() {
        ul.innerHTML = ""

        tasksList.forEach(task => {
            ul.appendChild(DOM.generateTasks(task))
        })
    }
}

const ulEvents = {
    clickedUl(e) {
        const dataAction = e.target.getAttribute('data-action')
        if (!dataAction) return

        let currentLi = e.target
        while (currentLi.nodeName !== 'LI') {
            currentLi = currentLi.parentElement
        }

        const currentIndexLi = [...lis].indexOf(currentLi)

        actions = {
            editContainer: currentLi.querySelector('.editContainer'),

            checkButton: function () {
                tasksList[currentIndexLi].completed = !tasksList[currentIndexLi].completed

                if (tasksList[currentIndexLi].completed) {
                    currentLi.querySelector(".fa-check").classList.remove('displayNone')
                } else {
                    currentLi.querySelector(".fa-check").classList.add('displayNone')
                }
                App.refresh()
            },

            editButton: function () {
                ul.querySelectorAll(".editContainer").forEach(container => {
                    container.removeAttribute('style')
                })
                actions.editContainer.style.display = 'flex'
                currentLi.querySelector('.editInput').focus()
            },

            editButtonContainer: function () {
                const val = currentLi.querySelector('.editInput').value
                Form.verifyInput(val)
                tasksList[currentIndexLi].name = val
                App.refresh()
            },

            cancelButtonContainer: function () {
                actions.editContainer.removeAttribute('style')
                currentLi.querySelector('.editInput').value = tasksList[currentIndexLi].name
            },

            deleteButton: function () {
                tasksList.splice(currentIndexLi, 1)
                App.refresh()
            },
        }

        if (actions[dataAction]) {
            actions[dataAction]()
        }
    },
}

const App = {
    init() {
        try {
            formSubmit.addEventListener('submit', function (e) {
                e.preventDefault()
                Form.addItem(inputItem.value)
            })
            ul.addEventListener("click", ulEvents.clickedUl)
            DOM.renderTask()
            LocalStorage.setNewData()
            inputItem.focus()
        } catch (e) {
            console.log(e.message)
        }
    },
    refresh() {
        DOM.renderTask()
        LocalStorage.setNewData()
    }
}

App.init()