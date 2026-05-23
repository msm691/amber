document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initPhotographyBackground();
    initAgeGate();
    initShareButton();
    initTiltEffect();
    initRippleEffect();
});

/* ==========================================
   0. GESTION DU THÈME (Jour / Nuit)
   ========================================== */
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-btn');
    const icon = document.getElementById('theme-icon');
    
    const savedTheme = localStorage.getItem('blackamber_theme');
    
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        icon.className = 'ph ph-sun';
    }

    themeBtn.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            document.body.removeAttribute('data-theme');
            icon.className = 'ph ph-moon';
            localStorage.setItem('blackamber_theme', 'light');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            icon.className = 'ph ph-sun';
            localStorage.setItem('blackamber_theme', 'dark');
        }
    });
}

/* ==========================================
   1. GESTION DE LA MODALE AGE GATE (+18)
   ========================================== */
function initAgeGate() {
    const ageGate = document.getElementById('age-gate');
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no'); // NOUVEAU : Sélection du bouton non
    const mainContent = document.getElementById('main-content');
    const exclusiveLinks = document.querySelectorAll('.link-btn.highlight');
    let targetUrl = '';

    // 1. On affiche le site immédiatement au chargement
    mainContent.classList.add('loaded');

    // 2. On écoute les clics sur les plateformes exclusives
    exclusiveLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            targetUrl = e.currentTarget.href; 
            
            ageGate.style.display = 'flex';
            setTimeout(() => {
                ageGate.classList.remove('hidden');
            }, 10);
        });
    });

    // 3. Si l'utilisateur clique sur "Oui"
    btnYes.addEventListener('click', () => {
        if (targetUrl) {
            window.open(targetUrl, '_blank'); 
            targetUrl = ''; 
        }
        
        ageGate.classList.add('hidden');
        setTimeout(() => {
            ageGate.style.display = 'none';
        }, 500);
    });

    // 4. NOUVEAU : Si l'utilisateur clique sur "Non, quitter"
    btnNo.addEventListener('click', (e) => {
        e.preventDefault(); // Annule le comportement du lien
        targetUrl = ''; // Efface la destination de la plateforme exclusive
        
        // Referme simplement la fenêtre en douceur
        ageGate.classList.add('hidden');
        setTimeout(() => {
            ageGate.style.display = 'none';
        }, 500);
    });
}

/* ==========================================
   2. BOUTON DE PARTAGE NATIF
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
        } catch (err) {}
    });
}

/* ==========================================
   3. FOND ANIMÉ : BOKEH CINÉMATOGRAPHIQUE
   ========================================== */
function initPhotographyBackground() {
    const canvas = document.getElementById('sky-canvas');
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initBokeh();
    });

    let orbs = [];
    
    class BokehOrb {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 80 + 30; 
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            
            const isTurquoise = Math.random() > 0.4;
            this.colorRGB = isTurquoise ? '21, 184, 166' : '255, 255, 255';
            this.maxAlpha = Math.random() * 0.15 + 0.05;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > width + this.size) this.x = -this.size;
            if (this.x < -this.size) this.x = width + this.size;
            if (this.y > height + this.size) this.y = -this.size;
            if (this.y < -this.size) this.y = height + this.size;
        }
        
        draw() {
            ctx.beginPath();
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            gradient.addColorStop(0, `rgba(${this.colorRGB}, ${this.maxAlpha})`);
            gradient.addColorStop(0.6, `rgba(${this.colorRGB}, ${this.maxAlpha * 0.4})`);
            gradient.addColorStop(1, `rgba(${this.colorRGB}, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initBokeh() {
        orbs = [];
        const numOrbs = window.innerWidth < 768 ? 15 : 30;
        for (let i = 0; i < numOrbs; i++) {
            orbs.push(new BokehOrb());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        orbs.forEach(orb => {
            orb.update();
            orb.draw();
        });
        requestAnimationFrame(animate);
    }

    initBokeh();
    animate();
}

/* ==========================================
   4. EFFET D'INCLINAISON ET RIPPLE
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