const backendUrl = 'https://1806clubbackend.vercel.app';
let selectedFiles = []; // Store selected files here

document.addEventListener("DOMContentLoaded", async function () {
  // Section Toggling
  document.querySelectorAll('.sidebar nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (!targetElement) return; // Prevent errors if element is missing

      document.querySelectorAll('.section, .sidebar nav a').forEach(el => {
        el.classList.remove('active');
      });

      targetElement.classList.add('active');
      link.classList.add('active');
    });
  });

  // Gallery Management
  const modal = document.getElementById('image-modal');
  const modalImage = document.getElementById('modal-image');
  const closeModal = document.querySelector('.close-modal');
  const imageList = document.getElementById('image-list');
  const uploadInput = document.getElementById('upload-input');
  const uploadButton = document.getElementById('upload-button');

  if (!imageList || !uploadInput || !uploadButton) return; // Prevent errors if elements are missing

  // Image Selection Handler
  uploadInput.addEventListener('change', (e) => {
    selectedFiles = Array.from(e.target.files); // Store selected files

    // Clear previous previews
    imageList.innerHTML = '';

    // Create previews without uploading
    selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const listItem = createImageListItem(e.target.result, file.name);
        imageList.appendChild(listItem);
      };
      reader.readAsDataURL(file);
    });
  });

  // Image Upload Handler
  uploadButton.addEventListener('click', async () => {
    if (selectedFiles.length === 0) {
      showToast('No files selected!', 'error');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('images', file));

    try {
      const response = await fetch(`${backendUrl}/api/gallery`, {
        method: 'POST',
        body: formData
      });

      const data = await handleResponse(response);
      showToast('Images uploaded successfully!');

      // Update with server-generated URLs
      data.images.forEach((image, index) => {
        const items = imageList.querySelectorAll('.image-list-item');
        if (items[index]) {
          items[index].querySelector('img').src = image.imageSrc;
          items[index].dataset.imageUrl = image.imageSrc;
        }
      });

      // Clear selection after successful upload
      selectedFiles = [];
      uploadInput.value = ''; // Clear file input

    } catch (error) {
      handleError(error, 'upload');
    }
  });

  // Delete Image Function
  window.deleteImageFromList = async function (btn) {
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
    if (!tbody) return;

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

  window.deleteReservation = async function (id) {
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
  if (closeModal) {
    closeModal.addEventListener('click', () => (modal.style.display = 'none'));
  }
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = 'none';
  };
});
// Toast Notification Function
function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'error' : ''}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // Remove the toast after the animation ends
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Example Usage in Your Code
async function uploadImages() {
  if (selectedFiles.length === 0) {
    showToast('No files selected!', 'error');
    return;
  }

  const formData = new FormData();
  selectedFiles.forEach(file => formData.append('images', file));

  try {
    const response = await fetch(`${backendUrl}/api/gallery`, {
      method: 'POST',
      body: formData
    });

    const data = await handleResponse(response);
    showToast('Images uploaded successfully!');

    // Update with server-generated URLs
    data.images.forEach((image, index) => {
      const items = imageList.querySelectorAll('.image-list-item');
      if (items[index]) {
        items[index].querySelector('img').src = image.imageSrc;
        items[index].dataset.imageUrl = image.imageSrc;
      }
    });

    // Clear selection after successful upload
    selectedFiles = [];
    uploadInput.value = ''; // Clear file input
    uploadButton.disabled = true;
    uploadButton.classList.add('disabled');

  } catch (error) {
    showToast('Failed to upload images. Please try again.', 'error');
    console.error('Upload error:', error);
  }
}

// Example Usage for Reservations
async function deleteReservation(id) {
  if (!confirm('Delete this reservation?')) return;

  try {
    const response = await fetch(`${backendUrl}/api/reservations/${id}`, {
      method: 'DELETE'
    });

    await handleResponse(response);
    document.querySelector(`tr[data-id="${id}"]`)?.remove();
    showToast('Reservation deleted successfully!');
  } catch (error) {
    showToast('Failed to delete reservation. Please try again.', 'error');
    console.error('Delete reservation error:', error);
  }
}
