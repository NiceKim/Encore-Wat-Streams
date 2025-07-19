const API_BASE_URL = 'http://localhost:3000/api';
let allShows = [];

// Utility function to normalize show data from backend
function normalizeShowData(show) {
    if (!show) return null;
    
    return {
        show_id: show.Show_ID || show.show_id || show.id,
        title: show.Title || show.title || 'Untitled Show',
        description: show.Description || show.description || 'No description available',
        category: show.Category || show.category || 'Uncategorized',
        price: show.Price || show.price || 0,
        thumbnail: show.Thumbnail || show.thumbnail,
        admin_id: show.Admin_ID || show.admin_id
    };
}

async function loadLiveStreams() {
    const container = document.getElementById('live-streams-container');
    container.innerHTML = '';
    try {

        let liveStreams = [];
        
        const response = await fetch(`${API_BASE_URL}/shows/schedules/streaming`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        liveStreams = await response.json();
     
        if (liveStreams.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center; width: 100%;">No live streams available</p>';
            return;
        }

        liveStreams.forEach(stream => {
            const card = document.createElement('div');
            card.className = 'live-stream-card';
            
            const imageSrc = stream.thumbnail ? 
                `images/${stream.thumbnail}` : 
                `images/p${stream.show_id}.jpg`;

            card.innerHTML = `
                <img src="${imageSrc}" alt="${stream.title}" class="live-preview">
                <div class="live-stream-info">
                    <h3 class="live-stream-title">${stream.title}</h3>
                    <p class="live-stream-description">${stream.description}</p>
                    <div class="live-stream-meta">
                        <span class="live-badge">LIVE</span>
                        <span class="viewer-count">
                            <i class="fas fa-map-marker-alt"></i>
                            ${stream.location}
                        </span>
                    </div>
                    <button class="watch-now-btn" onclick="window.location.href='live-stream.html?id=${stream.show_id}'">
                        <i class="fas fa-play-circle"></i> Watch Now
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
       
    } catch (error) {
        console.error('Error loading live streams:', error);
        const container = document.getElementById('live-streams-container');
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; width: 100%;">Failed to load live streams</p>';
    }
}

async function loadShows() {
    try {
        const response = await fetch(`${API_BASE_URL}/shows`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawShows = await response.json();

        if (Array.isArray(rawShows)) {
            // Map shows to a consistent format using the same normalizeShowData function
            const formattedShows = rawShows.map(show => normalizeShowData(show)).filter(show => show !== null);
            allShows = formattedShows;
            displayShows(formattedShows);
        } else {
            throw new Error('Shows data is not in array format');
        }
    } catch (error) {
        console.error('Error loading shows:', error);
        const container = document.getElementById('shows-container');
        container.innerHTML = `
            <div style="text-align: center; color: var(--text-muted);">
                <p>Failed to load shows</p>
                <p style="font-size: 0.9em; margin-top: 0.5em;">
                    ${error.message.includes('certificate') ? 
                      'Please accept the SSL certificate by visiting <a href="${API_BASE_URL}/shows" target="_blank">this link</a> first.' :
                      'Please try refreshing the page'}
                </p>
            </div>
        `;
    }
}

function getShowImage(show) {
    // Map of categories to default images
    const categoryImages = {
        'Opera': 'Lakhon Preah Reach Trop.jpg',
        'Comedy': 'Lakhon niyeay.jpg',
        'Dance': 'The Apsara Dance.avif',
        'Traditional': 'Robam Tep Apsara.jpg',
        'Theater': 'Lakhon bassac.jpg',
        'Performance': 'Lakhon Pol Srey.jpeg'
    };

    // If show has a specific thumbnail, use it
    if (show.thumbnail) {
        return `images/${show.thumbnail}`;
    }

    // If show has a category, use the category-specific image
    if (show.Category && categoryImages[show.Category]) {
        return `images/${categoryImages[show.Category]}`;
    }

    // Use numbered placeholders as fallback
    const showId = show.Show_ID || show.show_id || 1;
    const fallbackId = ((showId - 1) % 5) + 1; // Maps IDs to p1.jpg through p5.jpg
    return `images/p${fallbackId}.jpg`;
}

function displayShows(shows) {
    const container = document.getElementById('shows-container');
    container.innerHTML = '';
    
    if (!shows || shows.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; width: 100%;">No shows available</p>';
        return;
    }
    
    shows.forEach(show => {
        if (!show || !show.show_id) return; // Skip invalid shows
        
        const card = document.createElement('div');
        card.className = 'show-card';
        card.onclick = () => window.location.href = `show-details.html?id=${show.show_id}`;
        
        // Use the normalized properties
        const imageSrc = show.thumbnail ? `images/${show.thumbnail}` : `images/p${show.show_id}.jpg`;
        
        card.innerHTML = `
            <img src="${imageSrc}" alt="${show.title}" class="show-image" 
                 onerror="this.onerror=null; this.src='images/p1.jpg';">
            <div class="show-info">
                <h3 class="show-title">${show.title}</h3>
                ${show.category ? `<span class="show-category" style="color: var(--primary-gold); font-size: 0.9em; margin-bottom: 0.5rem; display: inline-block;">${show.category}</span>` : ''}
                <p class="show-description">${show.description ? show.description.substring(0, 100) + (show.description.length > 100 ? '...' : '') : 'No description available'}</p>
                <div class="show-meta">
                    ${typeof show.price === 'number' ? `
                        <span class="show-price" style="color: var(--secondary-gold);">$${show.price.toLocaleString()}</span>
                    ` : ''}
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadLiveStreams();
    loadShows();
}); 