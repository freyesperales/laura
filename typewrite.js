// Typewriter Effect - Versión Simple

function initTypewriter() {
    const element = document.getElementById('typewriter');
    if (!element) return;
    
    const words = ['negocio', 'empresa', 'proyecto', 'startup', 'marca', 'visión'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let speed = 150;
        
        if (isDeleting) speed = 100;
        
        if (!isDeleting && charIndex === currentWord.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 500;
        }
        
        setTimeout(type, speed);
    }
    
    element.classList.add('typewriter-active');
    type();
}
// Inicialización segura
document.addEventListener('DOMContentLoaded', function() {
    const typewriterElement = document.getElementById('typewriter');
    
    if (typewriterElement) {
        // Limpiar cualquier instancia previa
        typewriterElement.classList.remove('typewriter-active');
        
        // Crear nueva instancia
        const words = ['negocio', 'empresa', 'proyecto', 'startup', 'marca', 'visión'];
        window.typewriterInstance = new TypewriterEffect(typewriterElement, words, {
            typeSpeed: 100,
            deleteSpeed: 50,
            pauseTime: 1800,
            deleteDelay: 800
        });
    }
    
    // Setup tabs functionality...
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const targetContent = document.getElementById(`${targetTab}-plans`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
});