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

    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        // 기존 Login/Profile 메뉴 제거
        const oldLogin = navLinks.querySelector('a[href="login.html"]')?.parentElement;
        const oldProfile = navLinks.querySelector('a[href="profile.html"]')?.parentElement;
        if (oldLogin) navLinks.removeChild(oldLogin);
        if (oldProfile) navLinks.removeChild(oldProfile);

        // 동적으로 추가
        let loginItem = navLinks.querySelector('.nav-login-profile');
        if (!loginItem) {
            loginItem = document.createElement('li');
            loginItem.className = 'nav-login-profile';
            navLinks.appendChild(loginItem);
        }
        function updateNavLoginProfile() {
            const token = localStorage.getItem('token');
            if (token) {
                loginItem.innerHTML = '<a href="profile.html">Profile</a>';
            } else {
                loginItem.innerHTML = '<a href="login.html">Login</a>';
            }
        }
        updateNavLoginProfile();
    }
});