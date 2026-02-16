// Tree-Fall Game
// By: Devin Avery
// A simple 3D game where the player controls a cube to chop down trees by colliding with them. 
// The player moves around a flat plane, and trees are randomly placed. 
// When the player collides with a tree, the score increases and the tree respawns at a new location. 
// The game features basic lighting and shadows. 
// Use W/A/S/D keys to move the player cube around the scene.

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function App() {
  const containerRef = useRef(null);
  const [score, setScore] = useState(0);
  const playerRef = useRef({ x: 0, y: 0, z: 0 });
  const keysRef = useRef({});
  const treesRef = useRef([]);
  const sceneRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5);
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Ground plane
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x2d5016 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);

    // Player cube
    const cubeGeometry = new THREE.BoxGeometry(1, 2, 1);
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const player = new THREE.Mesh(cubeGeometry, cubeMaterial);
    player.position.set(0, 1, 0);
    player.castShadow = true;
    scene.add(player);

    // Create trees
    const createTree = (x, z) => {
      const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 3, 8);
      const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.set(x, 1.5, z);
      trunk.castShadow = true;
      scene.add(trunk);

      const foliageGeometry = new THREE.ConeGeometry(1.5, 3, 8);
      const foliageMaterial = new THREE.MeshPhongMaterial({ color: 0x228b22 });
      const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
      foliage.position.set(x, 5, z);
      foliage.castShadow = true;
      scene.add(foliage);

      return { x, z, trunk, foliage, radius: 1 };
    };

    // Spawn trees
    for (let i = 0; i < 10; i++) {
      const x = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 80;
      treesRef.current.push(createTree(x, z));
    }

    // Input handling
    const handleKeyDown = (e) => {
      keysRef.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      const speed = 0.3;
      if (keysRef.current['w']) playerRef.current.z -= speed;
      if (keysRef.current['s']) playerRef.current.z += speed;
      if (keysRef.current['a']) playerRef.current.x -= speed;
      if (keysRef.current['d']) playerRef.current.x += speed;

      player.position.set(playerRef.current.x, 1, playerRef.current.z);
      camera.position.set(playerRef.current.x, 8, playerRef.current.z + 10);
      camera.lookAt(playerRef.current.x, 0, playerRef.current.z);

      // Check collision with trees
      treesRef.current.forEach((tree) => {
        const dx = playerRef.current.x - tree.x;
        const dz = playerRef.current.z - tree.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        if (distance < tree.radius + 0.5) {
          setScore((s) => s + 1);
          tree.x = (Math.random() - 0.5) * 80;
          tree.z = (Math.random() - 0.5) * 80;
          tree.trunk.position.set(tree.x, 1.5, tree.z);
          tree.foliage.position.set(tree.x, 5, tree.z);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', fontSize: '32px', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
        Score: {score}
      </div>
      <div style={{ position: 'absolute', bottom: 20, left: 20, color: 'white', fontSize: '16px', textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
        Use W/A/S/D to move
      </div>
    </div>
  );
}