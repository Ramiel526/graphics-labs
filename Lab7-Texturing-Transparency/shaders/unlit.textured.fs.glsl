precision mediump float;

uniform sampler2D uTexture;
uniform float uAlpha;

// todo #3 - receive texture coordinates and verify correctness by 
// using them to set the pixel color 

// todo #12 - animate the texture by adding time to the texture coordinates

void main(void) {
    // todo #5 - sample a color from the texture and visualize

    gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
}
