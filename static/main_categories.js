document.addEventListener("DOMContentLoaded", function() {
  const urlParams = new URLSearchParams(window.location.search);
  const user = urlParams.get('user');
  const categoryItems = document.querySelectorAll(".category-item");

  categoryItems.forEach(function(item) {
    item.addEventListener("click", function() {
      // Remove active class from all items
      categoryItems.forEach(function(item) {
        item.classList.remove("active");
      });

      // Add active class to the clicked item
      this.classList.add("active");

      // Get the clicked item's ID
      const category = this.id;
      const encodedUser = encodeURIComponent(user);
      const encodedCategory = encodeURIComponent(category);
      
      const url = 'learning_list.html?user=' + encodedUser + '&category=' + encodedCategory;
      
      window.location.href = url;
    });
  });
});