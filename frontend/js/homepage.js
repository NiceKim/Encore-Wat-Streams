// Homepage JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Carousel functionality
    initCarousel();
    
    // Modal functionality
    initModal();
    
    // Smooth scrolling for CTA button
    initSmoothScrolling();
    
    // Check for live shows (simulated)
    checkLiveShows();
});

// Carousel Functionality
function initCarousel() {
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    const cards = track.querySelectorAll('.show-card');
    const cardWidth = cards[0].offsetWidth + 32; // 32px for gap
    let currentIndex = 0;
    const maxIndex = Math.max(0, cards.length - Math.floor(track.parentElement.offsetWidth / cardWidth));
    
    function updateCarousel() {
        const translateX = -currentIndex * cardWidth;
        track.style.transform = `translateX(${translateX}px)`;
        
        // Update button states
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
    }
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // Initialize carousel
    updateCarousel();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const newMaxIndex = Math.max(0, cards.length - Math.floor(track.parentElement.offsetWidth / cardWidth));
        if (currentIndex > newMaxIndex) {
            currentIndex = newMaxIndex;
        }
        updateCarousel();
    });
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

// Live Shows Simulation
function checkLiveShows() {
    const liveCard = document.getElementById('live-card');
    const noLiveMessage = document.getElementById('no-live');
    
    if (!liveCard || !noLiveMessage) return;
    
    // Simulate checking for live shows (in a real app, this would be an API call)
    const hasLiveShow = Math.random() > 0.7; // 30% chance of live show
    
    if (hasLiveShow) {
        liveCard.style.display = 'flex';
        noLiveMessage.style.display = 'none';
        
        // Add click handler for Watch Live button
        const watchBtn = liveCard.querySelector('.watch-live-btn');
        if (watchBtn) {
            watchBtn.addEventListener('click', () => {
                alert('Redirecting to live stream...\n(In a real application, this would open the live stream player)');
            });
        }
    } else {
        liveCard.style.display = 'none';
        noLiveMessage.style.display = 'block';
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

// Add navigation highlighting
window.addEventListener('scroll', () => {
    const sections = ['home', 'live-streaming', 'upcoming', 'traditions'];
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    const headerHeight = document.querySelector('.main-header').offsetHeight;
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentSection = sectionId;
            }
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}); 