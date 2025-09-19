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
const postsList = $(".post-item");
const commentItem = $(".comment-item");
const showCommentBtn = $(".show-comments-btn");

function renderPost(data) {
    postsList.innerHTML = data.map(post => {
        return `<h4 class="post-title">${post.title}</h4>
        <p class="post-body">${post.body}</p>
        <p class="post-author">Tác giả: <span class="author-name">
            ${post.id}
        </span></p>
        <button class="show-comments-btn" data-post-id="">Xem comments</button>
        <div class="comments-container" data-post-id=""></div>`
    }).join("");
};

function renderComment(data) {
    commentItem.innerHTML = data.map(comment => {
        return `<div class="comment-author">${comment.name}</div>
        <div class="comment-email">${comment.email}</div>
        <div class="comment-body">${comment.body}</div>`
    }).join("");
}

function handleShowPost() {
    sendRequest("get", "https://jsonplaceholder.typicode.com/posts?_limit=5", (data) => {
        renderPost(data);
    });
}

handleShowPost();

function handleShowComment() {
    // const postId = ...
    sendRequest("get", `https://https://jsonplaceholder.typicode.com/posts/${postId}/comments`, (data) => {
        renderComment(data);
    });
};

showCommentBtn.addEventListener("click", handleShowComment);



