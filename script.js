// Encode each path segment so spaces, &, (), and unicode work on GitHub Pages / Linux hosts.
function encodeAssetPath(path) {
    return String(path)
        .split('/')
        .map((segment) => (segment ? encodeURIComponent(segment) : ''))
        .join('/');
}

// Explicit image lists — avoids probing 99×4 extensions (hundreds of failed requests) and keeps order stable.
const projectsConfig = {
    'medical-projects': {
        title: 'A bunch of medical projects',
        description:
            'A stretch of work across healthcare products and services — from packaging and industrial design to service design and a lot of UX/UI.\n\n' +
            'What I liked most was getting to move between scales: the feel of a physical object in someone\'s hands, how a kit sits on a shelf, and the screens and flows that make the whole system make sense in a clinic or at home.\n\n' +
            'Healthcare is picky (and it should be). These projects were a good training ground for clear information, careful interaction, and design that has to work when people are stressed, tired, or in a hurry.',
        folder: 'A bunch of medical projects',
        images: ['01.jpg', '02.png', '03.jpg', '04.jpg', '05.JPG', '06.jpg', '07.jpg', '08.jpg', '09.png', '11.jpg']
    },
    'fylgja': {
        title: 'Fylgja',
        folder: 'Fylgja',
        description:
            'Fylgja is a small app with one job: alert you when your phone finally has coverage again — in the mountains, in the woods, or anywhere the signal keeps vanishing.\n\n' +
            'The idea came on a snow-cave trip. We kept hiking toward the nearest peak just to check if we could get a bar of signal, pulling the phone out every few hundred meters. Super annoying.\n\n' +
            'So Fylgja sits in the background and sings / vibrates when coverage returns. Less fiddling with the screen, more walking. Named after the Norse “fylgja” — a kind of companion spirit that follows you — which felt right for a little helper that watches the network while you watch the terrain.',
        images: ['01.png', '02.png', '03.png']
    },
    'lego': {
        title: 'Lego',
        folder: 'Lego',
        description:
            'I was lucky enough to work on a couple of projects for LEGO — the kind of brief where playfulness is the point and every detail still has to be airtight.\n\n' +
            'It was ridiculously fun. I believe one of the projects made it into the store in the end :D\n\n' +
            'I signed a stack of NDAs, so I can\'t show much. What I can say: it was a great lesson in designing for delight under serious constraints — kids, parents, manufacturing, and a brand that everyone already has strong feelings about.',
        images: ['01.jpg', '02.jpg', '03.jpg', '04.webp']
    },
    'master-thesis': {
        title: 'Master Thesis at The Oslo School of Architecture and Design',
        folder: 'Master Thesis',
        description:
            'Diploma title: “The creation and exploration of new tangible interactive game mechanics.”\n\n' +
            'I was looking at how physical interaction can expand old games — and how new mechanics can grow into wholly new ones. Screens are great, but hands, weight, friction, and shared space do something else to how we play and how we think.\n\n' +
            'The work mixed research, prototyping, and a lot of making: building pieces, testing rules, filming how people actually use the things. The videos below are from that process — rough, playful, and very much about finding mechanics that feel good in the hand before they look finished on a page.',
        images: [
            '01.png', '02.webp', '03.webp', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg',
            '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg'
        ],
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
        description:
            'I\'ve been lucky enough to work on Oslonøkkelen for many years at Oslo Origo — from early days through a product that now opens a big chunk of the city for hundreds of thousands of people.\n\n' +
            'Oslonøkkelen is Oslo\'s digital key: an app that gives easier, often extended, access to municipal places and services. Unlock doors, turn on lights, show library or recycling codes, and find what you can use on a map — after a one-time login with ID-porten. Location is used so you only open what you\'re actually standing next to.\n\n' +
            'It\'s used for libraries, neighbourhood venues, recycling stations, schools, kindergartens, sports facilities, and more. Some access is open to everyone; some is personal or comes automatically when you book a room.\n\n' +
            'I\'ve been part of the whole journey and got to do an absurd number of different things — product and interaction design, flows, visuals, prototypes, and the messy middle between citizens, locks, bookings, and city services — together with some of the best people I\'ve worked with.',
        officialLink: 'https://www.oslo.kommune.no/oslonokkelen/',
        officialLinkLabel: 'Official Oslonøkkelen page',
        images: ['01.jpg', '02.png', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.JPEG', '10.jpg'],
        videos: [
            'content/projects/Oslonøkkelen/images/Ny_n_kkel_animation_1.webp'
        ]
    }
};

function extractYouTubeId(mediaUrl) {
    if (mediaUrl.includes('youtu.be/')) {
        return mediaUrl.split('youtu.be/')[1].split(/[?#&]/)[0].trim();
    }
    if (mediaUrl.includes('youtube.com/watch?v=')) {
        return mediaUrl.split('v=')[1].split(/[?#&]/)[0].trim();
    }
    if (mediaUrl.includes('youtube.com/embed/')) {
        return mediaUrl.split('embed/')[1].split(/[?#&]/)[0].trim();
    }
    if (mediaUrl.includes('youtube.com/v/')) {
        return mediaUrl.split('v/')[1].split(/[?#&]/)[0].trim();
    }
    return null;
}

function createProjectImageSlot(src, alt, { eager = false } = {}) {
    const slot = document.createElement('div');
    slot.className = 'project-image-slot';

    const placeholder = document.createElement('div');
    placeholder.className = 'image-loading';
    placeholder.setAttribute('aria-hidden', 'true');
    slot.appendChild(placeholder);

    const img = new Image();
    img.alt = alt;
    img.className = 'modal-trigger';
    img.decoding = 'async';
    if (!eager) {
        img.loading = 'lazy';
    }

    const isAnimated = /\.(gif|webp)$/i.test(src);
    if (isAnimated) {
        img.style.imageRendering = 'auto';
    }

    img.onload = () => {
        placeholder.remove();
        slot.appendChild(img);
        slot.classList.add('is-loaded');
    };

    img.onerror = () => {
        slot.remove();
    };

    img.src = src;
    return slot;
}

function createProjectVideoSlot(mediaUrl, title, index) {
    const videoId = extractYouTubeId(mediaUrl);
    const slot = document.createElement('div');
    slot.className = 'project-image-slot project-video-slot';

    const placeholder = document.createElement('div');
    placeholder.className = 'image-loading';
    placeholder.setAttribute('aria-hidden', 'true');
    slot.appendChild(placeholder);

    // Thumbnail first keeps the grid uniform; click swaps in the embed.
    const thumb = document.createElement('img');
    thumb.className = 'project-video-thumb';
    thumb.alt = `${title} video ${index + 1}`;
    thumb.decoding = 'async';
    thumb.loading = 'lazy';
    thumb.src = videoId
        ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
        : '';

    const playBadge = document.createElement('div');
    playBadge.className = 'project-video-play';
    playBadge.setAttribute('aria-hidden', 'true');
    playBadge.textContent = '▶';

    const activate = () => {
        if (slot.dataset.activated === 'true' || !videoId) return;
        slot.dataset.activated = 'true';
        slot.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        iframe.title = `${title} video ${index + 1}`;
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('frameborder', '0');
        slot.appendChild(iframe);
    };

    thumb.onload = () => {
        placeholder.remove();
        slot.appendChild(thumb);
        slot.appendChild(playBadge);
        slot.classList.add('is-loaded');
    };

    thumb.onerror = () => {
        placeholder.remove();
        playBadge.textContent = 'YouTube';
        slot.appendChild(playBadge);
        slot.classList.add('is-loaded');
    };

    slot.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        activate();
    });
    slot.setAttribute('role', 'button');
    slot.setAttribute('tabindex', '0');
    slot.setAttribute('aria-label', `Play ${title} video ${index + 1}`);
    slot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activate();
        }
    });

    if (!videoId) {
        placeholder.textContent = 'Unavailable';
        placeholder.classList.add('image-loading-error');
    }

    return slot;
}

function loadProjectMedia(imagesContainer, projectConfig) {
    const folder = projectConfig.folder;

    if (projectConfig.videos && projectConfig.videos.length > 0) {
        projectConfig.videos.forEach((mediaUrl, index) => {
            const isLocalImage = /\.(gif|jpe?g|png|webp)$/i.test(mediaUrl) ||
                (!mediaUrl.includes('youtube.com') && !mediaUrl.includes('youtu.be'));

            if (isLocalImage) {
                const src = encodeAssetPath(mediaUrl);
                imagesContainer.appendChild(
                    createProjectImageSlot(src, `${projectConfig.title} Animation ${index + 1}`, {
                        eager: true
                    })
                );
                return;
            }

            imagesContainer.appendChild(
                createProjectVideoSlot(mediaUrl, projectConfig.title, index)
            );
        });
    }

    if (folder && Array.isArray(projectConfig.images)) {
        projectConfig.images.forEach((imageName, index) => {
            const src = encodeAssetPath(`content/projects/${folder}/images/${imageName}`);
            imagesContainer.appendChild(
                createProjectImageSlot(src, `${projectConfig.title} Image ${index + 1}`, {
                    eager: index < 4
                })
            );
        });
    }
}

function createGalleryImageCard(src, alt) {
    const container = document.createElement('div');
    container.className = 'image-container';

    const placeholder = document.createElement('div');
    placeholder.className = 'image-loading';
    placeholder.setAttribute('aria-hidden', 'true');
    container.appendChild(placeholder);

    const img = document.createElement('img');
    img.alt = alt;
    img.className = 'modal-trigger';
    img.decoding = 'async';
    img.style.display = 'none';

    let loadStarted = false;
    const startLoad = () => {
        if (loadStarted) return;
        loadStarted = true;
        img.src = src;
    };

    const showImage = () => {
        placeholder.remove();
        img.style.display = 'block';
        container.classList.add('is-loaded');
    };

    img.onload = showImage;
    img.onerror = () => {
        placeholder.textContent = 'Unavailable';
        placeholder.classList.add('image-loading-error');
    };

    if (/\.(gif|webp)$/i.test(src)) {
        img.style.imageRendering = 'auto';
    }

    container.appendChild(img);

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    observer.disconnect();
                    startLoad();
                }
            });
        }, { rootMargin: '300px 0px' });
        observer.observe(container);
    } else {
        img.loading = 'lazy';
        startLoad();
    }

    return container;
}

document.addEventListener('DOMContentLoaded', () => {
    // Load preview images
    Object.entries(projectsConfig).forEach(([projectId, config]) => {
        if (config.folder && config.images && config.images.length > 0) {
            const previewImg = document.querySelector(`[data-project="${projectId}"] .project-preview img`);
            if (previewImg) {
                previewImg.decoding = 'async';
                previewImg.src = encodeAssetPath(`content/projects/${config.folder}/images/${config.images[0]}`);
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

    function setupLazyCategoryLoader(categoryNameIncludes, loader) {
        const categories = Array.from(document.querySelectorAll('.category'));
        const category = categories.find(item => {
            const heading = item.querySelector('h2');
            return heading && heading.textContent.toLowerCase().includes(categoryNameIncludes);
        });

        if (!category) return;

        const content = category.querySelector('.content');
        if (!content) return;

        const runLoader = () => {
            if (content.classList.contains('active')) {
                loader();
            }
        };

        // Load immediately if already open.
        runLoader();

        // Load as soon as the category opens.
        const observer = new MutationObserver(runLoader);
        observer.observe(content, { attributes: true, attributeFilter: ['class'] });
    }

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
            e.stopPropagation();
            
            // Remove focus outline after click
            if (document.activeElement) {
                document.activeElement.blur();
            }
            projectTitle.blur();
            
            // Open Projects category if closed - do this FIRST
            const projectsCategory = Array.from(document.querySelectorAll('.category')).find((category) => {
                const heading = category.querySelector('h2');
                return heading && heading.textContent.toLowerCase().includes('projects');
            });
            if (projectsCategory) {
                const content = projectsCategory.querySelector('.content');
                const h2 = projectsCategory.querySelector('h2');
                if (content && !content.classList.contains('active')) {
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
                    const projectInfo = projectDetails.querySelector('.project-info');
                    let officialLinkElement = projectInfo ? projectInfo.querySelector('.project-official-link') : null;

                    if (projectConfig.officialLink && projectInfo) {
                        if (!officialLinkElement) {
                            officialLinkElement = document.createElement('a');
                            officialLinkElement.className = 'project-official-link';
                            officialLinkElement.target = '_blank';
                            officialLinkElement.rel = 'noopener noreferrer';
                            projectInfo.appendChild(officialLinkElement);
                        }
                        officialLinkElement.href = projectConfig.officialLink;
                        officialLinkElement.textContent = projectConfig.officialLinkLabel || 'Official page';
                    } else if (officialLinkElement) {
                        officialLinkElement.remove();
                    }
                }

            const imagesContainer = projectDetails.querySelector('.project-images');
                if (imagesContainer && imagesContainer.children.length === 0) {
                    loadProjectMedia(imagesContainer, projectConfig);
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

    let hasLoadedVeryNicePictures = false;
    function loadVeryNicePictures() {
        if (hasLoadedVeryNicePictures) return;
        hasLoadedVeryNicePictures = true;

        Object.entries(veryNicePicturesConfig).forEach(([subcategoryId, config]) => {
            const grid = document.querySelector(`.very-nice-pictures-grid[data-subcategory="${subcategoryId}"]`);
            if (grid && config.images.length > 0) {
                config.images.forEach(imageName => {
                    const src = encodeAssetPath(`content/${config.folder}/${imageName}`);
                    grid.appendChild(createGalleryImageCard(src, `Very nice picture - ${subcategoryId}`));
                });
            }
        });
    }

    // Load other images
    let hasLoadedOtherImages = false;
    function loadOtherImages() {
        if (hasLoadedOtherImages) return;
        hasLoadedOtherImages = true;

        const otherGrid = document.querySelector('.other-grid:not(.very-nice-pictures-grid)');
        if (!otherGrid) return;

        const otherImages = [
            '01.png',
            '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg',
            '20180729_164648.jpg',
            '20190501_153758.jpg',
            '20190611_194204.jpg',
            '20190909_091540_1.webp',
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
            'folding_1.webp',
            'gutta.jpg',
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
            'Sequence 01_6.webp',
            'skull_2.webp',
            'WP_20130917_007.JPG',
            'WP_20131229_001.jpg',
            'WP_20140611_003.jpg',
            'WP_20140616_015.jpg',
            'WP_20150412_005.jpg',
            'WP_20150412_008.jpg',
            'WP_20160729_22_11_37_Pro.jpg'
        ];

        otherImages.forEach(imageName => {
            const src = encodeAssetPath(`content/other/${imageName}`);
            otherGrid.appendChild(createGalleryImageCard(src, 'Other Project Image'));
        });
    }

    // Contact email (book recommendations still use mailto)
    const CONTACT_EMAIL = 'jaekroll@outlook.com';

    function openMailTo({ subject, body }) {
        const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = href;
    }

    // Newsletter via Buttondown (native POST — subscribers land in your Buttondown dashboard)
    const newsletterForm = document.querySelector('form[name="newsletter"]');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', () => {
            const button = newsletterForm.querySelector('button[type="submit"], button');
            if (button) {
                button.textContent = 'Subscribing…';
                button.disabled = true;
            }
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
    
    // Initialize cursor effect (skip on touch / reduced-motion)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const cursorToggle = document.getElementById('cursor-toggle');
    let isEnabled = !(prefersReducedMotion || isCoarsePointer);

    if (isEnabled) {
        window.addEventListener('pointerdown', updatePointer);
        window.addEventListener('pointermove', updatePointer);
        createTrail(null, 35);
    } else {
        const svg = document.querySelector('.cursor-trail');
        if (svg) svg.style.display = 'none';
        if (cursorToggle) cursorToggle.style.display = 'none';
    }

    if (cursorToggle) {
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
    }

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
            if (e.target.matches('.project-images img:not(.project-video-thumb), .other-grid img, .other-grid .image-container img, .video-container img, .project-image-slot:not(.project-video-slot) img')) {
                clickedImg = e.target;
            } else if (e.target.closest('.video-container img, .image-container img, .project-image-slot:not(.project-video-slot) img')) {
                clickedImg = e.target.closest('.video-container img, .image-container img, .project-image-slot:not(.project-video-slot) img');
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

    // Books — static list from content/books.json + ISBN recommendations emailed via FormSubmit
    const bookRecommendationForm = document.getElementById('book-recommendation-form');
    const isbnInput = document.getElementById('isbn-input');
    const recommendationStatus = document.getElementById('recommendation-status');
    const booksList = document.getElementById('books-list');

    function validateISBN(isbn) {
        const cleaned = isbn.replace(/[-\s]/g, '');
        if (cleaned.length === 10 || cleaned.length === 13) {
            return { valid: true, isbn: cleaned };
        }
        return { valid: false, error: 'ISBN must be 10 or 13 digits' };
    }

    async function fetchBookData(isbn) {
        try {
            const response = await fetch(
                `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
            );
            const data = await response.json();
            const book = data[`ISBN:${isbn}`];
            if (!book) return null;
            return {
                title: book.title || 'Unknown Title',
                author: book.authors?.[0]?.name || 'Unknown Author',
                cover: book.cover?.large || book.cover?.medium || null,
                isbn
            };
        } catch (error) {
            console.error('Error fetching book data:', error);
            return null;
        }
    }

    function displayBooks(books) {
        if (!booksList) return;

        if (!books || books.length === 0) {
            booksList.innerHTML = '';
            return;
        }

        booksList.innerHTML = '';
        books.forEach((book) => {
            const bookItem = document.createElement('div');
            bookItem.className = 'book-item';
            const coverHtml = book.cover
                ? `<img src="${book.cover}" alt="${book.title}" class="book-cover" loading="lazy" onerror="this.style.display='none'">`
                : '<div class="book-cover-placeholder">No Cover</div>';

            bookItem.innerHTML = `
                <div class="book-item-content">
                    ${coverHtml}
                    <div class="book-title">${book.title}</div>
                    <div class="book-author book-info-hidden">${book.author || ''}</div>
                    ${book.rating > 0 ? `<div class="book-rating book-info-hidden">${'★'.repeat(Math.round(book.rating))}${'☆'.repeat(5 - Math.round(book.rating))}</div>` : ''}
                </div>
            `;
            booksList.appendChild(bookItem);
        });
    }

    async function loadBooksFromJson() {
        if (!booksList) return;
        try {
            const response = await fetch('content/books.json', { cache: 'no-cache' });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            displayBooks(Array.isArray(data.books) ? data.books : []);
        } catch (error) {
            console.error('Error loading books.json:', error);
            booksList.innerHTML = '';
        }
    }

    setupLazyCategoryLoader('i love books', loadBooksFromJson);

    if (bookRecommendationForm) {
        bookRecommendationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const validation = validateISBN(isbnInput.value.trim());
            if (!validation.valid) {
                recommendationStatus.textContent = validation.error;
                recommendationStatus.className = 'recommendation-status error';
                return;
            }

            recommendationStatus.textContent = 'Looking up book...';
            recommendationStatus.className = 'recommendation-status';

            const bookData = await fetchBookData(validation.isbn);
            if (!bookData) {
                recommendationStatus.textContent = 'Book not found. Please check the ISBN and try again.';
                recommendationStatus.className = 'recommendation-status error';
                return;
            }

            const button = bookRecommendationForm.querySelector('button');
            button.disabled = true;

            openMailTo({
                subject: `Book recommendation: ${bookData.title}`,
                body: [
                    'Hi Jan Anders,',
                    '',
                    'Book recommendation from janandersekroll.no:',
                    `Title: ${bookData.title}`,
                    `Author: ${bookData.author}`,
                    `ISBN: ${bookData.isbn}`,
                    bookData.cover ? `Cover: ${bookData.cover}` : '',
                    ''
                ].filter(Boolean).join('\n')
            });

            recommendationStatus.textContent = `Found "${bookData.title}" — your email app should open so you can send it.`;
            recommendationStatus.className = 'recommendation-status success';
            isbnInput.value = '';
            button.disabled = false;

            setTimeout(() => {
                recommendationStatus.textContent = '';
                recommendationStatus.className = 'recommendation-status';
            }, 8000);
        });
    }

    // Webpage favicons — local files first, then remote fallbacks, then letter placeholder
    function normalizeDomain(domain) {
        return String(domain || '').replace(/^www\./i, '').toLowerCase();
    }

    function faviconSourcesFor(domain) {
        const host = normalizeDomain(domain);
        return [
            `content/webpages/icons/${host}.png`,
            `https://icon.horse/icon/${host}`,
            `https://icons.duckduckgo.com/ip3/${host}.ico`,
            `https://www.google.com/s2/favicons?domain=${host}&sz=64`
        ];
    }

    function showWebpageIconPlaceholder(img) {
        img.style.display = 'none';
        let placeholder = img.nextElementSibling;
        if (!placeholder || !placeholder.classList.contains('webpage-icon-placeholder')) {
            placeholder = document.createElement('div');
            placeholder.className = 'webpage-icon-placeholder';
            placeholder.setAttribute('aria-hidden', 'true');
            const label = (img.alt || img.getAttribute('data-domain') || '?').trim();
            placeholder.textContent = label.charAt(0).toUpperCase();
            img.insertAdjacentElement('afterend', placeholder);
        }
        placeholder.style.display = 'flex';
    }

    function loadFavicon(img, domain) {
        img.loading = 'eager';
        img.decoding = 'async';

        const sources = faviconSourcesFor(domain);
        let currentIndex = 0;

        // If HTML already points at a local icon, start from there; otherwise begin at 0.
        const currentSrc = img.getAttribute('src') || '';
        if (currentSrc) {
            const matchIndex = sources.findIndex((src) => currentSrc.endsWith(src) || currentSrc.includes(src));
            currentIndex = matchIndex >= 0 ? matchIndex : 0;
        }

        const tryNext = () => {
            if (currentIndex >= sources.length) {
                showWebpageIconPlaceholder(img);
                return;
            }

            img.onerror = () => {
                currentIndex += 1;
                tryNext();
            };

            img.onload = () => {
                img.onerror = null;
                img.style.display = 'block';
                const placeholder = img.nextElementSibling;
                if (placeholder && placeholder.classList.contains('webpage-icon-placeholder')) {
                    placeholder.style.display = 'none';
                }
            };

            img.src = sources[currentIndex];
        };

        // Cached local icons may already be complete.
        if (img.complete && img.naturalWidth > 0) {
            img.style.display = 'block';
            return;
        }

        tryNext();
    }
    
    let hasLoadedWebpageFavicons = false;
    function loadWebpageFavicons() {
        if (hasLoadedWebpageFavicons) return;
        hasLoadedWebpageFavicons = true;

        document.querySelectorAll('.webpage-icon[data-domain]').forEach(img => {
            const domain = img.getAttribute('data-domain');
            loadFavicon(img, domain);
        });
    }
    
    // Load YouTube channel icons from local files
    function loadYouTubeIcon(img, handle) {
        img.loading = 'eager';
        img.decoding = 'async';

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

        const config = iconMap[handle] || {
            folder: handle.toLowerCase(),
            filenames: ['icon.png', 'logo.png', 'icon.jpg', 'logo.jpg']
        };

        let filenameIndex = 0;

        const showPlaceholder = () => {
            img.style.display = 'none';
            const placeholder = img.nextElementSibling;
            if (placeholder && placeholder.classList.contains('channel-logo-placeholder')) {
                placeholder.style.display = 'flex';
            }
        };

        const tryNext = () => {
            if (filenameIndex >= config.filenames.length) {
                showPlaceholder();
                return;
            }

            const iconPath = encodeAssetPath(`content/youtube/${config.folder}/${config.filenames[filenameIndex]}`);
            const testImg = new Image();
            testImg.onload = () => {
                img.src = iconPath;
            };
            testImg.onerror = () => {
                filenameIndex += 1;
                tryNext();
            };
            testImg.src = iconPath;
        };

        img.addEventListener('error', showPlaceholder);
        tryNext();
    }
    
    let hasLoadedYoutubeIcons = false;
    function loadYouTubeIcons() {
        if (hasLoadedYoutubeIcons) return;
        hasLoadedYoutubeIcons = true;

        document.querySelectorAll('.channel-logo[data-youtube-handle]').forEach(img => {
            const handle = img.getAttribute('data-youtube-handle');
            loadYouTubeIcon(img, handle);
        });
    }
    
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

    setupLazyCategoryLoader('webpages', loadWebpageFavicons);
    setupLazyCategoryLoader('youtube', loadYouTubeIcons);
    setupLazyCategoryLoader('other things', loadOtherImages);
    setupLazyCategoryLoader('very nice pictures', loadVeryNicePictures);
    
}); 