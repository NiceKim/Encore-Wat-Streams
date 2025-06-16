const API_BASE_URL = 'https://localhost:3000/api';
let currentShow = null;
let currentSchedules = [];

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

// Format date and time
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return {
        date: date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
        }),
        time: date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit'
        })
    };
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const showId = urlParams.get('id');
        
        if (!showId) {
            window.location.href = 'shows.html';
            return;
        }

        // Fetch show details
        const showResponse = await fetch(`${API_BASE_URL}/shows/${showId}`);
        if (!showResponse.ok) {
            throw new Error('Failed to fetch show details');
        }
        const rawShow = await showResponse.json();
        const show = normalizeShowData(rawShow);

        if (!show) {
            throw new Error('Show not found');
        }

        // Update breadcrumb
        document.getElementById('show-title-breadcrumb').textContent = show.title;

        // Display show details
        document.getElementById('show-title').textContent = show.title;
        
        // Handle image path
        const imagePath = show.thumbnail || `p${show.show_id}.jpg`;
        const showImage = document.getElementById('show-image');
        showImage.src = `images/${imagePath}`;
        showImage.alt = show.title;
        
        // Add error handler for image
        showImage.onerror = function() {
            this.onerror = null;
            this.src = 'images/p1.jpg'; // Fallback image
        };

        document.getElementById('show-description').textContent = show.description;
        document.getElementById('show-category').textContent = show.category;
        document.getElementById('show-price').textContent = `$${Number(show.price).toFixed(2)}`;
        document.getElementById('book-button').href = `booking.html?id=${show.show_id}`;

        // Fetch schedules
        const schedulesResponse = await fetch(`${API_BASE_URL}/shows/${showId}/schedules`);
        if (!schedulesResponse.ok) {
            throw new Error('Failed to fetch schedules');
        }
        const schedules = await schedulesResponse.json();

        // Display schedules
        const schedulesGrid = document.getElementById('schedules-grid');
        
        // Ensure schedules is an array
        const schedulesArray = Array.isArray(schedules) ? schedules : (schedules ? [schedules] : []);
        
        if (schedulesArray.length === 0) {
            schedulesGrid.innerHTML = '<p style="text-align: center; color: var(--text-muted); grid-column: 1/-1;">No schedules available at the moment.</p>';
            return;
        }

        schedulesGrid.innerHTML = schedulesArray.map(schedule => {
            // Handle both uppercase and lowercase date property
            const dateValue = schedule.Date || schedule.date;
            if (!dateValue) {
                return ''; // Skip invalid schedules
            }

            try {
                const { date, time } = formatDateTime(dateValue);
                const location = schedule.Location || schedule.location || 'Online Streaming';
                
                return `
                    <div class="schedule-card">
                        <div class="schedule-date">
                            <i class="far fa-calendar"></i>
                            ${date}
                        </div>
                        <div class="schedule-time">
                            <i class="far fa-clock"></i>
                            ${time}
                        </div>
                        <div class="schedule-venue">
                            <i class="fas fa-map-marker-alt"></i>
                            ${location}
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error('Error formatting schedule:', error);
                return ''; // Skip schedules with invalid dates
            }
        }).filter(html => html).join('');

    } catch (error) {
        console.error('Error:', error);
        document.querySelector('.show-details-container').innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h2 style="color: var(--primary-gold);">Error Loading Show Details</h2>
                <p style="color: var(--text-muted);">Failed to load show details. Please try again later.</p>
                <a href="shows.html" class="book-button" style="margin-top: 1rem;">Back to Shows</a>
            </div>
        `;
    }
}); 