document.getElementById('imageInput').addEventListener('change', function () {
    updateImage();
});

document.getElementById('compressionSlider').addEventListener('input', function () {
    document.getElementById('qualityValue').textContent = Math.round(this.value * 100) + '%';
    updateImage();
});

function updateImage() {
    const file = document.getElementById('imageInput').files[0];
    const quality = parseFloat(document.getElementById('compressionSlider').value);
    if (file) {
        shrinkJpegFile(file, 800, 600, quality, function (blob) {
            const downloadBtn = document.getElementById('downloadBtn');
            const fileSizeInfo = document.getElementById('fileSizeInfo');
            const thumbnail = document.getElementById('thumbnail');
            const url = URL.createObjectURL(blob);
            downloadBtn.setAttribute('href', url);
            downloadBtn.setAttribute('download', 'resized-image.jpg');
            downloadBtn.classList.remove('hidden');
            fileSizeInfo.textContent = `Approximate File Size: ${(blob.size / 1024).toFixed(2)} KB`;
            thumbnail.src = url;
            thumbnail.classList.remove('hidden');
        });
    }
}

function shrinkJpegFile(file, maxWidth, maxHeight, quality, callback) {
  // Create an image element
  const img = new Image();
  // Create a file reader
  const reader = new FileReader();

  reader.onload = function (e) {
    // Set the image source to the file reader result
    img.src = e.target.result;
  };

  img.onload = function () {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Calculate the new size
    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }
    }

    // Set canvas size to the new dimensions
    canvas.width = width;
    canvas.height = height;

    // Draw the image on canvas
    ctx.drawImage(img, 0, 0, width, height);

    // Convert the canvas to a JPEG file
    canvas.toBlob(function (blob) {
      // Return the blob file through the callback
      callback(blob);
    }, 'image/jpeg', quality);
  };

  // Read the file as a data URL
  reader.readAsDataURL(file);
}

// Usage example
const fileInput = document.querySelector('#your-file-input');
fileInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    shrinkJpegFile(file, 800, 600, 0.7, function (newFile) {
      console.log('Shrinked file size:', newFile.size);
      // You can now use this file (newFile) to upload or for any other purpose
    });
  }
});
