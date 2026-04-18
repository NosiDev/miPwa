let deferredPrompt;
const installBtn = document.getElementById("installBtn");

if (installBtn) {
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  const showInstallButton = () => {
    if (isStandalone) return;
    installBtn.style.display = "inline-block";
    installBtn.classList.remove("hidden");
  };

  const hideInstallButton = () => {
    installBtn.style.display = "none";
    installBtn.classList.add("hidden");
  };

  hideInstallButton();

  if (isStandalone) {
    console.log("La app ya está abierta como aplicación instalada");
  } else {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      showInstallButton();
    });
  }

  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    hideInstallButton();
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("Usuario instaló la app");
    } else {
      console.log("Usuario canceló la instalación");
    }

    deferredPrompt = null;
  });

  window.addEventListener("appinstalled", () => {
    console.log("La app fue instalada");
    deferredPrompt = null;
    hideInstallButton();
  });
}
