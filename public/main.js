const input = document.querySelector("#inputText");
const ul = document.querySelector("#list");
const btn = document.querySelector("#addBtn");
const clearListBtn = document.querySelector("#clearBtn");
const clearCompletedBtn = document.querySelector("#clearCompletedBtn");
const todosLeft = document.querySelector("#todosLeft");

// window.onload = () => {
//
// };

const addItem = (e) => {
  e.preventDefault();
  if (input.value === "") {
    return alert("write something!");
  }
  fetch("/createTask", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      task: input.value,
    })
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res)
      const li = document.createElement("li");
      const butn = document.createElement("button")
      butn.innerHTML = 'X'
      butn.classList.add('deleteTask')
      butn.onclick = (e) => deleteTask(res)
      // li.classList.add(todosLeft.innerHTML);
      li.innerText = input.value;
      li.appendChild(butn)
      li.setAttribute("data-id", res);
      li.onclick = (e) => handleToggle(e);
      ul.appendChild(li);
      input.value = "";
    });
};


const handleToggle = () => {
  const etarget = event.target
  const completed = !event.target.classList.contains("lineThrough")
  const _id = event.target.dataset.id;
  fetch('/markCompleted', {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      _id,
      completed
    })
    })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        etarget.classList.toggle("lineThrough")
      }
  })
};

const clearCompleted = () => {
  fetch("/completedTasks", {
    method: "delete",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const completedTasks = document.querySelectorAll(".lineThrough");
  completedTasks.forEach((element) => element.remove());
  todosLeft.innerHTML = Number(todosLeft.innerHTML) - completedTasks.length;
};

const deleteTask = (_id) => {
 const etarget = event.target.parentNode
  event.stopPropagation()
  fetch("/singleTask", {
    method: "delete",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      _id,
    }),
  })
  .then(res => res.json())
  .then(res => {
    if (res.success) {
      console.log(etarget)
        // todosLeft.innerHTML = Number(todosLeft.innerHTML) - completedTasks.length;
        etarget.remove()
    }
})

};

const clearList = () => {
  fetch("/clear", {
    method: "delete",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  document.querySelectorAll("li").forEach((element) => element.remove());
  todosLeft.innerHTML = 0;
};

btn.addEventListener("click", addItem);
clearCompletedBtn.addEventListener("click", clearCompleted);
clearListBtn.addEventListener("click", clearList);
