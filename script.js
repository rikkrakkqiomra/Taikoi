document.addEventListener("DOMContentLoaded", function () {
    // Muutetaan taustan tyyliä
    document.body.style.background = "linear-gradient(to right, #D2B48C, #F5DEB3)";
    document.body.style.fontFamily = "Arial, sans-serif";
    document.body.style.color = "#4E342E";
    
    // Luodaan interaktiivinen partikkelitausta
    const background = document.createElement("div");
    background.id = "particle-background";
    document.body.appendChild(background);
    background.style.position = "fixed";
    background.style.top = 0;
    background.style.left = 0;
    background.style.width = "100%";
    background.style.height = "100%";
    background.style.pointerEvents = "none";
    
    for (let i = 0; i < 100; i++) {
        let particle = document.createElement("div");
        particle.classList.add("particle");
        background.appendChild(particle);
    }
    
    const particles = document.querySelectorAll(".particle");
    particles.forEach(p => {
        p.style.position = "absolute";
        p.style.width = "5px";
        p.style.height = "5px";
        p.style.background = "rgba(255, 255, 255, 0.5)";
        p.style.borderRadius = "50%";
        p.style.top = Math.random() * window.innerHeight + "px";
        p.style.left = Math.random() * window.innerWidth + "px";
        
        animateParticle(p);
    });
    
    function animateParticle(particle) {
        let duration = Math.random() * 5 + 2;
        particle.animate(
            [{ transform: "translateY(0)" }, { transform: "translateY(-100px)" }],
            { duration: duration * 1000, iterations: Infinity, easing: "linear" }
        );
    }
    
    // Lisätään toiminnallisuutta terminaaliin
    const terminalInput = document.querySelector(".terminal-input");
    const quotesContainer = document.getElementById("quotes");
    
    const quotes = {
        "imagination": "Einstein — 'Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world, stimulating progress, giving birth to evolution.'",
        "growth": "Friedrich Nietzsche — 'One must be a sea, to receive a polluted stream without becoming impure.'"
    };
    
    terminalInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            let input = this.value.trim().toLowerCase();
            this.value = "";
            
            quotesContainer.innerHTML = "";
            
            if (quotes[input]) {
                let quoteDiv = document.createElement("div");
                quoteDiv.classList.add("quote");
                quoteDiv.textContent = quotes[input];
                quotesContainer.appendChild(quoteDiv);
                quoteDiv.style.opacity = 0;
                setTimeout(() => (quoteDiv.style.opacity = 1), 100);
            } else {
                let errorDiv = document.createElement("div");
                errorDiv.classList.add("quote");
                errorDiv.textContent = "Ei löytynyt vastausta.";
                quotesContainer.appendChild(errorDiv);
                errorDiv.style.opacity = 0;
                setTimeout(() => (errorDiv.style.opacity = 1), 100);
            }
        }
    });
});
