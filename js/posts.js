const API_URL = "https://jsonplaceholder.typicode.com/posts";

const tbody = document.getElementById("posts-tbody");
const search = document.getElementById("search");
const pageSizeEl = document.getElementById("page-size");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const pageInfo = document.getElementById("page-info");
const sortId = document.getElementById("sort-id");
const sortTitle = document.getElementById("sort-title");
const statusMsg = document.getElementById("status");

let apiPosts = [];
let customPosts = JSON.parse(localStorage.getItem("custom-posts") || "[]");

let state = {
  query: "",
  sortKey: "id",
  sortDirection: "asc",
  page: 1,
  pageSize: 10,
};

const saveCustom = () =>
  localStorage.setItem("custom-posts", JSON.stringify(customPosts));

const showStatus = (msg) => (statusMsg.textContent = msg);

const mergePosts = () => {
  const combined = [...apiPosts, ...customPosts];
  const unique = combined.reduce((acc, post) => {
    acc[post.id] = post;
    return acc;
  }, {});
  return Object.values(unique).filter((p) => !p.deleted);
};

const applyFilters = (posts) => {
  let view = [...posts];

  //===> search
  if (state.query) {
    const searchQuery = state.query.toLowerCase();
    view = view.filter(
      (p) =>
        (p.title && p.title.toLowerCase().includes(searchQuery)) ||
        (p.body && p.body.toLowerCase().includes(searchQuery))
    );

    console.log(view);
  }

  //===> sort
  view.sort((a, b) => {
    let va = a[state.sortKey];
    let vb = b[state.sortKey];
    if (typeof va === "string") va = va.toLowerCase();
    if (typeof vb === "string") vb = vb.toLowerCase();
    if (va < vb) return state.sortDirection === "asc" ? -1 : 1;
    if (va > vb) return state.sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return view;
};

//===> Render
function render() {
  const view = applyFilters(mergePosts());
  const totalPages = Math.max(1, Math.ceil(view.length / state.pageSize));

  if (state.page > totalPages) state.page = totalPages;

  const start = (state.page - 1) * state.pageSize;
  const pagePosts = view.slice(start, start + state.pageSize);

  tbody.innerHTML = pagePosts
    .map(
      (p) => `
      <tr>
        <td>${p.id}</td>
        <td>${p.title}</td>
        <td>${p.body}</td>
        <td>
          <button class="btn" onclick="editPost(${p.id})">Edit</button>
          <button class="btn danger" onclick="deletePost(${p.id})">Delete</button>
        </td>
      </tr>`
    )
    .join("");

  pageInfo.textContent = `Page ${state.page} of ${totalPages}`;
  prev.disabled = state.page <= 1;
  next.disabled = state.page >= totalPages;
}

//===> Actions
window.editPost = (id) => (location.href = `create.html?id=${id}`);

window.deletePost = (id) => {
  if (!confirm("Are you sure you want to delete this post?")) return;

  // Delete the post if exist in custom posts
  customPosts = customPosts.filter((p) => p.id !== id);

  // Add deleted key which has value true if exist in api post
  if (apiPosts.find((p) => p.id === id)) {
    customPosts.push({ id, deleted: true });
  }

  showToast("Post has deleted succefully", "success");

  saveCustom();
  render();
};

//===> Events
search.oninput = (e) => {
  state.query = e.target.value;
  state.page = 1;
  render();
};

pageSizeEl.onchange = (e) => {
  state.pageSize = +e.target.value;
  state.page = 1;
  render();
};

prev.onclick = () => {
  if (state.page > 1) state.page--;
  render();
};

next.onclick = () => {
  state.page++;
  render();
};

function toggleSort(key) {
  if (state.sortKey === key) {
    if (state.sortDirection === "asc") {
      state.sortDirection = "desc";
    } else {
      state.sortDirection = "asc";
    }
  } else {
    state.sortKey = key;
    state.sortDirection = "asc";
  }
  render();
}
sortId.onclick = () => toggleSort("id");
sortTitle.onclick = () => toggleSort("title");

//===> Auth and Start page
document.addEventListener("DOMContentLoaded", async () => {
  if (!localStorage.getItem("auth-token"))
    return (location.href = "index.html");

  showStatus("Loading...");
  try {
    const res = await fetch(API_URL);
    apiPosts = await res.json();
    showStatus("");
  } catch {
    showStatus("Error while loading posts");
  }
  render();
});
