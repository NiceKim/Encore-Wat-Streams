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

// Check authentication status and update UI
function updateAuthUI() {
    const isLoggedIn = auth.isAuthenticated();
    const profileLink = document.querySelector('.profile-link');
    
    if (isLoggedIn) {
        // User is logged in - show profile link
        profileLink.style.display = 'flex';
        profileLink.href = './profile.html';
    } else {
        // User is not logged in - change profile to login
        profileLink.textContent = 'Login';
        profileLink.href = './login.html';
        profileLink.style.display = 'flex';
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
});

function register(event) {
  event.preventDefault(); // prevent form reload
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;

  if (name && email && password) {
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);
    alert("Registration successful!");
    window.location.href = "login.html";
  } else {
    alert("Please fill in all fields.");
  }
}

function login(event) {
  event.preventDefault(); // prevent form reload
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const storedEmail = localStorage.getItem("userEmail");
  const storedPassword = localStorage.getItem("userPassword");

  if (email === storedEmail && password === storedPassword) {
    alert("Login successful!");
    window.location.href = "home.html"; // you can create this later
  } else {
    alert("Invalid credentials!");
  }
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add navigation menu toggle for mobile
function setupMobileNav() {
    const nav = document.querySelector('nav ul');
    const menuButton = document.createElement('button');
    menuButton.className = 'menu-toggle';
    menuButton.innerHTML = '☰';
    menuButton.style.display = 'none';

    // Only show menu button on mobile
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    function handleMobileChange(e) {
        if (e.matches) {
            menuButton.style.display = 'block';
            nav.style.display = 'none';
        } else {
            menuButton.style.display = 'none';
            nav.style.display = 'flex';
        }
    }

    mediaQuery.addListener(handleMobileChange);
    handleMobileChange(mediaQuery);

    menuButton.addEventListener('click', () => {
        nav.style.display = nav.style.display === 'none' ? 'flex' : 'none';
    });

    document.querySelector('nav').insertBefore(menuButton, nav);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupMobileNav();
});


