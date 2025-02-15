document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
    });

    // Close navbar when a link is clicked (for mobile)
    document.querySelectorAll(".nav-links a").forEach((link) => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
        });
    });

    // WhatsApp Form Handler
    document.getElementById('whatsappForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const message = document.getElementById('message').value;
        const phone = '2348168951209';
        
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
            `Name: ${name}\nMessage: ${message}`
        )}`;
        
        window.open(whatsappUrl, '_blank');
        this.reset();
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // Intersection Observers
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.gallery-item, .testimonial-card, .map-container, .review-form').forEach(element => {
        observer.observe(element);
    });

    // Review Form Animation
    const reviewForm = document.querySelector('.review-form');
    setTimeout(() => {
        reviewForm.classList.add('show');
    }, 500);
});
// Fetch and display the most recent 3 reviews
fetch('reviews.json')
  .then(response => response.json())
  .then(data => {
    const testimonialGrid = document.querySelector('.testimonial-grid');
    testimonialGrid.innerHTML = ''; // Clear existing content
    data.slice(0, 3).forEach(review => {
      testimonialGrid.innerHTML += `
        <div class="testimonial-card">
          <p>${review.comment}</p>
          <h3>${review.name}</h3>
          <span>${review.date}</span>
        </div>
      `;
    });
  });
  document.getElementById("reservationForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const reservationData = {
        date: formData.get("eventDate"),
        tables: formData.get("tables"),
        guests: formData.get("guests"),
        time: formData.get("time"),
        // Add other fields like name/email if needed
    };

    // Send to backend
    const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData)
    });

    // Handle response...
});