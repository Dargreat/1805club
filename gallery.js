const backendUrl = 'https://1806clubbackend.vercel.app';



const animateGallery = () => {
    const galleryItems = document.querySelectorAll(".gallery-item");
    console.log('Adding show');
    
    galleryItems.forEach((item) => {
        console.log(item);
        
        const itemTop = item.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (itemTop < windowHeight - 100) {
            item.classList.add("show");
        }
    });
};

async function fetchGallery() {
    console.log('Fetching gallery');
    
    try {
        const response = await fetch(`${backendUrl}/api/gallery`);
        const galleryItems = await response.json();

        const gridContainer = document.querySelector('.grid');
        gridContainer.innerHTML = '';
        console.log(galleryItems);

        galleryItems.map(item => {
            console.log(item.imageUrl);

            const galleryDiv = document.createElement('div');
            console.log(galleryDiv);
            galleryDiv.classList.add('gallery-item');

            const img = document.createElement('img');
            img.src = item.imageUrl;
            img.alt = item.altText || 'Gallery Image';
            img.onerror = () => console.error("Image failed to load:", img.src);


            galleryDiv.appendChild(img);
            gridContainer.appendChild(galleryDiv);
        });
        animateGallery();

    } catch (error) {
        console.error('Error fetching gallery:', error);
    }
}

window.addEventListener("scroll", animateGallery);
document.addEventListener("DOMContentLoaded", function () {
    fetchGallery();
});