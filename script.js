import * as THREE from 'three';
import { TeapotGeometry } from 'three/addons/geometries/TeapotGeometry.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

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

// Function to create octahedron with opposite faces having the same color
function createOctahedron() {
    const geometry = new THREE.OctahedronGeometry(1.5);

    // Clear any existing groups
    geometry.clearGroups();

    const positionAttribute = geometry.getAttribute('position');
    const faceCount = positionAttribute.count / 3; // 8 triangular faces

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

        // Find opposite face
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

    // Create geometry groups
    const materialGroups = Array.from({ length: colors.length }, () => []);
    for (let i = 0; i < colorAssignments.length; i++) {
        materialGroups[colorAssignments[i]].push(i);
    }

    for (let colorIdx = 0; colorIdx < colors.length; colorIdx++) {
        for (const faceIdx of materialGroups[colorIdx]) {
            geometry.addGroup(faceIdx * 3, 3, colorIdx);
        }
    }

    const materials = colors.map(color => new THREE.MeshStandardMaterial({
        color,
        metalness: 0.3,
        roughness: 0.4
    }));

    return new THREE.Mesh(geometry, materials);
}

// Function to create tetrahedron
function createTetrahedron() {
    const geometry = new THREE.TetrahedronGeometry(1.5);

    // For tetrahedron, we can just assign a different color to each of the 4 faces
    geometry.clearGroups();

    // 4 faces, assign first 4 colors
    for (let i = 0; i < 4; i++) {
        geometry.addGroup(i * 3, 3, i);
    }

    const materials = colors.map(color => new THREE.MeshStandardMaterial({
        color,
        metalness: 0.3,
        roughness: 0.4
    }));

    return new THREE.Mesh(geometry, materials);
}

// Function to create torus
function createTorus() {
    const geometry = new THREE.TorusGeometry(1.2, 0.4, 16, 100);
    const material = new THREE.MeshStandardMaterial({
        color: 0x00d4ff, // Cyan-ish
        metalness: 0.7,
        roughness: 0.2
    });
    return new THREE.Mesh(geometry, material);
}

// Function to create teapot
function createTeapot() {
    const geometry = new TeapotGeometry(1, 15, true, true, true, false, true);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.9,
        roughness: 0.1,
    });
    return new THREE.Mesh(geometry, material);
}

// Create initial shape (cube)
let currentShape = createCube();
scene.add(currentShape);

// Gun creation function
function createGun() {
    const gunGroup = new THREE.Group();

    // Simple gun model (box)
    const barrelGeo = new THREE.BoxGeometry(0.1, 0.1, 0.5);
    const barrelMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const barrel = new THREE.Mesh(barrelGeo, barrelMat);
    barrel.position.set(0.2, -0.2, -0.5);
    gunGroup.add(barrel);

    // Muzzle flash light
    const flashLight = new THREE.PointLight(0xffaa00, 0, 5);
    flashLight.position.set(0.2, -0.2, -0.75);
    gunGroup.add(flashLight);
    gunGroup.userData.flashLight = flashLight;

    return gunGroup;
}

// Enemy creation function (Spiky Drone)
function createEnemy(x, z) {
    const enemyGroup = new THREE.Group();

    // Central sphere
    const sphereGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.8,
        roughness: 0.2
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    enemyGroup.add(sphere);

    // Spikes
    const spikeGeo = new THREE.ConeGeometry(0.1, 0.6, 8);
    const spikeMat = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.5,
        metalness: 0.5,
        roughness: 0.5
    });

    const positions = [
        [0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]
    ];

    positions.forEach(pos => {
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.set(pos[0] * 0.4, pos[1] * 0.4, pos[2] * 0.4);
        spike.lookAt(0, 0, 0);
        spike.rotateX(Math.PI);
        enemyGroup.add(spike);
    });

    enemyGroup.position.set(x, 0, z);
    scene.add(enemyGroup);

    return {
        mesh: enemyGroup,
        health: 1,
        speed: 2.0 + Math.random()
    };
}

// Shooting function
function shoot() {
    if (performance.now() - lastShotTime < SHOT_COOLDOWN) return;
    lastShotTime = performance.now();

    // Visual feedback
    if (gun) {
        // Recoil
        gun.position.z += 0.2;
        setTimeout(() => {
            if (gun) gun.position.z -= 0.2;
        }, 100);

        // Muzzle flash
        gun.userData.flashLight.intensity = 2;
        setTimeout(() => {
            if (gun && gun.userData.flashLight) gun.userData.flashLight.intensity = 0;
        }, 50);
    }

    // Raycast
    raycaster.setFromCamera(center, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (let i = 0; i < intersects.length; i++) {
        const hitObject = intersects[i].object;
        let parent = hitObject.parent;
        while (parent) {
            const enemyIndex = enemies.findIndex(e => e.mesh === parent);
            if (enemyIndex !== -1) {
                const enemy = enemies[enemyIndex];
                scene.remove(enemy.mesh);
                enemies.splice(enemyIndex, 1);
                score += 100;
                console.log("Enemy hit! Score:", score);
                return;
            }
            parent = parent.parent;
        }

        if (levelMeshes.includes(hitObject)) {
            return;
        }
    }
}

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

// FPS Mode Variables
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let controls;
let levelMeshes = [];
let isFPSMode = false;

// Game State
let gun;
let enemies = [];
let lastShotTime = 0;
const SHOT_COOLDOWN = 250; // ms
const ENEMY_SPAWN_RATE = 3000; // ms
let lastEnemySpawnTime = 0;
let score = 0;
let isGameOver = false;

// Raycaster for shooting
const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0); // Center of screen


// Initialize PointerLockControls
controls = new PointerLockControls(camera, document.body);

const instructions = document.getElementById('controls-info');

controls.addEventListener('lock', function () {
    instructions.style.display = 'none';
});

controls.addEventListener('unlock', function () {
    if (isFPSMode) {
        instructions.style.display = 'block';
    }
});

scene.add(controls.getObject());

const onKeyDown = function (event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
    }
};

const onKeyUp = function (event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
    }
};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

// Wolfenstein 3D style level map (1 = wall, 0 = empty)
const levelMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 1, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

function createLevel() {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({
        color: 0x0000ff, // Blue walls like Wolfenstein
        roughness: 0.1,
        metalness: 0.5
    });

    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.8,
        metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1; // Floor at feet level
    scene.add(floor);
    levelMeshes.push(floor);

    const ceilingGeometry = new THREE.PlaneGeometry(20, 20);
    const ceilingMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.9
    });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 1; // Ceiling
    scene.add(ceiling);
    levelMeshes.push(ceiling);

    for (let z = 0; z < levelMap.length; z++) {
        for (let x = 0; x < levelMap[z].length; x++) {
            if (levelMap[z][x] === 1) {
                const wall = new THREE.Mesh(geometry, material);
                // Map coordinates to world coordinates (centered)
                wall.position.x = (x - 5) * 2;
                wall.position.z = (z - 5) * 2;
                wall.position.y = 0;
                scene.add(wall);
                levelMeshes.push(wall);
            }
        }
    }
}

function clearLevel() {
    levelMeshes.forEach(mesh => scene.remove(mesh));
    levelMeshes = [];
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    const time = performance.now();

    if (isFPSMode) {
        if (controls.isLocked === true) {
            const delta = (time - prevTime) / 1000;

            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;

            direction.z = Number(moveForward) - Number(moveBackward);
            direction.x = Number(moveRight) - Number(moveLeft);
            direction.normalize(); // this ensures consistent movements in all directions

            if (moveForward || moveBackward) velocity.z -= direction.z * 40.0 * delta;
            if (moveLeft || moveRight) velocity.x -= direction.x * 40.0 * delta;

            controls.moveRight(-velocity.x * delta);
            controls.moveForward(-velocity.z * delta);

            // Simple boundary check (keep within the 20x20 area roughly)
            if (controls.getObject().position.x < -9) controls.getObject().position.x = -9;
            if (controls.getObject().position.x > 9) controls.getObject().position.x = 9;
            if (controls.getObject().position.z < -9) controls.getObject().position.z = -9;
            if (controls.getObject().position.z > 9) controls.getObject().position.z = 9;

            // Enemy Logic
            const playerPos = controls.getObject().position;

            // Spawn Enemies
            if (time - lastEnemySpawnTime > ENEMY_SPAWN_RATE && enemies.length < 5) {
                lastEnemySpawnTime = time;
                let x, z;
                do {
                    x = (Math.random() - 0.5) * 18;
                    z = (Math.random() - 0.5) * 18;
                } while (Math.abs(x - playerPos.x) < 5 && Math.abs(z - playerPos.z) < 5);

                enemies.push(createEnemy(x, z));
            }

            // Move Enemies
            for (let i = enemies.length - 1; i >= 0; i--) {
                const enemy = enemies[i];
                const enemyPos = enemy.mesh.position;

                // Move towards player
                const dir = new THREE.Vector3().subVectors(playerPos, enemyPos).normalize();
                enemyPos.add(dir.multiplyScalar(enemy.speed * delta));

                // Rotate enemy
                enemy.mesh.rotation.x += delta * 2;
                enemy.mesh.rotation.y += delta * 2;

                // Collision with player
                if (enemyPos.distanceTo(playerPos) < 1.0) {
                    console.log("Game Over!");
                    isFPSMode = false;
                    controls.unlock();
                    instructions.style.display = 'none';
                    clearLevel();
                    camera.position.set(0, 0, 5);
                    camera.lookAt(0, 0, 0);
                    alert("Game Over! Score: " + score);
                    document.getElementById('shape-dropdown').value = 'cube';
                    currentShape = createCube();
                    scene.add(currentShape);

                    // Clean up enemies and gun
                    enemies.forEach(e => scene.remove(e.mesh));
                    enemies = [];
                    if (gun) {
                        camera.remove(gun);
                        gun = null;
                    }
                    score = 0;
                    break;
                }
            }
        }
    } else {
        // Rotate the current shape
        if (currentShape) {
            currentShape.rotation.x += 0.01;
            currentShape.rotation.y += 0.01;
        }
    }

    prevTime = time;

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
    } else if (event.target.value === 'octahedron') {
        currentShape = createOctahedron();
    } else if (event.target.value === 'tetrahedron') {
        currentShape = createTetrahedron();
    } else if (event.target.value === 'torus') {
        currentShape = createTorus();
    } else if (event.target.value === 'teapot') {
        currentShape = createTeapot();
    } else if (event.target.value === 'fps') {
        isFPSMode = true;
        currentShape = null; // No single shape in FPS mode
        createLevel();
        instructions.style.display = 'block';

        // Reset camera for FPS
        camera.position.set(0, 0, 0);
        camera.lookAt(0, 0, -1);

        // Create and attach gun to camera
        gun = createGun();
        camera.add(gun);

        // Reset game state
        score = 0;
        enemies.forEach(e => scene.remove(e.mesh));
        enemies = [];
        lastEnemySpawnTime = performance.now();

        // Click to lock and shoot
        document.addEventListener('click', () => {
            if (isFPSMode) {
                if (!controls.isLocked) {
                    controls.lock();
                } else {
                    shoot();
                }
            }
        });
        return; // Skip adding currentShape
    }

    // If switching away from FPS mode
    if (isFPSMode && event.target.value !== 'fps') {
        isFPSMode = false;
        controls.unlock();
        instructions.style.display = 'none';
        clearLevel();
        camera.position.set(0, 0, 5); // Reset camera
        camera.lookAt(0, 0, 0);

        // Clean up enemies and gun
        enemies.forEach(e => scene.remove(e.mesh));
        enemies = [];
        if (gun) {
            camera.remove(gun);
            gun = null;
        }
        score = 0;
    }

    // Add new shape to scene
    if (currentShape) {
        scene.add(currentShape);
    }
});

// Start animation
animate();
