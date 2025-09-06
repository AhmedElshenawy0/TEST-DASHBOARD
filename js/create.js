const form = document.getElementById("create-form");
const titleInput = document.getElementById("title");
const bodyInput = document.getElementById("content");
const cancelBtn = document.getElementById("cancel");

const loadPosts = () =>
  JSON.parse(localStorage.getItem("custom-posts") || "[]");
const savePosts = (posts) =>
  localStorage.setItem("custom-posts", JSON.stringify(posts));
const getPostId = () =>
  Number(new URLSearchParams(location.search).get("id")) || null;

//===> Validation
const validate = (title, body) => {
  if (title.length < 3)
    return showToast("Title must be at least 3 chars.", "warning");
  if (body.length < 10)
    return showToast("Body must be at least 10 chars.", "warning");
  return true;
};

//===> Main
document.addEventListener("DOMContentLoaded", async () => {
  if (!localStorage.getItem("auth-token"))
    return (location.href = "index.html");

  const posts = loadPosts();
  const editId = getPostId();

  // Check if editable post from cutome or api
  if (editId) {
    const post = posts.find((p) => p.id === editId);

    if (post) {
      titleInput.value = post.title;
      bodyInput.value = post.body;
    } else {
      try {
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${editId}`
        );
        if (!res.ok) throw new Error("Post not found");
        const apiPost = await res.json();
        titleInput.value = apiPost.title;
        bodyInput.value = apiPost.body;
      } catch {
        showToast("Post not found!", "error");
        setTimeout(() => (location.href = "posts.html"), 1000);
      }
    }
  }

  //===> Submit
  form.onsubmit = (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!validate(title, body)) return;

    if (editId) {
      const index = posts.findIndex((p) => p.id === editId);
      if (index !== -1) {
        posts[index] = { ...posts[index], title, body };
      } else {
        posts.push({ id: editId, title, body });
      }
      showToast("Post has updated successfully", "success");
    } else {
      posts.push({ id: posts.length + 1, title, body });
      showToast("Post has created successfully", "success");
    }

    savePosts(posts);
    setTimeout(() => (location.href = "posts.html"), 1000);
  };

  //===> Cancel
  cancelBtn.onclick = () => (location.href = "posts.html");
});
