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

// Color palette
const colors = [
    0xff0000, // Red
    0x00ff00, // Green
    0x0000ff, // Blue
    0x00ffff, // Cyan
    0xff00ff, // Magenta
    0xffff00, // Yellow
    0xff8000, // Orange
    0x8000ff, // Purple
    0x00ff80, // Spring Green
    0xff1493  // Deep Pink
];

// Function to create cube
function createCube() {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const materials = colors.map(color => new THREE.MeshStandardMaterial({
        color,
        metalness: 0.3,
        roughness: 0.4
    }));
    return new THREE.Mesh(geometry, materials);
}

// Function to create dodecahedron with opposite faces having the same color
function createDodecahedron() {
    const geometry = new THREE.DodecahedronGeometry(1.5);

    // Clear any existing groups
    geometry.clearGroups();

    const positionAttribute = geometry.getAttribute('position');
    const normalAttribute = geometry.getAttribute('normal');

    // Calculate face normal for each triangle
    const triangleData = [];
    for (let i = 0; i < positionAttribute.count; i += 3) {
        const normal = new THREE.Vector3(
            (normalAttribute.getX(i) + normalAttribute.getX(i + 1) + normalAttribute.getX(i + 2)) / 3,
            (normalAttribute.getY(i) + normalAttribute.getY(i + 1) + normalAttribute.getY(i + 2)) / 3,
            (normalAttribute.getZ(i) + normalAttribute.getZ(i + 1) + normalAttribute.getZ(i + 2)) / 3
        ).normalize();

        triangleData.push({ index: i / 3, normal });
    }

    // Group triangles by their normal direction
    // Triangles with the same normal belong to the same pentagonal face
    const pentagonalFaces = [];
    const used = new Set();

    for (let i = 0; i < triangleData.length; i++) {
        if (used.has(i)) continue;

        const face = [i];
        used.add(i);

        // Find all triangles with very similar normals
        for (let j = i + 1; j < triangleData.length; j++) {
            if (used.has(j)) continue;

            const dot = triangleData[i].normal.dot(triangleData[j].normal);
            if (dot > 0.999) { // Very similar normals = same pentagonal face
                face.push(j);
                used.add(j);
            }
        }

        pentagonalFaces.push({
            triangles: face,
            normal: triangleData[i].normal
        });
    }

    // Now pair opposite faces and assign colors
    // Opposite faces have normals pointing in opposite directions
    const colorAssignments = new Array(triangleData.length);
    const faceColorMap = new Map();
    let colorIndex = 0;

    for (let i = 0; i < pentagonalFaces.length; i++) {
        if (faceColorMap.has(i)) continue;

        const face1 = pentagonalFaces[i];

        // Find the opposite face (normal pointing in opposite direction)
        let oppositeIdx = -1;
        let maxDot = -2;

        for (let j = 0; j < pentagonalFaces.length; j++) {
            if (i === j || faceColorMap.has(j)) continue;

            const face2 = pentagonalFaces[j];
            const dot = face1.normal.dot(face2.normal);

            // Opposite faces have dot product close to -1
            if (dot < -0.9 && dot > maxDot) {
                maxDot = dot;
                oppositeIdx = j;
            }
        }

        // Assign the same color to this face and its opposite
        const color = colorIndex % 6;

        // Assign color to face1
        for (const triIdx of face1.triangles) {
            colorAssignments[triIdx] = color;
        }
        faceColorMap.set(i, color);

        // Assign color to opposite face if found
        if (oppositeIdx !== -1) {
            for (const triIdx of pentagonalFaces[oppositeIdx].triangles) {
                colorAssignments[triIdx] = color;
            }
            faceColorMap.set(oppositeIdx, color);
        }

        colorIndex++;
    }

    // Create geometry groups based on color assignments
    const materialGroups = Array.from({ length: 6 }, () => []);
    for (let i = 0; i < colorAssignments.length; i++) {
        materialGroups[colorAssignments[i]].push(i);
    }

    // Add groups to geometry
    for (let colorIdx = 0; colorIdx < 6; colorIdx++) {
        for (const faceIdx of materialGroups[colorIdx]) {
            geometry.addGroup(faceIdx * 3, 3, colorIdx);
        }
    }

    // Create materials - one per color with specular highlights
    const materials = colors.map(color => new THREE.MeshStandardMaterial({
        color,
        metalness: 0.3,
        roughness: 0.4
    }));

    return new THREE.Mesh(geometry, materials);
}

// Function to create icosahedron with opposite faces having the same color
function createIcosahedron() {
    const geometry = new THREE.IcosahedronGeometry(1.5);

    // Clear any existing groups
    geometry.clearGroups();

    const positionAttribute = geometry.getAttribute('position');
    const faceCount = positionAttribute.count / 3; // 20 triangular faces

    // Calculate face centers (normals)
    const faces = [];
    for (let i = 0; i < faceCount; i++) {
        const idx = i * 3;
        const center = new THREE.Vector3(
            (positionAttribute.getX(idx) + positionAttribute.getX(idx + 1) + positionAttribute.getX(idx + 2)) / 3,
            (positionAttribute.getY(idx) + positionAttribute.getY(idx + 1) + positionAttribute.getY(idx + 2)) / 3,
            (positionAttribute.getZ(idx) + positionAttribute.getZ(idx + 1) + positionAttribute.getZ(idx + 2)) / 3
        ).normalize();
        faces.push({ index: i, normal: center });
    }

    // Pair opposite faces and assign colors
    const colorAssignments = new Array(faceCount);
    const used = new Set();
    let colorIndex = 0;

    for (let i = 0; i < faceCount; i++) {
        if (used.has(i)) continue;

        const face1 = faces[i];
        used.add(i);

        // Find opposite face (normal pointing in opposite direction)
        let oppositeIdx = -1;
        let minDot = 2;

        for (let j = 0; j < faceCount; j++) {
            if (used.has(j)) continue;

            const dot = face1.normal.dot(faces[j].normal);
            if (dot < minDot) {
                minDot = dot;
                oppositeIdx = j;
            }
        }

        const color = colorIndex % colors.length;
        colorAssignments[i] = color;

        if (oppositeIdx !== -1) {
            colorAssignments[oppositeIdx] = color;
            used.add(oppositeIdx);
        }

        colorIndex++;
    }

    // Create geometry groups based on color assignments
    const materialGroups = Array.from({ length: colors.length }, () => []);
    for (let i = 0; i < colorAssignments.length; i++) {
        materialGroups[colorAssignments[i]].push(i);
    }

    for (let colorIdx = 0; colorIdx < colors.length; colorIdx++) {
        for (const faceIdx of materialGroups[colorIdx]) {
            geometry.addGroup(faceIdx * 3, 3, colorIdx);
        }
    }

    // Create materials with specular highlights
    const materials = colors.map(color => new THREE.MeshStandardMaterial({
        color,
        metalness: 0.3,
        roughness: 0.4
    }));

    return new THREE.Mesh(geometry, materials);
}

// Create initial shape (cube)
let currentShape = createCube();
scene.add(currentShape);

// Add ambient light (low for high contrast)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// Add directional light for better shading (increased intensity)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Add point light for dynamic lighting (increased intensity)
const pointLight = new THREE.PointLight(0x00d4ff, 2.0, 100);
pointLight.position.set(0, 3, 3);
scene.add(pointLight);

// FPS counter variables
let lastTime = performance.now();
let frames = 0;
let fps = 60;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the current shape
    currentShape.rotation.x += 0.01;
    currentShape.rotation.y += 0.01;

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

// Handle shape selection
document.getElementById('shape-dropdown').addEventListener('change', (event) => {
    // Remove current shape
    scene.remove(currentShape);

    // Create new shape based on selection
    if (event.target.value === 'cube') {
        currentShape = createCube();
    } else if (event.target.value === 'dodecahedron') {
        currentShape = createDodecahedron();
    } else if (event.target.value === 'icosahedron') {
        currentShape = createIcosahedron();
    }

    // Add new shape to scene
    scene.add(currentShape);
});

// Start animation
animate();
