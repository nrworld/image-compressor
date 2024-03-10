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
        shrinkJpegFile(file, quality, function (blob) {
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

function shrinkJpegFile(file, quality, callback) {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = function(e) {
        img.src = e.target.result;
    };

    img.onload = function() {
        // Use the source image's dimensions
        let width = img.width;
        let height = img.height;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        // Adjust logic for quality = 1.0
        if (quality === 1) {
            // Bypass canvas for 100% quality to avoid any compression
            // This simply uses the original image data
            callback(file);
        } else {
            // Use the specified quality for compression
            canvas.toBlob(function(blob) {
                callback(blob);
            }, 'image/jpeg', quality);
        }
    };

    reader.readAsDataURL(file);
}
