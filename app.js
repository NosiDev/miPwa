let deferredPrompt;
const installBtn = document.getElementById("installBtn");

if (installBtn) {

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();

    deferredPrompt = e;

    installBtn.classList.remove("hidden"); // mejor para Tailwind
  });

  installBtn.addEventListener("click", async () => {

    if (!deferredPrompt) return;

    installBtn.classList.add("hidden");

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("Usuario instaló la app");
    } else {
      console.log("Usuario canceló la instalación");
    }

    deferredPrompt = null;
  });

}