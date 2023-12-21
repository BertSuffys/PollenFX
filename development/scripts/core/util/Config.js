

const Pivot = {
    BEGIN: 0,
    CENTER: 0.5,
    END: 1
}

const PollenFXClasses = {
    EMITTER_CONTAINER_CLASS: "pollenfx_emitter_container",
    EMITTER_BOX_CLASS: "pollenfx_emitter_box",
    PARTICLE_BOX_CLASS: "pollenfx_particle_box"
}

const PositionUnit = {
    PERCENTAGE: "%",
    PIXEL: "px",
    VIEW_WIDTH: "vw",
    VIEW_HEIGHT: "vh",
    VIEW: "v"
}

const ImageFitting = {
    COVER: "cover",
    FIT: "100% 100%",
    CONTAIN: "contain"
}

function pollenFXError(msg) {
    let fullMessage = "PollenFX Error -> ".concat(valid(msg) ? msg : "");
    throw new Error(fullMessage);
}

function valid(value) {
    return value != null && value != undefined;
}


