document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  const commentsContainer = document.getElementById("comments");


  const fetchComments = async (minId, maxId) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/comments`);
      if (!response.ok) {
        throw new Error('Сеть перестала быть доступна');
      }
      const comments = await response.json();
      const filteredComments = comments.filter(comment => comment.id >= minId && comment.id <= maxId);
      renderComments(filteredComments);
    } catch (error) {
      commentsContainer.innerHTML = `<p>⚠️ Что-то пошло не так: ${error.message}</p>`;
    } finally {
      preloader.style.display = 'none';
    }
  };


  const renderComments = (comments) => {
    comments.forEach(comment => {
      const commentDiv = document.createElement("div");
      commentDiv.className = "comment";
      commentDiv.innerHTML = `<strong>${comment.name}</strong> (${comment.email}): <p>${comment.body}</p>`;
      commentsContainer.appendChild(commentDiv);
    });
  };


  const randomFilter = () => {
    const random = Math.random();
    if (random < 0.5) {
      fetchComments(100, 200);
    } else {
      fetchComments(1, 99);
    }
  };

  randomFilter();
});
