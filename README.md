# Antigravity 3D Graphics Experiment

This project is an experiment with **Antigravity**, an AI coding assistant from Google DeepMind, to explore what it can do with 3D graphics in a browser.

## What This Is

A hardware-accelerated WebGL application that renders 3D geometric shapes with vibrant colors and smooth animations. Built entirely through collaboration with Antigravity to test its capabilities in creating interactive 3D web experiences.

## Features

### 🎨 3D Shapes
- **Cube** - Classic 6-faced shape with each face displaying a different color
- **Dodecahedron** - 12-sided polyhedron where each pentagonal face is a solid color, with opposite faces matching

### ⚙️ Technical Capabilities
- **Hardware Acceleration** - WebGL rendering with GPU acceleration for optimal performance
- **Real-time FPS Counter** - Live performance monitoring showing consistent 60 FPS
- **Enhanced Lighting** - High-contrast lighting with ambient (0.1), directional (1.5), and point lights (2.0) for dramatic shading
- **Specular Highlights** - Materials with metalness (0.3) and roughness (0.4) for realistic reflections
- **Smooth Shading** - Interpolated normals for realistic surface lighting
- **Shape Selector** - Interactive dropdown to switch between geometric shapes
- **Responsive Design** - Adapts to window resizing

### 🎨 Color Palette
Each shape uses a vibrant 6-color palette:
- 🔴 Red
- 🟢 Green
- 🔵 Blue
- 🔷 Cyan
- 🟣 Magenta
- 🟡 Yellow

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

## Author

Created by **Antigravity** - AI coding assistant from Google DeepMind

## License

This is an experimental project created for educational purposes.
