# Garden of Glitch

> "Systems don't just fail—they bloom."

**Garden of Glitch** is a recursive physics platformer exploring the concept of **controlled collapse**. Built for the **System Collapse Hackathon**, it demonstrates how stability is just a temporary state between two interesting chaos patterns.

As you navigate the "Garden," your actions generate **Entropy**. This isn't just a score—it's a system-wide variable that actively degrades the game engine itself.

## 🔗 Links
- **Live Demo**: https://gardenofglitch.vercel.app/

## 🎮 Core Concept & Mechanics

The game exists in the zone between rigid order and total chaos.

### 1. Entropy System
Every jump, move, and interaction generates Entropy.
- **Low Entropy (Stable)**: Standard physics, clean visuals, predictable controls.
- **Medium Entropy (Destabilizing)**: Visual artifacts, minor gravity fluctuations, environment jitter.
- **High Entropy (Collapse)**: 
    - **Physics Decay**: Gravity loses direction consistency. Friction becomes variable.
    - **Visual Decay**: Severe glitch shaders, pixelation sorting errors, chromatic aberration.
    - **Logic Decay**: "Ghost" platforms that exist visually but typically lack collision, or vice-versa.

### 2. Emergent Chaos
The collapse isn't scripted linearly; it emerges from the interaction of localized entropy thresholds. A level might be perfectly playable for one run, but become a chaotic, gravity-defying void in another.

## 🛠️ Tech Stack & Technical Highlights

Built with a focus on web-native high-performance graphics and physics.

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **3D Engine**: [React Three Fiber (R3F)](https://docs.pmnd.rs/react-three-fiber) & [Three.js](https://threejs.org/)
- **Physics**: [Rapier](https://rapier.rs/) (Real-time rigid body physics) - *Running on a separate worker for performance.*
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Post-Processing**: [React Three Postprocessing](https://github.com/pmndrs/react-postprocessing) - *Custom shader passes for Glitch and Pixelation.*

### Hackathon Tracks
Targeting the **Entropy Visuals** and **Adaptive Rules** tracks:
- *Entropy Visuals*: The interface represents disorder as an aesthetic experience.
- *Adaptive Rules*: Physics logic rewrites itself based on stress (Entropy).

## 🚀 Getting Started

### Prerequisites
- **Bun** (Recommended) or Node.js 20+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/system-collapse-hackathon.git
   cd system-collapse-hackathon
   ```

2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```

3. Run the development server:
   ```bash
   bun dev
   # or
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to see the Garden.

## 🕹️ Controls

- **W / A / S / D** or **Arrow Keys**: Movement
- **Space**: Jump
- **R**: Reset Level (Clears Entropy)
- **Mouse**: Rotate Camera

---
*Built with unstable code for a stable future.*
