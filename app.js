let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    installBtn.style.display = "block"; // Mostrar botón
});

installBtn.addEventListener("click", async () => {
    installBtn.style.display = "none";

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
        console.log("Usuario instaló la app");
    } else {
        console.log("Usuario canceló la instalación");
    }

    deferredPrompt = null;
});