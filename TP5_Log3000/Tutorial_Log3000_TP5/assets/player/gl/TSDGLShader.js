var kTSDGLShaderUniformColor="Color";var kTSDGLShaderUniformDuration="Duration";var kTSDGLShaderUniformMotionBlurVector="MotionBlurVector";var kTSDGLShaderUniformMVPMatrix="MVPMatrix";var kTSDGLShaderUniformOpacity="Opacity";var kTSDGLShaderUniformParticleTexture="ParticleTexture";var kTSDGLShaderUniformPercent="Percent";var kTSDGLShaderUniformPreviousMVPMatrix="PreviousMVPMatrix";var kTSDGLShaderUniformTexture="Texture";var kTSDGLShaderUniformTextureMatrix="TextureMatrix";var kTSDGLShaderUniformTextureSize="TextureSize";var kTSDGLShaderUniformTexture2="Texture2";var kTSDGLShaderUniformTexture2Matrix="Texture2Matrix";var kTSDGLShaderUniformTexture2Size="Texture2Size";var kTSDGLShaderUniformVelocityScale="VelocityScale";var kTSDGLShaderUniformVelocityTexture="VelocityTexture";var kTSDGLShaderAttributeCenter="Center";var kTSDGLShaderAttributeColor="Color";var kTSDGLShaderAttributeLifeSpan="LifeSpan";var kTSDGLShaderAttributeNormal="Normal";var kTSDGLShaderAttributeParticleTexCoord="ParticleTexCoord";var kTSDGLShaderAttributePosition="Position";var kTSDGLShaderAttributePreviousPosition="PreviousPosition";var kTSDGLShaderAttributeRotation="Rotation";var kTSDGLShaderAttributeScale="Scale";var kTSDGLShaderAttributeSpeed="Speed";var kTSDGLShaderAttributeTexCoord="TexCoord";var kTSDGLShaderUniformRotationMax="RotationMax";var kTSDGLShaderUniformSpeedMax="SpeedMax";var TSDGLShaderQualifierType={Unknown:0,Int:1,Float:2,Vec2:3,Vec3:4,Vec4:5,Mat3:6,Mat4:7};function TSDGLShaderQualifierTypeFromGLenum(b){var a=TSDGLShaderQualifierType.Unknown;switch(b){case GL_FLOAT:a=TSDGLShaderQualifierType.Float;break;case GL_FLOAT_VEC2:a=TSDGLShaderQualifierType.Vec2;break;case GL_FLOAT_VEC3:a=TSDGLShaderQualifierType.Vec3;break;case GL_FLOAT_VEC4:a=TSDGLShaderQualifierType.Vec4;break;case GL_BOOL:case GL_SAMPLER_2D:case GL_INT:a=TSDGLShaderQualifierType.Int;break;case GL_FLOAT_MAT3:a=TSDGLShaderQualifierType.Mat3;break;case GL_FLOAT_MAT4:a=TSDGLShaderQualifierType.Mat4;break;case GL_INT_VEC2:case GL_INT_VEC3:case GL_INT_VEC4:case GL_BOOL_VEC2:case GL_BOOL_VEC3:case GL_BOOL_VEC4:case GL_FLOAT_MAT2:case GL_SAMPLER_CUBE:default:console.log("Unimplemented GLenum type "+b);break}return a}var TSDGLShader=Class.create({initialize:function(a){this.gl=a;this._uniforms={};this.name="";this.programObject=null;this.isActive=false;this._uniformsNeedingUpdate=[]},initWithDefaultTextureShader:function(){this.initWithShaderFileNames("defaultTexture","defaultTexture");this.setGLint(0,kTSDGLShaderUniformTexture)},initWithDefaultTextureAndOpacityShader:function(){this.initWithShaderFileNames("defaultTexture","defaultTextureAndOpacity")},initWithDefaultHorizontalBlurShader:function(){this.initWithShaderFileNames("horizontalGaussianBlur","horizontalGaussianBlur");this.setGLint(0,kTSDGLShaderUniformTexture)},initWithDefaultVerticalBlurShader:function(){this.initWithShaderFileNames("verticalGaussianBlur","verticalGaussianBlur");this.setGLint(0,kTSDGLShaderUniformTexture)},initWithContentsShader:function(){this.initWithShaderFileNames("contents","contents")},initWithShaderFileNames:function(a,c){var b=KNWebGLShader[a].vertex;var d=KNWebGLShader[c].fragment;this.initWithShaders(b,d)},initWithShaders:function(b,e){var d=this.gl;var c=KNWebGLUtil.loadShader(d,d.VERTEX_SHADER,b);var a=KNWebGLUtil.loadShader(d,d.FRAGMENT_SHADER,e);this.programObject=KNWebGLUtil.createShaderProgram(d,c,a);this.p_updateUniformsAndAttributesFromShader()},p_updateUniformsAndAttributesFromShader:function(){var e=this.gl;var b=this.programObject;var k=-1;k=e.getProgramParameter(b,e.ACTIVE_UNIFORMS);for(var d=0;d<k;d++){var h=e.getActiveUniform(b,d);var a=h.name;var g=h.type;var j=h.size;var f=TSDGLShaderQualifierTypeFromGLenum(g);this.shaderQualifierForUniform(a,f)}var c=-1;c=e.getProgramParameter(b,e.ACTIVE_ATTRIBUTES);for(var d=0;d<c;d++){var h=e.getActiveAttrib(b,d);var a=h.name;var g=h.type;var j=h.size;this.locationForAttribute(a)}},shaderQualifierForUniform:function(a,c){var d=this.gl;var b=this._uniforms[a];if(!b){switch(c){case TSDGLShaderQualifierType.Unknown:console.log("Unknown Shader Qualifier Type!");break;case TSDGLShaderQualifierType.Int:b=new TSDGLShaderQualifierInt(d,a);break;case TSDGLShaderQualifierType.Float:b=new TSDGLShaderQualifierFloat(d,a);break;case TSDGLShaderQualifierType.Vec2:b=new TSDGLShaderQualifierPoint2D(d,a);break;case TSDGLShaderQualifierType.Vec3:b=new TSDGLShaderQualifierPoint3D(d,a);break;case TSDGLShaderQualifierType.Vec4:b=new TSDGLShaderQualifierPoint4D(d,a);break;case TSDGLShaderQualifierType.Mat3:b=new TSDGLShaderQualifierMat3(d,a);break;case TSDGLShaderQualifierType.Mat4:b=new TSDGLShaderQualifierMat4(d,a);break}b.updateUniformLocationWithShaderProgramObject(this.programObject);this._uniforms[a]=b}return b},setGLint:function(c,a){var b=this.shaderQualifierForUniform(a,TSDGLShaderQualifierType.Int);b.setProposedGLintValue(c);if(b._needsUpdate){this._uniformsNeedingUpdate.push(b)}this.p_setQualifiersIfNecessary()},setGLFloat:function(c,a){var b=this.shaderQualifierForUniform(a,TSDGLShaderQualifierType.Float);b.setProposedGLfloatValue(c);if(b._needsUpdate){this._uniformsNeedingUpdate.push(b)}this.p_setQualifiersIfNecessary()},setPoint2D:function(c,a){var b=this.shaderQualifierForUniform(a,TSDGLShaderQualifierType.Vec2);b.setProposedGLPoint2DValue(c);if(b._needsUpdate){this._uniformsNeedingUpdate.push(b)}this.p_setQualifiersIfNecessary()},setMat4WithTransform3D:function(c,a){var b=this.shaderQualifierForUniform(a,TSDGLShaderQualifierType.Mat4);b.setProposedTransform3D(c);if(b._needsUpdate){this._uniformsNeedingUpdate.push(b)}this.p_setQualifiersIfNecessary()},locationForUniform:function(a){var b;var c=this._uniforms[a];if(c){b=c._uniformLocation}if(!b){b=this.gl.getUniformLocation(this.programObject,a)}return b},locationForAttribute:function(b){if(!this._attributeLocations){this._attributeLocations={}}var a=this._attributeLocations[b];if(!a){a=this.gl.getAttribLocation(this.programObject,b);this._attributeLocations[b]=a}return a},p_setQualifiersIfNecessary:function(){if(!this.isActive){return}if(this._uniformsNeedingUpdate.length===0){return}for(var b=0,c=this._uniformsNeedingUpdate.length;b<c;b++){var a=this._uniformsNeedingUpdate[b];if(a._uniformLocation===-1){a.updateUniformLocationWithShaderProgramObject(this.programObject)}a.setGLUniformWithShader(this.gl,this)}this._uniformsNeedingUpdate=[]},activate:function(){var a=this.gl;if(!this.isActive){a.useProgram(this.programObject);this.isActive=true}this.p_setQualifiersIfNecessary()},deactivate:function(){if(this.isActive){this.isActive=false}}});var TSDGLShaderQualifier=Class.create({initialize:function(b,a){this.gl=b;this._uniformLocation=-1;this._needsUpdate=true;this._name=a},updateUniformLocationWithShaderProgramObject:function(a){if(this._uniformLocation===-1){this._uniformLocation=this.gl.getUniformLocation(a,this._name)}}});var TSDGLShaderQualifierInt=Class.create(TSDGLShaderQualifier,{initialize:function($super,b,a){this._GLintValue=0;this._proposedGLintValue=0;$super(b,a)},setProposedGLintValue:function(a){if(this._proposedGLintValue!==a){this._proposedGLintValue=a;this._needsUpdate=true}},setGLUniformWithShader:function(b,a){b.uniform1i(this._uniformLocation,this._proposedGLintValue);this._GLintValue=this._proposedGLintValue;this._needsUpdate=false}});var TSDGLShaderQualifierFloat=Class.create(TSDGLShaderQualifier,{initialize:function($super,b,a){this._GLfloatValue=0;this._proposedGLfloatValue=0;$super(b,a)},setProposedGLfloatValue:function(a){if(this._proposedGLfloatValue!==a){this._proposedGLfloatValue=a;this._needsUpdate=true}},setGLUniformWithShader:function(b,a){b.uniform1f(this._uniformLocation,this._proposedGLfloatValue);this._GLfloatValue=this._proposedGLfloatValue;this._needsUpdate=false}});var TSDGLShaderQualifierPoint2D=Class.create(TSDGLShaderQualifier,{initialize:function($super,b,a){this._GLPoint2DValue={};this._proposedGLPoint2DValue={};$super(b,a)},setProposedGLPoint2DValue:function(a){if(!(this._proposedGLPoint2DValue.x===a.x&&this._proposedGLPoint2DValue.y===a.y)){this._proposedGLPoint2DValue=a;this._needsUpdate=true}},setGLUniformWithShader:function(b,a){b.uniform2fv(this._uniformLocation,[this._proposedGLPoint2DValue.x,this._proposedGLPoint2DValue.y]);this._GLPoint2DValue=this._proposedGLPoint2DValue;this._needsUpdate=false}});var TSDGLShaderQualifierPoint3D=Class.create(TSDGLShaderQualifier,{initialize:function($super,b,a){this._GLPoint3DValue={};this._proposedGLPoint3DValue={};$super(b,a)},setProposedGLPoint3DValue:function(a){if(!(this._proposedGLPoint3DValue.x===a.x&&this._proposedGLPoint3DValue.y===a.y&&this._proposedGLPoint3DValue.z===a.z)){this._proposedGLPoint3DValue=a;this._needsUpdate=true}},setGLUniformWithShader:function(b,a){b.uniform3fv(this._uniformLocation,[this._proposedGLPoint3DValue.x,this._proposedGLPoint3DValue.y,this._proposedGLPoint3DValue.z]);this._GLPoint3DValue=this._proposedGLPoint3DValue;this._needsUpdate=false}});var TSDGLShaderQualifierPoint4D=Class.create(TSDGLShaderQualifier,{initialize:function($super,b,a){this._GLPoint4DValue={};this._proposedGLPoint4DValue={};$super(b,a)},setProposedGLPoint4DValue:function(a){if(!(this._proposedGLPoint4DValue.x===a.x&&this._proposedGLPoint4DValue.y===a.y&&this._proposedGLPoint4DValue.z===a.z&&this._proposedGLPoint4DValue.w===a.w)){this._proposedGLPoint4DValue=a;this._needsUpdate=true}},setGLUniformWithShader:function(b,a){b.uniform4fv(this._uniformLocation,[this._proposedGLPoint4DValue.x,this._proposedGLPoint4DValue.y,this._proposedGLPoint4DValue.z,this._proposedGLPoint4DValue.w]);this._GLPoint4DValue=this._proposedGLPoint4DValue;this._needsUpdate=false}});var TSDGLShaderQualifierMat3=Class.create(TSDGLShaderQualifier,{initialize:function($super,b,a){this._affineTransform=new Float32Array(9);this._proposedAffineTransform=new Float32Array(9);$super(b,a)},setProposedAffineTransform:function(a){if(!CGAffineTransformEqualToTransform(this._proposedAffineTransform,a)){this._proposedAffineTransform=a;this._needsUpdate=true}},setGLUniformWithShader:function(c,b){var a=[this._proposedAffineTransform.a,this._proposedAffineTransform.b,0,this._proposedAffineTransform.c,this._proposedAffineTransform.d,0,this._proposedAffineTransform.tx,this._proposedAffineTransform.ty,1];c.uniformMatrix3fv(this._uniformLocation,false,a);this._affineTransform=this._proposedAffineTransform;this._needsUpdate=false}});var TSDGLShaderQualifierMat4=Class.create(TSDGLShaderQualifier,{initialize:function($super,b,a){this._transform3D=new Float32Array(16);this._proposedTransform3D=new Float32Array(16);$super(b,a)},setProposedTransform3D:function(a){if(!CATransform3DEqualToTransform(this._proposedTransform3D,a)){this._proposedTransform3D=a;this._needsUpdate=true}},setGLUniformWithShader:function(b,a){b.uniformMatrix4fv(this._uniformLocation,false,this._proposedTransform3D);this._transform3D=this._proposedTransform3D;this._needsUpdate=false}});