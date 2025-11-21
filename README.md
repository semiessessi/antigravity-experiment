# Antigravity 3D Graphics Experiment

This project is an experiment with **Antigravity**, an AI coding assistant from Google DeepMind, to explore what it can do with 3D graphics in a browser.

## What This Is

A hardware-accelerated WebGL application that renders 3D geometric shapes with vibrant colors and smooth animations. Built entirely through collaboration with Antigravity to test its capabilities in creating interactive 3D web experiences.

## Features

### 🎨 3D Shapes
- **Cube** - Classic 6-faced shape with each face displaying a different color
- **Dodecahedron** - 12-sided polyhedron where each pentagonal face is a solid color, with opposite faces matching
- **Icosahedron** - 20-sided polyhedron with triangular faces, where opposite faces share the same color (10 unique colors for 10 pairs)
- **Octahedron** - 8-sided polyhedron with triangular faces
- **Tetrahedron** - 4-sided polyhedron with triangular faces
- **Torus** - Donut-shaped geometry
- **Teapot** - The classic Utah Teapot model

### ⚙️ Technical Capabilities
- **Hardware Acceleration** - WebGL rendering with GPU acceleration for optimal performance
- **Real-time FPS Counter** - Live performance monitoring showing consistent 60 FPS
- **Enhanced Lighting** - High-contrast lighting with ambient (0.1), directional (1.5), and point lights (2.0) for dramatic shading
- **Specular Highlights** - Materials with metalness (0.3) and roughness (0.4) for realistic reflections
- **Smooth Shading** - Interpolated normals for realistic surface lighting
- **Shape Selector** - Interactive dropdown to switch between geometric shapes
- **Responsive Design** - Adapts to window resizing
- **FPS Mode (Wolfenstein 3D Style)**:
    - Explore a procedurally generated maze
    - **Wall Collision Detection**: Players and enemies cannot pass through walls (raycasting-based)
    - **Combat System**: Wield a camera-attached gun with recoil and muzzle flash effects
    - **Enemies**: Battle against "Spiky Drones" - floating spheres with glowing red spikes that chase you
    - **Scoring**: Earn points by destroying enemies
    - **Game Over**: Don't let them touch you!



### 🎨 Color Palette
The cube and dodecahedron use the original 6-color palette:
- 🔴 Red
- 🟢 Green
- 🔵 Blue
- 🔷 Cyan
- 🟣 Magenta
- 🟡 Yellow

The icosahedron uses an expanded 10-color palette (for 10 opposite-face pairs):
- All 6 colors above, plus:
- 🟠 Orange
- 🟣 Purple
- 💚 Spring Green
- 💗 Deep Pink

## How to Run

1. Start a local web server in the project directory:
   ```bash
   python -m http.server 8000
   ```

2. Open your browser to:
   ```
   http://localhost:8000/index.html
   ```

3. Use the dropdown selector in the top-right to switch between shapes

## Technology Stack

- **Three.js** - 3D graphics library for WebGL
- **Vanilla JavaScript** - ES6 modules
- **CSS3** - Glassmorphic UI design with backdrop filters
- **HTML5** - Semantic markup

## Project Structure

```
├── index.html     # Page structure and importmap
├── style.css      # Glassmorphic UI styling
├── script.js      # Three.js rendering logic
└── .gitignore     # Git ignore rules
```

## What Antigravity Learned

Through this experiment, Antigravity demonstrated capabilities in:
- Setting up WebGL rendering with Three.js
- Creating complex geometry with multi-material support
- Implementing algorithmic color distribution based on geometric properties
- Grouping triangulated mesh faces to identify pentagonal faces
- Pairing opposite faces using normal vector analysis
- Building responsive, glassmorphic UI components
- Organizing code with clean separation of concerns

## The Challenge

The most interesting challenge was coloring the dodecahedron. Since Three.js triangulates pentagonal faces, we needed to:
1. Group triangles by their normal vectors to identify which belong to each pentagon
2. Find opposite pentagonal faces by comparing normal directions (dot product ≈ -1)
3. Assign the same color to opposite face pairs
4. Ensure all 6 colors are used across the 12 faces

## Mistakes and Retries

This section documents the challenges and iterations encountered during development - a candid look at the AI development process:

### ✅ What Went Smoothly
- **Initial Setup** - WebGL renderer, scene, and camera setup worked on first try
- **Code Organization** - Extracting CSS and JavaScript into separate files was straightforward
- **Git Integration** - Repository initialization and commits executed correctly
- **Cube Implementation** - Multi-material cube rendered perfectly from the start

### ❌ Challenges and Iterations

#### Dodecahedron Color Distribution (3-4 iterations)
- **Issue**: Initial attempt to assign materials directly to dodecahedron faces failed because `DodecahedronGeometry` triangulates pentagonal faces differently than `BoxGeometry`
- **Solution**: Developed algorithm to group triangles by normal vectors, then assign materials to geometry groups
- **Iterations**: 
  - First try: Black faces due to incorrect material indexing
  - Second try: Colors present but not matching on opposite faces  
  - Third try: Some triangles got multiple colors instead of solid pentagons
  - Final: Correctly grouped triangles by normals and paired opposite faces

#### Custom Shader Implementation (Complete Failure)
- **Attempt**: Tried to implement custom GLSL vertex and fragment shaders with rim lighting and fresnel effects
- **Issue**: Shader compilation failed, resulting in WebGL errors: "INVALID_OPERATION: drawElements: no valid shader program in use"
- **Root Cause**: Incompatible `flatShading` property in `ShaderMaterial` and/or syntax errors in shader code
- **Resolution**: Reverted to `MeshStandardMaterial` with `metalness` and `roughness` properties instead
- **Retries**: ~2-3 attempts to fix shaders before reverting

#### File Corruption from Edit Tool (5-6 occurrences)
- **Issue**: The `replace_file_content` tool repeatedly corrupted `script.js` due to inaccurate target content matching
- **Symptoms**: Missing function definitions, broken syntax, incomplete code blocks
- **Resolution**: Used `git checkout script.js` to revert to last good version multiple times
- **Learning**: Switched to `multi_replace_file_content` and `write_to_file` for more reliable edits

#### Lighting Adjustments (2 iterations)
- **Issue**: Initial lighting appeared flat even after removing `flatShading`
- **First fix**: Removed `flatShading: true` from materials  
- **Second fix**: Reduced ambient light to 0.1, increased directional and point lights, added `metalness` and `roughness`
- **Result**: Achieved dramatic high-contrast lighting with visible specular highlights

### 📊 Statistics
- **Total Major Retries**: ~10-12 significant iterations
- **File Reverts (git checkout)**: 5-6 times
- **Shader Attempts**: 2-3 (ultimately abandoned)
- **Dodecahedron Color Fixes**: 3-4 iterations
- **Successful on First Try**: Initial setup, code organization, git operations, cube implementation

### 💡 Key Learnings
1. Three.js geometries handle materials differently depending on their structure
2. Custom shaders require precise WebGL knowledge and careful testing
3. File editing tools need exact target content matching to avoid corruption
4. Multiple light sources with proper intensities create much better visual results than single lights
5. Material properties (`metalness`, `roughness`) are crucial for realistic rendering

## Decision Attribution

This project was a collaboration between the user and Antigravity. Here's who made which decisions:

### 👤 User's Decisions (Requirements & Direction)
- **Core Concept** - Hardware-accelerated 3D rendering webpage with real-time FPS counter
- **Initial Shape** - Spinning multi-colored cube with 6 distinct colored faces
- **Adding Dodecahedron** - Request to add a second shape with specific constraints
- **Dodecahedron Requirements**:
  - Each pentagonal face must be one solid color (not multi-colored from triangulation)
  - All 6 colors must be used
  - Opposite faces must have the same color
- **Custom Shaders** - Request to try implementing custom GLSL shaders for better materials/lighting
- **Lighting Enhancement** - Pointing out flat appearance and requesting improvements
- **High Contrast** - Specific request to reduce ambient lighting to 0.1 or lower and increase contrast
- **Transparency** - Requesting documentation of mistakes, retries, and decision attribution

### 🤖 Antigravity's Decisions (Implementation Choices)
- **Technology Stack** - Choosing Three.js as the WebGL library
- **Color Palette** - Selecting the specific 6 colors (Red, Green, Blue, Cyan, Magenta, Yellow)
- **UI Design** - Glassmorphic styling with backdrop filters and modern aesthetics
- **Code Organization** - Separating into `index.html`, `style.css`, and `script.js`
- **Dodecahedron Algorithm** - Using normal vector analysis to group triangles and pair opposite faces
- **Lighting Setup** - Specific light types, positions, and cyan point light color choice
- **Material Properties** - Adding `metalness: 0.3` and `roughness: 0.4` for specular highlights
- **Specific Intensities** - Ambient (0.1), Directional (1.5), Point Light (2.0) values
- **Error Recovery** - Strategy to revert to `MeshStandardMaterial` after shader failures
- **Next Shape Suggestion** - Proposing icosahedron as the next addition

### 🤝 Collaborative Decisions
- **Git Workflow** - User requested commits/pushes, Antigravity chose commit messages and author attribution
- **README Documentation** - User requested sections, Antigravity chose structure and content
- **Shape Selector** - User implied need for switching, Antigravity chose dropdown implementation

### 🚀 Phase 2: Expanding the Collection
The user requested to "add 3 more shapes to this as well as the classic teapot". This expansion phase involved several interesting decisions and technical steps:

#### Decisions & Selection
# Antigravity 3D Graphics Experiment

This project is an experiment with **Antigravity**, an AI coding assistant from Google DeepMind, to explore what it can do with 3D graphics in a browser.

## What This Is

A hardware-accelerated WebGL application that renders 3D geometric shapes with vibrant colors and smooth animations. Built entirely through collaboration with Antigravity to test its capabilities in creating interactive 3D web experiences.

## Features

### 🎨 3D Shapes
- **Cube** - Classic 6-faced shape with each face displaying a different color
- **Dodecahedron** - 12-sided polyhedron where each pentagonal face is a solid color, with opposite faces matching
- **Icosahedron** - 20-sided polyhedron with triangular faces, where opposite faces share the same color (10 unique colors for 10 pairs)
- **Octahedron** - 8-sided polyhedron with triangular faces
- **Tetrahedron** - 4-sided polyhedron with triangular faces
- **Torus** - Donut-shaped geometry
- **Teapot** - The classic Utah Teapot model

### ⚙️ Technical Capabilities
- **Hardware Acceleration** - WebGL rendering with GPU acceleration for optimal performance
- **Real-time FPS Counter** - Live performance monitoring showing consistent 60 FPS
- **Enhanced Lighting** - High-contrast lighting with ambient (0.1), directional (1.5), and point lights (2.0) for dramatic shading
- **Specular Highlights** - Materials with metalness (0.3) and roughness (0.4) for realistic reflections
- **Smooth Shading** - Interpolated normals for realistic surface lighting
- **Shape Selector** - Interactive dropdown to switch between geometric shapes
- **Responsive Design** - Adapts to window resizing

### 🎨 Color Palette
The cube and dodecahedron use the original 6-color palette:
- 🔴 Red
- 🟢 Green
- 🔵 Blue
- 🔷 Cyan
- 🟣 Magenta
- 🟡 Yellow

The icosahedron uses an expanded 10-color palette (for 10 opposite-face pairs):
- All 6 colors above, plus:
- 🟠 Orange
- 🟣 Purple
- 💚 Spring Green
- 💗 Deep Pink

## How to Run

1. Start a local web server in the project directory:
   ```bash
   python -m http.server 8000
   ```

2. Open your browser to:
   ```
   http://localhost:8000/index.html
   ```

3. Use the dropdown selector in the top-right to switch between shapes

## Technology Stack

- **Three.js** - 3D graphics library for WebGL
- **Vanilla JavaScript** - ES6 modules
- **CSS3** - Glassmorphic UI design with backdrop filters
- **HTML5** - Semantic markup

## Project Structure

```
├── index.html     # Page structure and importmap
├── style.css      # Glassmorphic UI styling
├── script.js      # Three.js rendering logic
└── .gitignore     # Git ignore rules
```

## What Antigravity Learned

Through this experiment, Antigravity demonstrated capabilities in:
- Setting up WebGL rendering with Three.js
- Creating complex geometry with multi-material support
- Implementing algorithmic color distribution based on geometric properties
- Grouping triangulated mesh faces to identify pentagonal faces
- Pairing opposite faces using normal vector analysis
- Building responsive, glassmorphic UI components
- Organizing code with clean separation of concerns

## The Challenge

The most interesting challenge was coloring the dodecahedron. Since Three.js triangulates pentagonal faces, we needed to:
1. Group triangles by their normal vectors to identify which belong to each pentagon
2. Find opposite pentagonal faces by comparing normal directions (dot product ≈ -1)
3. Assign the same color to opposite face pairs
4. Ensure all 6 colors are used across the 12 faces

## Mistakes and Retries

This section documents the challenges and iterations encountered during development - a candid look at the AI development process:

### ✅ What Went Smoothly
- **Initial Setup** - WebGL renderer, scene, and camera setup worked on first try
- **Code Organization** - Extracting CSS and JavaScript into separate files was straightforward
- **Git Integration** - Repository initialization and commits executed correctly
- **Cube Implementation** - Multi-material cube rendered perfectly from the start

### ❌ Challenges and Iterations

#### Dodecahedron Color Distribution (3-4 iterations)
- **Issue**: Initial attempt to assign materials directly to dodecahedron faces failed because `DodecahedronGeometry` triangulates pentagonal faces differently than `BoxGeometry`
- **Solution**: Developed algorithm to group triangles by normal vectors, then assign materials to geometry groups
- **Iterations**: 
  - First try: Black faces due to incorrect material indexing
  - Second try: Colors present but not matching on opposite faces  
  - Third try: Some triangles got multiple colors instead of solid pentagons
  - Final: Correctly grouped triangles by normals and paired opposite faces

#### Custom Shader Implementation (Complete Failure)
- **Attempt**: Tried to implement custom GLSL vertex and fragment shaders with rim lighting and fresnel effects
- **Issue**: Shader compilation failed, resulting in WebGL errors: "INVALID_OPERATION: drawElements: no valid shader program in use"
- **Root Cause**: Incompatible `flatShading` property in `ShaderMaterial` and/or syntax errors in shader code
- **Resolution**: Reverted to `MeshStandardMaterial` with `metalness` and `roughness` properties instead
- **Retries**: ~2-3 attempts to fix shaders before reverting

#### File Corruption from Edit Tool (5-6 occurrences)
- **Issue**: The `replace_file_content` tool repeatedly corrupted `script.js` due to inaccurate target content matching
- **Symptoms**: Missing function definitions, broken syntax, incomplete code blocks
- **Resolution**: Used `git checkout script.js` to revert to last good version multiple times
- **Learning**: Switched to `multi_replace_file_content` and `write_to_file` for more reliable edits

#### Lighting Adjustments (2 iterations)
- **Issue**: Initial lighting appeared flat even after removing `flatShading`
- **First fix**: Removed `flatShading: true` from materials  
- **Second fix**: Reduced ambient light to 0.1, increased directional and point lights, added `metalness` and `roughness`
- **Result**: Achieved dramatic high-contrast lighting with visible specular highlights

### 📊 Statistics
- **Total Major Retries**: ~10-12 significant iterations
- **File Reverts (git checkout)**: 5-6 times
- **Shader Attempts**: 2-3 (ultimately abandoned)
- **Dodecahedron Color Fixes**: 3-4 iterations
- **Successful on First Try**: Initial setup, code organization, git operations, cube implementation

### 💡 Key Learnings
1. Three.js geometries handle materials differently depending on their structure
2. Custom shaders require precise WebGL knowledge and careful testing
3. File editing tools need exact target content matching to avoid corruption
4. Multiple light sources with proper intensities create much better visual results than single lights
5. Material properties (`metalness`, `roughness`) are crucial for realistic rendering

## Decision Attribution

This project was a collaboration between the user and Antigravity. Here's who made which decisions:

### 👤 User's Decisions (Requirements & Direction)
- **Core Concept** - Hardware-accelerated 3D rendering webpage with real-time FPS counter
- **Initial Shape** - Spinning multi-colored cube with 6 distinct colored faces
- **Adding Dodecahedron** - Request to add a second shape with specific constraints
- **Dodecahedron Requirements**:
  - Each pentagonal face must be one solid color (not multi-colored from triangulation)
  - All 6 colors must be used
  - Opposite faces must have the same color
- **Custom Shaders** - Request to try implementing custom GLSL shaders for better materials/lighting
- **Lighting Enhancement** - Pointing out flat appearance and requesting improvements
- **High Contrast** - Specific request to reduce ambient lighting to 0.1 or lower and increase contrast
- **Transparency** - Requesting documentation of mistakes, retries, and decision attribution

### 🤖 Antigravity's Decisions (Implementation Choices)
- **Technology Stack** - Choosing Three.js as the WebGL library
- **Color Palette** - Selecting the specific 6 colors (Red, Green, Blue, Cyan, Magenta, Yellow)
- **UI Design** - Glassmorphic styling with backdrop filters and modern aesthetics
- **Code Organization** - Separating into `index.html`, `style.css`, and `script.js`
- **Dodecahedron Algorithm** - Using normal vector analysis to group triangles and pair opposite faces
- **Lighting Setup** - Specific light types, positions, and cyan point light color choice
- **Material Properties** - Adding `metalness: 0.3` and `roughness: 0.4` for specular highlights
- **Specific Intensities** - Ambient (0.1), Directional (1.5), Point Light (2.0) values
- **Error Recovery** - Strategy to revert to `MeshStandardMaterial` after shader failures
- **Next Shape Suggestion** - Proposing icosahedron as the next addition

### 🤝 Collaborative Decisions
- **Git Workflow** - User requested commits/pushes, Antigravity chose commit messages and author attribution
- **README Documentation** - User requested sections, Antigravity chose structure and content
- **Shape Selector** - User implied need for switching, Antigravity chose dropdown implementation

### 🚀 Phase 2: Expanding the Collection
The user requested to "add 3 more shapes to this as well as the classic teapot". This expansion phase involved several interesting decisions and technical steps:

#### Decisions & Selection
- **User's Request**: Explicitly asked for "3 more shapes" + "classic teapot".
- **Antigravity's Selection**: To complement the existing Cube, Dodecahedron, and Icosahedron, I chose:
    - **Octahedron** & **Tetrahedron**: To complete the set of Platonic solids available in Three.js.
    - **Torus**: To introduce a curved, non-polyhedral shape that highlights the specular lighting differently.
- **The Teapot**: The user specifically requested the "classic teapot" (Utah Teapot), a staple of 3D graphics history.

#### Technical Implementation & Challenges
- **Teapot Availability**: The `TeapotGeometry` is not part of the core Three.js library.
- **Instructional Overlay**: Created an instructional overlay that appears when the pointer is unlocked, explaining the controls.

## Phase 4: Combat Update (Gun & Enemies)

The "FPS Mode" needed actual gameplay, so I added a combat system.

### The Gun
- **Attachment**: A simple geometric gun model is attached directly to the camera, ensuring it always stays in the player's view.
- **Feedback**:
    - **Recoil**: The gun moves backward (`z` axis) when fired and snaps back, simulating kickback.
    - **Muzzle Flash**: A point light at the tip of the gun flashes briefly when shooting, illuminating the immediate area.

### The Enemies: "Spiky Drones"
- **Design**: Instead of simple pyramids, I created "Spiky Drones". These are composed of a central dark sphere (`SphereGeometry`) with multiple red glowing cones (`ConeGeometry`) protruding from it.
- **AI**: The enemies have a simple "seek" behavior. They constantly calculate the vector towards the player and move along it. They also rotate to add visual dynamism.
- **Spawning**: Enemies spawn at random locations away from the player to keep the pressure on.

### Technical Challenges
- **Raycasting**: Shooting is implemented using `THREE.Raycaster` from the center of the screen. This provides instant hit detection.
- **Group Management**: Enemies are `THREE.Group` objects containing multiple meshes. Raycasting hits individual meshes (like a spike or the sphere), so I had to implement logic to traverse up the scene graph (`parent`) to find the main Enemy object to destroy.

## Author

Created by **Antigravity** - AI coding assistant from Google DeepMind

## License

This is an experimental project created for educational purposes.
