document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    menuToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', 
            mobileNav.classList.contains('active'));
    });

    // Desktop dropdown toggle
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (dropdownToggle && dropdownMenu) {
        // Toggle dropdown menu when clicking the button
        dropdownToggle.addEventListener('click', () => {
            const isExpanded = dropdownMenu.classList.contains('active');
            dropdownMenu.classList.toggle('active');
            dropdownToggle.setAttribute('aria-expanded', !isExpanded);
        });

        // Update dropdown button text when option is selected
        dropdownMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedText = link.textContent;
                
                // Update active state
                dropdownMenu.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
                
                // Update button text
                dropdownToggle.textContent = selectedText;
                const arrow = document.createElement('span');
                arrow.className = 'arrow';
                arrow.textContent = '▼';
                dropdownToggle.appendChild(arrow);
                
                // Close dropdown
                dropdownMenu.classList.remove('active');
                dropdownToggle.setAttribute('aria-expanded', 'false');

                // Only scroll if it's not the "All posts" option
                if (selectedText !== 'All posts') {
                    const targetId = link.getAttribute('href');
                    const target = document.querySelector(targetId);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                } else {
                    // Scroll to top for "All posts" option
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('active');
                dropdownToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Handle keyboard navigation
        dropdownToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dropdownMenu.classList.toggle('active');
                dropdownToggle.setAttribute('aria-expanded', 
                    dropdownMenu.classList.contains('active'));
            }
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                // Close mobile menu if open
                mobileNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');

                // Smooth scroll to target
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}); 