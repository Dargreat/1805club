const backendUrl = 'https://1806clubbackend.vercel.app';

// Section Toggling
document.querySelectorAll('.sidebar nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    
    document.querySelectorAll('.section, .sidebar nav a').forEach(el => {
      el.classList.remove('active');
    });

    document.querySelector(targetId).classList.add('active');
    link.classList.add('active');
  });
});

// Gallery Management
const uploadInput = document.getElementById('upload-input');
const galleryGrid = document.querySelector('.gallery-grid');
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const closeModal = document.querySelector('.close-modal');

// Image Upload Handler
uploadInput.addEventListener('change', async (e) => {
  const files = e.target.files;
  const formData = new FormData();

  for (const file of files) {
    formData.append('images', file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const galleryItem = document.createElement('div');
      galleryItem.className = 'gallery-item';
      galleryItem.innerHTML = `
        <img src="${e.target.result}" alt="Gallery Image">
        <button class="delete-btn" onclick="deleteImage(this)">
          <i class="fas fa-trash"></i>
        </button>
      `;
      
      galleryItem.querySelector('img').addEventListener('click', () => {
        modal.style.display = 'flex';
        modalImage.src = e.target.result;
      });

      galleryGrid.appendChild(galleryItem);
    };
    reader.readAsDataURL(file);
  }

  try {
    const response = await fetch(`${backendUrl}/api/gallery`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Upload failed');
    const data = await response.json();
    console.log('Upload successful:', data);
  } catch (error) {
    console.error('Upload error:', error);
    alert('Error uploading images');
  }
});

// Delete Image Function
window.deleteImage = function(btn) {
  if (confirm('Are you sure you want to delete this image?')) {
    const galleryItem = btn.closest('.gallery-item');
    const imageSrc = galleryItem.querySelector('img').src;

    galleryItem.remove();

    fetch(`${backendUrl}/api/gallery`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl: imageSrc })
    })
    .then(response => {
      if (!response.ok) throw new Error('Delete failed');
      console.log('Image deleted successfully');
    })
    .catch(error => {
      console.error('Delete error:', error);
      alert('Error deleting image');
    });
  }
};

// Modal Controls
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
};

// Delete Image in Modal
document.getElementById('delete-image').addEventListener('click', () => {
  const imageUrl = modalImage.src;
  const galleryItem = document.querySelector(`.gallery-item img[src="${imageUrl}"]`)?.closest('.gallery-item');
  
  if (galleryItem) {
    galleryItem.remove();
    modal.style.display = 'none';
    
    fetch(`${backendUrl}/api/gallery`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl })
    });
  }
});

// Reservation Data Handling
fetch(`${backendUrl}/api/reservations`)
  .then(response => response.json())
  .then(data => {
    const tbody = document.querySelector('.reservation-table tbody');
    tbody.innerHTML = data.map(reservation => `
      <tr>
        <td>${reservation.name}</td>
        <td>${new Date(reservation.date).toLocaleDateString()}</td>
        <td>${reservation.preferredTime}</td>
        <td>${reservation.guests}</td>
        <td><span class="status">${reservation.status}</span></td>
        <td>
          <button class="delete-btn-sm" onclick="deleteReservation('${reservation._id}')">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
  })
  .catch(error => console.error('Error loading reservations:', error));

window.deleteReservation = function(id) {
  if (confirm('Delete this reservation?')) {
    fetch(`${backendUrl}/api/reservations/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        document.querySelector(`tr[data-id="${id}"]`)?.remove();
      }
    });
  }
};
