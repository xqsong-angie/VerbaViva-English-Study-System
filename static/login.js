function myFunction() {
  var x = document.getElementById("password");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

window.addEventListener("DOMContentLoaded", (event) => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    // get username and password
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // get user account json
    fetch("accounts.json")
      .then(function(response) {
        return response.json();
      })
      .then(function(userAccounts) {
        // verify user account
        var isValidUser = userAccounts.find(function(user) {
          return user.username === username && user.password === password;
        });

        if (isValidUser) {
          // verify passed
          const user = username;
          const url = 'main_categories.html?user=' + encodeURIComponent(user);
          window.location.href = url;
        } else {
          // verify failed
          document.getElementById("errorMessage").textContent = "Incorrect username or password.";
        }
      })
      .catch(function(error) {
        console.error("Error encountered:", error);
      });
  });
  }
});
