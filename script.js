// Add project configurations at the top of the file
const projectsConfig = {
    'medical-projects': {
        title: 'A bunch of medical projects',
        description: 'Did a lot of various projects all revolving around healthcare products of some sort. Super happy to use the whole range of the design landscape, including package design, service design, industrial design and a lot of UX/UI design.',
        folder: 'A bunch of medical projects'
    },
    'fylgja': {
        title: 'Fylgja',
        description: 'An app that alerts you when you have coverage in the mountains (and other places). The idea came when we were out on a snow cave expedition, and we needed to go up to the nearest mountain to see if we could get coverage. It is super annoying to pull out the phone every few hundred meters to check. This app sings a tune and vibrates to alert you if you get phone coverage.'
    },
    'lego': {
        title: 'Lego',
        description: 'Was lucky enough to work on a couple of projects for LEGO. Super fun, I do believe one of the projects made it into the store in the end :D Had to sign a bunch of NDAs so not really allowed to show much :('
    },
    'master-thesis': {
        title: 'Master Thesis at The Oslo School of Architecture and Design',
        folder: 'Master Thesis',
        images: true,  // Enable dynamic image loading
        description: 'The title of my diploma was "The creation and exploration of new tangible interactive game mechanics." I was looking at how we could expand old games with new mechanics and create new mechanics for new games.',
        videos: [
            'https://youtu.be/rBf26crYyzk',
            'https://youtu.be/hdXjrF_VJCw',
            'https://youtu.be/yCdMQvk3J3M',
            'https://youtu.be/4e6rzrU7W-I',
            'https://youtu.be/Rv6znMOP-Ws'
        ]
    },
    'Oslonøkkelen': {
        title: 'Oslonøkkelen',
        folder: 'Oslonøkkelen',
        description: 'Vært så heldig å jobbe med Oslonøkkelen i en haug med år.\n\n' + 
            'Som er en digital nøkkel som gir deg utvidet og enklere tilgang til flere av byens lokaler og tjenester via en app på din mobiltelefon.\n\n' + 
            'Vært med på hele reisen og fikk gjort så utrolig mye forskjellige sammen med de aller beste folkene.',
        videos: [
            'content/projects/Oslonøkkelen/images/Ny_n_kkel_animation_1.gif'
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
                    tempImg.onerror = () => {
                        // Silently fail - image doesn't exist
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
        const toggleCategory = () => {
            const content = category.nextElementSibling;
            const isActive = content.classList.toggle('active');
            category.setAttribute('aria-expanded', isActive);
            // Remove focus outline after click
            category.blur();
        };
        
        category.addEventListener('click', toggleCategory);
        category.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCategory();
            }
        });
    });

    // Subcategory click handlers
    const subcategories = document.querySelectorAll('.subcategory h3');
    subcategories.forEach(subcategory => {
        subcategory.setAttribute('role', 'button');
        subcategory.setAttribute('tabindex', '0');
        subcategory.setAttribute('aria-expanded', 'false');
        
        const toggleSubcategory = () => {
            const content = subcategory.nextElementSibling;
            const isActive = content.classList.toggle('active');
            subcategory.setAttribute('aria-expanded', isActive);
            // Remove focus outline after click
            subcategory.blur();
        };
        
        subcategory.addEventListener('click', toggleSubcategory);
        subcategory.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleSubcategory();
            }
        });
    });

    // Project click handler - simple and reliable
    function handleProjectClick(e) {
        // Don't handle if clicking on category headers
        if (e.target.tagName === 'H2' || e.target.closest('h2')) {
            return;
        }
        
        // First, try to find project-title using elementFromPoint (works even if hidden)
        const x = e.clientX;
        const y = e.clientY;
        
        // Temporarily make all content visible to check
        const allProjectTitles = document.querySelectorAll('.project-title');
        let projectTitle = null;
        let projectId = null;
        
        // Check each project title to see if click is within its bounds
        allProjectTitles.forEach(title => {
            const rect = title.getBoundingClientRect();
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                projectTitle = title;
                projectId = title.getAttribute('data-project');
            }
        });
        
        // Fallback: walk up DOM tree
        if (!projectTitle) {
            let clickedEl = e.target;
            while (clickedEl && clickedEl !== document.body) {
                if (clickedEl.tagName === 'H2' || (clickedEl.classList && clickedEl.classList.contains('category'))) {
                    break;
                }
                if (clickedEl.classList && clickedEl.classList.contains('project-title')) {
                    projectTitle = clickedEl;
                    projectId = clickedEl.getAttribute('data-project');
                    break;
                }
                if (clickedEl.hasAttribute && clickedEl.hasAttribute('data-project')) {
                    projectTitle = clickedEl;
                    projectId = clickedEl.getAttribute('data-project');
                    break;
                }
                if (clickedEl.classList && clickedEl.classList.contains('project-item')) {
                    projectTitle = clickedEl.querySelector('.project-title');
                    if (projectTitle) {
                        projectId = projectTitle.getAttribute('data-project');
                        break;
                    }
                }
                clickedEl = clickedEl.parentElement;
            }
        }
        
        // If we found a project, handle it
        if (projectTitle && projectId) {
            console.log('Opening project:', projectId);
            e.stopPropagation();
            
            // Remove focus outline after click
            if (document.activeElement) {
                document.activeElement.blur();
            }
            projectTitle.blur();
            
            // Open Projects category if closed - do this FIRST
            const projectsCategory = document.querySelector('.category:first-of-type');
            if (projectsCategory) {
                const content = projectsCategory.querySelector('.content');
                const h2 = projectsCategory.querySelector('h2');
                if (content && !content.classList.contains('active')) {
                    console.log('Opening Projects category');
                    content.classList.add('active');
                    if (h2) h2.setAttribute('aria-expanded', 'true');
                    // Wait a moment for display to update
                    setTimeout(() => handleProjectOpen(projectId), 10);
                    return;
                }
            }
            
            // Category is open, proceed immediately
            handleProjectOpen(projectId);
        }
    }
    
    function handleProjectOpen(projectId) {
            
            const projectDetails = document.getElementById(projectId);
            const projectConfig = projectsConfig[projectId];
            
        if (!projectDetails) {
            console.error('Project details element not found:', projectId);
            return;
        }
        
        if (!projectConfig) {
            console.error('Project config not found:', projectId);
            return;
        }
        
        console.log('Found project details and config for:', projectId);
        
        // Toggle project details
            if (projectDetails.classList.contains('active')) {
                projectDetails.classList.remove('active');
            } else {
            // Close all other projects
                document.querySelectorAll('.project-details').forEach(d => {
                    d.classList.remove('active');
                });
            
            // Open this project
                projectDetails.classList.add('active');
                
            // Update description
                const descElement = projectDetails.querySelector('.project-desc');
            if (descElement) {
                    descElement.textContent = projectConfig.description;
                }

            // Load images for projects that need it
                if (projectId === 'medical-projects' || projectId === 'fylgja' || projectId === 'Oslonøkkelen' || projectId === 'master-thesis') {
                    const imagesContainer = projectDetails.querySelector('.project-images');
                    if (imagesContainer && imagesContainer.children.length === 0) {
                    // Add videos and images/GIFs
                        if (projectConfig.videos && projectConfig.videos.length > 0) {
                        projectConfig.videos.forEach((mediaUrl, index) => {
                            // Check if it's an image/GIF file (not a YouTube URL)
                            const isImage = mediaUrl.match(/\.(gif|jpg|jpeg|png|webp)$/i) || 
                                          (!mediaUrl.includes('youtube.com') && !mediaUrl.includes('youtu.be'));
                            
                            if (isImage) {
                                // Create image container for GIF/image
                                const imageContainer = document.createElement('div');
                                imageContainer.className = 'video-container';
                                
                                const img = document.createElement('img');
                                // For GIFs, don't use lazy loading to ensure they play
                                const isGif = mediaUrl.toLowerCase().endsWith('.gif');
                                if (!isGif) {
                                    img.loading = 'lazy';
                                }
                                img.src = mediaUrl;
                                img.alt = `${projectConfig.title} Animation ${index + 1}`;
                                img.style.width = '100%';
                                img.style.height = '100%';
                                img.style.objectFit = 'contain';
                                
                                // Ensure GIFs loop continuously
                                if (isGif) {
                                    img.style.imageRendering = 'auto';
                                    
                                    // Force GIF to loop by reloading the source
                                    // This works by clearing and resetting the src, which restarts the animation
                                    const forceGifLoop = () => {
                                        const currentSrc = img.src;
                                        // Temporarily set to empty, then restore to force restart
                                        img.src = '';
                                        // Use requestAnimationFrame to ensure smooth transition
                                        requestAnimationFrame(() => {
                                            img.src = currentSrc;
                                        });
                                    };
                                    
                                    // Reload the GIF periodically to ensure it keeps looping
                                    // Check if the image is still in the DOM before reloading
                                    let loopInterval = setInterval(() => {
                                        if (!img.parentNode || !document.body.contains(img)) {
                                            clearInterval(loopInterval);
                                            return;
                                        }
                                        forceGifLoop();
                                    }, 2000); // Reload every 2 seconds to ensure continuous looping
                                    
                                    // Also reload once when the image first loads
                                    img.addEventListener('load', function() {
                                        // Small delay to let the GIF start playing
                                        setTimeout(() => {
                                            forceGifLoop();
                                        }, 500);
                                    }, { once: true });
                                }
                                
                                imageContainer.appendChild(img);
                                imagesContainer.insertBefore(imageContainer, imagesContainer.firstChild);
                            } else {
                                // It's a YouTube video
                                let videoId = null;
                                let embedUrl = null;
                                
                                // Extract video ID from various YouTube URL formats
                                if (mediaUrl.includes('youtu.be/')) {
                                    // Short URL: https://youtu.be/VIDEO_ID
                                    videoId = mediaUrl.split('youtu.be/')[1].split('?')[0].split('&')[0].split('#')[0].trim();
                                } else if (mediaUrl.includes('youtube.com/watch?v=')) {
                                    // Standard URL: https://youtube.com/watch?v=VIDEO_ID
                                    videoId = mediaUrl.split('v=')[1].split('&')[0].split('#')[0].trim();
                                } else if (mediaUrl.includes('youtube.com/embed/')) {
                                    // Already embed URL: extract ID
                                    videoId = mediaUrl.split('embed/')[1].split('?')[0].split('&')[0].split('#')[0].trim();
                                } else if (mediaUrl.includes('youtube.com/v/')) {
                                    // Old format: https://youtube.com/v/VIDEO_ID
                                    videoId = mediaUrl.split('v/')[1].split('?')[0].split('&')[0].split('#')[0].trim();
                                }
                                
                                // Validate video ID (YouTube IDs are typically 11 characters)
                                if (!videoId || videoId.length !== 11) {
                                    console.error('Invalid YouTube video ID from URL:', mediaUrl, 'Extracted ID:', videoId);
                                    // Still try to embed, might work
                                }
                                
                                // Build proper embed URL
                                embedUrl = `https://www.youtube.com/embed/${videoId}`;
                                
                                console.log('Embedding video:', embedUrl, 'from original URL:', mediaUrl, 'Video ID:', videoId);

                                const videoContainer = document.createElement('div');
                                videoContainer.className = 'video-container';
                                
                                // Create iframe element directly
                                const iframe = document.createElement('iframe');
                                iframe.setAttribute('src', embedUrl);
                                iframe.setAttribute('width', '560');
                                iframe.setAttribute('height', '315');
                                iframe.setAttribute('title', 'YouTube video player');
                                iframe.setAttribute('frameborder', '0');
                                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                                iframe.setAttribute('allowfullscreen', '');
                                iframe.setAttribute('loading', 'lazy');
                                
                                // Add error handling
                                iframe.onerror = () => {
                                    console.error('Failed to load iframe for video:', embedUrl);
                                    videoContainer.innerHTML = `<p style="color: #ff4444;">Failed to load video. <a href="${mediaUrl}" target="_blank" style="color: #FF69B4;">Watch on YouTube</a></p>`;
                                };
                                
                                videoContainer.appendChild(iframe);
                                imagesContainer.insertBefore(videoContainer, imagesContainer.firstChild);
                            }
                            });
                        }

                    // Load images
                        const projectFolder = projectId === 'medical-projects' 
                            ? 'A bunch of medical projects'
                        : projectId === 'fylgja' ? 'Fylgja'
                        : projectId === 'Oslonøkkelen' ? 'Oslonøkkelen'
                                    : 'Master Thesis';
                        
                        for(let i = 1; i <= 99; i++) {
                            const paddedIndex = String(i).padStart(2, '0');
                        ['png', 'jpg', 'jpeg', 'gif'].forEach(ext => {
                                const img = new Image();
                                const isGif = ext.toLowerCase() === 'gif';
                                img.src = `content/projects/${projectFolder}/images/${paddedIndex}.${ext}`;
                                img.onload = function() {
                                    img.alt = `${projectConfig.title} Image ${i}`;
                                    // Don't use lazy loading for GIFs to ensure they play
                                    if (!isGif) {
                                        img.loading = 'lazy';
                                    }
                                    img.className = 'modal-trigger';
                                    // Ensure GIFs loop continuously
                                    if (isGif) {
                                        img.style.imageRendering = 'auto';
                                        
                                        // Force GIF to loop by reloading the source
                                        const forceGifLoop = () => {
                                            const currentSrc = img.src;
                                            // Temporarily set to empty, then restore to force restart
                                            img.src = '';
                                            // Use requestAnimationFrame to ensure smooth transition
                                            requestAnimationFrame(() => {
                                                img.src = currentSrc;
                                            });
                                        };
                                        
                                        // Reload the GIF periodically to ensure it keeps looping
                                        let loopInterval = setInterval(() => {
                                            if (!img.parentNode || !document.body.contains(img)) {
                                                clearInterval(loopInterval);
                                                return;
                                            }
                                            forceGifLoop();
                                        }, 2000); // Reload every 2 seconds to ensure continuous looping
                                        
                                        // Also reload once when the image first loads
                                        img.addEventListener('load', function() {
                                            // Small delay to let the GIF start playing
                                            setTimeout(() => {
                                                forceGifLoop();
                                            }, 500);
                                        }, { once: true });
                                    }
                                    imagesContainer.appendChild(img);
                                };
                            });
                        }
                    }
                }
            
            // Scroll into view
            setTimeout(() => {
                projectDetails.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    }
    
    // Attach click handler to document
    document.addEventListener('click', handleProjectClick);

    // Load very nice pictures
    const veryNicePicturesConfig = {
        'my-bikes': {
            folder: 'very-nice-pictures/my-bikes',
            images: [
                // Bike images (add more filenames here when available)
            ]
        },
        'my-desk': {
            folder: 'very-nice-pictures/my-desk',
            images: [
                'DSC01097.JPG',
                'DSC08601.jpg',
                'WP_20130926_027.JPG',
                'WP_20131006_003.jpg',
                'WP_20150302_002.jpg',
                'WP_20151224_16_11_12_Rich_LI.jpg'
            ]
        },
        'my-laptops': {
            folder: 'very-nice-pictures/my-laptops',
            images: [
                'IMG_2004.JPG'
            ]
        }
    };

    Object.entries(veryNicePicturesConfig).forEach(([subcategoryId, config]) => {
        const grid = document.querySelector(`.very-nice-pictures-grid[data-subcategory="${subcategoryId}"]`);
        if (grid && config.images.length > 0) {
            config.images.forEach(imageName => {
                // Create container like other images
                const container = document.createElement('div');
                container.className = 'image-container';
                
                const img = new Image();
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.alt = `Very nice picture - ${subcategoryId}`;
                img.loading = 'lazy';
                img.className = 'modal-trigger';
                
                img.onerror = () => {
                    if (container.parentNode) {
                        container.parentNode.removeChild(container);
                    }
                };
                
                img.onload = () => {
                    // Image loaded successfully
                };
                
                container.appendChild(img);
                grid.appendChild(container);
                
                // Set src after appending to container
                img.src = `content/${config.folder}/${imageName}`;
            });
        }
    });

    // Load other images
    const otherGrid = document.querySelector('.other-grid:not(.very-nice-pictures-grid)');
    if (otherGrid) {
        const otherImages = [
            '01.png',
            '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg',
            '20180729_164648.jpg',
            '20190501_153758.jpg',
            '20190611_194204.jpg',
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
            'DSC08455.ARW.jpg',
            'DSC09074.jpg',
            'folding_1.gif',
            'gutta.png',
            'IMG_4220.JPG',
            'IMG_4808.JPG',
            'IMG_5561.JPG',
            'IMG_6578.JPG',
            'IMG_7148.JPG',
            'InstagramCapture_6c34ffbe-09b4-489e-8b6e-82724d3fe82e.jpg',
            'Jan Anders Ekroll IDE Diploma Report Til print with bleed_Page_054_Image_0001.jpg',
            'Jan Anders Ekroll IDE Diploma Report Til print with bleed_Page_055_Image_0001.jpg',
            'Jan Anders Ekroll IDE Diploma Report Til print with bleed_Page_056_Image_0001.jpg',
            'litenku.jpg',
            'Sequence 01_6.gif',
            'skull_2.png',
            'WP_20130917_007.JPG',
            'WP_20131229_001.jpg',
            'WP_20140611_003.jpg',
            'WP_20140616_015.jpg',
            'WP_20150412_005.jpg',
            'WP_20150412_008.jpg',
            'WP_20160729_22_11_37_Pro.jpg'
        ];
        
        // Load all images at once but with lazy loading
        otherImages.forEach(imageName => {
            const isGif = imageName.toLowerCase().endsWith('.gif');
            
            // Create container for image with loading placeholder
            const container = document.createElement('div');
            container.className = 'image-container';
            container.style.position = 'relative';
            container.style.width = '100%';
            container.style.height = '180px';
            container.style.background = 'var(--bg-color)';
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'center';
            
            // Create loading placeholder
            const loadingPlaceholder = document.createElement('div');
            loadingPlaceholder.className = 'image-loading';
            loadingPlaceholder.style.width = '100%';
            loadingPlaceholder.style.height = '100%';
            loadingPlaceholder.style.display = 'flex';
            loadingPlaceholder.style.alignItems = 'center';
            loadingPlaceholder.style.justifyContent = 'center';
            loadingPlaceholder.style.color = 'var(--text-color-muted)';
            loadingPlaceholder.style.fontSize = '0.8rem';
            loadingPlaceholder.style.fontFamily = "'Space Mono', monospace";
            loadingPlaceholder.textContent = 'Loading...';
            container.appendChild(loadingPlaceholder);
            
            // Create the actual image
            const img = new Image();
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.display = 'none'; // Hide until loaded
            img.alt = 'Other Project Image';
            img.className = 'modal-trigger';
            
            // Function to show the image
            const showImage = () => {
                loadingPlaceholder.style.display = 'none';
                img.style.display = 'block';
            };
            
            // Set up event handlers BEFORE setting src to avoid race conditions
            img.onerror = () => {
                // Show error message instead of removing
                loadingPlaceholder.textContent = 'Failed to load';
                loadingPlaceholder.style.color = 'var(--text-color-muted)';
                // Don't remove - keep the placeholder visible
            };
            
            img.onload = showImage;
            
            // Also use addEventListener as a backup
            img.addEventListener('load', showImage);
            img.addEventListener('error', () => {
                loadingPlaceholder.textContent = 'Failed to load';
                loadingPlaceholder.style.color = 'var(--text-color-muted)';
            });
            
            // Set loading attribute BEFORE setting src (for lazy loading non-GIFs)
            if (!isGif) {
                img.loading = 'lazy';
            }
            
            // Append image to container first
            container.appendChild(img);
            
            // Set src to trigger loading
            img.src = `content/other/${imageName}`;
            
            // Check if image is already loaded (cached images) - do this after setting src
            // Use multiple checks to ensure we catch cached images
            const checkLoaded = () => {
                if (img.complete && img.naturalWidth > 0) {
                    // Image was already loaded (cached), show it immediately
                    showImage();
                    return true;
                }
                return false;
            };
            
            // Check immediately and after a short delay
            requestAnimationFrame(checkLoaded);
            setTimeout(checkLoaded, 100);
            
            // Polling fallback: check periodically if image has loaded (for lazy loading cases)
            let pollCount = 0;
            const maxPolls = 50; // Check for up to 5 seconds (50 * 100ms)
            const pollInterval = setInterval(() => {
                pollCount++;
                if (checkLoaded() || pollCount >= maxPolls) {
                    clearInterval(pollInterval);
                }
            }, 100);
            
            // Fallback: if image hasn't loaded after 3 seconds, try removing lazy loading
            if (!isGif) {
                setTimeout(() => {
                    if (loadingPlaceholder.style.display !== 'none' && !img.complete) {
                        // Image hasn't loaded, try removing lazy loading
                        img.loading = 'eager';
                        // Force reload
                        const currentSrc = img.src;
                        img.src = '';
                        img.src = currentSrc;
                    }
                }, 3000);
            }
            
            // Ensure GIFs loop continuously
            if (isGif) {
                img.style.imageRendering = 'auto';
                
                // Force GIF to loop by reloading the source
                const forceGifLoop = () => {
                    const currentSrc = img.src;
                    // Temporarily set to empty, then restore to force restart
                    img.src = '';
                    // Use requestAnimationFrame to ensure smooth transition
                    requestAnimationFrame(() => {
                        img.src = currentSrc;
                    });
                };
                
                // Reload the GIF periodically to ensure it keeps looping
                let loopInterval = setInterval(() => {
                    if (!container.parentNode || !document.body.contains(container)) {
                        clearInterval(loopInterval);
                        return;
                    }
                    forceGifLoop();
                }, 2000); // Reload every 2 seconds to ensure continuous looping
                
                // Also reload once when the image first loads
                img.addEventListener('load', function() {
                    // Small delay to let the GIF start playing
                    setTimeout(() => {
                        forceGifLoop();
                    }, 500);
                }, { once: true });
            }
            
            // Container already has img appended, now append to grid
            otherGrid.appendChild(container);  // Append immediately to maintain order
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

    // Modal functionality
    const modal = document.querySelector('.modal');
    const modalImg = modal ? modal.querySelector('img') : null;
    const modalClose = modal ? modal.querySelector('.modal-close') : null;
    
    // Track current image and all available images
    let currentImageIndex = 0;
    let allImages = [];

    // Function to check if modal is open
    function isModalOpen() {
        if (!modal) return false;
        return modal.style.display === 'block' || 
               window.getComputedStyle(modal).display === 'block' ||
               !modal.hasAttribute('aria-hidden') || 
               modal.getAttribute('aria-hidden') === 'false';
    }
    
    // Function to close all open projects
    function closeAllProjects() {
        document.querySelectorAll('.project-details.active').forEach(project => {
            project.classList.remove('active');
        });
    }
    
    // Function to navigate to next/previous image
    function navigateImage(direction) {
        if (!modalImg) return;
        
            if (allImages.length === 0) {
                // Try to collect images again if array is empty
                const allProjectImages = Array.from(document.querySelectorAll('.project-images img, .project-images .video-container img'));
                const allOtherImages = Array.from(document.querySelectorAll('.other-grid img, .other-grid .image-container img'));
                allImages = [...allProjectImages, ...allOtherImages];
            
            if (allImages.length === 0) return;
            
            // Find current image in the new collection
            const currentSrc = modalImg.src;
            currentImageIndex = allImages.findIndex(img => img.src === currentSrc);
            if (currentImageIndex === -1) {
                currentImageIndex = 0;
            }
        }
        
        currentImageIndex += direction;
        
        // Wrap around
        if (currentImageIndex < 0) {
            currentImageIndex = allImages.length - 1;
        } else if (currentImageIndex >= allImages.length) {
            currentImageIndex = 0;
        }
        
        const nextImg = allImages[currentImageIndex];
        if (nextImg && nextImg.src) {
            modalImg.src = nextImg.src;
            modalImg.alt = nextImg.alt || 'Enlarged image view';
        }
    }
    
    // Global keyboard handler for Escape key and modal navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // First check if modal is open - close that first
            if (isModalOpen()) {
                e.preventDefault();
                if (modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                    modal.setAttribute('aria-hidden', 'true');
                }
            } else {
                // If modal is not open, close any open projects
                const openProjects = document.querySelectorAll('.project-details.active');
                if (openProjects.length > 0) {
                    e.preventDefault();
                    closeAllProjects();
                }
            }
        } else if (isModalOpen() && modalImg) {
            // Only handle arrow keys when modal is open
            if (e.key === 'ArrowLeft' || e.keyCode === 37) {
                e.preventDefault();
                e.stopPropagation();
                navigateImage(-1);
            } else if (e.key === 'ArrowRight' || e.keyCode === 39) {
                e.preventDefault();
                e.stopPropagation();
                navigateImage(1);
            }
        }
    });

    if (modal && modalClose && modalImg) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target === modalClose) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
                modal.setAttribute('aria-hidden', 'true');
            }
        });

        // Image click handler - combine both project and other images
        document.addEventListener('click', (e) => {
            // Check if clicked element is an image or inside a video container or image container
            let clickedImg = null;
            if (e.target.matches('.project-images img, .other-grid img, .other-grid .image-container img, .video-container img')) {
                clickedImg = e.target;
            } else if (e.target.closest('.video-container img, .image-container img')) {
                clickedImg = e.target.closest('.video-container img, .image-container img');
            }
            
            if (clickedImg) {
                // Collect all images from the same container
                const container = clickedImg.closest('.project-images, .other-grid, .video-container');
                if (container) {
                    // Get the parent container (project-images or other-grid)
                    const parentContainer = container.closest('.project-images, .other-grid') || container;
                    allImages = Array.from(parentContainer.querySelectorAll('img'));
                    currentImageIndex = allImages.findIndex(img => img === clickedImg || img.src === clickedImg.src);
                    
                    // If image not found, try to find it in all images on page
                    if (currentImageIndex === -1) {
                        // Fallback: collect all images from all containers
                        const allProjectImages = Array.from(document.querySelectorAll('.project-images img, .project-images .video-container img'));
                        const allOtherImages = Array.from(document.querySelectorAll('.other-grid img'));
                        allImages = [...allProjectImages, ...allOtherImages];
                        currentImageIndex = allImages.findIndex(img => img === clickedImg || img.src === clickedImg.src);
                    }
                } else {
                    // Fallback: collect all images from all containers
                    const allProjectImages = Array.from(document.querySelectorAll('.project-images img, .project-images .video-container img'));
                    const allOtherImages = Array.from(document.querySelectorAll('.other-grid img, .other-grid .image-container img'));
                    allImages = [...allProjectImages, ...allOtherImages];
                    currentImageIndex = allImages.findIndex(img => img === clickedImg || img.src === clickedImg.src);
                }
                
                if (currentImageIndex === -1) {
                    currentImageIndex = 0;
                }
                
                modalImg.src = clickedImg.src;
                modalImg.alt = clickedImg.alt || 'Enlarged image view';
                modal.style.display = 'block';
                modal.setAttribute('aria-hidden', 'false');
                modal.setAttribute('tabindex', '-1');
                document.body.style.overflow = 'hidden';
                
                // Focus the modal to ensure keyboard events work
                setTimeout(() => {
                    modal.focus();
                }, 10);
            }
        });
    }

    // Books section - ISBN recommendation handler
    const bookRecommendationForm = document.getElementById('book-recommendation-form');
    const isbnInput = document.getElementById('isbn-input');
    const recommendationStatus = document.getElementById('recommendation-status');
    const recommendedBooksList = document.getElementById('recommended-books-list');
    
    // JSONStore.io configuration - A free service for storing JSON without a backend
    // The store ID below is a unique identifier for your recommendations
    // You can change it to any unique string if you want a fresh store
    const JSONSTORE_ID = 'janandersekroll-book-recommendations';
    const JSONSTORE_URL = `https://www.jsonstore.io/${JSONSTORE_ID}`;
    
    // Load recommended books from JSONStore.io (or localStorage as fallback)
    async function loadRecommendedBooks() {
        recommendedBooksList.innerHTML = '<p style="color: var(--text-color-muted); font-size: 0.9rem;">Loading recommendations...</p>';
        
        let recommended = [];
        
        try {
            const response = await fetch(JSONSTORE_URL);
            
            if (response.ok) {
                const data = await response.json();
                recommended = data.books || data || [];
                
                // If we got data from JSONStore, also update localStorage as backup
                if (recommended.length > 0) {
                    localStorage.setItem('recommendedBooks', JSON.stringify(recommended));
                }
            } else {
                // Fallback to localStorage if fetch fails
                recommended = JSON.parse(localStorage.getItem('recommendedBooks') || '[]');
            }
        } catch (error) {
            console.error('Error loading from JSONStore:', error);
            // Fallback to localStorage
            recommended = JSON.parse(localStorage.getItem('recommendedBooks') || '[]');
        }
        
        recommendedBooksList.innerHTML = '';
        
        if (recommended.length === 0) {
            recommendedBooksList.innerHTML = '<p style="color: var(--text-color-muted); font-size: 0.9rem;">No recommendations yet. Be the first!</p>';
            return;
        }
        
        recommended.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.className = 'recommended-book-item';
            bookItem.innerHTML = `
                ${book.cover ? `<img src="${book.cover}" alt="${book.title}" class="book-cover" onerror="this.style.display='none'">` : ''}
                <div class="book-title">${book.title || 'Unknown Title'}</div>
                <div class="book-author">${book.author || 'Unknown Author'}</div>
                <div style="font-size: 0.7rem; color: var(--text-color-muted); margin-top: 0.5rem;">ISBN: ${book.isbn}</div>
            `;
            recommendedBooksList.appendChild(bookItem);
        });
    }
    
    // Save recommended books to JSONStore.io (or localStorage as fallback)
    async function saveRecommendedBooks(recommended) {
        try {
            const response = await fetch(JSONSTORE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ books: recommended })
            });
            
            if (!response.ok) {
                throw new Error('Failed to save to JSONStore');
            }
            
            // Also save to localStorage as backup
            localStorage.setItem('recommendedBooks', JSON.stringify(recommended));
        } catch (error) {
            console.error('Error saving to JSONStore:', error);
            // Fallback to localStorage
            localStorage.setItem('recommendedBooks', JSON.stringify(recommended));
        }
    }
    
    // Validate and clean ISBN
    function validateISBN(isbn) {
        // Remove hyphens and spaces
        const cleaned = isbn.replace(/[-\s]/g, '');
        
        // Check if it's ISBN-10 or ISBN-13
        if (cleaned.length === 10) {
            return { valid: true, isbn: cleaned, type: 'ISBN-10' };
        } else if (cleaned.length === 13) {
            return { valid: true, isbn: cleaned, type: 'ISBN-13' };
        }
        return { valid: false, error: 'ISBN must be 10 or 13 digits' };
    }
    
    // Fetch book data from Open Library API
    async function fetchBookData(isbn) {
        try {
            const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
            const data = await response.json();
            const bookKey = `ISBN:${isbn}`;
            
            if (data[bookKey]) {
                const book = data[bookKey];
                return {
                    title: book.title || 'Unknown Title',
                    author: book.authors?.[0]?.name || 'Unknown Author',
                    cover: book.cover?.large || book.cover?.medium || null,
                    isbn: isbn
                };
            }
            return null;
        } catch (error) {
            console.error('Error fetching book data:', error);
            return null;
        }
    }
    
    if (bookRecommendationForm) {
        bookRecommendationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const isbnValue = isbnInput.value.trim();
            const validation = validateISBN(isbnValue);
            
            if (!validation.valid) {
                recommendationStatus.textContent = validation.error;
                recommendationStatus.className = 'recommendation-status error';
                return;
            }
            
            recommendationStatus.textContent = 'Looking up book...';
            recommendationStatus.className = 'recommendation-status';
            
            // Fetch book data
            const bookData = await fetchBookData(validation.isbn);
            
            if (!bookData) {
                recommendationStatus.textContent = 'Book not found. Please check the ISBN and try again.';
                recommendationStatus.className = 'recommendation-status error';
                return;
            }
            
            // Load existing recommendations
            let recommended = [];
            try {
                const response = await fetch(JSONSTORE_URL);
                if (response.ok) {
                    const data = await response.json();
                    recommended = data.books || data || [];
                } else {
                    recommended = JSON.parse(localStorage.getItem('recommendedBooks') || '[]');
                }
            } catch (error) {
                recommended = JSON.parse(localStorage.getItem('recommendedBooks') || '[]');
            }
            
            // Check if already recommended
            if (recommended.some(b => b.isbn === validation.isbn)) {
                recommendationStatus.textContent = 'This book has already been recommended!';
                recommendationStatus.className = 'recommendation-status error';
                return;
            }
            
            recommended.push(bookData);
            
            // Save to JSONBin.io (or localStorage)
            await saveRecommendedBooks(recommended);
            
            // Update display
            await loadRecommendedBooks();
            
            // Success message
            recommendationStatus.textContent = `Thank you! "${bookData.title}" has been added to recommendations.`;
            recommendationStatus.className = 'recommendation-status success';
            
            // Clear input
            isbnInput.value = '';
            
            // Clear status after 5 seconds
            setTimeout(() => {
                recommendationStatus.textContent = '';
                recommendationStatus.className = 'recommendation-status';
            }, 5000);
        });
        
        // Load recommended books on page load
        loadRecommendedBooks().catch(error => {
            console.error('Error loading recommended books:', error);
        });
    }
    
    // Goodreads integration - locked to your account only
    const booksList = document.getElementById('books-list');
    const GOODREADS_USER_ID = '120322204'; // Your Goodreads user ID
    
    // Auto-load books on page load
    function autoLoadBooks() {
        if (!booksList) {
            console.error('Books list element not found');
            return;
        }
        
        // First try to load from localStorage (faster)
        const hasCachedBooks = loadBooksFromStorage();
        
        // Always fetch fresh data (will update if cached books exist)
        fetchGoodreadsBooks(GOODREADS_USER_ID);
    }
    
    // Auto-load when books section is opened
    let booksLoaded = false;
    
    function setupBooksAutoLoad() {
        const categories = document.querySelectorAll('.category');
        categories.forEach(category => {
            const h2 = category.querySelector('h2');
            if (h2 && h2.textContent.includes('I love books')) {
                const booksContent = category.querySelector('.content');
                if (booksContent) {
                    // Watch for when the category is opened
                    const observer = new MutationObserver((mutations) => {
                        if (booksContent.classList.contains('active') && !booksLoaded) {
                            booksLoaded = true;
                            autoLoadBooks();
                        }
                    });
                    observer.observe(booksContent, { attributes: true, attributeFilter: ['class'] });
                    
                    // Also listen for clicks on the category header
                    h2.addEventListener('click', () => {
                        setTimeout(() => {
                            if (booksContent.classList.contains('active') && !booksLoaded) {
                                booksLoaded = true;
                                autoLoadBooks();
                            }
                        }, 100);
                    });
                    
                    // Try to load immediately if category is already open
                    if (booksContent.classList.contains('active')) {
                        autoLoadBooks();
                    }
                }
            }
        });
    }
    
    setupBooksAutoLoad();
    
    // Load books from localStorage on page load (if available)
    function loadBooksFromStorage() {
        const savedBooks = localStorage.getItem('goodreadsBooks');
        const savedUserId = localStorage.getItem('goodreadsUserId');
        if (savedBooks && savedUserId === GOODREADS_USER_ID && booksList) {
            const books = JSON.parse(savedBooks);
            displayBooks(books);
            return true;
        }
        return false;
    }
    
    function displayBooks(books) {
        if (!booksList) {
            console.error('Books list element not found');
            return;
        }
        
        if (!books || books.length === 0) {
            booksList.innerHTML = '<p style="color: var(--text-color-muted);">No books found. Make sure your "read" shelf is public on Goodreads.</p>';
            return;
        }
        
        booksList.innerHTML = '';
        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.className = 'book-item';
            
            // Create cover image (hidden, shown on hover) - positioned at cursor
            const coverHtml = book.cover 
                ? `<img src="${book.cover}" alt="${book.title}" class="book-cover" onerror="this.style.display='none'">`
                : '<div class="book-cover-placeholder">No Cover</div>';
            
            bookItem.innerHTML = `
                <div class="book-item-content">
                    ${coverHtml}
                    <div class="book-title">${book.title}</div>
                    <div class="book-author book-info-hidden">${book.author}</div>
                    ${book.rating ? `<div class="book-rating book-info-hidden">${'★'.repeat(Math.round(book.rating))}${'☆'.repeat(5 - Math.round(book.rating))}</div>` : ''}
                </div>
            `;
            
            booksList.appendChild(bookItem);
        });
    }
    
    async function fetchGoodreadsBooks(userId) {
        if (!booksList) {
            console.error('Books list element not found');
            return;
        }
        
        if (!userId || userId !== GOODREADS_USER_ID) {
            booksList.innerHTML = '<p style="color: #ff4444;">Invalid user ID.</p>';
            return;
        }
        
        // Show loading state
        booksList.innerHTML = '<p style="color: var(--text-color-muted);">Loading books from Goodreads...</p>';
        
        try {
            // Goodreads RSS feed URL
            const rssUrl = `https://www.goodreads.com/review/list_rss/${userId}?shelf=read&per_page=200`;
            
            // Try multiple CORS proxy services as fallback
            const proxies = [
                `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`,
                `https://corsproxy.io/?${encodeURIComponent(rssUrl)}`,
                `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(rssUrl)}`,
                `https://cors-anywhere.herokuapp.com/${rssUrl}`,
                `https://thingproxy.freeboard.io/fetch/${rssUrl}`,
                `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`
            ];
            
            let response = null;
            let data = null;
            let xmlContent = null;
            
            // Try each proxy until one works
            let lastError = null;
            for (const proxyUrl of proxies) {
                try {
                    response = await fetch(proxyUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/xml, text/xml, */*'
                        }
                    });
                    
                    if (!response.ok) {
                        lastError = `HTTP ${response.status}`;
                        continue;
                    }
                    
                    // Try to get as text first (some proxies return XML directly)
                    const contentType = response.headers.get('content-type') || '';
                    if (contentType.includes('xml') || contentType.includes('text')) {
                        xmlContent = await response.text();
                        if (xmlContent && xmlContent.trim().startsWith('<?xml') || xmlContent.trim().startsWith('<rss')) {
                            break;
                        }
                    }
                    
                    // Otherwise try JSON
                    try {
                        data = await response.json();
                        
                        // Handle different proxy response formats
                        if (data.contents) {
                            xmlContent = data.contents;
                        } else if (data.content) {
                            xmlContent = data.content;
                        } else if (data.data) {
                            xmlContent = data.data;
                        } else if (typeof data === 'string') {
                            xmlContent = data;
                        } else {
                            lastError = 'Unexpected response format';
                            continue;
                        }
                        
                        if (xmlContent && (xmlContent.trim().startsWith('<?xml') || xmlContent.trim().startsWith('<rss'))) {
                            break;
                        }
                    } catch (jsonErr) {
                        // If JSON parsing fails, we already have xmlContent from text
                        if (xmlContent) break;
                        lastError = jsonErr.message;
                        continue;
                    }
                } catch (err) {
                    lastError = err.message;
                    console.log('Proxy failed, trying next...', proxyUrl, err);
                    continue;
                }
            }
            
            if (!xmlContent) {
                // Test if RSS feed is accessible directly (for debugging)
                const testUrl = `https://www.goodreads.com/review/list_rss/${userId}?shelf=read&per_page=5`;
                throw new Error(`All proxy services failed. Last error: ${lastError || 'Unknown'}. The RSS feed URL should be: ${testUrl}. Please verify your "read" shelf is public by visiting this URL in your browser.`);
            }
            
            // Parse XML/RSS
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
            
            // Check for errors
            const parseError = xmlDoc.querySelector('parsererror');
            if (parseError) {
                throw new Error('Failed to parse RSS feed. Make sure your "read" shelf is set to PUBLIC in Goodreads privacy settings.');
            }
            
            // Check if feed is empty or blocked
            const channel = xmlDoc.querySelector('channel');
            if (!channel) {
                throw new Error('RSS feed appears to be empty or inaccessible. Make sure your "read" shelf is PUBLIC in Goodreads settings.');
            }
            
            // Extract books from RSS
            const items = xmlDoc.querySelectorAll('item');
            const books = [];
            
            items.forEach(item => {
                const title = item.querySelector('title')?.textContent || 'Unknown Title';
                const author = item.querySelector('author_name')?.textContent || item.querySelector('author')?.textContent || 'Unknown Author';
                const cover = item.querySelector('book_large_image_url')?.textContent || item.querySelector('book_medium_image_url')?.textContent || null;
                const rating = item.querySelector('user_rating')?.textContent || null;
                const isbn = item.querySelector('isbn')?.textContent || null;
                
                books.push({
                    title: title.replace(/^.*: /, ''), // Remove "Book Title: " prefix if present
                    author: author,
                    cover: cover,
                    rating: rating ? parseFloat(rating) : null,
                    isbn: isbn
                });
            });
            
            if (books.length === 0) {
                booksList.innerHTML = '<p style="color: var(--text-color-muted);">No books found. Make sure your "read" shelf is public on Goodreads.</p>';
                return;
            }
            
            // Save to localStorage
            localStorage.setItem('goodreadsBooks', JSON.stringify(books));
            localStorage.setItem('goodreadsUserId', userId);
            
            // Display books
            displayBooks(books);
            
        } catch (error) {
            console.error('Error fetching Goodreads books:', error);
            let errorMessage = error.message || 'Unknown error';
            
            // Provide more helpful error messages
            if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
                errorMessage = 'Network error. This might be a CORS issue. Try refreshing the page or check if your "read" shelf is public on Goodreads.';
            } else if (errorMessage.includes('proxy')) {
                errorMessage = 'Proxy service unavailable. Please try again in a few moments.';
            }
            
            booksList.innerHTML = `<p style="color: #ff4444;">Error loading books: ${errorMessage}<br><br>Make sure:<br>1. Your "read" shelf is set to <strong>public</strong> in Goodreads settings<br>2. You have books marked as "read" on Goodreads</p>`;
        }
    }
    
    // Load favicons for webpages
    function loadFavicon(img, domain) {
        // Explicitly set loading to eager for immediate load (favicons are small)
        img.loading = 'eager';
        
        // Try multiple favicon sources
        const sources = [
            `https://${domain}/favicon.ico`,
            `https://icon.horse/icon/${domain}`,
            `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
        ];
        
        let currentIndex = 0;
        
        function tryNext() {
            if (currentIndex >= sources.length) {
                // All sources failed, use a default
                img.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
                return;
            }
            
            const testImg = new Image();
            testImg.onload = () => {
                img.src = sources[currentIndex];
            };
            testImg.onerror = () => {
                currentIndex++;
                tryNext();
            };
            testImg.src = sources[currentIndex];
        }
        
        tryNext();
    }
    
    // Load favicons for all webpage icons
    document.querySelectorAll('.webpage-icon[data-domain]').forEach(img => {
        const domain = img.getAttribute('data-domain');
        loadFavicon(img, domain);
    });
    
    // Load YouTube channel icons from local files
    function loadYouTubeIcon(img, handle) {
        // Explicitly set loading to eager for immediate load (icons are small)
        img.loading = 'eager';
        
        // Map handles to folder names and specific icon filenames
        const iconMap = {
            'FlokrollProjects': {
                folder: 'flokroll-projects',
                filenames: ['icon logo.png', 'icon.png', 'logo.png']
            },
            'FlokrollAdventures': {
                folder: 'flokroll-adventure',
                filenames: ['logo.png', 'icon.png', 'icon logo.png']
            },
            'FlokrollLife': {
                folder: 'flokroll-life',
                filenames: ['logo.png', 'icon.png', 'icon logo.png']
            },
            'FlokrollDev': {
                folder: 'flokroll_dev',
                filenames: ['flokrolldevlogoicon.jpg', 'icon.jpg', 'icon.png', 'logo.png']
            },
            'FlokrollDiv': {
                folder: 'flokroll-div',
                filenames: ['logoicon flokroll div.png', 'icon.png', 'logo.png', 'icon logo.png']
            }
        };
        
        const config = iconMap[handle];
        if (!config) {
            // Fallback for unknown handles
            const folder = handle.toLowerCase();
            config = {
                folder: folder,
                filenames: ['icon.png', 'logo.png', 'icon.jpg', 'logo.jpg']
            };
        }
        
        const folder = config.folder;
        let filenameIndex = 0;
        
        function tryNext() {
            if (filenameIndex >= config.filenames.length) {
                // All filenames failed, show placeholder
                img.style.display = 'none';
                const placeholder = img.nextElementSibling;
                if (placeholder && placeholder.classList.contains('channel-logo-placeholder')) {
                    placeholder.style.display = 'flex';
                }
                return;
            }
            
            const filename = config.filenames[filenameIndex];
            
            // Try multiple path formats to ensure it works both locally and on live site
            const pathsToTry = [
                `content/youtube/${folder}/${filename}`,  // Relative path (works locally)
                `/content/youtube/${folder}/${filename}`, // Absolute from root
                `./content/youtube/${folder}/${filename}` // Explicit relative
            ];
            
            let pathIndex = 0;
            
            function tryPath() {
                if (pathIndex >= pathsToTry.length) {
                    // All paths failed for this filename, try next filename
                    filenameIndex++;
                    tryNext();
                    return;
                }
                
                const iconPath = pathsToTry[pathIndex];
                const testImg = new Image();
                testImg.onload = () => {
                    // Explicitly set loading to eager for immediate load
                    img.loading = 'eager';
                    img.src = iconPath;
                };
                testImg.onerror = () => {
                    pathIndex++;
                    tryPath();
                };
                testImg.src = iconPath;
            }
            
            tryPath();
        }
        
        tryNext();
        
        // Add error handler for the actual image element
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const placeholder = this.nextElementSibling;
            if (placeholder && placeholder.classList.contains('channel-logo-placeholder')) {
                placeholder.style.display = 'flex';
            }
        });
    }
    
    // Load YouTube icons for all channel logos
    document.querySelectorAll('.channel-logo[data-youtube-handle]').forEach(img => {
        const handle = img.getAttribute('data-youtube-handle');
        loadYouTubeIcon(img, handle);
    });
    
    // Handle missing YouTube channel logos - show placeholders (for backwards compatibility)
    const channelLogos = document.querySelectorAll('.channel-logo[src*="flokroll_dev"], .channel-logo[src*="flokroll-div"]');
    channelLogos.forEach(img => {
        if (!img.hasAttribute('data-youtube-handle')) {
            img.addEventListener('error', function() {
                this.style.display = 'none';
                const placeholder = this.nextElementSibling;
                if (placeholder && placeholder.classList.contains('channel-logo-placeholder')) {
                    placeholder.style.display = 'flex';
                }
            });
        }
    });
    
}); 