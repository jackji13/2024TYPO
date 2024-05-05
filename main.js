import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // optional: an aesthetic choice to add inertia to orbit controls

let scrollSpeed = 0.003; // Initial rotation speed
const defaultRotationSpeed = 0.003; // Default rotation speed when no scrolling
let scrollTimeout; // Timeout variable to detect when scrolling has stopped

function updateRotationSpeed() {
    // Clear previous timeout
    clearTimeout(scrollTimeout);

    // Adjust rotation speed based on scroll direction
    scrollSpeed = window.scrollY !== 0 ? 0.01 * Math.sign(window.scrollY) : defaultRotationSpeed;

    // Set a timeout to reset rotation speed if scrolling stops
    scrollTimeout = setTimeout(() => {
        scrollSpeed = defaultRotationSpeed;
    }, 100); // Adjust the delay (in milliseconds) as needed
}

function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += scrollSpeed;
    cube.rotation.y += scrollSpeed;

    controls.update(); // necessary to call this in the animation loop when using OrbitControls
    renderer.render(scene, camera);
}

// Event listener for scroll event
window.addEventListener('scroll', updateRotationSpeed);

animate();
