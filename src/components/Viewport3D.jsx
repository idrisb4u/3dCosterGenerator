import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCw, Eye, Box, Maximize2, Layers, RefreshCw, ZoomIn, ZoomOut, Puzzle } from 'lucide-react';

export default function Viewport3D({
  baseMesh,
  accentMesh,
  rimMesh,
  artworkMesh,
  baseColor = '#111827',
  accentColor = '#dc2626',
  rimColor = '#111827',
  artworkColor = '#111827',
  dimensions = { width: 100, height: 100, baseThickness: 2.2, accentThickness: 1.0, artworkHeight: 1.2 },
  layerCutHeight = 10,
  maxCutHeight = 10,
  isWireframe = false,
  autoRotate = false,
  explodedView = 0, // 0 = assembled, 1 = fully exploded
}) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const coasterGroupRef = useRef(null);
  const clippingPlaneRef = useRef(null);

  const [activeView, setActiveView] = useState('perspective');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#080c14');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, -115, 95);
    camera.up.set(0, 0, 1);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.localClippingEnabled = true;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 0, 3);
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.minDistance = 30;
    controls.maxDistance = 350;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.25);
    keyLight.position.set(70, -90, 130);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 10;
    keyLight.shadow.camera.far = 400;
    const d = 85;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x94a3b8, 0.5);
    fillLight.position.set(-80, 80, 70);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
    rimLight.position.set(0, 100, 30);
    scene.add(rimLight);

    // Build Plate
    const bedGroup = new THREE.Group();
    const bedGeo = new THREE.PlaneGeometry(220, 220);
    const bedMat = new THREE.MeshStandardMaterial({
      color: 0x141a24,
      roughness: 0.88,
      metalness: 0.1,
    });
    const bedMesh = new THREE.Mesh(bedGeo, bedMat);
    bedMesh.receiveShadow = true;
    bedMesh.position.set(0, 0, -0.1);
    bedGroup.add(bedMesh);

    const gridHelper = new THREE.GridHelper(220, 22, 0x38bdf8, 0x1e293b);
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.set(0, 0, 0.05);
    bedGroup.add(gridHelper);

    const centerRingGeo = new THREE.RingGeometry(4.5, 5.0, 32);
    const centerRingMat = new THREE.MeshBasicMaterial({ color: 0x0284c7, side: THREE.DoubleSide });
    const centerRing = new THREE.Mesh(centerRingGeo, centerRingMat);
    centerRing.position.set(0, 0, 0.1);
    bedGroup.add(centerRing);

    scene.add(bedGroup);

    // Coaster Model Group
    const coasterGroup = new THREE.Group();
    scene.add(coasterGroup);
    coasterGroupRef.current = coasterGroup;

    // Clipping Plane
    const clippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 100);
    clippingPlaneRef.current = clippingPlane;

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
      controlsRef.current.autoRotateSpeed = 2.0;
    }
  }, [autoRotate]);

  useEffect(() => {
    if (!clippingPlaneRef.current || !rendererRef.current) return;
    if (layerCutHeight < maxCutHeight && explodedView === 0) {
      clippingPlaneRef.current.constant = layerCutHeight;
      rendererRef.current.clippingPlanes = [clippingPlaneRef.current];
    } else {
      rendererRef.current.clippingPlanes = [];
    }
  }, [layerCutHeight, maxCutHeight, explodedView]);

  // Update Meshes in 3D Scene (with Exploded View Offsets)
  useEffect(() => {
    const group = coasterGroupRef.current;
    if (!group) return;

    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    }

    const makeMaterial = (colorHex, roughness = 0.38) => {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        roughness: roughness,
        metalness: 0.08,
        wireframe: isWireframe,
        side: THREE.DoubleSide,
      });
    };

    // Calculate vertical lift offsets for Exploded Assembly View
    const accentLift = explodedView * 16.0; // 0 to 16mm lift
    const artLift = explodedView * 32.0;    // 0 to 32mm lift

    // 1. Base Mesh (Part 1 - stays at Z = 0)
    if (baseMesh && baseMesh.geometry) {
      const baseClone = new THREE.Mesh(baseMesh.geometry.clone(), makeMaterial(baseColor, 0.45));
      baseClone.castShadow = true;
      baseClone.receiveShadow = true;
      baseClone.position.copy(baseMesh.position);
      group.add(baseClone);
    }

    // 2. Middle Accent Plate (Part 2 - lifts in exploded view)
    if (accentMesh && accentMesh.geometry) {
      const accentClone = new THREE.Mesh(accentMesh.geometry.clone(), makeMaterial(accentColor, 0.35));
      accentClone.castShadow = true;
      accentClone.receiveShadow = true;
      accentClone.position.copy(accentMesh.position);
      accentClone.position.z += accentLift;
      group.add(accentClone);
    }

    // 3. Rim Mesh (sits with base - in 2-color mode, matches baseColor!)
    if (rimMesh && rimMesh.geometry) {
      const effectiveRimColor = accentMesh ? rimColor : baseColor;
      const rimClone = new THREE.Mesh(rimMesh.geometry.clone(), makeMaterial(effectiveRimColor, 0.35));
      rimClone.castShadow = true;
      rimClone.receiveShadow = true;
      rimClone.position.copy(rimMesh.position);
      group.add(rimClone);
    }

    // 4. Top Artwork Mesh (Part 3 - lifts highest in exploded view)
    if (artworkMesh && artworkMesh.geometry) {
      const artClone = new THREE.Mesh(artworkMesh.geometry.clone(), makeMaterial(artworkColor, 0.32));
      artClone.castShadow = true;
      artClone.receiveShadow = true;
      artClone.position.copy(artworkMesh.position);
      artClone.position.z += artLift;
      group.add(artClone);
    }
  }, [
    baseMesh,
    accentMesh,
    rimMesh,
    artworkMesh,
    baseColor,
    accentColor,
    rimColor,
    artworkColor,
    isWireframe,
    explodedView,
  ]);

  const setCameraView = (view) => {
    if (!cameraRef.current || !controlsRef.current) return;
    setActiveView(view);
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    switch (view) {
      case 'perspective':
        camera.position.set(0, -115, 95);
        camera.up.set(0, 0, 1);
        controls.target.set(0, 0, explodedView > 0 ? 12 : 3);
        break;
      case 'top':
        camera.position.set(0, 0, 160);
        camera.up.set(0, 1, 0);
        controls.target.set(0, 0, 0);
        break;
      case 'front':
        camera.position.set(0, -150, 12);
        camera.up.set(0, 0, 1);
        controls.target.set(0, 0, explodedView > 0 ? 12 : 3);
        break;
      case 'iso':
        camera.position.set(90, -90, 80);
        camera.up.set(0, 0, 1);
        controls.target.set(0, 0, explodedView > 0 ? 12 : 3);
        break;
      default:
        break;
    }
    controls.update();
  };

  const handleZoom = (delta) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const factor = delta > 0 ? 0.85 : 1.15;
    cameraRef.current.position.multiplyScalar(factor);
    controlsRef.current.update();
  };

  const totalZ = (
    Number(dimensions.baseThickness) +
    (dimensions.hasAccent ? Number(dimensions.accentThickness) : 0) +
    Number(dimensions.artworkHeight)
  ).toFixed(1);

  return (
    <div className="relative w-full h-full min-h-[440px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full flex-1 cursor-grab active:cursor-grabbing" />

      {/* Floating Viewport Presets */}
      <div className="absolute top-4 left-4 flex items-center space-x-1.5 p-1 bg-slate-900/85 backdrop-blur-md rounded-xl border border-slate-700/60 shadow-lg z-10">
        <button
          onClick={() => setCameraView('perspective')}
          title="3D Perspective View"
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
            activeView === 'perspective' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D</span>
        </button>

        <button
          onClick={() => setCameraView('top')}
          title="Top-Down Alignment View"
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
            activeView === 'top' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Top</span>
        </button>

        <button
          onClick={() => setCameraView('front')}
          title="Front Profile View"
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
            activeView === 'front' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Profile</span>
        </button>

        <button
          onClick={() => setCameraView('iso')}
          title="Isometric View"
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
            activeView === 'iso' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Iso</span>
        </button>
      </div>

      {/* Floating Zoom & Controls */}
      <div className="absolute top-4 right-4 flex items-center space-x-1.5 p-1 bg-slate-900/85 backdrop-blur-md rounded-xl border border-slate-700/60 shadow-lg z-10">
        <button
          onClick={() => handleZoom(1)}
          title="Zoom In"
          className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(-1)}
          title="Zoom Out"
          className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setCameraView('perspective')}
          title="Reset Camera"
          className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Exploded View Floating Notification */}
      {explodedView > 0 && (
        <div className="absolute top-16 left-4 bg-emerald-500/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/40 text-xs font-medium text-emerald-300 flex items-center space-x-2 animate-fade-in z-10">
          <Puzzle className="w-4 h-4 text-emerald-400" />
          <span>Exploded Glue Assembly View ({Math.round(explodedView * 100)}%)</span>
        </div>
      )}

      {/* Bottom Status & Dimensions Badge */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-md text-xs font-mono text-slate-300 flex items-center space-x-3">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Size:</span>
            <strong className="text-white">{dimensions.width}×{dimensions.height}×{totalZ} mm</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span>Parts: <strong className="text-emerald-400">3 Modular STLs</strong></span>
        </div>

        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 shadow-md text-[11px] text-slate-400 hidden sm:flex items-center space-x-2">
          <span>Rotate: <kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-200">Left Drag</kbd></span>
          <span>•</span>
          <span>Pan: <kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-200">Right Drag</kbd></span>
        </div>
      </div>
    </div>
  );
}
