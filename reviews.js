// Fetch and display all reviews
fetch('reviews.json')
  .then(response => response.json())
  .then(data => {
    const testimonialGrid = document.querySelector('.testimonial-grid');
    testimonialGrid.innerHTML = ''; // Clear existing content
    data.forEach(review => {
      testimonialGrid.innerHTML += `
        <div class="testimonial-card">
          <p>${review.comment}</p>
          <h3>${review.name}</h3>
          <span>${review.date}</span>
        </div>
      `;
    });
  });