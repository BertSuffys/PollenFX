const svgNS = "http://www.w3.org/2000/svg";

const FXConfig = {
  PFX_STYLES_SET: false,                                              // whether the general pfx styles have been set
};

const Pivot = {
  BEGIN: 0,
  CENTER: 0.5,
  END: 1,
};

const PollenFXClasses = {
  EMITTER_CONTAINER_WRAPPER_CLASS: "pollenfx_emitter_wrapper",
  EMITTER_CONTAINER_CLASS: "pollenfx_emitter_container",
  EMITTER_BOX_CLASS: "pollenfx_emitter_box",
  ORIGIN_BOX_CLASS: "pollenfx_origin_box",
  PARTICLE_BOX_CLASS: "pollenfx_particle_box",
  PFX_DISALLOW_OVERFLOW_CLASS: "pfx-disallow-overflow"                // the class preventing overflow on a certain pfx element                                  
};

const PositionUnit = {
  PERCENTAGE: "%",
  PIXEL: "px",
  VIEW_WIDTH: "vw",
  VIEW_HEIGHT: "vh",
  VIEW: "v",
};

const ImageFitting = {
  COVER: "cover",
  FIT: "100% 100%",
  CONTAIN: "contain",
};

const UNSTABLE_ANCHOR_TYPES = ["img", "button", "address", "h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "em"];