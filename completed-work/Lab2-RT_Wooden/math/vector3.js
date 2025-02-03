/*
 * An "object" representing a 3d vector to make operations simple and concise.
 *
 * Similar to how we work with plain numbers, we will work with vectors as
 * an entity unto itself.  Note the syntax below: var Vector3 = function...
 * This is different than you might be used to in most programming languages.
 * Here, the function is meant to be instantiated rather than called and the
 * instantiation process IS similar to other object oriented languages => new Vector3()
 */

var Vector3 = function(x, y, z) {
    this.x = x; this.y = y; this.z = z;
    // if(x !== undefined)
    
    // todo - make sure to set a default value in case x, y, or z is not passed in

    // let isAdult = age >= 18 ? "Yes" : "No"; // Yes if true, No if false
    
    //let result = condition ? value_if_true : value_if_false;

    this.x = (x !== undefined) ? x : 0;
    this.y = (y !== undefined) ? y : 0;
    this.z = (z !== undefined) ? z : 0;
    
    console.assert(this instanceof Vector3, "Vector3 constructor must be called with the 'new' operator");
    console.assert(typeof(this.x) === "number");
    console.assert(typeof(this.y) === "number");
    console.assert(typeof(this.z) === "number");
}

Vector3.prototype = {

    //----------------------------------------------------------------------------- 
    set: function(x, y, z) {
        // todo set 'this' object's values to those from x, y, and z

        // Don't know why this doesn't work, should be assigning to the attributes
        // Vector3.x = x 
        // Vector3.y = y 
        // Vector3.z = z   

        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    },

    //----------------------------------------------------------------------------- 
    clone: function() {
        return new Vector3(this.x, this.y, this.z);
    },

    //----------------------------------------------------------------------------- 
    copy: function(other) {
        // copy the values from other into 'this'
        //this = other; 
        this.x = other.x; 
        this.y = other.y;
        this.z = other.z;

        return this;
    },

    //----------------------------------------------------------------------------- 
    negate: function() {
        // multiply 'this' vector by -1
        // This SHOULD change the values of this.x, this.y, and this.z

        this.x *= -1;
        this.y *= -1;
        this.z *= -1;

       //this *= -1;

        return this;
    },

    //----------------------------------------------------------------------------- 
    add: function(v) {
        // todo - add v to 'this' vector
        // This SHOULD change the values of this.x, this.y, and this.z

        this.x += v.x
        this.y += v.y
        this.z += v.z

        return this;
    },

    //----------------------------------------------------------------------------- 
    subtract: function(v) {
        // todo - subtract v from 'this' vector
        // This SHOULD change the values of this.x, this.y, and this.z

        this.x -= v.x
        this.y -= v.y
        this.z -= v.z
        
        // this.x = this.x - v.x

       return this;
    },

    //----------------------------------------------------------------------------- 
    multiplyScalar: function(scalar) {
        // multiply 'this' vector by "scalar"
        // This SHOULD change the values of this.x, this.y, and this.z

        // this *= scalar;

        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;

        return this;
    },

    //----------------------------------------------------------------------------- 
    length: function() {
        // todo - return the magnitude (A.K.A. length) of 'this' vector
        // This should NOT change the values of this.x, this.y, and this.z
        let length = Math.sqrt(this.x ** 2  + this.y ** 2 + this.z ** 2)

        return length;
    },

    //----------------------------------------------------------------------------- 
    lengthSqr: function() {
        // todo - return the squared magnitude of this vector ||v||^2
        // This should NOT change the values of this.x, this.y, and this.z

        // There are many occasions where knowing the exact length is unnecessary 
        // and the square can be substituted instead (for performance reasons).  
        // This function should NOT have to take the square root of anything.
        let squaredLen = (this.length()) ** 2

        return squaredLen;
    },

    //----------------------------------------------------------------------------- 
    normalize: function() {
        // todo - Change the components of this vector so that its magnitude will equal 1.
        // This SHOULD change the values of this.x, this.y, and this.z
        const len = this.length();

        if (len > 0){
            this.x /= len;
            this.y /= len;
            this.z /= len;
        }
        return this;
    },

    //----------------------------------------------------------------------------- 
    dot: function(other) {
        // todo - return the dot product betweent this vector and "other"
        // This should NOT change the values of this.x, this.y, and this.z

        var dotProd = this.x * other.x + this.y * other.y + this.z * other.z
        return dotProd;
    },


    //============================================================================= 
    // The functions below must be completed in order to receive an "A"

    //----------------------------------------------------------------------------- 
    rescale: function(newScale) {
        // todo - Change this vector's length to be newScale
        const currentLength = this.length();
        if (currentLength > 0){
            const scale = newScale / currentLength;
            this.x *= scale;
            this.y *= scale;
            this.z *= scale;

        }
        return this;
    }
};

// These functions do not require a Vector3 instance, just call Vector3.myFunction(...)

//----------------------------------------------------------------------------- 
Vector3.fromTo = function(fromPoint, toPoint) { 
    if (!(fromPoint instanceof Vector3) || !(toPoint instanceof Vector3)) {
        console.error("fromTo requires instance of Vector3: 'from' and 'to'");
    }

    return new Vector3 (toPoint.x - fromPoint.x, toPoint.y - fromPoint.y, toPoint.z - fromPoint.z); 

    // todo - return the vector that goes from "fromPoint" to "toPoint"
    //        NOTE - "fromPoint" and "toPoint" should not be altered
}

//----------------------------------------------------------------------------- 
Vector3.angle = function(v1, v2) {
    // todo - calculate the angle in degrees between vectors v1 and v2. Do NOT
    //        change any values on the vectors themselves
    /* 
    the math checks were provided with help from my partner Jin Xing Tan (Herman)
    */
    if ( !(v1 instanceof Vector3) || !(v2 instanceof Vector3)) {
        console.error('angle requires two vectors; "v1" and "v2"')
        return null;
    }
    
    const dotProduct = v1.dot(v2);
    const magnitudeProduct = v1.length() * v2.length();

    if (magnitudeProduct === 0) {
        console.error('Cannot calculate angle with zero-length vector');
        return null;
    }

    const angleInRadians = Math.acos(dotProduct / magnitudeProduct);
    return (angleInRadians * 180) / Math.PI;
}

//----------------------------------------------------------------------------- 
Vector3.project = function(vectorToProject, otherVector) {
    // todo - return a vector that points in the same direction as "otherVector"
    //        but whose length is the projection of "vectorToProject" onto "otherVector"
    //        NOTE - "vectorToProject" and "otherVector" should NOT be altered (i.e. use clone)
    //        See "1.x - Vector Projection Recipe" slides under resources/lecture for more information

    if ( !(vectorToProject instanceof Vector3) || !(otherVector instanceof Vector3)) {
        console.error('project requires two vectors: "vectorToProject" and "otherVector"');
        return null;
    }

    const dotProduct = vectorToProject.dot(otherVector);
    const magnitudeSquared = otherVector.lengthSqr();

    if (magnitudeSquared === 0) {
        console.error("Cannot project onto a zero-length vector");
        return null;
    }
    const scalarProjection = dotProduct / magnitudeSquared;

    return otherVector.clone().multiplyScalar(scalarProjection)
}