import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);

// Shader code
const vertexShader = `
    varying vec3 vPosition;

    void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    varying vec3 vPosition;
    uniform float time;

    void main() {
        float r = 0.5 + 0.5 * sin(vPosition.x * 2.0 + time);
        float g = 0.5 + 0.5 * sin(vPosition.y * 2.0 + time);
        float b = 0.5 + 0.5 * sin(vPosition.z * 2.0 + time);
        gl_FragColor = vec4(r, g, b, 1.0);
    }
`;

const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        time: { value: 0.0 }
    }
});

const cube = new THREE.Mesh(geometry, shaderMaterial);
cube.position.set(0, 0, 0);
cube.scale.set(1, 1, 1);
scene.add(cube);

camera.position.z = 7;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

let scrollSpeed = 0.003;
const defaultRotationSpeed = 0.003;
let scrollTimeout;

function updateRotationSpeed() {
    clearTimeout(scrollTimeout);
    scrollSpeed = window.scrollY !== 0 ? 0.01 * Math.sign(window.scrollY) : defaultRotationSpeed;
    scrollTimeout = setTimeout(() => {
        scrollSpeed = defaultRotationSpeed;
    }, 20);
}

function animate() {
    requestAnimationFrame(animate);

    shaderMaterial.uniforms.time.value += 0.02; // Update the time uniform to animate the shader

    cube.rotation.x += scrollSpeed;
    cube.rotation.y += scrollSpeed;

    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('scroll', updateRotationSpeed);
animate();