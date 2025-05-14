// Correctly import Three.js and GLTFLoader from unpkg
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";


// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5); // Move the camera back

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);


// Load the GLTF model
console.log('Loading GLTF model...');
const loader = new GLTFLoader();
loader.load('model/model.gltf', (gltf) => {
    const model = gltf.scene;
    // Make the model bigger and position it
    model.scale.set(10, 10, 10);
    model.position.set(0, 2, 0);
    scene.add(model);
    console.log('Model loaded successfully');
    console.log('Scene contents:', scene);
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        model.rotation.y += 0.005;
        renderer.render(scene, camera);
    }
    animate();

    // Mousemove interaction
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.clientX) / 300;
        const y = (window.innerHeight / 2 - e.clientY) / 300;
        model.rotation.x = y;
        model.rotation.y = x;
    });
}, undefined, (error) => {
    console.error('Error loading GLTF:', error);
});

// Set camera position
camera.position.z = 5;
