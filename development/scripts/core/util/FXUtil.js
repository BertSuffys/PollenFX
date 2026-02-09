class FXUtil {
  static pollenFXError(msg) {
    let fullMessage = "PollenFX Error -> ".concat(FXUtil.valid(msg) ? msg : "");
    throw new Error(fullMessage);
  }

  static valid(value) {
    if (value == null) return false; // catches null and undefined
    if (typeof value === "string") return value !== "";
    return true;
  }

  static writeClassToDomElement(element, clazz) {
    if (FXUtil.valid(element) && FXUtil.valid(clazz)) {
      element.classList.add(clazz);
    }
  }

  static disallowElementOverflow(element) {
    FXUtil.writeClassToDomElement(element, PollenFXClasses.PFX_DISALLOW_OVERFLOW_CLASS);
  }

  static addDocumentCSS(styles) {
    if (!FXConfig.PFX_STYLES_SET && FXUtil.valid(styles) && Array.isArray(styles)) {
      const styleElement = document.createElement("style");
      styleElement.type = "text/css";
      const stylesJoined = styles.join();
      styleElement.textContent = stylesJoined;
      document.head.appendChild(styleElement);
      FXConfig.PFX_STYLES_SET = true;
    }
  }

  static fromPixel(pixelValueString) {
    return parseInt(pixelValueString.replace("px", "")); // Turns '138.4px' into 138.4
  }
}
