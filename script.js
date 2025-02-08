document.addEventListener('DOMContentLoaded', () => {
    // Get both desktop and mobile dropdowns
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');

    // Add click handlers for all dropdown toggles
    dropdownToggles.forEach((dropdownToggle, index) => {
        const dropdownMenu = dropdownMenus[index];

        // Toggle dropdown menu when clicking the button
        dropdownToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from bubbling to document
            
            // Close all other dropdowns first
            dropdownMenus.forEach((menu, i) => {
                if (i !== index) {
                    menu.classList.remove('active');
                    dropdownToggles[i].setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle this dropdown
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
                dropdownMenus.forEach(menu => {
                    menu.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                });
                link.classList.add('active');
                
                // Update all dropdown toggle buttons
                dropdownToggles.forEach(toggle => {
                    toggle.textContent = selectedText;
                    const arrow = document.createElement('span');
                    arrow.className = 'arrow';
                    arrow.textContent = '▼';
                    toggle.appendChild(arrow);
                });
                
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
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdownMenus.forEach(menu => {
                menu.classList.remove('active');
            });
            dropdownToggles.forEach(toggle => {
                toggle.setAttribute('aria-expanded', 'false');
            });
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
}); 