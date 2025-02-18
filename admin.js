const backendUrl = 'http://localhost:5000';


// Toggle Sections
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.sidebar nav ul li a');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    sections.forEach(section => section.classList.remove('active'));
    target.classList.add('active');
    navLinks.forEach(navLink => navLink.classList.remove('active'));
    link.classList.add('active');
  });
});

// Image Upload and Gallery Management
const uploadInput = document.getElementById('upload-input');
const galleryGrid = document.querySelector('.gallery-grid');
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const closeModal = document.querySelector('.close-modal');
const deleteImageBtn = document.getElementById('delete-image');

uploadInput.addEventListener('change', (e) => {
  const files = e.target.files;
  for (const file of files) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.addEventListener('click', () => {
        modal.style.display = 'flex';
        modalImage.src = img.src;
      });
      galleryGrid.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

deleteImageBtn.addEventListener('click', () => {
  const imageToDelete = document.querySelector(`img[src="${modalImage.src}"]`);
  if (imageToDelete) {
    imageToDelete.remove();
    modal.style.display = 'none';
  }
});

// Reservation Data (Example)
const reservations = [
  { name: 'John Doe', date: '2023-10-15', time: '7:00 PM', guests: 4, status: 'Confirmed' },
  { name: 'Jane Smith', date: '2023-10-16', time: '6:30 PM', guests: 2, status: 'Pending' },
];

const reservationTable = document.querySelector('.reservation-table tbody');

reservations.forEach(reservation => {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${reservation.name}</td>
    <td>${reservation.date}</td>
    <td>${reservation.time}</td>
    <td>${reservation.guests}</td>
    <td>${reservation.status}</td>
  `;
  reservationTable.appendChild(row);
});

fetch(`${backendUrl}/reservations`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch reservations");
        }
        return response.json();
    })
    .then(data => {
        const reservationTable = document.querySelector(".reservation-table tbody");
        if (!reservationTable) return;

        reservationTable.innerHTML = "";

        data.forEach(reservation => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${reservation.name}</td>
                <td>${reservation.date}</td>
                <td>${reservation.time}</td>
                <td>${reservation.guests}</td>
                <td>${reservation.status}</td>
            `;
            reservationTable.appendChild(row);
        });
    })
    .catch(error => {
        console.error("Error fetching reservations:", error);
    });



document.addEventListener("DOMContentLoaded", function () {
  const uploadInput = document.getElementById("upload-input");

  uploadInput.addEventListener("change", async function (event) {
      const files = event.target.files;
      if (files.length === 0) return;

      const formData = new FormData();
      for (const file of files) {
          formData.append("image", file);
      }

      try {
          const response = await fetch(`${backendUrl}/gallery`, {
              method: "POST",
              body: formData
          });

          const result = await response.json();

          if (response.ok) {
              alert("Image uploaded successfully!");
              console.log("Uploaded Image URL:", result.url);
          } else {
              alert("Image upload failed. " + (result.error || ""));
          }
      } catch (error) {
          console.error("Error uploading image:", error);
          alert("An error occurred while uploading. Please try again.");
      }
  });
});
