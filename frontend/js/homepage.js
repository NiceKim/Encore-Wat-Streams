const API_BASE_URL = 'http://localhost:3000/api';

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

async function loadUpcomingShows() {
    try {
        console.log('Fetching shows from:', `${API_BASE_URL}/shows`);
        const response = await fetch(`${API_BASE_URL}/shows`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const shows = await response.json();
        console.log('Received shows data:', shows);

        if (Array.isArray(shows)) {
            // Map shows to a consistent format, handling both upper and lowercase properties
            const formattedShows = shows.map(show => {
                // Get ID using fallbacks
                const showId = show.Show_ID || show.show_id || show.id;
                if (!showId) {
                    console.warn('Show missing ID:', show);
                    return null;
                }
                const img_url = 'images/' + show.thumbnail;
                return {
                    show_id: showId,
                    title: show.Title || show.title || 'Untitled Show',
                    description: show.Description || show.description || 'No description available',
                    category: show.Category || show.category || 'Uncategorized',
                    date: show.Date || show.date || '',
                    time: show.Time || show.time || '',
                    image: img_url || `images/p${showId}.jpg`
                };
            }).filter(show => show !== null); // Remove any null entries

            // Render to carousel
            const carouselTrack = document.getElementById('carousel-track');
            carouselTrack.innerHTML = '';
            if (formattedShows.length === 0) {
                carouselTrack.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No upcoming shows found.</p>';
                return;
            }
            formattedShows.forEach(show => {
                const showCard = document.createElement('div');
                showCard.className = 'show-card';
                showCard.style.cursor = 'pointer';
                showCard.onclick = () => navigateToShowDetails(show.show_id);
                showCard.innerHTML = `
                    <div class="show-image-container">
                        <img src="${show.image}" alt="${show.title}">
                        <div class="show-category-badge">${show.category}</div>
                    </div>
                    <div class="show-info">
                        <div class="show-content">
                            <h3>${show.title}</h3>
                            <p class="show-description">${show.description}</p>
                            <p class="show-date">${show.date}</p>
                            <p class="show-time">${show.time}</p>
                        </div>
                        <button class="see-more-btn">See More</button>
                    </div>
                `;
                carouselTrack.appendChild(showCard);
            });

            // Re-initialize carousel navigation if needed
            initCarousel();
        } else {
            throw new Error('Shows data is not in array format');
        }
    } catch (error) {
        console.error('Error loading shows:', error);
        const carouselTrack = document.getElementById('carousel-track');
        carouselTrack.innerHTML = `
            <div style="text-align: center; color: var(--text-muted);">
                <p>Failed to load upcoming shows</p>
                <p style="font-size: 0.9em; margin-top: 0.5em;">Please try refreshing the page</p>
            </div>
        `;
    }
}

async function loadLiveStreaming() {
    try {
        const response = await fetch(`${API_BASE_URL}/shows/schedules/streaming`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const streamingSchedules = await response.json();
        const container = document.getElementById('live-streams-container');
        container.innerHTML = '';

        if (!streamingSchedules || streamingSchedules.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center; width: 100%;">No live streams at the moment</p>';
            return;
        }

        // Fetch show details for each streaming schedule
        const liveStreams = await Promise.all(streamingSchedules.map(async schedule => {
            try {
                const showId = schedule.show_id || schedule.Show_ID;
                if (!showId) return null;

                const showResponse = await fetch(`${API_BASE_URL}/shows/${showId}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (!showResponse.ok) return null;
                
                const show = await showResponse.json();
                return {
                    schedule_id: schedule.schedule_id || schedule.Schedule_ID,
                    show_id: showId,
                    date: schedule.date || schedule.Date,
                    location: schedule.location || schedule.Location,
                    is_streaming: schedule.is_streaming || schedule.IsStreaming,
                    show: normalizeShowData(show)
                };
            } catch (error) {
                console.error(`Error fetching show details:`, error);
                return null;
            }
        }));

        // Filter out any failed show fetches and duplicates
        const uniqueStreams = liveStreams
            .filter(stream => stream && stream.show)
            .filter((stream, index, self) => 
                index === self.findIndex(s => s.show_id === stream.show_id)
            );

        // Create Carousel
        if (uniqueStreams.length > 0) {
            container.innerHTML = `
                <div class="carousel-wrapper live-carousel-wrapper">
                    <button id="live-prev-btn" class="carousel-btn"><i class="fas fa-chevron-left"></i></button>
                    <div id="live-carousel-track" class="carousel-track live-carousel-track"></div>
                    <button id="live-next-btn" class="carousel-btn"><i class="fas fa-chevron-right"></i></button>
                </div>
            `;
            const track = container.querySelector('#live-carousel-track');

            uniqueStreams.forEach(stream => {
                const card = document.createElement('div');
                card.className = 'live-stream-card live-carousel-card';
                
                const imageSrc = stream.show.thumbnail ? 
                    `images/${stream.show.thumbnail}` : 
                    `images/p${stream.show.show_id}.jpg`;

                card.innerHTML = `
                    <img src="${imageSrc}" alt="${stream.show.title}" class="live-preview">
                    <div class="live-stream-info">
                        <h3 class="live-stream-title">${stream.show.title}</h3>
                        <p class="live-stream-description">${stream.show.description}</p>
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
                track.appendChild(card);
            });

            initLiveCarousel();
        } else {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center; width: 100%;">No live streams available</p>';
        }
    } catch (error) {
        console.error('Error loading live streams:', error);
        const container = document.getElementById('live-streams-container');
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; width: 100%;">Failed to load live streams</p>';
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Carousel functionality
    initCarousel();
    
    // Modal functionality
    initModal();
    
    // Smooth scrolling for CTA button
    initSmoothScrolling();
    
    // Load live shows
    loadLiveStreaming();
    
    // Load upcoming shows
    loadUpcomingShows();
});

// Carousel Functionality
function initCarousel() {
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    const cards = track.querySelectorAll('.show-card');
    if (cards.length === 0) return;
    
    // Get computed gap between cards
    const gap = parseInt(window.getComputedStyle(track).gap) || 0;
    const cardWidth = cards[0].offsetWidth + gap;
    
    prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });
    
    // Optional: Snap to nearest card on scroll end (for manual scroll)
    let isScrolling;
    track.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            // Find the closest card
            const scrollLeft = track.scrollLeft;
            const index = Math.round(scrollLeft / cardWidth);
            track.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
        }, 100);
    });
}


function initLiveCarousel() {
    const track = document.getElementById('live-carousel-track');
    const prevBtn = document.getElementById('live-prev-btn');
    const nextBtn = document.getElementById('live-next-btn');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    const cards = track.querySelectorAll('.live-carousel-card');
    if (cards.length === 0) return;


    const cardWidth = cards[0].offsetWidth + parseInt(window.getComputedStyle(track).gap || 0);
    let currentIndex = 0;

    function scrollToCard(idx) {
        const maxIdx = cards.length - 1;
        currentIndex = Math.max(0, Math.min(idx, maxIdx));
        track.scrollTo({ left: currentIndex * cardWidth, behavior: 'smooth' });
    }

    prevBtn.addEventListener('click', () => {
        scrollToCard(currentIndex - 1);
    });
    nextBtn.addEventListener('click', () => {
        scrollToCard(currentIndex + 1);
    });

    // Snap to nearest card on scroll end
    let isScrolling;
    track.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            const scrollLeft = track.scrollLeft;
            const idx = Math.round(scrollLeft / cardWidth);
            scrollToCard(idx);
        }, 100);
    });
 
    scrollToCard(0);
}

// Modal Functionality
function initModal() {
    const modal = document.getElementById('tradition-modal');
    const closeBtn = document.querySelector('.close-modal');
    const traditionCards = document.querySelectorAll('.tradition-card');
    
    if (!modal || !closeBtn) return;
    
    // Tradition data for modal content
    const traditionData = {
        'lakhon-preah': {
            title: "Lakhon Preah Reach Trop",
            image: "images/Lakhon Preah Reach Trop.jpg",
            description: `
                <p><strong>Royal Heritage:</strong> Lakhon Preah Reach Trop is the most sacred and refined form of Cambodian classical dance, traditionally performed exclusively for royalty and in the sacred halls of palaces. This divine art form represents the pinnacle of Khmer cultural achievement.</p>
                
                <p><strong>Sacred Performance:</strong> Every movement, gesture, and expression in this dance carries deep spiritual meaning. The performers, adorned in elaborate golden costumes and intricate headdresses, embody celestial beings and divine characters from ancient mythology.</p>
                
                <p><strong>Purpose & Function:</strong> Served as spiritual offerings to the gods and ancestors, entertainment for royal courts, and preservation of sacred stories. Performances were believed to bring blessings, prosperity, and divine protection to the kingdom.</p>
                
                <p><strong>Cultural Preservation:</strong> This royal dance tradition nearly disappeared during the Khmer Rouge era but has been carefully revived and preserved through the dedication of master artists and cultural guardians who risked their lives to protect this precious heritage.</p>
            `
        },
        'lakhon-pol-srey': {
            title: "Lakhon Pol Srey",
            image: "images/Lakhon Pol Srey.jpeg",
            description: `
                <p><strong>Feminine Artistry:</strong> Lakhon Pol Srey celebrates the grace and elegance of feminine expression in Cambodian classical dance. This art form emphasizes the delicate beauty and sophisticated movements that embody the ideals of Khmer womanhood.</p>
                
                <p><strong>Story & Purpose:</strong> These performances tell stories of noble ladies, celestial princesses, and heroic women from Cambodian literature. The dances serve to preserve tales of feminine virtue, wisdom, and strength while showcasing the refined culture of the Khmer people.</p>
                
                <p><strong>Artistic Technique:</strong> Characterized by intricate hand movements (kbach), subtle facial expressions, and flowing costume work. Every gesture carries meaning, from the positioning of fingers to the tilt of the head, creating a visual poetry that speaks without words.</p>
                
                <p><strong>Cultural Significance:</strong> Beyond entertainment, Lakhon Pol Srey serves as a vehicle for moral education, teaching young women about proper conduct, cultural values, and the importance of maintaining grace under pressure through the stories portrayed.</p>
            `
        },
        'lakhon-bassac': {
            title: "Lakhon Bassac",
            image: "images/Lakhon bassac.jpg",
            description: `
                <p><strong>People's Theater:</strong> Lakhon Bassac emerged in the early 20th century as a more accessible form of theater for common people. Unlike the elite court dances, this folk opera brought entertainment and moral lessons directly to villages and communities throughout Cambodia.</p>
                
                <p><strong>Story & Themes:</strong> The performances combine traditional Khmer stories with contemporary social issues, love stories, and moral tales. These productions often feature themes of justice, family honor, social inequality, and the struggles of everyday life that resonate with ordinary people.</p>
                
                <p><strong>Performance Style:</strong> Incorporates singing, dancing, music, and dialogue in a theatrical format. The costumes are colorful but less elaborate than court dances, making the art form economically accessible while maintaining cultural authenticity.</p>
                
                <p><strong>Social Purpose:</strong> Serves as both entertainment and education, addressing social problems, promoting moral values, and preserving Cambodian culture in a format that appeals to all social classes. It became a powerful medium for social commentary and cultural preservation.</p>
            `
        },
        'lakhon-niyeay': {
            title: "Lakhon Niyeay",
            image: "images/Lakhon niyeay.jpg",
            description: `
                <p><strong>Spoken Drama:</strong> Lakhon Niyeay represents the evolution of Cambodian theater into modern dramatic form, emphasizing dialogue, character development, and realistic storytelling. This theatrical tradition bridges ancient performance arts with contemporary dramatic expression.</p>
                
                <p><strong>Story & Content:</strong> These productions focus on complex human relationships, social issues, historical events, and moral dilemmas. The stories often explore themes of love, betrayal, family conflict, political intrigue, and the human condition in both historical and modern contexts.</p>
                
                <p><strong>Artistic Approach:</strong> Unlike dance-heavy traditional forms, Lakhon Niyeay emphasizes acting skills, vocal expression, and dramatic timing. Performers use naturalistic movements and contemporary staging techniques while maintaining respect for Cambodian cultural values.</p>
                
                <p><strong>Educational Purpose:</strong> Serves as a platform for social commentary, historical education, and moral instruction. These performances address contemporary issues while preserving important cultural stories, making them relevant to modern audiences seeking both entertainment and enlightenment.</p>
            `
        },
        lakhon: {
            title: "Lakhon Khol",
            image: "https://via.placeholder.com/400x300/8B4513/FFD700?text=Lakhon+Khol+Detail",
            description: `
                <p><strong>Historical Origins:</strong> Dating back to the Angkor period, Lakhon Khol is a masked dance drama that depicts stories from the Reamker, the Cambodian version of the Indian epic Ramayana.</p>
                
                <p><strong>Cultural Significance:</strong> This art form preserves ancient moral teachings and Buddhist values through dramatic storytelling, serving as both entertainment and moral instruction.</p>
                
                <p><strong>Ritual Elements:</strong> Before each performance, sacred rituals are conducted to honor the spirits and seek protection. The masks themselves are considered sacred objects with spiritual power.</p>
                
                <p><strong>Performance Style:</strong> Combines elaborate choreography, traditional music, and ornate masks to bring epic tales to life, with each character having distinct movements and symbolic meaning.</p>
            `
        },
        peacock: {
            title: "The Peacock Dance",
            image: "https://via.placeholder.com/400x300/8B4513/FFD700?text=Peacock+Dance+Detail",
            description: `
                <p><strong>Natural Inspiration:</strong> Inspired by the graceful movements of peacocks, this dance celebrates the beauty of nature and the harmony between humans and the natural world.</p>
                
                <p><strong>Symbolic Meaning:</strong> The peacock represents beauty, prosperity, and good fortune in Cambodian culture. The dance embodies these qualities through fluid, elegant movements.</p>
                
                <p><strong>Artistic Expression:</strong> Dancers wear vibrant costumes with feather-like elements and use fans to mimic the peacock's magnificent tail display.</p>
                
                <p><strong>Cultural Context:</strong> Often performed during harvest festivals and New Year celebrations to bring good luck and prosperity to the community.</p>
            `
        },
        yike: {
            title: "Yike Theater",
            image: "https://via.placeholder.com/400x300/8B4513/FFD700?text=Yike+Theater+Detail",
            description: `
                <p><strong>Folk Tradition:</strong> Yike is a popular folk theater form that emerged in rural Cambodia, combining singing, dancing, acting, and instrumental music to tell stories of love, heroism, and moral lessons.</p>
                
                <p><strong>Community Art:</strong> Unlike royal court dances, Yike belongs to the people and reflects everyday life, local legends, and folk wisdom passed down through generations.</p>
                
                <p><strong>Interactive Performance:</strong> Audiences often participate by singing along, clapping, and responding to performers, creating a dynamic and engaging theatrical experience.</p>
                
                <p><strong>Cultural Preservation:</strong> Yike plays a crucial role in preserving Cambodian language, music, and storytelling traditions, especially in rural communities.</p>
            `
        },
        shadow: {
            title: "Sbek Thom (Shadow Puppetry)",
            image: "https://via.placeholder.com/400x300/8B4513/FFD700?text=Shadow+Puppetry+Detail",
            description: `
                <p><strong>Ancient Art Form:</strong> Sbek Thom uses large leather puppets to create shadow plays, with stories primarily from the Reamker epic. This art form dates back over 1,000 years.</p>
                
                <p><strong>Sacred Tradition:</strong> Performances often begin with ceremonies honoring ancestors and spirits. The puppets themselves are crafted with sacred materials and blessed before use.</p>
                
                <p><strong>Artistic Craftsmanship:</strong> Each puppet is hand-carved from cow hide and intricately decorated. Master artisans spend months creating a single puppet with detailed ornamentation.</p>
                
                <p><strong>Storytelling Medium:</strong> The interplay of light and shadow, combined with traditional music and narration, creates a mystical atmosphere that transports audiences to ancient mythical worlds.</p>
            `
        }
    };
    
    // Add click listeners to tradition cards
    traditionCards.forEach(card => {
        const seeMoreBtn = card.querySelector('.see-more-btn');
        if (seeMoreBtn) {
            seeMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const tradition = card.getAttribute('data-tradition');
                if (traditionData[tradition]) {
                    showModal(traditionData[tradition]);
                }
            });
        }
    });
    
    // Close modal functionality
    closeBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    function showModal(data) {
        const modalImage = document.getElementById('modal-image');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        
        if (modalImage && modalTitle && modalDescription) {
            modalImage.src = data.image;
            modalImage.alt = data.title;
            modalTitle.textContent = data.title;
            modalDescription.innerHTML = data.description;
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }
    
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = ctaButton.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Add booking functionality to show cards
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('book-btn')) {
        e.preventDefault();
        const showCard = e.target.closest('.show-card');
        const showTitle = showCard.querySelector('h3').textContent;
        const showDate = showCard.querySelector('.show-date').textContent;
        const showTime = showCard.querySelector('.show-time').textContent;
        
        alert(`Booking ${showTitle}\nDate: ${showDate}\nTime: ${showTime}\n\n(In a real application, this would open the booking system)`);
    }
});

// Function to navigate to show details page
function navigateToShowDetails(showId) {
    if (showId) {
        // Navigate to show-details.html with the show ID as a URL parameter
        window.location.href = `show-details.html?id=${showId}`;
    } else {
        console.error('Show ID not provided for navigation');
    }
} 