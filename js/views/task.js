import Utility from '../utility/utility.js';
class Task {
    constructor(name, parentContext){
        this.name = name
        this.isEditActive = false
        this.html = null
        this.parentContext = parentContext
        this.init()
    }

    init(){
        this.render()
        this.addEvents()
    }

    render(){
        var template = `
        <div draggable="true" class="task">
            <span class="task-name">${this.name}</span>
            <input type="text" class="edit-task-input hide">
            <div>
                <button class='edit-task'>Edit</button>
                <button class='delete-task'>Delete</button>
            </div>
        </div>
        `
        this.html = Utility.getHTML(template)
    }

    addEvents(){
        this.handleEdit()
        this.handleDelete()
        this.handleDrag()
    }

    handleEdit(){
        var editButton = this.html.querySelector('.edit-task')
        if(editButton){
            Utility.addEventListener(editButton, 'click', event=>{
                this.isEditActive = !this.isEditActive
                editButton.innerText = this.isEditActive?'Done':'Edit'
                var nameElement = this.html.querySelector('.task-name')
                var inputElement = this.html.querySelector('.edit-task-input')
                nameElement.classList.toggle('hide', this.isEditActive)
                inputElement.classList.toggle('hide', !this.isEditActive)

                if(this.isEditActive){
                    inputElement.value = this.name
                } else {
                    this.name = inputElement.value.trim()
                    nameElement.innerText = this.name
                    this.parentContext.updateLocalStorage()
                }
            });
        }
    }

    handleDelete(){
        var deleteButton = this.html.querySelector('.delete-task')
        if(deleteButton){
            Utility.addEventListener(deleteButton, 'click', event=>{
                this.parentContext.deleteTask(this)
            });
        }
    }

    handleDrag(){
        if(this.html){
            Utility.addEventListener(this.html, 'dragstart', event=>{
                this.parentContext.onDragStart(this)
            });
        }
    }
}

export default Task