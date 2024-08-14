document.addEventListener("DOMContentLoaded", function() {

    // Function to fetch users, posts, and todos
    async function fetchUserData() {
        let outputDiv = document.getElementById('output');
        try {
            const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
            const users = await usersResponse.json();

            const userPromises = users.map(async user => {
                const postsResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${user.id}/posts`);
                const posts = await postsResponse.json();

                const todosResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${user.id}/todos`);
                const todos = await todosResponse.json();

                return {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    posts: posts.map(post => ({ title: post.title, body: post.body })),
                    todos: todos.map(todo => ({ title: todo.title }))
                };
            });

            const usersData = await Promise.all(userPromises);

            // Log usersData to the console
            console.log(usersData);
            
            // Clear previous output
            outputDiv.innerHTML = '';

            // Display the user data
            usersData.forEach(user => {
                let userElement = document.createElement('div');
                userElement.innerHTML = `
                    <h3>ID: ${user.id} - ${user.username} (${user.email})</h3>
                    <p>Phone: ${user.phone}</p>
                    <h4>Posts:</h4>
                    <ul>${user.posts.map(post => `<li><strong>${post.title}</strong>: ${post.body}</li>`).join('')}</ul>
                    <h4>Todos:</h4>
                    <ul>${user.todos.map(todo => `<li>${todo.title}</li>`).join('')}</ul>
                `;
                outputDiv.appendChild(userElement);
            });

            // Automatically show the output after fetching
            document.getElementById('output-toggle').textContent = 'Hide Console Output';
            outputDiv.style.display = 'block';
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Function to fetch and modify posts
    function fetchAndModifyPosts() {
        let outputDiv = document.getElementById('output'); // Get the output div inside the event listener
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(response => response.json())
            .then(data => {
                outputDiv.innerHTML = '';  // Clear previous output

                let modifiedPosts = data.map(post => {
                    if (post.id % 2 === 0) {
                        post.title = post.title.toUpperCase();
                    }
                    return post;
                });

                // Log the modified posts to the console
                console.log(modifiedPosts);

                // Display the modified posts on the page
                modifiedPosts.forEach(post => {
                    let postElement = document.createElement('div');
                    postElement.textContent = `ID: ${post.id}, Title: ${post.title}`;
                    outputDiv.appendChild(postElement);
                });

                // Automatically show the output after fetching
                document.getElementById('output-toggle').textContent = 'Hide Console Output';
                outputDiv.style.display = 'block';
            })
            .catch(error => console.error('Error:', error));
    }

    // Set up the buttons and their event listeners
    document.getElementById('fetchData')?.addEventListener('click', fetchUserData);
    document.getElementById('fetchPosts')?.addEventListener('click', fetchAndModifyPosts);

    // Toggle the visibility of the output
    document.getElementById('output-toggle').addEventListener('click', function() {
        let outputDiv = document.getElementById('output');
        if (outputDiv.style.display === 'none' || outputDiv.style.display === '') {
            outputDiv.style.display = 'block';
            this.textContent = 'Hide Console Output';
        } else {
            outputDiv.style.display = 'none';
            this.textContent = 'Show Console Output';
        }
    });
});