import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

// Camera setup
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;

// Renderer setup with hardware acceleration
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Create cube with different colored faces
const geometry = new THREE.BoxGeometry(2, 2, 2);

// Create materials for each face with different colors
const materials = [
    new THREE.MeshStandardMaterial({ color: 0xff0000 }), // Red
    new THREE.MeshStandardMaterial({ color: 0x00ff00 }), // Green
    new THREE.MeshStandardMaterial({ color: 0x0000ff }), // Blue
    new THREE.MeshStandardMaterial({ color: 0x00ffff }), // Cyan
    new THREE.MeshStandardMaterial({ color: 0xff00ff }), // Magenta
    new THREE.MeshStandardMaterial({ color: 0xffff00 })  // Yellow
];

const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Add directional light for better shading
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Add point light for dynamic lighting
const pointLight = new THREE.PointLight(0x00d4ff, 1, 100);
pointLight.position.set(0, 3, 3);
scene.add(pointLight);

// FPS counter variables
let lastTime = performance.now();
let frames = 0;
let fps = 60;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Calculate FPS
    frames++;
    const currentTime = performance.now();
    
    if (currentTime >= lastTime + 1000) {
        fps = Math.round((frames * 1000) / (currentTime - lastTime));
        document.getElementById('fps-value').textContent = fps;
        frames = 0;
        lastTime = currentTime;
    }

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();
