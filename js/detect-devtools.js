// Devtools Detection Library
// Provides DisableDevtool function to detect and optionally disable devtools

function DisableDevtool(options = {}) {
  const { tkName = "devtools-key", md5 = "", interval = 100, onDetect = null, disableWithoutKey = false } = options;

  // Check if devtools is open
  const checkDevtools = () => {
    const threshold = 160;

    if (window.outerHeight - window.innerHeight > threshold) {
      return true; // Horizontal devtools detected
    }

    if (window.outerWidth - window.innerWidth > threshold) {
      return true; // Vertical devtools detected
    }

    return false;
  };

  // Check for valid key
  const isValidKey = () => {
    if (!tkName || !md5) return true; // No key required

    const storedKey = localStorage.getItem(tkName);
    return storedKey === md5;
  };

  // Main detection loop
  const intervalMs = parseInt(interval) || 100;

  setInterval(() => {
    const devtoolsOpen = checkDevtools();
    const validKey = isValidKey();

    if (devtoolsOpen) {
      if (onDetect) {
        onDetect(devtoolsOpen);
      }

      if (!validKey && disableWithoutKey) {
        // Optionally disable page
        document.body.innerHTML = "";
        console.clear();
      }
    }
  }, intervalMs);

  // Return object with helper methods
  return {
    isEnabled: () => true,
    getStatus: () => ({
      devtoolsDetected: checkDevtools(),
      keyValid: isValidKey(),
    }),
  };
}

// Make available globally
window.DisableDevtool = DisableDevtool;
