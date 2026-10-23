# 3D Coaster Studio (3dCosterGenerator)

[![Live Web App](https://img.shields.io/badge/Live%20App-GitHub%20Pages-success?style=for-the-badge&logo=github)](https://idrisb4u.github.io/3dCosterGenerator/)

A modern client-side Web CAD application designed specifically for crafting multi-layer 3D printable drink coasters with Klipper, Bambu Lab AMS, and standard single-nozzle FDM printers.

---

## 🌐 Live Web Application
You can use the app directly in your browser without installing anything:
**[https://idrisb4u.github.io/3dCosterGenerator/](https://idrisb4u.github.io/3dCosterGenerator/)**

Local Dev URL:
**[http://localhost:3000/](http://localhost:3000/)**

---

## ✨ Features

### 1. Multi-Layer Coaster Architecture
- **Blank Back Layer**: Solid, watertight insulating foundation with customizable thickness (1.6mm - 6.0mm) to protect tables and guarantee structural rigidity.
- **Front Artwork Layer**: Detailed SVG artwork, Spider-Man emblem, or typography monograms with configurable depth (0.4mm - 3.0mm).
- **Embossed vs Debossed**:
  - *Embossed (Raised)*: Rises above the base surface, ideal for two-tone color-swap printing.
  - *Debossed (Carved)*: Recessed into the base for a flat flush coaster surface.
- **Raised Condensation Rim (Lip)**: Optional outer barrier (2mm - 8mm width, 0.6mm - 3.0mm height) to catch cold drink droplets.
- **Bottom Chamfer / Bevel**: Prevents elephant foot during 3D printing and makes lifting the coaster off flat tables effortless.

### 2. Supported Shapes & Custom Dimensions
- **Circle**: Classic round coaster (e.g. 100mm diameter).
- **Square / Rectangle**: Independent width, height, and corner rounding radius (0mm to 25mm).
- **Hexagon**: 6-sided modern geometric polygon.
- **Octagon**: 8-sided faceted profile.
- **Heart**: Organic curved silhouette for gifts and holidays.
- **Shield Crest**: Heraldic emblem shape.

### 3. Curated SVG Library & Typography Engine
- **Prebuilt Designs**:
  - **Spider-Man**: Authentic high-detail chest spider emblem & mask eyes.
  - **Superheroes**: Batman Dark Knight, Captain America Shield, Avengers Crest.
  - **Beverages**: Artisan Coffee cup with steam swirls, frothy Craft Beer mug.
  - **Patterns**: Sacred Flower of Life Mandala, Celtic Knot, Honeycomb Hex Maze.
- **Alphabet Monograms**:
  - Complete A to Z in elegant flourished Calligraphy Script.
  - Complete A to Z in clean Modern Bold Sans-serif.
- **Custom Text Tool**:
  - Type any custom letter, name, or phrase.
  - Choose between Calligraphy Script (`Great Vibes`), Royal Serif (`Cinzel Decorative`), Modern Bold (`Montserrat`), or Vintage Gothic (`Pirata One`).
  - Add decorative border crest frames (Double Circle, Beaded Ring, Geometric Octagon, Diamond, Rounded Frame).
- **Custom SVG Upload & Paste**:
  - Drag-and-drop any standard `.svg` file or paste raw SVG XML with instant path validation.

### 4. Interactive 3D Viewport
- Real-time WebGL rendering with Three.js.
- Standard 3D printer build plate (220×220 mm) with 10mm grid lines.
- Quick camera buttons: **3D Perspective**, **Top-Down Alignment**, **Profile View**, and **Isometric**.
- **Interactive Layer Cut Simulator**: Scrub through the print height to see how your model builds up layer-by-layer.
- Turntable 360° spin & wireframe inspection modes.

### 5. Multi-Material & Filament Preview
- Customize colors for the Base, Rim, and Front Artwork layers.
- Popular filament presets:
  - Spider-Man Classic (Scarlet Red & Matte Black)
  - Silk Gold Monogram (Navy Blue & Silk Gold)
  - Dark Knight Stealth (Matte Carbon & Amber)
  - Espresso Barista (Warm Brown & Cream Latte)
  - Cyberpunk Neon (Midnight Navy & Cyan)
  - Monochrome Minimal (Pure White & Jet Black)

### 6. Binary STL Export & Slicer / Klipper Guide
- **Combined Single STL**: Watertight, manifold binary STL ready for slicing with a filament swap macro (`PAUSE` or `M600`) at the exact calculated swap layer.
- **Multi-Part STL Pack**: Exports `_base.stl` and `_artwork.stl` with matching `(0,0,0)` origins for multi-extrusion or Bambu AMS / Prusa MMU printing.
- **Slicer Assistant**:
  - Automatically calculates total layer count, exact filament swap layer, and swap Z height.
  - Provides ready-to-copy Klipper macro snippets.
  - Estimates filament weight (grams PLA) and print duration.

---

## 🛠️ Printing with Klipper (Single-Nozzle Color Swap)

1. Design your coaster in 3D Coaster Studio and click **Export STL** $\rightarrow$ **Download Combined STL**.
2. Open the STL file in your slicer (**OrcaSlicer, PrusaSlicer, Bambu Studio, or Cura**).
3. In the app's **Klipper Guide** tab, check the exact swap layer (e.g. *Layer 16 at Z = 3.20mm*).
4. In your slicer's layer bar, right-click that layer and select **Add Color Change** (or **Pause Print**).
5. Start the print with your Base filament (e.g. Black). When Klipper reaches the swap layer, it pauses automatically.
6. Feed your second filament (e.g. Red for Spider-Man), purge the nozzle, and click **Resume** in Mainsail / Fluidd.

---

## 📂 Project Structure

```
3D_Coaster Designer/
├── public/
│   └── fonts/                   # Local TrueType fonts for offline vector generation
│       ├── GreatVibes.ttf
│       ├── CinzelDecorative.ttf
│       ├── Montserrat.ttf
│       └── PirataOne.ttf
├── src/
│   ├── components/
│   │   ├── Controls/
│   │   │   ├── DesignControls.jsx     # Presets, alphabets, text tool, SVG upload
│   │   │   ├── MaterialControls.jsx   # Filament colors & presets
│   │   │   ├── ShapeControls.jsx      # Base shape, dimensions, rim, chamfer
│   │   │   ├── SlicerAssistant.jsx    # Klipper macro & layer calculations
│   │   │   └── TransformControls.jsx  # Scale, position, rotation, emboss/deboss
│   │   ├── ExportModal.jsx            # Binary STL downloader (single & multi-part)
│   │   ├── HelpModal.jsx              # 3D printing & Klipper walkthrough
│   │   ├── Navbar.jsx                 # Top bar with quick start presets & tools
│   │   └── Viewport3D.jsx             # Three.js 3D canvas & build plate
│   ├── utils/
│   │   ├── geometryGenerator.js       # Base & artwork 3D geometry engine
│   │   ├── prebuiltSvgs.js            # Curated vectors (Spider-Man, heroes, drinks, mandalas)
│   │   ├── slicerHelpers.js           # Layer & filament weight estimations
│   │   ├── stlExporter.js             # High-performance Binary STL exporter
│   │   └── textToSvg.js               # Dynamic Opentype bezier vector converter
│   ├── App.jsx                        # Master application coordinator
│   ├── index.css                      # Tailwind styling & glassmorphism
│   └── main.jsx                       # React root entry
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```
