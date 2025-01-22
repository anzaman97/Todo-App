
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




//add and remove items
document.querySelector('.js-input-element').addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    addTodo();
    updateDyNum();
  }
})


document.querySelector('.circle').addEventListener('click', addTodo)


const todoList = [
  'Complete online Javascript course',
  'Jog around the park 3x',
  '10 minutes meditation',
  'Read for 1 hour',
  'Pick up groceries',
  'Complete  Todo app on Frontend Mentor',
];





for (let i = 0; i < todoList.length; i++) {
  total = todoList.length;
}

renderTodoList();
let items = document.querySelector('.dynamic-num');
items.innerHTML = total;



const addTodoItem = () => {
  if (inputField.value.trim() !== "") {
    const todoText = inputField.value;
    inputField.value = "";
    let todoListHTML = '';


    todoList.forEach((todo, index) => {
      const html = `<li type="checkbox" draggable="true" class="item item1  ">
        <input " type="checkbox" class="checkbox">
        <span class="text">${todo}</span>
        <div class="remove"> </div>
      </li>`;
      todoListHTML += html;
    })
  }
}
  ;


document.querySelector('.todo-list').innerHTML = todoListHTML;

document.querySelectorAll('.remove')
  .forEach((deleteButton, index) => {
    deleteButton.addEventListener('click', () => {
      todoList.splice(index, 1);
      renderTodoList();
      updateDyNum();
    });
  });




function addTodo() {
  const inputElement = document.querySelector('.js-input-element');
  const newTodo = inputElement.value;
  if (newTodo !== '')
    todoList.push(newTodo)
  inputElement.value = '';

  renderTodoList();
  updateDyNum();
};

function updateDyNum() {
  let total = 0;

  for (let i = 0; i < todoList.length; i++) {
    total = todoList.length;
  }
  let items = document.querySelector('.dynamic-num');

  items.innerHTML = total;

};




//drag and drop




