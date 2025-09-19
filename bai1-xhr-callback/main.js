const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Hàm gửi request đến API
function sendRequest(method, url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
        const data = JSON.parse(this.responseText);
        if (this.status >= 200 && this.status < 400) {
            callback(data)
        }
    }
    xhr.send();
};

// Element bài 1
const userIdInput = $("#user-id-input");
const searchUserBtn = $("#search-user-btn");
const userProfileCard = $(".user-profile-card");
const errorMessage = $(".error-message");

// Render User ra giao diện 
function renderUser(data, userID) {
    // Tìm user theo ID
    const user = data.find(u => u.id == userID);

    if (!user) {
        errorMessage.style.display = "block";
        errorMessage.innerHTML = `<p id="user-error-text">Không tìm thấy user với ID: ${userID}</p>`;

        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 2000);
        return;
    }

    // Render thông tin của user được tìm thấy
    userProfileCard.style.display = "block";
    userProfileCard.innerHTML = `
        <div id="user-avatar" class="user-avatar">U</div>
        <div class="user-info">
            <h4 id="user-name" class="user-name">${user.name}</h4>
            <div class="user-details" id="user-details">
                <div class="user-detail-item">
                    <span class="user-detail-label">Email:</span>
                    <span id="user-email">${user.email}</span>
                </div>
                <div class="user-detail-item">
                    <span class="user-detail-label">Phone:</span>
                    <span id="user-phone">${user.phone}</span>
                </div>
                <div class="user-detail-item">
                    <span class="user-detail-label">Website:</span>
                    <span id="user-website">${user.website}</span>
                </div>
                <div class="user-detail-item">
                    <span class="user-detail-label">Company:</span>
                    <span id="user-company">${user.company.name}</span>
                </div>
                <div class="user-detail-item">
                    <span class="user-detail-label">Address:</span>
                    <span id="user-address">${user.address.street}, ${user.address.city}</span>
                </div>
            </div>
        </div>`;
};

// Hàm xử lý tìm user by ID
function handleSearchUserByID() {
    const userID = userIdInput.value;

    if (!userID) {
        errorMessage.style.display = "block";
        errorMessage.innerHTML = `<p id="user-error-text">Vui lòng nhập User ID</p>`;

        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 2000);
        return;
    }

    sendRequest("GET", "https://jsonplaceholder.typicode.com/users", (data) => {
        renderUser(data, userID);
    });
}

searchUserBtn.addEventListener("click", handleSearchUserByID);

// Element bài 2
const postsList = $(".posts-container");
const loadMorePostBtn = $(".load-more-btn");

function renderPost(data) {
    postsList.innerHTML = data.map(post => {
        return `<div class="post-item" data-post-id="${post.id}">
        <h4 class="post-title">${post.title}</h4>
        <p class="post-body">${post.body}</p>
        <p class="post-author">Tác giả: <span class="author-name">${post.userId}</span></p>
        <button class="show-comments-btn" data-post-id="${post.id}">Xem comments</button>
        <div class="comments-container" data-post-id="${post.id}">
            <!-- Comments sẽ được load động -->
        </div>
    </div>`
    }).join("");

    setTimeout(() => {
        const showCommentBtns = $$(`.show-comments-btn`);
        showCommentBtns.forEach(btn => {
            btn.addEventListener("click", handleShowComment);
        });
    });
};

function renderComment(data, postId) {
    const commentsContainer = $(`.comments-container[data-post-id="${postId}"]`);

    if (commentsContainer) {
        commentsContainer.innerHTML = data.map(comment => {
            return `
        <div class="comment-item">
            <div class="comment-author">${comment.name}</div>
            <div class="comment-email">${comment.email}</div>
            <div class="comment-body">${comment.body}</div>
        </div>`
        }).join("");
    }
}

function handleShowPost() {
    sendRequest("get", "https://jsonplaceholder.typicode.com/posts?_limit=5", (data) => {
        renderPost(data);
    });
}

function handleShowComment(e) {
    const postId = e.target.dataset.postId;
    const commentsContainer = $(`.comments-container[data-post-id="${postId}"]`);

    // Kiểm tra xem comments đã được load chưa
    if (commentsContainer && commentsContainer.innerHTML.trim() !== '') {
        // Nếu đã có comments, ẩn/hiện
        commentsContainer.style.display = commentsContainer.style.display === 'none' ? 'block' : 'none';
        e.target.textContent = commentsContainer.style.display === 'none' ? 'Xem comments' : 'Ẩn comments';

        sendRequest("GET", `https://jsonplaceholder.typicode.com/posts/${postId}/comments?_limit=3`, (data) => {
            renderComment(data, postId);
        });
        return;
    }
}

// Khi click xem thêm sẽ có 3 post nữa hiện ra
let numberOfPost = 5;
loadMorePostBtn.addEventListener("click", () => {
    numberOfPost += 3;

    sendRequest("get", `https://jsonplaceholder.typicode.com/posts?_limit=${numberOfPost}`, (data) => {
        renderPost(data);
    });
})

// Hiển thị 5 post ngay khi tải trang
handleShowPost();

// Element bài 3
const todoList = $(".todo-list");
const loadTodoBtn = $("#load-todos-btn");
const todoUserIdInput = $("#todo-user-id-input");

const totalTodos = $("#total-todos");
const completedTodos = $("#completed-todos");
const incompleteTodos = $("#incomplete-todos");

function renderToDoList(data, userId) {
    const user = data.find(u => u.userId == userId);

    if (!user) {
        $("#todos-error").style.display = "block";
        $("#todos-error").innerHTML = `<p id="user-error-text">Không tìm thấy user với ID: ${userId}</p>`;

        setTimeout(() => {
            $("#todos-error").style.display = "none";
        }, 2000);
        return;
    }

    // Render todo list
    todoList.innerHTML = data.map(item => {
        return `<div class="todo-item ${item.completed ? "completed" : "incomplete"} " data-todo-id="${userId}" data-completed="">
                        <div class="todo-checkbox"></div>
                        <div class="todo-text">${item.title}</div>
                    </div>`
    }).join("");


    // Hiển thị tổng số Todos
    showTotalTodos(data);

    // Hiển thị số Todos đã hoàn thành và chưa hoàn thành
    showTodosProgress(data);
}

function showTotalTodos(data) {
    let count = 0;
    for (const index in data) {
        count++;
    }

    totalTodos.innerText = count;
    return;
}

function showTodosProgress(data) {
    let count_todoCompleted = 0;
    let count_todoIncomplete = 0;
    for (let index in data) {
        if (data[index].completed) {
            count_todoCompleted++;
            completedTodos.innerText = count_todoCompleted;
        } else {
            count_todoIncomplete++;
            incompleteTodos.innerText = count_todoIncomplete;
        }
    }
    return;
}

function handleLoadTodoByUserId() {
    const userId = Number(todoUserIdInput.value);

    // Kiểm tra nếu lỗi thì thông báo
    if (!userId) {
        $("#todos-error").style.display = "block";
        $("#todos-error").innerHTML = `<p id="todos-error-text">Vui lòng nhập UserID cần tìm từ 1-10</p>`

        setTimeout(() => {
            $("#todos-error").style.display = "none";
        }, 2000)

        return;
    };

    // Không lỗi thì render
    sendRequest("GET", `https://jsonplaceholder.typicode.com/users/${userId}/todos`, (data) => {
        renderToDoList(data, userId);
    });

    return;
};

loadTodoBtn.addEventListener("click", handleLoadTodoByUserId);

$("#filter-all").addEventListener("click", function () {
    const userId = Number(todoUserIdInput.value);
    this.classList.add("active");
    $("#filter-completed").classList.remove("active");
    $("#filter-incomplete").classList.remove("active");
    sendRequest("GET", `https://jsonplaceholder.typicode.com/users/${userId}/todos`, (data) => {
        renderToDoList(data, userId);
    });
});

$("#filter-completed").addEventListener("click", function () {
    const userId = Number(todoUserIdInput.value);
    this.classList.add("active");
    $("#filter-all").classList.remove("active");
    $("#filter-incomplete").classList.remove("active");
    sendRequest("GET", `https://jsonplaceholder.typicode.com/users/${userId}/todos?completed=true`, (data) => {
        renderToDoList(data, userId);
    });
})

$("#filter-incomplete").addEventListener("click", function () {
    const userId = Number(todoUserIdInput.value);
    this.classList.add("active");
    $("#filter-completed").classList.remove("active");
    $("#filter-all").classList.remove("active");
    sendRequest("GET", `https://jsonplaceholder.typicode.com/users/${userId}/todos?completed=false`, (data) => {
        renderToDoList(data, userId);
    });
})
