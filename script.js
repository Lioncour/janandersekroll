// Add project configurations at the top of the file
const projectsConfig = {
    'medical-projects': {
        title: 'A bunch of medical projects',
        description: 'Did a lot of various projects all revolving around healthcare products of some sort. Super happy to use the whole range of the design landscape, including package design, service design, industrial design and a lot of UX/UI design.',
        folder: 'A bunch of medical projects'
    },
    'funny-project': {
        title: 'Funny project',
        description: 'Experimental design explorations with a twist. A collection of unconventional design experiments that challenge traditional approaches.',
        folder: 'Funny project'
    },
    'fylgja': {
        title: 'Fylgja',
        description: 'An app that alerts you when you have coverage in the mountains(and other places) The idea came when we whre out on a snowcave expedition, and we needed to go up to the nearest mountain to see if we could get coverage. It is super annoying to pull out the phone very few hundred meters to check. This app sings a tune and vibrates to alert you if you get phone coverage.'
    },
    'lego': {
        title: 'Lego',
        description: 'Was lucky enough to work on a couple of projects for LEGO. Super fun, I do believe one of the projects made it into the store in the end :D Had to sign a bunch of NDAs so not really allowed to show much :('
    },
    'master-thesis': {
        title: 'Master Thesis at The Oslo School of Architecture and Design',
        folder: 'Master Thesis',
        images: true,  // Enable dynamic image loading
        description: 'The title of my diploma was "The creation and exploration of new tangible interactive game mechanics. i was looking at hwo we could expand old games with new mechanics and create new mechanics for new games.'
    },
    'Oslonøkkelen': {
        title: 'Oslonøkkelen',
        folder: 'Oslonøkkelen',
        description: 'Vært så heldig å jobbe med Oslonøkkelen i en haug med år.\n\n' + 
            'Som er en digital nøkkel som gir deg utvidet og enklere tilgang til flere av byens lokaler og tjenester via en app på din mobiltelefon.\n\n' + 
            'Vært med på hele reisen og fikk gjort så utrolig mye forskjellige sammen med de aller beste folkene.',
        videos: [
            'https://www.youtube.com/embed/U3mbjSVsb1c'
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Load preview images
    Object.entries(projectsConfig).forEach(([projectId, config]) => {
        if (config.folder) {
            const previewImg = document.querySelector(`[data-project="${projectId}"] .project-preview img`);
            if (previewImg) {
                // Try both png and jpg for the preview
                const tryLoadPreview = (ext) => {
                    const tempImg = new Image();
                    tempImg.onload = () => {
                        previewImg.src = tempImg.src;
                    };
                    tempImg.src = `content/projects/${config.folder}/images/01.${ext}`;
                };
                
                tryLoadPreview('png');
                tryLoadPreview('jpg');
            }
        }
    });

    // Category click handlers
    const categories = document.querySelectorAll('.category h2');
    categories.forEach(category => {
        category.addEventListener('click', () => {
            const content = category.nextElementSibling;
            content.classList.toggle('active');
        });
    });

    // Subcategory click handlers
    const subcategories = document.querySelectorAll('.subcategory h3');
    subcategories.forEach(subcategory => {
        subcategory.addEventListener('click', () => {
            const content = subcategory.nextElementSibling;
            content.classList.toggle('active');
        });
    });

    // Project title click handlers
    const projectTitles = document.querySelectorAll('.project-title');
    projectTitles.forEach(title => {
        title.addEventListener('click', () => {
            const projectId = title.getAttribute('data-project');
            const projectDetails = document.getElementById(projectId);
            const projectConfig = projectsConfig[projectId];
            
            if (projectDetails.classList.contains('active')) {
                projectDetails.classList.remove('active');
            } else {
                document.querySelectorAll('.project-details').forEach(d => {
                    d.classList.remove('active');
                });
                projectDetails.classList.add('active');
                
                // Update project description
                const descElement = projectDetails.querySelector('.project-desc');
                if (descElement && projectConfig) {
                    descElement.textContent = projectConfig.description;
                }

                // Load images dynamically for specific projects
                if (projectId === 'medical-projects' || projectId === 'fylgja' || projectId === 'Oslonøkkelen' || projectId === 'master-thesis') {
                    const imagesContainer = projectDetails.querySelector('.project-images');
                    if (imagesContainer && imagesContainer.children.length === 0) {
                        // Add videos if they exist
                        if (projectConfig.videos && projectConfig.videos.length > 0) {
                            projectConfig.videos.forEach(videoUrl => {
                                // Convert YouTube URLs to embed format if needed
                                const embedUrl = videoUrl.includes('embed') 
                                    ? videoUrl 
                                    : videoUrl.replace('youtu.be/', 'www.youtube.com/embed/');

                                const videoContainer = document.createElement('div');
                                videoContainer.className = 'video-container';
                                videoContainer.innerHTML = `
                                    <iframe 
                                        width="560" 
                                        height="315" 
                                        src="${embedUrl}"
                                        title="YouTube video player" 
                                        frameborder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowfullscreen>
                                    </iframe>
                                `;
                                imagesContainer.insertBefore(videoContainer, imagesContainer.firstChild);
                            });
                        }

                        const projectFolder = projectId === 'medical-projects' 
                            ? 'A bunch of medical projects'
                            : projectId === 'fylgja'
                                ? 'Fylgja'
                                : projectId === 'Oslonøkkelen'
                                    ? 'Oslonøkkelen'
                                    : 'Master Thesis';
                        
                        for(let i = 1; i <= 99; i++) {
                            const paddedIndex = String(i).padStart(2, '0');
                            const extensions = ['png', 'jpg', 'jpeg', 'gif'];  // Add GIF support
                            
                            extensions.forEach(ext => {
                                const img = new Image();
                                img.src = `content/projects/${projectFolder}/images/${paddedIndex}.${ext}`;
                                console.log('Trying to load:', img.src); // Debug loading
                                img.onload = function() {
                                    console.log('Successfully loaded:', img.src); // Debug success
                                    img.alt = `${projectConfig.title} Image ${i}`;
                                    img.loading = 'lazy';
                                    img.className = 'modal-trigger';
                                    imagesContainer.appendChild(img);
                                };
                                img.onerror = function() {
                                    console.log('Failed to load:', img.src); // Debug failures
                                };
                            });
                        }
                    }
                }
            }
        });
    });

    // Image click handler - combine both project and other images
    document.addEventListener('click', (e) => {
        if (e.target.matches('.project-images img, .other-grid img')) {
            const img = e.target;
            modalImg.src = img.src;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    });

    // Load other images
    const otherGrid = document.querySelector('.other-grid');
    if (otherGrid) {
        const otherImages = [
            '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg',
            '20190501_153758.jpg',
            '20190909_091540_1.gif',
            'Drap & Design_Page_02_Image_0001.jpg',
            'Drap & Design_Page_03_Image_0001.jpg',
            'Drap & Design_Page_05_Image_0001.jpg',
            'Drap & Design_Page_06_Image_0001.jpg',
            'Drap & Design_Page_07_Image_0001.jpg',
            'Drap & Design_Page_08_Image_0001.jpg',
            'Drap & Design_Page_09_Image_0001.jpg',
            'Drap & Design_Page_10_Image_0001.jpg',
            'Drap & Design_Page_11_Image_0001.jpg',
            'Drap & Design_Page_16_Image_0001.jpg',
            'Drap & Design_Page_17_Image_0001.jpg',
            'Drap & Design_Page_19_Image_0001.jpg',
            'Drap & Design_Page_20_Image_0001.jpg',
            'DSC_0182.JPG',
            'DSC_0221 (2).JPG',
            'DSC_0248.JPG',
            'DSC02769.jpg',
            'DSC03099.jpg',
            'DSC05914.jpg',
            'DSC07491.jpg',
            'DSC07652-2.jpg',
            'DSC07693.jpg',
            'DSC08029.jpg',
            'DSC09074.jpg',
            'folding_1.gif',
            'folding.gif',
            'gutta.png',
            'IMG_4220.JPG',
            'IMG_4808.JPG',
            'IMG_5561.JPG',
            'InstagramCapture_6c34ffbe-09b4-489e-8b6e-82724d3fe82e.jpg',
            'Jan Anders Ekroll IDE Diploma Report Til print with bleed_Page_054_Image_0001.jpg',
            'Jan Anders Ekroll IDE Diploma Report Til print with bleed_Page_055_Image_0001.jpg',
            'Jan Anders Ekroll IDE Diploma Report Til print with bleed_Page_056_Image_0001.jpg',
            'litenku.jpg',
            'skull_2.png',
            'WP_20131229_001.jpg',
            'WP_20140611_003.jpg',
            'WP_20140616_015.jpg',
            'WP_20150412_005.jpg',
            'WP_20150412_008.jpg',
            'WP_20160729_22_11_37_Pro.jpg'
        ];
        
        // Load all images at once but with lazy loading
        otherImages.forEach(imageName => {
            const img = new Image();
            img.src = `content/other/${imageName}`;
            img.alt = 'Other Project Image';
            img.loading = 'lazy';
            img.className = 'modal-trigger';
            otherGrid.appendChild(img);  // Append immediately to maintain order
        });
    }

    // Newsletter form handler
    const newsletterForm = document.querySelector('form[name="newsletter"]');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default page reload/redirect

            const button = newsletterForm.querySelector('button');
            const formData = new FormData(newsletterForm);
            const confirmationDiv = document.getElementById('newsletter-confirmation');
            const emailInput = newsletterForm.querySelector('input[name="email"]');

            // Change button state while submitting
            button.textContent = 'Submitting...';
            button.disabled = true;

            fetch("/", { // Submit to the same path (Netlify requirement for AJAX)
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString(),
            })
            .then(() => {
                // Success!
                emailInput.style.display = 'none'; // Hide input
                button.style.display = 'none'; // Hide button
                confirmationDiv.style.display = 'block'; // Show confirmation message

                // Trigger confetti
                confetti({
                    particleCount: 150,
                    spread: 90,
                    origin: { y: 0.6 }
                });

                // Optional: Reset form/hide confirmation after a delay
                // setTimeout(() => {
                //    confirmationDiv.style.display = 'none';
                //    emailInput.style.display = 'block';
                //    emailInput.value = ''; // Clear input
                //    button.style.display = 'block';
                //    button.textContent = 'Subscribe';
                //    button.disabled = false;
                // }, 5000); // Reset after 5 seconds

            }).catch((error) => {
                // Handle errors
                console.error('Form submission error:', error);
                confirmationDiv.textContent = 'Oops! Something went wrong. Please try again.';
                confirmationDiv.style.display = 'block';
                confirmationDiv.style.color = 'red'; // Indicate error
                button.textContent = 'Subscribe'; // Reset button
                button.disabled = false;
            });
        });
    }

    // Cursor effect
    const SVGNS = 'http://www.w3.org/2000/svg';
    const EASE = 0.3;  // Make it more fluid
    
    const pointer = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    };
    
    function updatePointer(event) {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
    }
    
    function createLine(leader) {
        const line = document.createElementNS(SVGNS, 'line');
        
        const get = gsap.getProperty(line);
        const set = gsap.quickSetter(line, 'attr');
        
        const genModifier = (prop) => {
            const pos2 = `${prop}2`;
            
            return () => {
                const linePos = get(prop);
                const leaderPos = leader(prop);
                
                // Create smoother movement
                const linePosNext = linePos + (leaderPos - linePos) * EASE * (1 + Math.random() * 0.2);
                
                set({[pos2]: leaderPos - linePosNext});
                
                return linePosNext;
            }
        };
        
        gsap.set(line, pointer);
        
        gsap.to(line, {
            x: '+=1',
            y: '+=1',
            repeat: -1,
            ease: 'power1.out',
            modifiers: {
                x: genModifier('x'),
                y: genModifier('y')
            }
        });  
        
        return line;
    }
    
    function createTrail(color, length = 10) {  
        const svg = document.querySelector('.cursor-trail');
        svg.innerHTML = '';
    
        let leader = (prop) => prop === 'x' ? pointer.x : pointer.y;
    
        for (let i = 0; i < length; i++) {
            const line = createLine(leader);
            const progress = i / length;
            let hue;
            let saturation = 100;
            let lightness = 70;
            let opacity = 1;  // Solid colors, no transparency

            if (progress < 0.25) {
                hue = 270;  // Light pastel purple
                saturation = 60;
                lightness = 85;
            } else if (progress < 0.5) {
                hue = 60;   // Pastel yellow
                saturation = 70;
                lightness = 88;
            } else if (progress < 0.75) {
                hue = 55;   // Brighter yellow
                saturation = 85;
                lightness = 75;
            } else {
                hue = 50;   // Golden yellow
                saturation = 100;
                lightness = 70;
            }
            line.style.stroke = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            line.style.strokeWidth = '24';
            if (i > 0) {
                line.style.strokeLinecap = 'round';
                line.style.strokeLinejoin = 'round';
            }
            svg.appendChild(line);
            leader = gsap.getProperty(line);
        }
    }
    
    // Initialize cursor effect
    window.addEventListener('pointerdown', updatePointer);
    window.addEventListener('pointermove', updatePointer);
    createTrail(null, 35);  // Shorter trail
    
    // Toggle cursor effect
    const cursorToggle = document.getElementById('cursor-toggle');
    let isEnabled = true;
    
    cursorToggle.addEventListener('click', () => {
        const svg = document.querySelector('.cursor-trail');
        if (isEnabled) {
            svg.style.display = 'none';
        } else {
            svg.style.display = 'block';
            createTrail(null, 35);
        }
        isEnabled = !isEnabled;
    });

    // Profile image fireworks effect
    function createParticle(x, y, color) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.backgroundColor = color;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        document.body.appendChild(particle);
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 1 + Math.random() * 5;
        const lifetime = 1000 + Math.random() * 1000;
        
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        let opacity = 1;
        
        const animate = () => {
            const x = parseFloat(particle.style.left);
            const y = parseFloat(particle.style.top);
            particle.style.left = (x + vx) + 'px';
            particle.style.top = (y + vy) + 'px';
            opacity -= 0.02;
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    function createFireworks(x, y) {
        const colors = ['#FF69B4', '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C'];
        for (let i = 0; i < 50; i++) {
            createParticle(x, y, colors[Math.floor(Math.random() * colors.length)]);
        }
    }
    
    // Add click handler for profile image
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        profileImage.addEventListener('click', (e) => {
            const rect = e.target.getBoundingClientRect();
            createFireworks(rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
    }
});

// Modal functionality - move outside DOMContentLoaded
const modal = document.querySelector('.modal');
const modalImg = modal.querySelector('img');
const modalClose = modal.querySelector('.modal-close');

modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target === modalClose) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// Keep your existing projectsConfig and other functions below 