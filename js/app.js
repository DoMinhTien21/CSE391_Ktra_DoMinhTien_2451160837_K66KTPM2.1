const taskList = document.getElementById("taskList");
const taskForm = document.getElementById("taskForm");
const taskName = document.getElementById("taskName");
const error = document.getElementById("error");

const btnShowForm = document.getElementById("btnShowForm");
const btnCloseForm = document.getElementById("btnCloseForm");
const btnAdd = document.getElementById("btnAdd");

let tasks = [];
let selectedPriority = "Low";
let editingId = null;

fetch("data.json")
    .then(res => res.json())
    .then(data => {
        tasks = data;
        render();
    })

//Mở form

btnShowForm.onclick = () => {
    taskForm.classList.remove("d-none");
    taskName.focus();
};

btnCloseForm.onclick = () => {
    taskForm.classList.add("d-none");
    resetForm();
};

document.querySelectorAll(".priority-btn").forEach(btn => {
    btn.onclick = () => {
        selectedPriority = btn.dataset.priority;
        
        document.querySelectorAll(".priority-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    };
});

//HIỂN THỊ DANH SÁCH

function render() {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML = `<div class="text-muted text-center p-4 border rounded">No tasks available.</div>`;
        return;
    }

    tasks.forEach(task => {
        
        let priorityColor = "text-success";
        if (task.priority === "High") priorityColor = "text-danger";
        if (task.priority === "Medium") priorityColor = "text-warning";

        
        let statusBadgeColor = "bg-secondary";
        if (task.status === "In Progress") statusBadgeColor = "bg-primary";
        if (task.status === "Done") statusBadgeColor = "bg-success";

        taskList.innerHTML += `
        <div class="card mb-3 task-card" data-id="${task.id}">
            <div class="card-body">
                <div class="row align-items-center">

                    <div class="col-md-4 mb-2 mb-md-0">
                        <div class="text-muted small">Task</div>
                        <div class="fw-bold text-break">${task.task}</div>
                    </div>

                    <div class="col-md-2 mb-2 mb-md-0">
                        <div class="text-muted small">Priority</div>
                        <div class="${priorityColor} fw-bold">
                            ${task.priority}
                        </div>
                    </div>

                    <div class="col-md-2 mb-2 mb-md-0">
                        <div class="text-muted small mb-1">Status</div>
                        <span class="badge ${statusBadgeColor} status-btn" style="cursor: pointer; user-select: none; padding: 8px 12px;">
                            ${task.status}
                        </span>
                    </div>

                    <div class="col-md-4 text-md-end">
                        <button class="btn btn-sm btn-warning edit-btn me-1">
                            Edit
                        </button>
                        <button class="btn btn-sm btn-danger delete-btn">
                            Delete
                        </button>
                    </div>

                </div>
            </div>
        </div>
        `;
    });
}


btnAdd.onclick = () => {
    const name = taskName.value.trim();
    error.innerText = "";

    if (!name) {
        error.innerText = "Task name cannot be empty!";
        return;
    }

    if (editingId) {
        //(Sửa)
        const t = tasks.find(x => x.id === editingId);
        if (t) {
            t.task = name;
            t.priority = selectedPriority;
        }
        editingId = null;
    } else {
        //(Thêm mới)
        tasks.push({
            id: Date.now(),
            task: name,
            priority: selectedPriority,
            status: "To Do"
        });
    }

    resetForm();
    render();
    taskForm.classList.add("d-none");
};


taskList.onclick = (e) => {
    const card = e.target.closest(".task-card");
    if (!card) return;

    const id = Number(card.dataset.id);

    
    if (e.target.classList.contains("status-btn")) {
        const t = tasks.find(x => x.id === id);
        if (t) {
            if (t.status === "To Do") {
                t.status = "In Progress";
            } else if (t.status === "In Progress") {
                t.status = "Done";
            } else {
                t.status = "To Do";
            }
            render(); 
        }
        return;
    }

    // XÓA TASK
    if (e.target.classList.contains("delete-btn")) {
        tasks = tasks.filter(t => t.id !== id);
        render();
        return;
    }

    //SỬA TASK
    if (e.target.classList.contains("edit-btn")) {
        const t = tasks.find(x => x.id === id);
        if (t) {
            taskName.value = t.task;
            selectedPriority = t.priority;
            editingId = id;

            document.querySelectorAll(".priority-btn").forEach(b => {
                if (b.dataset.priority === t.priority) b.classList.add("active");
                else b.classList.remove("active");
            });

            error.innerText = "";
            taskForm.classList.remove("d-none");
            taskName.focus();
        }
    }
};


//(RESET FORM)
function resetForm() {
    taskName.value = "";
    error.innerText = "";
    selectedPriority = "Low";
    editingId = null;
    document.querySelectorAll(".priority-btn").forEach(b => b.classList.remove("active"));
}