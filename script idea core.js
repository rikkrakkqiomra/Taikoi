document.addEventListener("DOMContentLoaded", function () {
    console.log("Skripti ladattu!"); // Testaa, että skripti käynnistyy

    // Muutetaan taustan tyyliä
    document.body.style.background = "linear-gradient(to right, #D2B48C, #F5DEB3)";
    document.body.style.fontFamily = "Arial, sans-serif";
    document.body.style.color = "#4E342E";
    
    // Lisätään terminaalin toiminnallisuus
    const terminalInput = document.querySelector(".terminal-input");
    const quotesContainer = document.getElementById("quotes");
    const terminalContainer = document.querySelector(".terminal-container");

    if (!terminalInput) {
        console.error("Virhe: .terminal-input ei löydy! Varmista, että HTML sisältää tämän elementin.");
        return;
    }

    console.log("Terminaali löydetty!"); // Varmistetaan, että elementti löytyy

    const quotes = {
        "imagination": "Einstein — 'Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world, stimulating progress, giving birth to evolution.'",
        "growth": "Friedrich Nietzsche — 'One must be a sea, to receive a polluted stream without becoming impure.'"
    };

    terminalInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            console.log("Enter painettu!"); // Testaa, että enter-näppäin rekisteröityy
            e.preventDefault();

            let input = this.value.trim().toLowerCase();
            this.value = "";

            quotesContainer.innerHTML = "";

            const output = document.createElement("p");
            output.style.color = "#00ff00";
            output.style.fontWeight = "bold";

if (quotes[input]) {
    let quoteDiv = document.createElement("div");
    quoteDiv.classList.add("quote");
    quoteDiv.textContent = quotes[input];
    quotesContainer.appendChild(quoteDiv);
    
    setTimeout(() => {
        quoteDiv.classList.add("show");
    }, 50);
} else {
    let errorDiv = document.createElement("div");
    errorDiv.classList.add("quote");
    errorDiv.textContent = "Ei löytynyt vastausta.";
    quotesContainer.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.classList.add("show");
    }, 50);
}

            
            terminalContainer.appendChild(output);
            terminalContainer.scrollTop = terminalContainer.scrollHeight;
        }
    });
});
