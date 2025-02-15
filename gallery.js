// Animate gallery items on scroll
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

window.addEventListener("scroll", animateGallery);
window.addEventListener("load", animateGallery);