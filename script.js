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
        title.addEventListener('click', () => {
            const projectId = title.getAttribute('data-project');
            const projectDetails = document.getElementById(projectId);
            
            // Toggle the clicked project
            projectDetails.classList.toggle('active');
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
}); 