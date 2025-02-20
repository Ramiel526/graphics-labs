'use strict'

var gl;

var appInput = new Input();
var time = new Time();
var camera = new OrbitCamera(appInput);
const assetLoader = new AssetLoader();

var sphereGeometryList = []; // this will be created after assets are loaded
var groundGeometry = null;   // this will be procedurally created

var projectionMatrix = new Matrix4();

// the shader that will be used by each piece of geometry (they could each use their own shader but in this case it will be the same)
var textureShaderProgram;

// auto start the app when the html page is ready
window.onload = window['initializeAndStartRendering'];

// List of assets to load
const assetList = [
    { name: 'textureTextVS', url: './shaders/unlit.textured.vs.glsl', type: 'text' },
    { name: 'textureTextFS', url: './shaders/unlit.textured.fs.glsl', type: 'text' },
    { name: 'sphereJSON', url: './data/sphere.json', type: 'json' },
    { name: 'uvGridImage', url: './data/uvgrid.png', type: 'image' }
];

// -------------------------------------------------------------------------
async function initializeAndStartRendering() {
    gl = getWebGLContext("webgl-canvas");

    await assetLoader.loadAssets(assetList);

    createShaders();
    createScene();

    // todo #8
    // - enable depth test (z-buffering)
    // - enable backface culling

    updateAndRender();
}

// -------------------------------------------------------------------------
function createShaders()  {
    const textureTextVS = assetLoader.assets.textureTextVS;
    const textureTextFS = assetLoader.assets.textureTextFS;

    textureShaderProgram = createCompiledAndLinkedShaderProgram(gl, textureTextVS, textureTextFS);

    textureShaderProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(textureShaderProgram, "aVertexPosition"),
        vertexTexcoordsAttribute: gl.getAttribLocation(textureShaderProgram, "aTexcoords")
    };

    textureShaderProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(textureShaderProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(textureShaderProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(textureShaderProgram, "uProjectionMatrix"),
        textureUniform: gl.getUniformLocation(textureShaderProgram, "uTexture"),
        alphaUniform: gl.getUniformLocation(textureShaderProgram, "uAlpha"),
    };
}

// -------------------------------------------------------------------------
function createScene() {
    groundGeometry = new WebGLGeometryQuad(gl, textureShaderProgram);
    groundGeometry.create(assetLoader.assets.uvGridImage);

    // make it bigger
    var scale = new Matrix4().makeScale(10.0, 10.0, 10.0);

    // compensate for the model being flipped on its side
    var rotation = new Matrix4().makeRotationX(-90);

    groundGeometry.worldMatrix.multiply(rotation).multiply(scale);

    for (var i = 0; i < 3; ++i) {
        var sphereGeometry = new WebGLGeometryJSON(gl, textureShaderProgram);
        sphereGeometry.create(assetLoader.assets.sphereJSON, assetLoader.assets.uvGridImage);

        // Scale it down so that the diameter is 3 (model is at 100x scale)
        var scale = new Matrix4().makeScale(0.03, 0.03, 0.03);

        // raise it by the radius to make it sit on the ground
        var translation = new Matrix4().makeTranslation(0, 1.5, -5 + i * 5);

        sphereGeometry.worldMatrix.makeIdentity();
        sphereGeometry.worldMatrix.multiply(translation).multiply(scale);

        sphereGeometry.alpha = 0.2 + 0.8 * (i / 2);

        sphereGeometryList.push(sphereGeometry);
    }
}

// -------------------------------------------------------------------------
function updateAndRender() {
    requestAnimationFrame(updateAndRender);

    var aspectRatio = gl.canvasWidth / gl.canvasHeight;

    time.update();
    camera.update(time.deltaTime, time.secondsElapsedSinceStart);

    // specify what portion of the canvas we want to draw to (all of it, full width and height)
    gl.viewport(0, 0, gl.canvasWidth, gl.canvasHeight);

    // this is a new frame so let's clear out whatever happened last frame
    gl.clearColor(0.707, 0.707, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    projectionMatrix.makePerspective(45, aspectRatio, 0.1, 1000);

    groundGeometry.render(camera, projectionMatrix, textureShaderProgram);

    // todo #9
    //   1. enable blending
    //   2. set blend mode source to gl.SRC_ALPHA and destination to gl.ONE_MINUS_SRC_ALPHA

    // todo #11 apply the painter's algorithm

    // todo #7 
    // uncomment when directed by guide
    // for (var i = 0; i < sphereGeometryList.length; ++i) {
    //     sphereGeometryList[i].render(camera, projectionMatrix, textureShaderProgram);
    // }

    // todo - disable blending
}
