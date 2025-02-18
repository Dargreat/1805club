const backendUrl = 'http://localhost:5000';


const galleryItems = document.querySelectorAll(".gallery-item");

const animateGallery = () => {
    galleryItems.forEach((item) => {
        const itemTop = item.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (itemTop < windowHeight - 100) {
            item.classList.add("show");
        }
    });
};

async function fetchGallery() {
    try {
        const response = await fetch(`${backendUrl}/gallery`); 
        const galleryItems = await response.json();

        const gridContainer = document.querySelector('.grid');
        gridContainer.innerHTML = ''; 

        galleryItems.forEach(item => {
            const galleryDiv = document.createElement('div');
            galleryDiv.classList.add('gallery-item');

            const img = document.createElement('img');
            img.src = item.imageUrl; 
            img.alt = item.altText || 'Gallery Image';

            galleryDiv.appendChild(img);
            gridContainer.appendChild(galleryDiv);
        });
    } catch (error) {
        console.error('Error fetching gallery:', error);
    }
}

window.addEventListener("scroll", animateGallery);
window.addEventListener("load", animateGallery);
window.addEventListener("load", fetchGallery);