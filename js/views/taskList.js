import Utility from '../utility/utility.js';
class TaskList {
    constructor(name, taskList, parentContext){
        this.name = name
        this.oldName = name
        this.parentContext = parentContext
        this.isEditActive = false
        this.taskList = taskList
        this.html = null

        this.init()
    }

    init(){
        this.render()
        this.addEvents()
    }

    render(){
        var template = `
        <div class="list">
            <div class="header">
                <span class="list-name">${this.name}</span>
                <input type="text" class="edit-list-input hide">
                <button class='edit-list'>Edit</button>
            </div>
            <div class="task-container">
            </div>
        </div>
        `
        this.html = Utility.getHTML(template)
        this.generateTaskView()
    }

    addEvents(){
        this.handleEdit()
        this.handleDrag()
    }

    handleEdit(){
        var editButton = this.html.querySelector('.edit-list')
        if(editButton){
            Utility.addEventListener(editButton, 'click', event=>{
                this.isEditActive = !this.isEditActive
                editButton.innerText = this.isEditActive?'Done':'Edit'
                var nameElement =this.html.querySelector('.list-name')
                var editInput = this.html.querySelector('.edit-list-input')
                nameElement.classList.toggle('hide', this.isEditActive)
                editInput.classList.toggle('hide', !this.isEditActive)
                if(!this.isEditActive){
                    this.oldName = this.name
                    this.name = editInput.value.trim()
                    nameElement.innerText = this.name
                    this.parentContext.handleEditListName(this.oldName, this.name)

                } else{
                    editInput.value = this.name
                }

            });
        }
    }

    handleDrag(){
        var taskContainer = this.html.querySelector('.task-container')
        Utility.addEventListener(taskContainer, 'dragenter', this.dragEnter)
        Utility.addEventListener(taskContainer, 'dragover', this.dragOver)
        Utility.addEventListener(taskContainer, 'dragleave', this.dragLeave)
        Utility.addEventListener(taskContainer, 'drop', this.drop)
    }

    dragEnter = (e) => {
        console.log("dragEnter", this.name)
        e.preventDefault();
    }
    
    dragOver = (e) => {
        // console.log("dragOver", this.name)
        e.preventDefault();
    }
    
    dragLeave = (e) => {
        console.log("dragLeave", this.name)
    }
    
    drop = (e) => {
        console.log("drop", this.name)
        this.parentContext.onDrop(this)
    }

    addTask(task){
        this.taskList.push(task)
        this.generateTaskView()
    }

    generateTaskView(){
        var taskContainer = this.html.querySelector('.task-container')
        taskContainer.innerHTML = ""
        this.taskList.forEach(task => {
            taskContainer.appendChild(task.html)
        });
    }
}

export default TaskList