// -------------------------------------------------------------------------
// Initialize and return the WebGL context
function getWebGLContext(canvasID, fullScreen) {
    let canvas = document.getElementById(canvasID);
    let gl;

    // Set the canvas to fill the screen and adjust for high DPI
    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;

        // Set canvas style size (CSS pixels)
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

        // Set canvas internal size (scaled for device pixel ratio)
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;

        // Adjust the WebGL viewport if gl is initialized
        if (gl) {
            gl.viewport(0, 0, canvas.width, canvas.height);
        }
    }

    if (fullScreen) {
        // Resize canvas initially and when the window resizes
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
    }

    try {
        gl = canvas.getContext("webgl", { alpha: false });

        // Adjust the viewport to the new canvas size
        gl.viewport(0, 0, canvas.width, canvas.height);

        // Store canvas dimensions
        gl.canvasWidth = canvas.width;
        gl.canvasHeight = canvas.height;

        return gl;
    } catch (e) {
        console.error('Failed to initialize WebGL:', e);
    }

    if (!gl) {
        alert("Could not initialize WebGL, sorry :-(");
    }

    return null;
}

// -------------------------------------------------------------------------
function createCompiledShader(gl, shaderText, shaderType) {
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderText);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(shader);
        console.error('Shader compilation failed:', error);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// -----------------------------------------------------------------------------
function createCompiledAndLinkedShaderProgram(gl, vertexShaderText, fragmentShaderText) {
    const vertexShader = createCompiledShader(gl, vertexShaderText, gl.VERTEX_SHADER);
    const fragmentShader = createCompiledShader(gl, fragmentShaderText, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) {
        console.error('Failed to compile shaders.');
        return null;
    }

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        const error = gl.getProgramInfoLog(shaderProgram);
        console.error('Program linking failed:', error);
        gl.deleteProgram(shaderProgram);
        return null;
    }

    return shaderProgram;
}

// -------------------------------------------------------------------------
function checkFrameBufferStatus(gl) {
    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    switch(status) {
        case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
            console.log('Framebuffer incomplete: attachment');
            break;
        case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
            console.log('Framebuffer incomplete: missing attachment');
            break;
        case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
            console.log('Framebuffer incomplete: dimensions');
            break;
        case gl.FRAMEBUFFER_UNSUPPORTED:
            console.log('Framebuffer unsupported');
            break;
        default:
            // Framebuffer is complete
            break;
    }
}
