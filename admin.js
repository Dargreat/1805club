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

// Image Upload Handler with Progress
uploadInput.addEventListener('change', async (e) => {
  const files = e.target.files;
  const formData = new FormData();

  // Clear previous uploads
  imageList.innerHTML = '';

  for (const file of files) {
    formData.append('images', file); // Matches backend expectation
    
    // Create preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      const listItem = createImageListItem(e.target.result, file.name);
      imageList.appendChild(listItem);
    };
    reader.readAsDataURL(file);
  }

  try {
    const response = await fetch(`${backendUrl}/api/gallery`, {
      method: 'POST',
      body: formData
    });

    const data = await handleResponse(response);
    console.log('Upload successful:', data);
    showToast('Images uploaded successfully!');
    
    // Update with server-generated URLs
    data.urls.forEach((url, index) => {
      const items = imageList.querySelectorAll('.image-list-item');
      if (items[index]) {
        items[index].querySelector('img').src = url;
        items[index].dataset.imageUrl = url;
      }
    });

  } catch (error) {
    handleError(error, 'upload');
    imageList.innerHTML = ''; // Clear failed uploads
  }
});

// Delete Image Function
window.deleteImageFromList = async function(btn) {
  if (!confirm('Are you sure you want to delete this image?')) return;

  const listItem = btn.closest('.image-list-item');
  const imageUrl = listItem.dataset.imageUrl;

  try {
    listItem.remove();
    const response = await fetch(`${backendUrl}/api/gallery`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl })
    });
    
    await handleResponse(response);
    showToast('Image deleted successfully!');
  } catch (error) {
    handleError(error, 'delete');
    imageList.appendChild(listItem); // Re-add if deletion failed
  }
};

// Reservation Management
async function loadReservations() {
  try {
    const response = await fetch(`${backendUrl}/api/reservations`);
    const data = await handleResponse(response);
    populateReservationTable(data);
  } catch (error) {
    handleError(error, 'load reservations');
  }
}

function populateReservationTable(reservations) {
  const tbody = document.querySelector('.reservation-table tbody');
  tbody.innerHTML = reservations.map(reservation => `
    <tr data-id="${reservation._id}">
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
}

window.deleteReservation = async function(id) {
  if (!confirm('Delete this reservation?')) return;

  try {
    const response = await fetch(`${backendUrl}/api/reservations/${id}`, {
      method: 'DELETE'
    });
    
    await handleResponse(response);
    document.querySelector(`tr[data-id="${id}"]`)?.remove();
    showToast('Reservation deleted successfully!');
  } catch (error) {
    handleError(error, 'delete reservation');
  }
};

// Helper Functions
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
}

function handleError(error, context) {
  console.error(`${context} error:`, error);
  showToast(`Error: ${error.message}`, 'error');
}

function createImageListItem(src, filename) {
  const item = document.createElement('div');
  item.className = 'image-list-item';
  item.innerHTML = `
    <div class="image-list-preview">
      <img src="${src}" class="image-list-thumbnail" alt="Thumbnail">
      <span class="image-list-name">${filename}</span>
    </div>
    <div class="image-list-actions">
      <button class="list-delete-btn" onclick="deleteImageFromList(this)">
        <i class="fas fa-trash"></i> Delete
      </button>
    </div>
  `;
  return item;
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Initial Load
loadReservations();

// Modal Controls
closeModal.addEventListener('click', () => (modal.style.display = 'none'));
window.onclick = (e) => (e.target === modal) && (modal.style.display = 'none');
