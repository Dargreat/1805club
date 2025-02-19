const backendUrl = 'http://localhost:5000';

document.addEventListener("DOMContentLoaded", async function () {
    await fetchGallery();

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
    document.getElementById('whatsappForm').addEventListener('submit', function (e) {
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
        anchor.addEventListener('click', function (e) {
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

    const reservationForm = document.getElementById("reservationForm");

    if (reservationForm) {
        reservationForm.addEventListener("submit", async function (event) {
            event.preventDefault(); // Prevent page reload

            const formData = new FormData(reservationForm);
            const formObject = Object.fromEntries(formData.entries()); // Convert FormData to JSON object

            try {
                const response = await fetch(`${backendUrl}/api/reservations`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formObject),
                });

                if (response.ok) {
                    const result = await response.json();
                    alert("Reservation successful!");
                    reservationForm.reset(); // Reset form after successful submission
                } else {
                    alert("Failed to make reservation. Please try again.");
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                alert("An error occurred. Please try again.");
            }
        });
    }

    const reviewForms = document.querySelectorAll(".review-form");

    reviewForms.forEach(form => {
        form.addEventListener("submit", async function (event) {
            event.preventDefault(); // Prevent page reload

            const formData = new FormData(form);
            const formObject = Object.fromEntries(formData.entries()); // Convert FormData to JSON object

            try {
                const response = await fetch(`${backendUrl}/api/reviews`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formObject),
                });

                if (response.ok) {
                    alert("Review submitted successfully!");
                    form.reset(); // Reset form after successful submission
                } else {
                    alert("Failed to submit review. Please try again.");
                }
            } catch (error) {
                console.error("Error submitting review:", error);
                alert("An error occurred. Please try again.");
            }
        });
    });
});
// Fetch and display the most recent 3 reviews
fetch(`${backendUrl}/api/reviews`) // Replace with your actual API URL
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch reviews');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        
        const testimonialGrid = document.querySelector('.testimonial-grid');
        if (!testimonialGrid) return;

        testimonialGrid.innerHTML = ''; // Clear existing content

        data.slice(0, 3).forEach(review => {
            console.log(review);
            
            const reviewCard = document.createElement('div');
            reviewCard.classList.add('testimonial-card');

            reviewCard.innerHTML = `
                <p>${review.review}</p>
                <h3>${review.name}</h3>
                <span>${new Date(review.createdAt).toLocaleDateString()}</span>
            `;

            testimonialGrid.appendChild(reviewCard);
        });
    })
    .catch(error => {
        console.error('Error fetching reviews:', error);
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

async function fetchGallery() {
    try {
        const response = await fetch(`${backendUrl}/api/gallery`); // Replace with your actual API URL
        const galleryItems = await response.json();

        const gridContainer = document.querySelector('.grid');
        gridContainer.innerHTML = ''; // Clear existing content

        galleryItems.forEach(item => {
            const galleryDiv = document.createElement('div');
            galleryDiv.classList.add('gallery-item');

            const img = document.createElement('img');
            img.src = item.imageUrl; // Adjust based on your API response structure
            img.alt = item.altText || 'Gallery Image';

            galleryDiv.appendChild(img);
            gridContainer.appendChild(galleryDiv);
        });
    } catch (error) {
        console.error('Error fetching gallery:', error);
    }
}