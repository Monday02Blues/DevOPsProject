const accessKey = 'ppt9yS0chYWHgdiZN-Mt9YZXPzSB17C_SriQcTchcEU'; // Replace with your Unsplash API access key
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const imageGrid = document.getElementById('image-grid');
const errorMessage = document.getElementById('error-message');
const darkModeToggle = document.getElementById('dark-mode-toggle');

let currentPage = 1;
let currentQuery = '';
let isLoading = false;

// Event listeners
searchButton.addEventListener('click', () => {
    currentQuery = searchInput.value;
    currentPage = 1; // Reset to first page
    fetchImages(currentQuery, currentPage);
});

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Infinite scrolling
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isLoading) {
        currentPage++;
        fetchImages(currentQuery, currentPage);
    }
});

// Fetch images from Unsplash API
async function fetchImages(query, page) {
    if (!query) return;

    errorMessage.textContent = '';
    if (page === 1) {
        imageGrid.innerHTML = ''; // Clear previous results
    }

    isLoading = true;

    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&page=${page}&client_id=${accessKey}`);
        const data = await response.json();

        if (data.results.length === 0) {
            errorMessage.textContent = 'No results found.';
            return;
        }

        data.results.forEach(image => {
            const imageItem = document.createElement('div');
            imageItem.classList.add('image-item');

            const img = document.createElement('img');
            img.src = image.urls.small;
            img.alt = image.alt_description;

            const caption = document.createElement('div');
            caption.classList.add('image-caption');
            caption.textContent = image.alt_description || 'No caption available';

            const downloadButton = document.createElement('a');
            downloadButton.href = image.urls.full;
            downloadButton.download = '';
            downloadButton.textContent = 'Download';
            downloadButton.style.display = 'block';
            downloadButton.style.color = 'white';
            downloadButton.style.textAlign = 'center';
            downloadButton.style.backgroundColor = '#007bff';
            downloadButton.style.padding = '5px';
            downloadButton.style.borderRadius = '5px';
            downloadButton.style.marginTop = '5px';

            imageItem.appendChild(img);
            imageItem.appendChild(caption);
            imageItem.appendChild(downloadButton);
            imageGrid.appendChild(imageItem);
        });
    } catch (error) {
        console.error('Error fetching images:', error);
        errorMessage.textContent = 'An error occurred while fetching images.';
    } finally {
        isLoading = false; // Reset loading state
    }
}