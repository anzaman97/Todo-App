
//theme changer

let darkmode = localStorage.getItem('darkmode')
const themeSwitch = document.querySelector('.toggle-btn');

const enableDarkmode = () => {
  document.body.classList.add('darkmode')
  localStorage.setItem('darkmode', 'active')
}

const disableDarkmode = () => {
  document.body.classList.remove('darkmode')
  localStorage.setItem('darkmode', null)
}

if (darkmode === 'active') enableDarkmode()

themeSwitch.addEventListener('click', () => {
  darkmode = localStorage.getItem('darkmode')
  darkmode !== 'active' ? enableDarkmode() : disableDarkmode()
})


//TODO 

//DOM
const input = document.querySelector('.js-input-element');
const todoList = document.querySelector('.todo-list');
const addBtn = document.querySelector('.circle')
const dynamicNum = document.querySelector('.dynamic-num');
const allBtn = document.querySelector('.all-btn');
const activeBtn = document.querySelector('.active-btn');
const completedBtn = document.querySelector('.completed-btn');
const clearBtn = document.querySelector('.clear-btn');

//check todos from local storage

try {
  const storedTodos = JSON.parse(localStorage.getItem('todos'));
  if (Array.isArray(storedTodos)) {
    todos = storedTodos.filter(todo => todo && todo.id && todo.text);
  }
} catch (error) {
  console.error("Error loading todos from localStorage", error);
  localStorage.removeItem('todos');
}


renderTodoList();

//new todo

const addTodoItem = () => {
  if (input.value.trim() !== "") {
    const todoText = input.value;
    input.value = "";

    const todoItemId = Math.floor(Math.random() * 10000);

    const newTodoItem = {
      id: todoItemId,
      text: todoText,
      isComplete: false,
    };
    todos.push(newTodoItem);
    localStorage.setItem("todos", JSON.stringify(todos));

    renderTodoList();
    updateItemsLeft();
  }
};


//event listeners for enter and click 
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && input.value.trim() !== "") {
    addTodoItem();
  }
});

addBtn.addEventListener("click", () => {
  addTodoItem();
});




//rendering new todo

function renderTodoList() {
  todoList.innerHTML = "";

  todos.forEach((todo, index) => {
    const newTodoItem = document.createElement("li");
    newTodoItem.className = "item";
    newTodoItem.setAttribute("draggable", "true");
    newTodoItem.setAttribute("data-index", index);

    const todoContent = `
<input " type="checkbox" class="checkbox"  id="checkbox-${todo.id}" ${todo.isComplete ? "checked" : ""}>
 <label for="checkbox-${todo.id}"></label>
        <span class="text">${todo.text}</span>
        <div class="remove"> </div>
    `;

    newTodoItem.innerHTML = todoContent;
    todoList.appendChild(newTodoItem);
  });

  addDraggableEventListeners();

}

const toggleTodoCompletion = (todoId) => {
  todos = todos.map((todo) => {
    if (todo.id === todoId) {
      todo.isComplete = !todo.isComplete;
    }
    return todo;
  });
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodoList();
  updateItemsLeft();
};

todoList.addEventListener("change", (event) => {
  const checkbox = event.target;
  const todoId = parseInt(checkbox.id.split("-")[1]);
  toggleTodoCompletion(todoId);
});

// Delete todo function
const deleteTodo = (todoId) => {

  todos = todos.filter((todo) => todo.id !== todoId);
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodoList();
  updateItemsLeft();
};

todoList.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove")) {
    const icon = event.target;
    const todoItem = icon.closest(".item");

    // Ensure the todoItem is found before proceeding
    if (todoItem) {
      const todoId = parseInt(
        todoItem.querySelector('input[type="checkbox"]').id.split("-")[1]
      );

      deleteTodo(todoId);
    } else {
      console.log("Todo item not found"); // Debug log if no item is found
    }
  }

});

//update items left

const updateItemsLeft = () => {
  const incompleteItems = todos.filter((todo) => !todo.isComplete);
  dynamicNum.textContent = incompleteItems.length;

};

//filter todo list

function filterTodoList(filterType) {
  let filteredTodos = [];

  switch (filterType) {
    case "all":
      filteredTodos = todos;
      break;
    case "active":
      filteredTodos = todos.filter(function (todo) {
        return !todo.isComplete;
      });
      break;
    case "completed":
      filteredTodos = todos.filter(function (todo) {
        return todo.isComplete;
      });
      break;
  }

  renderFilteredTodoList(filteredTodos);
}

function renderFilteredTodoList(filteredTodos) {
  todoList.innerHTML = "";

  filteredTodos.forEach((todo, index) => {
    const newTodoItem = document.createElement("li");
    newTodoItem.className = "item";
    newTodoItem.setAttribute("draggable", "true");
    newTodoItem.setAttribute("data-index", index);



    const todoContent = `
      <input  type="checkbox" class="checkbox"  id="checkbox-${todo.id}" ${todo.isComplete ? "checked" : ""}>
       <label for="checkbox-${todo.id}"></label>
              <span class="text">${todo.text}</span>
              <div class="remove"> </div>
          `;
    newTodoItem.innerHTML = todoContent;
    todoList.appendChild(newTodoItem);
  });

  addDraggableEventListeners()
}

//TÄHÄN JÄITT½!!!

function clearCompletedTodos() {
  todos = todos.filter((todo) => !todo.isComplete);

  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodoList();
  updateItemsLeft();
}

allBtn.addEventListener("click", () => {
  allBtn.classList.add("active");
  activeBtn.classList.remove("active");
  completedBtn.classList.remove("active");
  filterTodoList("all");
});

activeBtn.addEventListener("click", () => {
  allBtn.classList.remove("active");
  activeBtn.classList.add("active");
  completedBtn.classList.remove("active");
  filterTodoList("active");
});

completedBtn.addEventListener("click", () => {
  allBtn.classList.remove("active");
  activeBtn.classList.remove("active");
  completedBtn.classList.add("active");
  filterTodoList("completed");
});


clearBtn.addEventListener("click", () => {
  clearCompletedTodos();
});



//drag and drop

let dragStartIndex;

function addDraggableEventListeners() {
  const todoItems = document.querySelectorAll(".item");

  todoItems.forEach((item, index) => {
    item.addEventListener("dragstart", () => item.classList.add("dragging"));

    item.addEventListener("dragend", () => {
      item.classList.remove("dragging")
      updateTodosOrder();
    });
  });

  todoList.addEventListener('dragover', (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector('.dragging');
    // get array of all items except the one dragging
    let siblings = [...todoList.querySelectorAll('.item:not(.dragging)')];

    // find next sibling item after which the dragging item should be placed
    let nextSibling = siblings.find(sibling => {
      return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 0.5;
    });

    // Inserting the dragging item before the found sibling
    todoList.insertBefore(draggingItem, nextSibling);
  });

  todoList.addEventListener("dragenter", e => e.preventDefault());
}

function updateTodosOrder() {
  const updatedTodos = [];
  const todoItems = document.querySelectorAll(".item");

  todoItems.forEach((item) => {
    const index = parseInt(item.getAttribute("data-index"));
    updatedTodos.push(todos[index]);
  });

  todos = updatedTodos;
  localStorage.setItem("todos", JSON.stringify(todos));
}

renderTodoList();
updateItemsLeft();