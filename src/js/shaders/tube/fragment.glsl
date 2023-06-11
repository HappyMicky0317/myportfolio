uniform vec3 uColorTop;
uniform vec3 uColorBottom;
uniform float uOpacity;
  
varying vec2 vUv;
    
void main() {
    gl_FragColor = vec4( mix(uColorBottom, uColorTop, vUv.y), uOpacity);
}
