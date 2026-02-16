import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export default function App() {
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [playerPosition, setPlayerPosition] = useState(0);
  const [activeCorner, setActiveCorner] = useState(null);
  const [cornersGlowing, setCornersGlowing] = useState([false, false, false, false]);

  const corners = [
    { pos: [-5, 0, -5], index: 0 },
    { pos: [5, 0, -5], index: 1 },
    { pos: [-5, 0, 5], index: 2 },
    { pos: [5, 0, 5], index: 3 },
  ];

  useEffect(() => {
    if (!gameActive) return;

    const timer = setTimeout(() => {
      const randomCorner = Math.floor(Math.random() * 4);
      setActiveCorner(randomCorner);

      const newGlowing = [false, false, false, false];
      newGlowing[randomCorner] = true;
      setCornersGlowing(newGlowing);

      setTimeout(() => {
        if (playerPosition !== randomCorner) {
          setScore(score + 1);
          setPlayerPosition(Math.floor(Math.random() * 4));
        } else {
          setScore(0);
          setPlayerPosition(Math.floor(Math.random() * 4));
        }
        setCornersGlowing([false, false, false, false]);
      }, 1000);
    }, 2000);

    return () => clearTimeout(timer);
  }, [gameActive, playerPosition, score]);

  const handleCornerClick = (index) => {
    setPlayerPosition(index);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        <PerspectiveCamera position={[0, 8, 12]} fov={50} />
        <OrbitControls />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />

        {/* Platform Grid */}
        <mesh position={[0, -1, 0]}>
          <boxGeometry args={[12, 0.5, 12]} />
          <meshStandardMaterial color="#444" />
        </mesh>

        {/* Corner Slabs */}
        {corners.map((corner) => (
          <mesh
            key={corner.index}
            position={[corner.pos[0], 0.5, corner.pos[2]]}
            onClick={() => handleCornerClick(corner.index)}
          >
            <boxGeometry args={[2, 1, 2]} />
            <meshStandardMaterial
              color={
                playerPosition === corner.index
                  ? '#0066ff'
                  : cornersGlowing[corner.index]
                  ? '#ffff00'
                  : '#ffffff'
              }
              emissive={cornersGlowing[corner.index] ? '#ffff00' : '#000000'}
              emissiveIntensity={cornersGlowing[corner.index] ? 0.8 : 0}
            />
          </mesh>
        ))}
      </Canvas>

      <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', fontSize: '24px' }}>
        Score: {score}
      </div>
      <div style={{ position: 'absolute', bottom: 20, left: 20, color: 'white', fontSize: '16px' }}>
        Click a corner to move. Yellow = called corner. Blue = your position.
      </div>
    </div>
  );
}