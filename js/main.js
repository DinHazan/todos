'use strict';
var gIdx = 1000;
var gTodos;
var gTodosFilter = 'All';

var TODOS_KEY = 'todosApp'

function init() {
    console.log('Todo App');
    gTodos = createTodos();
    renderCounts();
    renderTodos();
}

function todoClicked(elTodo, todoIdx) {
    gTodos[todoIdx].isDone = !gTodos[todoIdx].isDone;
    elTodo.classList.toggle('done');
    renderCounts();
    saveToStorage(TODOS_KEY, gTodos);
}

function deleteTodo(ev, todoIdx) {
    ev.stopPropagation();
    console.log('Deleting Todo', todoIdx);
    gTodos.splice(todoIdx, 1);
    renderTodos();
    renderCounts();
    saveToStorage(TODOS_KEY, gTodos);
}

function addTodo() {
    // console.log('Add Todo');
    var todoTxt = getTodosTxt()
    var newTodo = createTodo(todoTxt);
    gTodos.unshift(newTodo);
    renderCounts();

    document.querySelector('.status-filter').value = 'All';
    gTodosFilter = 'All';
    renderTodos();

    saveToStorage(TODOS_KEY, gTodos);

}


function setFilter(strFilter) {
    debugger
    gTodosFilter = strFilter;
    renderTodos();
}

/*
 <li class="todo" onclick="todoClicked(this)">
    Todo 1
    <div class="btns">
        <button class="btn btn-danger" onclick="deleteTodo(event, 0)">x</button>
    </div>
</li>

*/


function renderTodos() {
    var strHTML = ''

    var todos = getTodosForDisplay()

    todos.forEach(function (todo, idx) {
        var className = (todo.isDone) ? 'done' : '';
        strHTML +=
            `
            <li class="todo ${className}" onclick="todoClicked(this, ${idx})">
                ${todo.txt}
                <div class="btns">
                    <button class="btn btn-danger" onclick="deleteTodo(event, ${idx})">x</button>
                    <button class="sort-btn btn-up">⬆️</button>
                    <button class="sort-btn btn-down">⬇️</button>
                </div>  
            </li>
            `
    })
    document.querySelector('.todos').innerHTML = strHTML;
    displayNonFilterBtn()
    
}


function createTodos() {

    var todos = loadFromStorage(TODOS_KEY);
    if (todos) return todos;

    todos = [];

    todos.push(createTodo('Learn Javascript'))
    todos.push(createTodo('Play with HTML5'))
    todos.push(createTodo('Master CSS'))

    return todos;
}

function createTodo(txt) {
    return {
        id: gIdx++,
        txt: txt,
        isDone: false,
        createdAt: Date.now(),
        importance: getImportance()
    }
}

function renderCounts() {

    var activeCount = 0;
    gTodos.forEach(function (todo) {
        if (!todo.isDone) activeCount++;
    })

    document.querySelector('.total-count').innerText = gTodos.length;
    document.querySelector('.active-count').innerText = activeCount;
}


function getTodosForDisplay() {
    var todos = [];
    gTodos.forEach(function (todo) {
        if (gTodosFilter === 'All' ||
            (gTodosFilter === 'Active' && !todo.isDone) ||
            (gTodosFilter === 'Done' && todo.isDone)) {
            todos.push(todo);
        }
    });

    if (todos.length === 0) {
        nonToDoMessage()
    } else {
        var elMessage = document.querySelector('.non-todos-messege')
        elMessage.innerText = ''
    }
    return todos;
}

function getTodosTxt() {
    var todoTxt = ''
    while (todoTxt === '') {
        todoTxt = prompt('What do you want todo?..');
    }
    return todoTxt
}

function getImportance() {
    var importanceLevel = 0
    while (importanceLevel !== 1 && importanceLevel !== 2 && importanceLevel !== 3) {
        importanceLevel = +prompt('choose the importence of the to todo (1-3)')
    }
    return importanceLevel
}
// function createdAt (timestamp)
function sortToDoBy(sortType) {
    if (sortType === 'Txt') {
        sortByText(gTodos)
    } else if (sortType === 'Created') {
        sortByValue(gTodos, 'createdAt')
    } else if (sortType === 'Importance') {
        sortByValue(gTodos, 'importance')
    }
    renderTodos()
}

function sortByText(arr) {
    arr.sort(function (a, b) {
        var txtA = a.txt.toUpperCase();
        var txtB = b.txt.toUpperCase();
        if (txtA < txtB) {
            return -1;
        }
        if (txtA > txtB) {
            return 1;
        }
    })
    return arr
}

function sortByValue(arr, selctor) {

    arr.sort(function (a, b) {
        return a[selctor] - b[selctor]
    })
    return arr
}

function nonToDoMessage() {
    var elMessage = document.querySelector('.non-todos-messege')
    if (gTodosFilter === "All") {
        elMessage.innerText = 'No todos'
    } else if (gTodosFilter === "Active") {
        elMessage.innerText = "No Active Todos"
    } else {
        elMessage.innerText = "No Done Todos"
    }
}

function displayNonFilterBtn() {
    var elBtnUp = document.querySelector('.btn-up')
    var elBtnDown = document.querySelector('.btn-down')
    if (elBtnDown.style.display === 'none' && gTodosFilter !== 'All' ){
        return 
    }else{
        if (gTodosFilter === 'All') {
            elBtnUp.style.display = 'inline-block'
            elBtnDown.style.display = 'inline-block'
            
        } else {
            elBtnUp.style.display = 'none'
            elBtnDown.style.display = 'none'
        }
    }
}

// function sortUp(idx) {
//     var currentTodo = gTodos.splice(idx, 1)
//     gTodos.splice(idx - 1, 0, currentTodo)
// }

// function sortDown(idx) {
//     var currentTodo = gTodos.splice(idx, 1)
//     gTodos.splice(idx + 1, 0, currentTodo)
// }