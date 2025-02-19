const backendUrl = 'https://1806clubbackend.vercel.app';

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