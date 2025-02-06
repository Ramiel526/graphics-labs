/*
 * An object representing a 4x4 matrix
 */

var Matrix4 = function() {
    console.assert(this instanceof Matrix4, "Matrix4 constructor must be called with the 'new' operator");

    this.elements = new Float32Array(16);
    return this.makeIdentity();
}

//=============================================================================  
Matrix4.prototype = {

    // -------------------------------------------------------------------------
    clone: function() {
        var newMatrix = new Matrix4();
        for (var i = 0; i < 16; ++i) {
            newMatrix.elements[i] = this.elements[i];
        }
        return newMatrix;
    },

    // -------------------------------------------------------------------------
    copy: function(m) {
        for (var i = 0; i < 16; ++i) {
            this.elements[i] = m.elements[i];
        }

        return this;
    },

    // -------------------------------------------------------------------------
    getElement: function(row, col) {
        return this.elements[row * 4 + col];
    },

    // -------------------------------------------------------------------------
    set: function(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
        var e = this.elements;

        e[0] = n11; e[1] = n12; e[2] = n13; e[3] = n14;
        e[4] = n21; e[5] = n22; e[6] = n23; e[7] = n24;
        e[8] = n31; e[9] = n32; e[10] = n33; e[11] = n34;
        e[12] = n41; e[13] = n42; e[14] = n43; e[15] = n44;

        return this;
    },

    // -------------------------------------------------------------------------
    makeIdentity: function() {
        // todo make this matrix be the identity matrix
        var e = this.elements; // access matrix elements array
        
        for (var i = 0; i < 16; i++) {  // loop through all matrix elements
            if ( i % 5 === 0) {
                e[i] = 1;  // set diagonal elements to 1
            } else {
                e[i] = 0;  // set all other elements to 0
            }
        }

        return this;
    },

    // -------------------------------------------------------------------------
    multiplyScalar: function(s) {
        for (var i = 0; i < 16; ++i) {
            this.elements[i] = this.elements[i] * s;
        }
    },

    // -------------------------------------------------------------------------
    multiplyVector: function(v) {
        // safety check
        if (!(v instanceof Vector4)) {
            console.error("Trying to multiply a 4x4 matrix with an invalid vector value");
        }
        var e = this.elements;

        // vector component extraction 
        var vx = v.x; 
        var vy = v.y; 
        var vz = v.z; 
        var vw = v.w; 

        // todo
        // set the result vector values to be the result of multiplying the
        // vector v by 'this' matrix
        var newX = (e[0] * vx) + (e[1] * vy) + (e[2] * vz) + (e[3] * vw);
        var newY = (e[4] * vx) + (e[5] * vy) + (e[6] * vz) + (e[7] * vw);
        var newZ = (e[8] * vx) + (e[9] * vy) + (e[10] * vz) + (e[11] * vw);
        var newW = (e[12] * vx) + (e[13] * vy) + (e[14] * vz) + (e[15] * vw);

        var result = new Vector4(newX, newY, newZ, newW);

        return result;
    },

    // -------------------------------------------------------------------------
    multiply: function(rightSideMatrix) {
        // safety check
        if (!(rightSideMatrix instanceof Matrix4)) {
            console.error("Trying to multiply a 4x4 matrix with an invalid matrix value");
            return this; 
        }

        // todo - multiply 'this' * rightSideMatrix
        var a = this.elements; 
        var b = rightSideMatrix.elements; 
        var result = new Float32Array(16);

        // matrix multiplicatoin 
        for (var row = 0; row < 4; row++) {  // loop through each row leftside of matrix
            for (var col = 0; col < 4; col++) {  // loop through column right side of matrix
                var sum = 0; // start sum of 0
                for (var k = 0; k < 4; k++) {  // compute dot product of row and columns
                    sum += a[row * 4 + k] * b[k * 4 + col]; // multiply elements and collect sum 
                }
                result[row * 4 + col] = sum;  // store the value in correct position
            }
        }
        this.elements.set(result); 

        return this;
    },

    // -------------------------------------------------------------------------
    premultiply: function(leftSideMatrix) {
        // ignore this, the implementation will be distributed with the solution
        return this;
    },

    // -------------------------------------------------------------------------
    makeScale: function(x, y, z) {
        // todo make this matrix into a pure scale matrix based on (x, y, z)
        var e = this.elements;

        for (var i = 0; i < 16; i++) {
            e[i] = 0;
        }

        // scale values along the diagonals
        e[0] = x; // x scale
        e[5] = y; // y scale
        e[10] = z; // z scale
        e[15] = 1; // homogeneous coord

        return this;
    },

    // -------------------------------------------------------------------------
    makeRotationX: function(degrees) {
        // todo - convert to radians
        var radians = degrees * (Math.PI / 180); // conversion from degrees to radians

        var cosine = Math.cos(radians); // compute for cosine
        var sine = Math.sin(radians); // compute for sine

        // shortcut - use in place of this.elements
        var e = this.elements;

        for (var i = 0; i < 16; i++) {
            e[i] = 0;
        }

        // todo - set every element of this matrix to be a rotation around the x-axis
        e[0] = 1; // x-axis
        e[5] = cosine;  // cos(θ) affects y
        e[6] = -sine; // -sin(θ) affects y-z swap
        e[9] = sine;  // sin(θ) affects y-z swap
        e[10] = cosine; // cos(θ) affects z
        e[15] = 1; // Homogeneous coordinate

        return this;
    },

    // -------------------------------------------------------------------------
    makeRotationY: function(degrees) {
        // todo - convert to radians
        var radians = degrees * (Math.PI / 180); // conversion from degrees to radians

        var cosine = Math.cos(radians); // compute for cosine
        var sine = Math.sin(radians); // compute for sine

        // shortcut - use in place of this.elements
        var e = this.elements;

        for (var i = 0; i < 16; i++) {
            e[i] = 0;
        }

        // todo - set every element of this matrix to be a rotation around the y-axis
        e[0] = cosine;   // cos(θ) affects x
        e[2] = sine;   // sin(θ) affects x-z swap
        e[5] = 1;   // Y remains unchanged
        e[8] = -sine;  // -sin(θ) affects x-z swap
        e[10] = cosine;  // cos(θ) affects z
        e[15] = 1;  // Homogeneous coordinate

        return this;
    },

    // -------------------------------------------------------------------------
    makeRotationZ: function(degrees) {
        // todo - convert to radians
        var radians = degrees * (Math.PI / 180); // conversion from degrees to radians

        var cosine = Math.cos(radians); // compute for cosine
        var sine = Math.sin(radians); // compute for sine

        // shortcut - use in place of this.elements
        var e = this.elements;

        for (var i = 0; i < 16; i++) {
            e[i] = 0;
        }

        // todo - set every element of this matrix to be a rotation around the z-axis
        e[0] = cosine;   // cos(θ) affects x
        e[1] = -sine;  // -sin(θ) affects x-y swap
        e[4] = sine;   // sin(θ) affects x-y swap
        e[5] = cosine;   // cos(θ) affects y
        e[10] = 1;  // z unchanged
        e[15] = 1;  // Homogeneous coordinate

        return this;
    },

    // -------------------------------------------------------------------------
    makeTranslation: function(arg1, arg2, arg3) {
        // todo - wipe out the existing matrix and make it a pure translation
        var e = this.elements;

        var x, y, z; 
        //      - If arg1 is a Vector3 or Vector4, use its components and ignore
        //        arg2 and arg3. O.W., treat arg1 as x, arg2 as y, and arg3 as z
        if (arg1 instanceof Vector4) {
            x = arg1.x; 
            y = arg1.y; 
            z = arg1.z; 
        } else if (arg1 instanceof Vector3) {
            x = arg1.x; 
            y = arg1.y; 
            z = arg1.z; 
        } else {
            x = arg1; 
            y = arg2; 
            z = arg3; 
        }
        // pure translation matrix overwrite
        e[0] = 1; e[1] = 0; e[2] = 0; e[3] = x;
        e[4] = 0; e[5] = 1; e[6] = 0; e[7] = y;
        e[8] = 0; e[9] = 0; e[10] = 1; e[11] = z;
        e[12] = 0; e[13] = 0; e[14] = 0; e[15] = 1;

        return this;
    },

    // -------------------------------------------------------------------------
    makePerspective: function(fovy, aspect, near, far) {
        // todo - convert fovy to radians
        var fovyRads = fovy * (Math.PI / 180); 

        // todo -compute t (top) and r (right)
        var transform = Math.tan(fovyRads / 2) * near; 
        var rotation = transform * aspect; 
        
        // shortcut - use in place of this.elements
        var e = this.elements;

        for (var i = 0; i < 16; i++) {
            e[i] = 0;
        }

        // todo - set every element to the appropriate value
        e[0] = near / rotation;   // x scaling
        e[5] = near / transform;   // y scaling
        e[10] = -(far + near) / (far - near);  // depth scaling
        e[11] = (-2 * far * near) / (far - near);  // corrected Depth projection
        e[14] = -1;  // perspective division
        e[15] = 0;   // ensures homogeneous division

        return this;
    },

    // -------------------------------------------------------------------------
    makeOrthographic: function(left, right, top, bottom, near, far) {
        // shortcut - use in place of this.elements
        var e = this.elements;

        for (var i = 0; i < 16; i++) {
            e[i] = 0;
        }

        // todo - set every element to the appropriate value
        e[0] = 2 / (right - left);   // x scaling
        e[5] = 2 / (top - bottom);   // y scaling
        e[10] = -2 / (far - near);   // z scaling
        e[3] = -(right + left) / (right - left); // x translation
        e[7] = -(top + bottom) / (top - bottom); // y translation
        e[11] = -(far + near) / (far - near); // z translation
        e[15] = 1; // homogeneous coordinate

        return this;
    },

    // -------------------------------------------------------------------------
    // @translation - a Matrix4 translation matrix
    // @rotation - a Matrix4 rotation Matrix
    // @scale - a Matrix4 scale matrix
    createTRSMatrix: function(translation, rotation, scale) {
        // todo - create a matrix that combines translation, rotation, and scale such
        //        that TRANSFORMATIONS take place in the following order: 1) scale,
        //        2) rotation, and 3) translation. The values of translation, rotation,
        //        and scale should NOT be modified.

        var trsMatrix = new Matrix4();
        trsMatrix.makeIdentity(); 
        trsMatrix.multiply(translation);
        trsMatrix.multiply(rotation); 
        trsMatrix.multiply(scale); 
        
        return trsMatrix;
    },

    // -------------------------------------------------------------------------
    // @currentRotationAngle - the angle of rotation around the earth
    // @offsetFromEarth - the relative displacement from the earth
    // @earthTransform - the transformation used to apply to the earth
    createMoonMatrix: function(currentRotationAngle, offsetFromEarth, earthTransform) {

        // todo - create a matrix that combines translation and rotation such that when
        //        it is applied to a sphere starting at the origin, moves the sphere to 
        //        orbit the earth.  The displacement from the earth is given by  
        //        "offsetFromEarth" and the current rotation around the earth (z-axis)
        //        is given by "currentRotationAngle" degrees.

        // Note: Do NOT change earthTransform but do use it, it already has the rotation and translation for the earth

        var moonMatrix = new Matrix4();

        // todo - combine all necessary matrices necessary to achieve the desired effect
        var rotationMatrix = new Matrix4().makeRotationZ(currentRotationAngle); 
        var translationMatrix = new Matrix4().makeTranslation(offsetFromEarth, 0, 0); 

        moonMatrix.multiply(earthTransform); // apply earth transformation
        moonMatrix.multiply(rotationMatrix); // moon's orbit rotation
        moonMatrix.multiply(translationMatrix); // translation away from earth

        return moonMatrix;
    },

    // -------------------------------------------------------------------------
    determinant: function() {
        var e = this.elements;

        // laid out for clarity, not performance
        var m11 = e[0]; var m12 = e[1]; var m13 = e[2]; var m14 = e[3];
        var m21 = e[4]; var m22 = e[5]; var m23 = e[6]; var m24 = e[7];
        var m31 = e[8]; var m32 = e[9]; var m33 = e[10]; var m34 = e[11];
        var m41 = e[12]; var m42 = e[13]; var m43 = e[14]; var m44 = e[15];

        var det11 = m11 * (m22 * (m33 * m44 - m34 * m43) +
            m23 * (m34 * m42 - m32 * m44) +
            m24 * (m32 * m43 - m33 * m42));

        var det12 = -m12 * (m21 * (m33 * m44 - m34 * m43) +
            m23 * (m34 * m41 - m31 * m44) +
            m24 * (m31 * m43 - m33 * m41));

        var det13 = m13 * (m21 * (m32 * m44 - m34 * m42) +
            m22 * (m34 * m41 - m31 * m44) +
            m24 * (m31 * m42 - m32 * m41));

        var det14 = -m14 * (m21 * (m32 * m43 - m33 * m42) +
            m22 * (m33 * m41 - m31 * m43) +
            m23 * (m31 * m42 - m32 * m41));

        return det11 + det12 + det13 + det14;
    },

    // -------------------------------------------------------------------------
    transpose: function() {
        var te = this.elements;
        var tmp;

        tmp = te[1]; te[1] = te[4]; te[4] = tmp;
        tmp = te[2]; te[2] = te[8]; te[8] = tmp;
        tmp = te[6]; te[6] = te[9]; te[9] = tmp;

        tmp = te[3]; te[3] = te[12]; te[12] = tmp;
        tmp = te[7]; te[7] = te[13]; te[13] = tmp;
        tmp = te[11]; te[11] = te[14]; te[14] = tmp;

        return this;
    },


    // -------------------------------------------------------------------------
    inverse: function() {
        // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
        var te = this.elements,
            me = this.clone().elements,

            n11 = me[0], n21 = me[1], n31 = me[2], n41 = me[3],
            n12 = me[4], n22 = me[5], n32 = me[6], n42 = me[7],
            n13 = me[8], n23 = me[9], n33 = me[10], n43 = me[11],
            n14 = me[12], n24 = me[13], n34 = me[14], n44 = me[15],

            t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
            t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
            t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
            t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

        var det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

        if (det === 0) {
            var msg = "can't invert matrix, determinant is 0";
            console.warn(msg);
            return this.makeIdentity();
        }

        var detInv = 1 / det;

        te[0] = t11 * detInv;
        te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
        te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
        te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;

        te[4] = t12 * detInv;
        te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
        te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
        te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;

        te[8] = t13 * detInv;
        te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
        te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
        te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;

        te[12] = t14 * detInv;
        te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
        te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
        te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;

        return this;
    },

    // -------------------------------------------------------------------------
    log: function() {
        var te = this.elements;
        console.log('[ ' +
            '\n ' + te[0] + ', ' + te[1] + ', ' + te[2] + ', ' + te[3] +
            '\n ' + te[4] + ', ' + te[5] + ', ' + te[6] + ', ' + te[7] +
            '\n ' + te[8] + ', ' + te[9] + ', ' + te[10] + ', ' + te[11] +
            '\n ' + te[12] + ', ' + te[13] + ', ' + te[14] + ', ' + te[15] +
            '\n]'
        );

        return this;
    }
};

