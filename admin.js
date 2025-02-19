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
const imageList = document.getElementById('image-list');
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
      // Create list item
      const listItem = document.createElement('div');
      listItem.className = 'image-list-item';
      listItem.innerHTML = `
        <div class="image-list-preview">
          <img src="${e.target.result}" class="image-list-thumbnail" alt="Thumbnail">
          <span class="image-list-name">${file.name}</span>
        </div>
        <div class="image-list-actions">
          <button class="list-delete-btn" onclick="deleteImageFromList(this)">
            <i class="fas fa-trash"></i>
            Delete
          </button>
        </div>
      `;
      
      imageList.appendChild(listItem);
    };
    reader.readAsDataURL(file);
  }

  // Upload to backend
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

// Delete Image Function for List
window.deleteImageFromList = function(btn) {
  if (confirm('Are you sure you want to delete this image?')) {
    const listItem = btn.closest('.image-list-item');
    const imageSrc = listItem.querySelector('img').src;

    // Remove from UI
    listItem.remove();

    // Delete from backend
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
          <button class="list-delete-btn" onclick="deleteReservation('${reservation._id}')">
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
