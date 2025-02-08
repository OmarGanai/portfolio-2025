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
                        <span class="arrow">▾</span>
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
}); 