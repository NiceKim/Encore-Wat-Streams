// Navigation and Page Transitions
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.main-header');
    
    // Ensure navigation is always visible
    header.style.display = 'flex';

    // Add page transition element
    const transitionElement = document.createElement('div');
    transitionElement.className = 'page-transition';
    document.body.appendChild(transitionElement);

    // Handle navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle external page links (not hash links)
            if (!this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetHref = this.getAttribute('href');

                // Start transition
                document.body.classList.add('fade-out');
                transitionElement.classList.add('active');

                // Navigate after transition
                setTimeout(() => {
                    window.location.href = targetHref;
                }, 300);
            }
        });
    });

    // Handle page load
    window.addEventListener('pageshow', function(event) {
        // Remove transition effects
        document.body.classList.remove('fade-out');
        transitionElement.classList.remove('active');
    });

    // Handle back/forward navigation
    window.addEventListener('popstate', function() {
        document.body.classList.remove('fade-out');
        transitionElement.classList.remove('active');
    });
});