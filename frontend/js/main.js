// DOM Elements
const featuredShowsGrid = document.getElementById('featured-shows-grid');

// Sample data (will be replaced with API calls)
const sampleShows = [
    {
        id: 1,
        title: "Traditional Dance Performance",
        description: "Experience the beauty of traditional Cambodian dance",
        image: "images/show1.jpg",
        date: "2024-06-15",
        time: "19:00"
    },
    {
        id: 2,
        title: "Puppet Theater Show",
        description: "Classic puppet show featuring ancient stories",
        image: "images/show2.jpg",
        date: "2024-06-16",
        time: "20:00"
    },
    {
        id: 3,
        title: "Cultural Performance",
        description: "A blend of music, dance, and storytelling",
        image: "images/show3.jpg",
        date: "2024-06-17",
        time: "18:30"
    }
];

// Function to create show cards
function createShowCard(show) {
    const card = document.createElement('div');
    card.className = 'show-card';
    
    card.innerHTML = `
        <img src="${show.image}" alt="${show.title}">
        <div class="content">
            <h3>${show.title}</h3>
            <p>${show.description}</p>
            <p>Date: ${formatDate(show.date)}</p>
            <p>Time: ${show.time}</p>
            <a href="show-details.html?id=${show.id}" class="cta-button">View Details</a>
        </div>
    `;
    
    return card;
}

// Function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Load featured shows
function loadFeaturedShows() {
    sampleShows.forEach(show => {
        const card = createShowCard(show);
        featuredShowsGrid.appendChild(card);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedShows();
}); 