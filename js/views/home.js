import Utility from '../utility/utility.js';
import TaskList from './taskList.js';
import Task from './task.js';

class Home{
    constructor(){
        this.taskListName = []
        this.taskList = []
        this.draggedTask = null
        this.init();
    }

    init(){
        this.loadData()
        this.render();
        this.addEvents();
    }

    loadData(){
        var taskList = Utility.getFromLocalStorage('taskList')
        taskList.forEach(item => {
            let taskListObj = {}
            taskListObj['name'] = item['name']
            this.taskListName.push(item['name']) 
            taskListObj['tasks'] = item['taskList'].map(task => new Task(task.name, this));
            this.taskList.push(new TaskList(taskListObj.name, taskListObj.tasks, this))
        });
    }

    addEvents(){
        this.handleAddList()
        this.handleAddTask()
    }

    render(){
        var template = `
        <div>
            <div class='title'>Add Task List</div>
            <div>
                <input class="list-name-input" type="text">
                <button class="add-list">Add list</button>
            </div>
            <div class="add-task-header hide">
                <div class='title'>Add task</div>
                <div class="list-dropdown">
                    <span class='sub-title'>Name</span><input class="task-name-input" type="text">
                    <span class='sub-title ml-5'>Choose List</span>
                    <select class="list-select">
                        ${this.templateHelper()}
                    </select>
                    <button class="add-task">Add Task</button>
                </div>
            </div>
            
            <div class="task-list"></div>
        </div>
        `
        this.html = Utility.getHTML(template)
        var container = document.querySelector('#maincontainer')
        container.appendChild(this.html)
        this.showAddTask()
        this.generateTaskListView()
    }

    templateHelper(){
        return this.taskListName.map(item => `<option value="${item}">${item}</option>`).join('\n')
        
    }

    generateTaskListView(){
        var listContainer  = this.html.querySelector('.task-list')
        listContainer.innerHTML = ""
        this.taskList.forEach(list =>{
            listContainer.appendChild(list.html)
        })
    }

    handleAddList(){
        var addListButton = this.html.querySelector('.add-list')
        if(addListButton){
            Utility.addEventListener(addListButton, 'click', event=>{
                var listName = this.html.querySelector('.list-name-input').value.trim()
                this.html.querySelector('.list-name-input').value = ""
                if(listName){
                    this.makeListObject(listName)
                }
            });
        }
    }

    handleAddTask(){
        var addTaskButton = this.html.querySelector('.add-task')
        if(addTaskButton){
            Utility.addEventListener(addTaskButton, 'click', event=>{
                var taskName = this.html.querySelector('.task-name-input').value.trim()
                var selectedList = this.html.querySelector('.list-select').value.trim()
                this.html.querySelector('.task-name-input').value = ""
                if(selectedList) this.linkTaskToList(this.makeTaskObject(taskName), selectedList)
            })
        }
    }

    makeListObject(listName){
        var taskList = new TaskList(listName, [], this)
        this.taskList.push(taskList)
        this.taskListName = []
        this.taskList.forEach(list =>{
            this.taskListName.push(list.name)
        })
        this.showAddTask()
        this.updateDropdown()
        this.generateTaskListView()
        this.updateLocalStorage()

    }

    makeTaskObject(taskName){
        return new Task(taskName, this)
    }

    linkTaskToList(task, selectedList){
        var selectedListObject = this.taskList.filter(list=> list.name == selectedList)[0]
        selectedListObject.addTask(task)
        this.updateLocalStorage()

    }

    handleEditListName(oldName, newName){
        this.taskListName = this.taskListName.filter(name=> name!=oldName)
        this.taskListName.push(newName)
        this.updateDropdown()
        this.updateLocalStorage()
    }

    deleteTask(taskObj){
        var filteredListId
        var taskToDelete
        this.taskList.forEach((list, listId)=>{
            list.taskList = list.taskList.filter(task => {
                if(task == taskObj) {
                    filteredListId = listId
                    taskToDelete = task
                }
                return task!= taskObj
            })
        })

        this.taskList[filteredListId].generateTaskView()
        this.updateLocalStorage()
    }

    onDragStart(taskObj){
        this.draggedTask = taskObj
    }

    onDrop(listObj){
        var targetList = this.taskList.filter(list=> list === listObj)[0]
        this.deleteTask(this.draggedTask)
        targetList.addTask(this.draggedTask)
        this.updateLocalStorage()
    }

    updateDropdown(){
        var dropdown = this.html.querySelector('.list-dropdown')
        dropdown.children[3].innerHTML = ""
        this.taskListName.forEach(name=>{
            dropdown.children[3].add(Utility.getHTML(`<option value="${name}">${name}</option>`))
        })
    }

    showAddTask(){
        if(this.taskListName.length>0){
            this.html.querySelector('.add-task-header').classList.toggle('hide', false)
        }
    }

    updateLocalStorage(){
        var storageData = []
        this.taskList.forEach(list=>{
            let tempList = {}
            tempList.name = list.name
            tempList.taskList = list.taskList.map(task => {
                return {'name':task.name}
            })
            storageData.push(tempList)
        })
        Utility.resetLocalStorage('taskList', storageData)
    }

}

export default Home