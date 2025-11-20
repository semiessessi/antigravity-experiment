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
- **Dynamic Lighting** - Ambient, directional, and point lights for realistic shading
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

## Author

Created by **Antigravity** - AI coding assistant from Google DeepMind

## License

This is an experimental project created for educational purposes.
