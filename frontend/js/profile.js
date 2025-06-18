const API_BASE_URL = 'http://localhost:3000/api';

let currentFilter = 'all';
let currentUser = null;

async function getCurrentUserFromAPI() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return null;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/users/detail`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        if (!response.ok) throw new Error('Unauthorized');
        const user = await response.json();

        // Show admin controls if user is an admin
        const adminControls = document.getElementById('admin-controls');
        if (adminControls) {
            adminControls.style.display = user.type === 'ADMIN' ? 'block' : 'none';
        }

        return user;
    } catch (e) {
        console.log('Error getting current user from API:', e);
        // window.location.href = 'login.html';
        return null;
    }
}

function getTicketTypeDetails(type) {
    const types = {
        standard: {
            name: 'Standard',
            quality: 'HD',
            replay: '24 hours'
        },
        premium: {
            name: 'Premium',
            quality: '4K',
            replay: '7 days'
        },
        family: {
            name: 'Family',
            quality: '4K',
            replay: '30 days'
        }
    };
    return types[type] || types.standard;
}

function loadBookings(filter = 'all') {
    try {
        // Get bookings from localStorage
        const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
        const container = document.getElementById('bookings-container');
        currentFilter = filter;

        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.status === filter);
        });

        if (!Array.isArray(bookings) || bookings.length === 0) {
            container.innerHTML = `
                <div class="no-bookings">
                    <i class="fas fa-ticket-alt"></i>
                    <h3>No Bookings Found</h3>
                    <p>Ready to experience amazing performances? Book your first show now!</p>
                    <a href="shows.html" class="primary-button small" style="display: inline-flex; margin-top: 1rem;">
                        <i class="fas fa-theater-masks"></i>
                        Browse Shows
                    </a>
                </div>`;
            return;
        }

        // Filter bookings based on status and date
        const now = new Date();
        const filteredBookings = bookings.filter(booking => {
            if (!booking || !booking.date) return false;
            
            const showDate = new Date(booking.date);
            const isPast = showDate < now;
            
            switch (filter) {
                case 'upcoming':
                    return !isPast && booking.status !== 'cancelled';
                case 'past':
                    return isPast && booking.status !== 'cancelled';
                case 'cancelled':
                    return booking.status === 'cancelled';
                case 'all':
                    return booking.status !== 'cancelled'; // Only show non-cancelled bookings for 'all'
                default:
                    return booking.status !== 'cancelled';
            }
        });

        if (filteredBookings.length === 0) {
            container.innerHTML = `<p class="no-bookings">No ${filter} bookings found</p>`;
            return;
        }

        container.innerHTML = filteredBookings.map(booking => {
            if (!booking || !booking.show) {
                console.error('Invalid booking data:', booking);
                return '';
            }

            const ticketDetails = getTicketTypeDetails(booking.ticketType);
            return `
                <div class="booking-card">
                    <div class="booking-image-container">
                        <img src="${booking.show.image}" alt="${booking.show.title}" class="booking-image" onerror="this.src='images/placeholder.jpg'">
                        ${booking.status === 'cancelled' ? '<div class="cancelled-overlay">Cancelled</div>' : ''}
                    </div>
                    <div class="booking-info">
                        <div class="booking-header">
                            <h3 class="booking-title">${booking.show.title}</h3>
                            <div class="booking-id">Booking ID: ${booking.id}</div>
                        </div>
                        <div class="ticket-type">
                            ${ticketDetails.name} Ticket
                        </div>
                        <div class="booking-details">
                            <div class="booking-detail">
                                <i class="fas fa-calendar"></i>
                                <span>${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${booking.schedule.split(', ')[1]}</span>
                            </div>
                            <div class="booking-detail">
                                <i class="fas fa-video"></i>
                                <span>${ticketDetails.quality} Quality Streaming</span>
                            </div>
                            <div class="booking-detail">
                                <i class="fas fa-history"></i>
                                <span>${ticketDetails.replay} Replay Access</span>
                            </div>
                            <div class="booking-detail">
                                <i class="fas fa-comments"></i>
                                <span>Live Chat Access</span>
                            </div>
                            ${ticketDetails.name === 'Family' ? `
                            <div class="booking-detail">
                                <i class="fas fa-users"></i>
                                <span>Up to 4 Devices</span>
                            </div>
                            ` : ''}
                            ${(ticketDetails.name === 'Premium' || ticketDetails.name === 'Family') ? `
                            <div class="booking-detail">
                                <i class="fas fa-star"></i>
                                <span>Exclusive Content</span>
                            </div>
                            ` : ''}
                            <div class="booking-detail">
                                <i class="fas fa-dollar-sign"></i>
                                <span>Total: $${booking.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                        <div class="booking-actions">
                            ${booking.status !== 'cancelled' ? `
                                <button class="primary-button small" onclick="window.location.href='live-stream.html?id=${booking.show.id}&stream=${booking.streamKey}'">
                                    <i class="fas fa-play"></i> Watch
                                </button>
                                <button class="secondary-button small" onclick="cancelBooking('${booking.id}')">
                                    <i class="fas fa-times"></i> Cancel
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading bookings:', error);
        document.getElementById('bookings-container').innerHTML = `
            <p class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                Failed to load bookings. Please refresh the page or try again later.
            </p>
        `;
    }
}

function cancelBooking(bookingId) {
    try {
        if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
            return;
        }

        const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
        const bookingIndex = bookings.findIndex(b => b.id === bookingId);
        
        if (bookingIndex === -1) {
            throw new Error('Booking not found');
        }

        bookings[bookingIndex].status = 'cancelled';
        localStorage.setItem('userBookings', JSON.stringify(bookings));
        
        // Refresh the display with current filter
        loadBookings(currentFilter);
        
        // Show success message
        alert('Booking cancelled successfully');
    } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking. Please try again.');
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    // Get current user from API
    currentUser = await getCurrentUserFromAPI();
    if (!currentUser) return;
    document.querySelector('.profile-info h1').textContent = currentUser.name;
    document.querySelector('.profile-info p').textContent = `Member since ${new Date(currentUser.registration_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;

    // Load bookings from database
    loadBookings('all');
    
    // Add event listeners to filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => loadBookings(btn.dataset.status));
    });
}); 