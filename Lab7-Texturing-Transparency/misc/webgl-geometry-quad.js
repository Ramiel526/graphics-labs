/*
 * A simple object to encapsulate the data and operations of object rasterization
 */
function WebGLGeometryQuad(gl) {
    this.gl = gl;
    this.worldMatrix = new Matrix4();
    this.alpha = 1.0; 

    // -----------------------------------------------------------------------------
    this.getPosition = function() {
        // todo #10 - return a vector4 of this object's world position contained in its matrix
    }

    // -----------------------------------------------------------------------------
    this.create = function(rawImage) {
        var verts = [
            -1.0, -1.0,  0.0,
             1.0, -1.0,  0.0,
            -1.0,  1.0,  0.0,
             1.0,  1.0,  0.0
        ];

        var normals = [
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0
        ];

        var uvs = [
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0
        ];

        var indices = [0, 1, 2, 2, 1, 3];
        this.indexCount = indices.length;

        // create the position and normal information for this object and send it to the GPU
        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(verts), this.gl.STATIC_DRAW);

        this.normalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);

        this.texCoordsBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordsBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(uvs), this.gl.STATIC_DRAW);

        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);

        // If a raw image is provided, create a texture and configure it
        if (rawImage) {
            // todo #4 
            // 1. create the texture (uncomment when ready)
            // this.texture = ?

            // 2. bind the texture

            // needed for the way browsers load images, ignore this
            this.gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

            // 3. set wrap modes (for s and t) for the texture
            // 4. set filtering modes (magnification and minification)
            // 5. send the image WebGL to use as this texture

            // todo #6 - set up trilinear filtering

            // We're done for now, unbind
            this.gl.bindTexture(gl.TEXTURE_2D, null);
        }
    }

    // -----------------------------------------------------------------------------
    this.render = function(camera, projectionMatrix, shaderProgram) {
        this.gl.useProgram(shaderProgram);

        var attributes = shaderProgram.attributes;
        var uniforms   = shaderProgram.uniforms;

        // Bind and set the vertex positions
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.vertexAttribPointer(
            attributes.vertexPositionAttribute,
            3,
            this.gl.FLOAT,
            false,
            0,
            0
        );
        this.gl.enableVertexAttribArray(attributes.vertexPositionAttribute);

        // Bind and set the vertex normals if this attribute exists
        if (attributes.vertexNormalsAttribute !== undefined && attributes.vertexNormalsAttribute !== -1) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
            this.gl.vertexAttribPointer(
                attributes.vertexNormalsAttribute,
                3,
                this.gl.FLOAT,
                false,
                0,
                0
            );
            this.gl.enableVertexAttribArray(attributes.vertexNormalsAttribute);
        }

        // Bind and set the texture coordinates if this attribute exists
        if (attributes.vertexTexcoordsAttribute !== undefined && attributes.vertexTexcoordsAttribute !== -1) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordsBuffer);
            this.gl.vertexAttribPointer(
                attributes.vertexTexcoordsAttribute,
                2,
                this.gl.FLOAT,
                false,
                0,
                0
            );
            this.gl.enableVertexAttribArray(attributes.vertexTexcoordsAttribute);
        }

        // Bind the index buffer
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        // If we have a texture, bind it to texture unit 0 and assign to the sampler
        if (this.texture && uniforms.textureUniform) {
            // todo #4
            // uncomment when ready
            // gl.activeTexture(?);
            // gl.bindTexture(?, ?);
            // send texture uniform to shader
        }

        // Send our uniforms to the shader
        this.gl.uniformMatrix4fv(uniforms.worldMatrixUniform, false, this.worldMatrix.clone().transpose().elements);
        this.gl.uniformMatrix4fv(uniforms.viewMatrixUniform, false, camera.getViewMatrix().clone().transpose().elements);
        this.gl.uniformMatrix4fv(uniforms.projectionMatrixUniform, false, projectionMatrix.clone().transpose().elements);
        this.gl.uniform1f(uniforms.alphaUniform, this.alpha);

        // Draw the geometry
        this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);

        // Unbind the texture if it was bound
        if (this.texture && uniforms.textureUniform) 
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);

        // Disable the vertex attribute arrays
        this.gl.disableVertexAttribArray(attributes.vertexPositionAttribute);

        if (attributes.vertexNormalsAttribute !== undefined && attributes.vertexNormalsAttribute !== -1) 
            this.gl.disableVertexAttribArray(attributes.vertexNormalsAttribute);

        if (attributes.vertexTexcoordsAttribute !== undefined && attributes.vertexTexcoordsAttribute !== -1) 
            this.gl.disableVertexAttribArray(attributes.vertexTexcoordsAttribute);
    }
}
