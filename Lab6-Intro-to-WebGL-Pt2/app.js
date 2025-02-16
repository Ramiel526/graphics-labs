'use strict'

var gl;

var appInput = new Input();
var time = new Time();
var camera = new Camera(appInput);
var assetLoader = new AssetLoader();

// these will be created after assets are loaded in createScene
var groundGeometry = null;
var sphereGeometry = null;

var projectionMatrix = new Matrix4();

// the shader that will be used by each piece of geometry (they could each use their own shader but in this case it will be the same)
var colorProgram;

// auto start the app when the html page is ready
window.onload = window['initializeAndStartRendering'];

// we need to asynchronously fetch files from the "server" (your local hard drive)
// This specifies the list of assets to load.
const assetList = [
    { name: 'unlitColorVS', url: './shaders/color.unlit.vs.glsl', type: 'text' },
    { name: 'unlitColorFS', url: './shaders/color.unlit.fs.glsl', type: 'text' },
    { name: 'sphereJSON', url: './data/sphere.json', type: 'json' },
];

// -------------------------------------------------------------------------
// Initializes WebGL, loads assets, and starts the render loop
async function initializeAndStartRendering() {
    gl = getWebGLContext("webgl-canvas");

    // load the assets in the list and wait for the process to complete
    var loadededSuccessfully = await assetLoader.loadAssets(assetList);
    if (!loadededSuccessfully) return;

    createShaders();
    createScene();

    // Specify what portion of the canvas we want to draw to (all of it)
    gl.viewport(0, 0, gl.canvasWidth, gl.canvasHeight);
    gl.enable(gl.DEPTH_TEST);

    // Kick off the render loop
    updateAndRender();
}

// -------------------------------------------------------------------------
function createShaders(loadedAssets) {
    var unlitColorVS = assetLoader.assets.unlitColorVS;
    var unlitColorFS = assetLoader.assets.unlitColorFS;

    colorProgram = createCompiledAndLinkedShaderProgram(gl, unlitColorVS, unlitColorFS);
    gl.useProgram(colorProgram);

    colorProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(colorProgram, "aVertexPosition"),
        vertexColorsAttribute: gl.getAttribLocation(colorProgram, "aVertexColor"),
    };

    colorProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(colorProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(colorProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(colorProgram, "uProjectionMatrix"),
        colorUniform: gl.getUniformLocation(colorProgram, "uColor")
    };
}

// -------------------------------------------------------------------------
function createScene() {
    // TRS translation rotation scale
    // multiply left <- right 
    groundGeometry = new WebGLGeometryQuad(gl);
    groundGeometry.create();

    // todo #1 - makeTranslation the quad so you can see it
    // groundGeometry.worldMatrix...
    // ***Editing below to rotate the gnd to coordinate plane then translate to (0, 0, -10)
    // var groundPosition = (0, 0, -10); // new var to hold ground locationoi
    var rotMat = new Matrix4();
    var transMat =  new Matrix4();
    var scaleMat = new Matrix4();

    rotMat.makeRotationX(-90)
    scaleMat.makeScale(10, 10, 10)
    transMat.makeTranslation(0,-1, 10);
    // transMat.makeTranslation(groundPosition);

    // todo #2 - rotate and scale the quad to make it "ground-like"
    
    groundGeometry.worldMatrix.multiply(transMat.multiply(rotMat.multiply(scaleMat)));

    // todo #3 - create the sphere geometry
    // sphereGeometry = ?
    // sphereGeometry.create(?);

    // todo #4 - scale and makeTranslation the sphere
    // sphere.Geometry.worldMatrix...
}

// -------------------------------------------------------------------------
function updateAndRender() {
    requestAnimationFrame(updateAndRender);

    var aspectRatio = gl.canvasWidth / gl.canvasHeight;

    time.update();
    camera.update(time.deltaTime);

    gl.clearColor(0.707, 0.707, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    projectionMatrix.makePerspective(45, aspectRatio, 0.1, 1000);

    gl.useProgram(colorProgram);

    // render ground
    gl.uniform4f(colorProgram.uniforms.colorUniform, 0.5, 0.5, 0.5, 1.0);
    groundGeometry.render(camera, projectionMatrix, colorProgram);

    // todo #5 - change color for the sphere

    // todo #9 - animate the color of the sphere
    // todo #10 - animate the color with non-grayscale values

    // todo #3 - render the sphere
}
