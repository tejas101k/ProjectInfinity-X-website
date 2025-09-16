// src/lib/particles.ts

// Helper function to shade colors (adapted from original JS)
export function shadeColor(color: string, percent: number): string {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);
    R = Math.min(255, Math.max(0, R * (100 + percent) / 100));
    G = Math.min(255, Math.max(0, G * (100 + percent) / 100));
    B = Math.min(255, Math.max(0, B * (100 + percent) / 100));
    const r = Math.round(R);
    const g = Math.round(G);
    const b = Math.round(B);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Detect mobile device
export function isMobile(): boolean {
    if (typeof window === 'undefined') return false; // Server-side check
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Create particles
export function createParticles(type: 'sparkle' | 'droplet', count: number, containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear existing particles
    container.innerHTML = '';

    const colors = type === 'sparkle'
        ? ['#4285f4', '#00c6ff', '#3ddc84', '#fbbc04', '#34a853'] // Original colors
        : ['#4285f4', '#00c6ff', '#3ddc84'];

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add(type);

        const left = Math.random() * 100;
        const top = Math.random() * 100;
        particle.style.left = `${left}%`;
        particle.style.top = `${top}%`;

        const color = colors[Math.floor(Math.random() * colors.length)];
        if (type === 'sparkle') {
            particle.style.backgroundColor = color;
            particle.style.boxShadow = `0 0 8px 2px ${color}`;
            const size = Math.random() * 3 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            const x = (Math.random() - 0.5) * 200;
            const y = (Math.random() - 0.5) * 200;
            particle.style.setProperty('--sparkle-x', `${x}vw`);
            particle.style.setProperty('--sparkle-y', `${y}vh`);
            const duration = Math.random() * 8 + 4;
            const delay = Math.random() * 5;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
        } else { // droplet
            particle.style.background = `linear-gradient(to bottom, ${color}, ${shadeColor(color, -20)})`;
            const width = Math.random() * 8 + 4;
            const height = width * 1.5;
            particle.style.width = `${width}px`;
            particle.style.height = `${height}px`;
            const duration = Math.random() * 6 + 3;
            const delay = Math.random() * 5;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
        }
        container.appendChild(particle);
    }
}

// Initialize particles based on user preference
export function initParticles(): void {
    if (typeof window === 'undefined') return; // Server-side check

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
        console.log("Reduced motion preferred, skipping particle animation.");
        return;
    }

    const sparkleCount = isMobile() ? 15 : 40;
    const dropletCount = isMobile() ? 8 : 20;

    // Ensure containers exist
    if (!document.getElementById('sparkles')) {
        const sparklesDiv = document.createElement('div');
        sparklesDiv.id = 'sparkles';
        sparklesDiv.className = 'particles-container';
        document.body.appendChild(sparklesDiv);
    }
    if (!document.getElementById('droplets')) {
        const dropletsDiv = document.createElement('div');
        dropletsDiv.id = 'droplets';
        dropletsDiv.className = 'particles-container';
        document.body.appendChild(dropletsDiv);
    }

    createParticles('sparkle', sparkleCount, 'sparkles');
    createParticles('droplet', dropletCount, 'droplets');
}