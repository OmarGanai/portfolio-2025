document.addEventListener('DOMContentLoaded', () => {
    // Get both desktop and mobile dropdowns
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    const dropdowns = document.querySelectorAll('.dropdown, .mobile-dropdown');

    // Add click handlers for all dropdown toggles
    dropdownToggles.forEach((toggle, index) => {
        const menu = dropdownMenus[index];
        const dropdown = dropdowns[index];

        // Toggle dropdown menu when clicking the button
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();  // Prevent click from bubbling
            
            // Close all other dropdowns first
            dropdownMenus.forEach((m, i) => {
                if (i !== index) {
                    m.classList.remove('active');
                    dropdowns[i].classList.remove('active');
                }
            });

            // Toggle this dropdown
            menu.classList.toggle('active');
            dropdown.classList.toggle('active');
        });

        // Update dropdown button text when option is selected
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedText = link.textContent;
                
                // Update active state
                dropdownMenus.forEach(menu => {
                    menu.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                });
                link.classList.add('active');
                
                // Update all dropdown toggle buttons
                dropdownToggles.forEach(toggle => {
                    toggle.innerHTML = `
                        <span class="arrow">⌄</span>
                        <span class="toggle-text">${selectedText}</span>
                    `;
                });
                
                // Close dropdown
                menu.classList.remove('active');
                dropdown.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');

                // Handle navigation
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
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            });
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown') && !e.target.closest('.mobile-dropdown')) {
            dropdownMenus.forEach(menu => menu.classList.remove('active'));
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });

    // Handle keyboard navigation
    dropdownToggles.forEach((toggle, index) => {
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const menu = dropdownMenus[index];
                menu.classList.toggle('active');
                toggle.setAttribute('aria-expanded', 
                    menu.classList.contains('active'));
            }
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    const toggleButton = document.querySelector('.toggle-button');
    const metricsContent = document.querySelector('.metrics-content');
    const metricsToggle = document.querySelector('.metrics-toggle');
    
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            metricsContent.classList.toggle('hidden');
            metricsToggle.classList.toggle('active');
            toggleButton.textContent = metricsContent.classList.contains('hidden') 
                ? '> Tell me more' 
                : '< Show less';
        });
    }

    // Theme switching functionality
    const themeButtons = document.querySelectorAll('.theme-btn');
    const root = document.documentElement;

    // Set initial theme based on localStorage or system preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Add click handlers to all theme buttons
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    });

    function setTheme(theme) {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    // Handle active section in navigation
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const mobileMenuLinks = document.querySelectorAll('.mobile-dropdown .dropdown-menu a');
    
    function setActiveSection() {
        const fromTop = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Check if section is in viewport
            if (window.scrollY + window.innerHeight > section.offsetTop + 100) {
                section.classList.add('visible');
            }
            
            if (fromTop >= sectionTop && fromTop <= sectionTop + sectionHeight) {
                const id = section.getAttribute('id');
                // Remove active class from all sections
                sections.forEach(s => s.classList.remove('active'));
                // Add active class to current section
                section.classList.add('active');
                
                // Update desktop nav
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
                // Update mobile nav
                mobileMenuLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Initial check
    setActiveSection();
    
    // Update on scroll
    window.addEventListener('scroll', () => {
        requestAnimationFrame(setActiveSection);
    });

    // Add click handler for portfolio card theme toggle
    const portfolioThemeBtn = document.querySelector('.toggle-theme-btn');
    if (portfolioThemeBtn) {
        portfolioThemeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentTheme = root.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }
}); 