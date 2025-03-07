const backendUrl = 'https://1806clubbackend.vercel.app';
let selectedFiles = [];

document.addEventListener("DOMContentLoaded", async function () {
  // Section Toggling
  document.querySelectorAll('.sidebar nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (!targetElement) return;

      document.querySelectorAll('.section, .sidebar nav a').forEach(el => {
        el.classList.remove('active');
      });

      targetElement.classList.add('active');
      link.classList.add('active');
    });
  });

  // Gallery Management
  const imageList = document.getElementById('image-list');
  const uploadInput = document.getElementById('upload-input');
  const uploadButton = document.getElementById('upload-button');

  // File Selection Handler
  uploadInput.addEventListener('change', (e) => {
    selectedFiles = Array.from(e.target.files);
    imageList.innerHTML = '';

    selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const listItem = createImageListItem(e.target.result, file.name);
        imageList.appendChild(listItem);
      };
      reader.readAsDataURL(file);
    });

    if (selectedFiles.length > 0) {
      uploadButton.disabled = false;
      uploadButton.classList.remove('disabled');
    }
  });

  // Upload Handler
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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      const data = await response.json();
      showToast('Images uploaded successfully!');

      // Update with server URLs
      data.images.forEach((image, index) => {
        const items = imageList.querySelectorAll('.image-list-item');
        if (items[index]) {
          items[index].querySelector('img').src = image.imageSrc;
          items[index].dataset.imageUrl = image.imageSrc;
        }
      });

      // Reset state
      selectedFiles = [];
      uploadInput.value = '';
      uploadButton.disabled = true;
      uploadButton.classList.add('disabled');

    } catch (error) {
      console.error('Upload error:', error);
      showToast(`Upload failed: ${error.message}`, 'error');
    }
  });

  // Delete Image Handler
  window.deleteImageFromList = async function (btn) {
    if (!confirm('Are you sure you want to delete this image?')) return;

    const listItem = btn.closest('.image-list-item');
    const imageUrl = listItem.dataset.imageUrl;

    try {
      const response = await fetch(`${backendUrl}/api/gallery`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Delete failed');
      }

      listItem.remove();
      showToast('Image deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      showToast(`Delete failed: ${error.message}`, 'error');
    }
  };

  // Reservation Management
  async function loadReservations() {
    try {
      const response = await fetch(`${backendUrl}/api/reservations`);
      if (!response.ok) throw new Error('Failed to load reservations');
      const data = await response.json();
      populateReservationTable(data);
    } catch (error) {
      console.error('Reservation load error:', error);
      showToast('Failed to load reservations', 'error');
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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Delete failed');
      }

      document.querySelector(`tr[data-id="${id}"]`)?.remove();
      showToast('Reservation deleted successfully!');
    } catch (error) {
      console.error('Reservation delete error:', error);
      showToast(`Delete failed: ${error.message}`, 'error');
    }
  };

  // Helper Functions
  function createImageListItem(src, filename) {
    const item = document.createElement('div');
    item.className = 'image-list-item';
    item.dataset.imageUrl = src; // Temporary until server URL is available
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
    document.getElementById('toast-container').appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // Initial Load
  loadReservations();

  // Modal Controls
  const modal = document.getElementById('image-modal');
  const closeModal = document.querySelector('.close-modal');
  
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  window.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  };
});
