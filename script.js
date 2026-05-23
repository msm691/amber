document.addEventListener('DOMContentLoaded', () => {
    initNetworkBackground();
    initAgeGate();
    initShareButton();
    initTiltEffect();
    initRippleEffect();
});

/* ==========================================
   1. GESTION DE LA MODALE AGE GATE (+18)
   ========================================== */
function initAgeGate() {
    const ageGate = document.getElementById('age-gate');
    const btnYes = document.getElementById('btn-yes');
    const mainContent = document.getElementById('main-content');

    // La modale s'affiche systématiquement à chaque chargement de page.
    btnYes.addEventListener('click', () => {
        // Au clic sur "Oui", on lance l'animation de disparition
        ageGate.classList.add('hidden');
        
        // On attend la fin du fondu (500ms) pour révéler le site et lancer ses animations
        setTimeout(() => {
            ageGate.style.display = 'none';
            mainContent.classList.add('loaded');
        }, 500);
    });
}

/* ==========================================
   2. BOUTON DE PARTAGE NATIF (Web Share API)
   ========================================== */
function initShareButton() {
    const shareBtn = document.getElementById('share-btn');
    
    if (!navigator.share) {
        shareBtn.style.display = 'none';
        return;
    }

    shareBtn.addEventListener('click', async () => {
        try {
            await navigator.share({
                title: 'Black Amber | Liens Officiels',
                text: 'Découvrez l\'univers exclusif de Black Amber.',
                url: window.location.href
            });
            console.log('Partage réussi !');
        } catch (err) {
            console.log('Partage annulé ou erreur :', err);
        }
    });
}

/* ==========================================
   3. FOND ANIMÉ : RÉSEAU DE PARTICULES
   ========================================== */
function initNetworkBackground() {
    const canvas = document.getElementById('sky-canvas');
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
    });

    let particles = [];
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 1.5;
            this.speedY = (Math.random() - 0.5) * 1.5;
            this.color = Math.random() > 0.5 ? '#15b8a6' : '#38bdf8';
        }
        update() {
            if (this.x > width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > height || this.y < 0) this.speedY = -this.speedY;
            this.x += this.speedX;
            this.y += this.speedY;

            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x -= forceDirectionX * force * 2;
                    this.y -= forceDirectionY * force * 2;
                }
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const numParticles = window.innerWidth < 768 ? 40 : 80;
        for (let i = 0; i < numParticles; i++) particles.push(new Particle());
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 120) {
                    let opacity = 1 - (distance / 120);
                    ctx.strokeStyle = `rgba(21, 184, 166, ${opacity * 0.5})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animate);
    }

    initParticles();
    animate();
}

/* ==========================================
   4. EFFET D'INCLINAISON ET RIPPLE (UI/UX)
   ========================================== */
function initTiltEffect() {
    const buttons = document.querySelectorAll('.link-btn');
    if (window.matchMedia('(pointer: fine)').matches) {
        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const rotateX = (((rect.height / 2) - (e.clientY - rect.top)) / (rect.height / 2)) * 8;
                const rotateY = (((e.clientX - rect.left) - (rect.width / 2)) / (rect.width / 2)) * 8;
                btn.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
            });
        });
    }
}

function initRippleEffect() {
    document.querySelectorAll('.link-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}