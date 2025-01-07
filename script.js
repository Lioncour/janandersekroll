// Handle category and subcategory clicking
document.addEventListener('DOMContentLoaded', () => {
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
        title.addEventListener('click', async () => {
            const projectId = title.getAttribute('data-project');
            console.log('Project clicked:', projectId);
            const projectDetails = document.getElementById(projectId);
            const projectConfig = projectsConfig[projectId];
            console.log('Project config:', projectConfig);
            
            if (projectDetails.classList.contains('active')) {
                projectDetails.classList.remove('active');
            } else {
                // Load content if not already loaded
                if (!projectDetails.dataset.loaded) {
                    const content = await loadProjectContent(projectConfig.folder);
                    console.log('Loaded content:', content);
                    const html = marked.parse(content); // Convert markdown to HTML
                    console.log('Parsed HTML:', html);
                    
                    // Create project card with dynamic content
                    projectDetails.innerHTML = `
                        <article class="project-card">
                            <div class="project-images">
                                <img src="content/projects/${projectConfig.folder}/P1120480.JPG" alt="${projectConfig.title}">
                                <img src="content/projects/${projectConfig.folder}/Artboard 2-100.jpg" alt="${projectConfig.title}">
                                <img src="content/projects/${projectConfig.folder}/2 - Trend.png" alt="${projectConfig.title}">
                                <img src="content/projects/${projectConfig.folder}/4 - Statistic.png" alt="${projectConfig.title}">
                            </div>
                            <div class="project-info">
                                ${html}
                            </div>
                        </article>
                    `;
                    projectDetails.dataset.loaded = 'true';
                }
                projectDetails.classList.add('active');
            }
        });
    });

    // Cursor movement code
    const SVGNS = 'http://www.w3.org/2000/svg';
    const EASE = 0.5;

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
                
                const linePosNext = linePos + (leaderPos - linePos) * EASE;
                
                set({[pos2]: leaderPos - linePosNext});
                
                return linePosNext;
            }
        };
        
        gsap.set(line, pointer);
        
        gsap.to(line, {
            x: '+=1',
            y: '+=1',
            repeat: -1,
            ease: 'linear',
            modifiers: {
                x: genModifier('x'),
                y: genModifier('y')
            }
        });  
        
        return line;
    }

    function createTrail(color, length = 10) {  
        const svg = document.createElementNS(SVGNS, 'svg');

        let leader = (prop) => prop === 'x' ? pointer.x : pointer.y;

        for (let i = 0; i < length; i++) {
            const line = createLine(leader);
            
            line.style.stroke = color;
            svg.appendChild(line);
            
            leader = gsap.getProperty(line);
        }
        
        document.body.appendChild(svg);
    }

    window.addEventListener('pointerdown', updatePointer);
    window.addEventListener('pointermove', updatePointer);

    // Add cursor toggle functionality
    const toggleButton = document.getElementById('cursor-toggle');
    const body = document.body;
    
    toggleButton.addEventListener('click', () => {
        body.classList.toggle('cursor-effect-disabled');
        toggleButton.textContent = body.classList.contains('cursor-effect-disabled') 
            ? 'Enable Cursor Effect' 
            : 'Disable Cursor Effect';
    });

    // Create trails with new color scheme
    createTrail('rgba(255, 192, 203, 0.4)', 15);
    createTrail('rgba(230, 230, 250, 0.4)', 10);
    createTrail('rgba(224, 227, 230, 0.3)', 8);
    createTrail('rgba(147, 112, 219, 0.4)', 5);

    // Add click counter for name
    let nameClickCount = 0;
    let lastClickTime = 0;
    const nameElement = document.querySelector('h1');

    nameElement.addEventListener('click', () => {
        const now = Date.now();
        if (now - lastClickTime > 2000) {
            nameClickCount = 1;
        } else {
            nameClickCount++;
        }
        lastClickTime = now;

        if (nameClickCount >= 3) {
            createRandomParticleExplosions();
            window.createRainbowTrails();
            nameClickCount = 0;
        }
    });

    // Add newsletter submit handler
    const newsletterForm = document.querySelector('.signup-form');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const button = newsletterForm.querySelector('button');
        createRandomParticleExplosions();
        window.createRainbowTrails();
        
        // Show success message
        button.textContent = 'Subscribed! ✨';
        setTimeout(() => {
            button.textContent = 'Subscribe';
        }, 2000);
    });

    // Add profile image click handler
    const profileImage = document.querySelector('.profile-image-container');
    if (profileImage) {
        profileImage.addEventListener('click', () => {
            const rect = profileImage.getBoundingClientRect();
            createRandomParticleExplosions();
            window.createRainbowTrails();
        });
    }
}); 

const projectsConfig = {
    'medical-projects': {
        title: 'A bunch of medical projects',
        year: '2024',
        folder: 'A bunch of medical projects'
    },
    'funny-project': {
        title: 'Funny project',
        year: '2024',
        folder: 'Funny project'
    },
    'fylgja': {
        title: 'Fylgja',
        year: '2023',
        folder: 'Fylgja'
    },
    'lego': {
        title: 'Lego',
        year: '2023',
        folder: 'Lego'
    },
    'master-thesis': {
        title: 'Master Thesis',
        year: '2023',
        folder: 'Master Thesis'
    },
    'oslonokelen': {
        title: 'Oslonøkelen',
        year: '2023',
        folder: 'Oslonokelen'
    }
};

async function loadProjectContent(projectId) {
    const folder = projectsConfig[projectId].folder;
    const projectPath = `content/projects/${folder}/README.md`;
    try {
        const response = await fetch(projectPath);
        if (!response.ok) throw new Error('Content not found');
        const markdown = await response.text();
        return markdown;
    } catch (error) {
        console.error('Error loading project content:', error);
        console.log('Failed to load:', projectPath);
        return '# Content not available\nProject details could not be loaded.';
    }
} 

// Make createTrail function globally available
window.createTrail = createTrail;

// Move createRainbowTrails function outside of DOMContentLoaded
function createRainbowTrails() {
    const colors = [
        'rgba(255, 0, 0, 0.4)',    // Red
        'rgba(255, 165, 0, 0.4)',  // Orange
        'rgba(255, 255, 0, 0.4)',  // Yellow
        'rgba(0, 255, 0, 0.4)',    // Green
        'rgba(0, 0, 255, 0.4)',    // Blue
        'rgba(238, 130, 238, 0.4)'  // Violet
    ];

    colors.forEach((color, i) => {
        setTimeout(() => {
            createTrail(color, 15);
        }, i * 100);
    });
} 

function createParticleExplosion(x, y) {
    const particles = [];
    const particleCount = 100;
    const colors = [
        '#FF69B4', // Pink
        '#FFB6C1', // Light Pink
        '#DDA0DD', // Plum
        '#EE82EE', // Violet
        '#DA70D6', // Orchid
        '#FF1493'  // Deep Pink
    ];

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 15 + 5;
        
        particle.style.position = 'absolute';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.filter = 'blur(1px)';
        particle.style.transform = 'translate(-50%, -50%)';
        
        container.appendChild(particle);
        particles.push(particle);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 15 + 5;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        let opacity = 1;

        gsap.to(particle, {
            x: vx * 20,
            y: vy * 20,
            opacity: 0,
            duration: 1 + Math.random(),
            ease: 'power2.out',
            onComplete: () => {
                container.removeChild(particle);
                if (particles.every(p => !p.parentNode)) {
                    document.body.removeChild(container);
                }
            }
        });
    }
} 

function createRandomParticleExplosions() {
    const numExplosions = 5; // Number of simultaneous explosions
    
    for (let i = 0; i < numExplosions; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createParticleExplosion(x, y);
        }, i * 200); // Stagger the explosions
    }
} 