# Antigravity 3D Graphics Experiment

An interactive WebGL application showcasing 3D graphics capabilities, built entirely through collaboration with **Antigravity** (Google DeepMind's AI coding assistant).

## 🎯 Project Overview

This project demonstrates hardware-accelerated 3D rendering in the browser, featuring geometric shapes, an FPS game mode with combat mechanics, and advanced collision detection. Every line of code was written through natural language conversations with Antigravity.

---

## ✨ Features

### 3D Shape Gallery
Browse and interact with various geometric shapes:
- **Cube** - 6 colored faces
- **Dodecahedron** - 12 pentagonal faces  
- **Icosahedron** - 20 triangular faces
- **Octahedron** - 8 triangular faces
- **Tetrahedron** - 4 triangular faces
- **Torus** - Donut shape
- **Teapot** - Classic Utah Teapot

### FPS Mode (Wolfenstein 3D Style)
A complete first-person shooter experience:
- **Procedural Maze** - Randomly generated blue-walled labyrinth
- **First-Person Controls** - WASD movement + mouse look (pointer lock)
- **Combat System**:
  - Camera-attached gun with visual recoil
  - Muzzle flash lighting effects
  - Raycasting-based shooting
- **Enemies - "Spiky Drones"**:
  - Black spheres with 6 glowing red spikes
  - AI pathfinding that chases the player
  - Continuous rotation animation
- **Wall Collision Detection**:
  - Players cannot walk through walls
  - Enemies stop at walls when chasing
  - Raycasting-based collision system
- **Game Mechanics**:
  - Score tracking (100 points per enemy)
  - Game over on enemy collision
  - Enemy spawning system (max 5 at once)

---

## 🎨 Visual Design

### Color Palette
**Standard Shapes** (Cube, Dodecahedron):
- 🔴 Red • 🟢 Green • 🔵 Blue • 🔷 Cyan • 🟣 Magenta • 🟡 Yellow

**Icosahedron** (10 opposite-face pairs):
- All 6 above + 🟠 Orange • 🟤 Brown • 🟪 Purple • ⚫ Gray

### Lighting System
- **Ambient Light**: 0.1 intensity (low for high contrast)
- **Directional Light**: 1.5 intensity at (5,5,5)
- **Point Light**: 2.0 intensity cyan glow at (0,3,3)
- **Materials**: Metalness 0.3-0.9, Roughness 0.1-0.4 for realistic reflections

---

## 🛠️ Technical Implementation

### Core Technologies
- **Three.js** (v0.160.0) - 3D rendering library
- **WebGL** - GPU-accelerated graphics
- **ES6 Modules** - Modern JavaScript with import maps
- **GLSL Shaders** - Custom materials and effects

### Performance
- **60 FPS** - Consistent frame rate with real-time counter
- **Hardware Acceleration** - GPU rendering via WebGL
- **Optimized Rendering** - Frustum culling and efficient draw calls

### Key Algorithms

#### Raycasting Collision Detection
Both player and enemy movement use raycasting to detect walls:
```javascript
// Cast ray in movement direction
raycaster.set(position, direction);
const intersects = raycaster.intersectObjects(levelMeshes);
if (intersects.length > 0 && intersects[0].distance < collisionRadius) {
    // Block movement
}
```

#### Enemy AI
Simple but effective chase behavior:
```javascript
// Calculate direction to player
const dir = new THREE.Vector3().subVectors(playerPos, enemyPos).normalize();
// Check for walls before moving
raycaster.set(enemyPos, dir);
const wallIntersects = raycaster.intersectObjects(levelMeshes);
if (wallIntersects.length === 0 || wallIntersects[0].distance > moveDistance) {
    enemyPos.add(dir.multiplyScalar(speed * delta));
}
```

#### Shooting Mechanics
Instant hit detection using raycasting:
```javascript
raycaster.setFromCamera(center, camera); // Center of screen
const intersects = raycaster.intersectObjects(scene.children, true);
// Traverse parent hierarchy to find enemy groups
```

---

## 📋 Development Journey

### Phase 1: Foundation (Initial Setup)
**Goal**: Create basic 3D viewer with rotating cube

**Implementation**:
- Set up Three.js scene, camera, renderer
- Created cube with 6-color face mapping
- Added rotation animation loop
- Implemented FPS counter

**Challenges**:
- Learning Three.js geometry and material systems
- Understanding face indexing for color assignment

---

### Phase 2: Shape Expansion
**Goal**: Add more geometric shapes to the gallery

**Shapes Added**:
- Dodecahedron (12 faces, opposite-face color matching)
- Icosahedron (20 faces, 10-color palette)
- Octahedron, Tetrahedron, Torus
- Utah Teapot (using TeapotGeometry addon)

**Implementation**:
- Extended dropdown UI
- Created shape factory functions
- Configured import map for Three.js addons
- Implemented face color mapping algorithms

**Challenges**:

**Dodecahedron Complexity**:
The dodecahedron was particularly challenging due to its geometry:
- **12 pentagonal faces** - Each face has 5 vertices, but Three.js uses triangles
- **Triangulation**: Three.js automatically triangulates pentagons into 3 triangles each (36 total triangles)
- **Opposite Face Matching**: Had to identify which faces are opposite to assign matching colors
  - Pentagon faces don't have a simple "opposite" relationship like cube faces
  - Solution: Used geometric analysis - faces are opposite if their centroids are roughly 180° apart
  - Implemented by checking face normal directions and grouping into 6 pairs
- **Face Indexing**: The `DodecahedronGeometry` face indices don't follow an obvious pattern
  - Had to manually map triangle groups back to their parent pentagon faces
  - Each pentagon = 3 consecutive triangles in the geometry

**Code Approach**:
```javascript
// Create 6 materials for 6 pairs of opposite faces
const materials = colors.map(color => new THREE.MeshStandardMaterial({...}));

// Map faces to materials (3 triangles per pentagon)
geometry.faces.forEach((face, i) => {
    face.materialIndex = Math.floor(i / 6); // Group triangles into pentagons
});
```

**Teapot Import Issue**: 
- `TeapotGeometry` from `three/addons/` initially failed on GitHub Pages
- **Solution**: Verified CDN paths and import map configuration


---

### Phase 3: FPS Mode
**Goal**: Create a Wolfenstein 3D-style first-person experience

**Implementation**:
- Integrated `PointerLockControls` for mouse look
- Created procedural maze generator (20x20 grid)
- Implemented WASD movement with velocity physics
- Added boundary checks to keep player in bounds
- Created controls overlay UI

**Technical Details**:
- Used `PointerLockControls` from Three.js addons
- Maze walls: Blue boxes (0.5×2×0.5) in grid pattern
- Movement: Velocity-based with friction (10.0 damping)
- Camera height: Fixed at y=0 for ground-level view

**Challenges**:
- Pointer lock API browser compatibility
- Smooth movement physics tuning
- Mode switching between shapes and FPS

---

### Phase 4: Combat System
**Goal**: Add gun, enemies, and gameplay mechanics

**Gun Implementation**:
- Simple box geometry attached to camera
- Recoil animation (0.2 units for 100ms)
- Muzzle flash using PointLight (intensity 2.0 for 50ms)
- Click to shoot (when pointer locked)

**Enemy Design - "Spiky Drones"**:
- Central black sphere (0.4 radius)
- 6 red cone spikes (emissive glow)
- Positioned on cardinal axes
- Continuous X/Y rotation (2 rad/s)

**AI Behavior**:
- Spawn every 3 seconds (max 5 enemies)
- Spawn away from player (min 5 unit distance)
- Move toward player at 2-3 units/second
- Random speed variation for unpredictability

**Game Loop**:
- Raycasting for hit detection
- Score system (100 points per kill)
- Game over on collision (distance < 1.0)
- Automatic cleanup and reset

**Challenges**:
- **Hit Detection**: Had to traverse Three.js group hierarchy to detect hits on enemy children (spikes/sphere)
- **Initial Game Over Bug**: Enemies spawned too close on mode entry
  - **Fix**: Initialize `lastEnemySpawnTime` when entering FPS mode

---

### Phase 5: Collision Detection
**Goal**: Prevent players and enemies from passing through walls

**Implementation**:
- Player collision: Raycast in movement direction before applying velocity
- Enemy collision: Check wall intersection before moving toward player
- Collision radius: 0.5 units for player, 0.3 buffer for enemies
- Independent X/Z axis collision (allows wall sliding)

**Technical Approach**:
```javascript
// Player: Check forward and right movement separately
if (velocity.z !== 0) {
    const forwardDir = new THREE.Vector3(0, 0, -1);
    forwardDir.applyQuaternion(camera.quaternion);
    raycaster.set(playerPos, forwardDir);
    // Check collision...
}
```

**Results**:
- Smooth wall sliding behavior
- Enemies naturally path around obstacles
- Maintains 60 FPS performance

**Challenges**:
- Quaternion math for camera-relative directions
- Balancing collision radius for feel vs. accuracy

---

## 🚀 Running Locally

1. **Clone the repository**
```bash
git clone https://github.com/semiessessi/antigravity-experiment.git
cd antigravity-experiment
```

2. **Start a local server**
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server -p 8000
```

3. **Open in browser**
```
http://localhost:8000
```

---

## 🎮 Controls

### Shape Viewer Mode
- **Mouse**: Rotate view
- **Dropdown**: Select different shapes

### FPS Mode
- **Click**: Lock pointer / Shoot (when locked)
- **WASD**: Move
- **Mouse**: Look around
- **ESC**: Unlock pointer

---

## 📁 Project Structure

```
antigravity-experiment/
├── index.html          # Main HTML with dropdown UI
├── script.js           # Three.js logic, FPS mode, combat
├── style.css           # Minimal styling
└── README.md           # This file
```

---

## 🔮 Future Ideas

- Volumetric cloud rendering with ray marching
- More enemy types with different behaviors
- Power-ups and weapon variety
- Procedural texture generation
- Particle effects for explosions
- Sound effects and music
- Multiplayer networking

---

## 🤖 Built with Antigravity

This entire project was created through conversations with Antigravity, Google DeepMind's AI coding assistant. Every feature, from the basic cube to the complete FPS game mode, was implemented by describing what I wanted in natural language.

**Key Learnings**:
- AI can handle complex 3D graphics programming
- Iterative refinement through conversation works well
- Debugging is collaborative (AI suggests fixes, I test)
- Documentation benefits from AI organization

---

## 📄 License

MIT License - Feel free to use this code for learning or your own projects!
