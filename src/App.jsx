// FOUR CORNERS 3D GAME
// BY: DEVIN AVERY
// Classic 4 corners game BUT in 3D.
// The game keeps track of the player's score and resets if they DON'T go to the corner called.

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Text, Float } from '@react-three/drei';
import { Vector3 } from 'three';

// Ball player 
function Player({ targetPosition }) {
  const meshRef = useRef();
  const currentPos = new Vector3(...targetPosition);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // EDIT: Smoother movement using lerp (Linear Interpolation)
      meshRef.current.position.lerp(new Vector3(targetPosition[0], 1, targetPosition[2]), 0.15);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 1, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#0066ff" emissive="#002266" />
    </mesh>
  );
}

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState('START'); 
  const [activeCorner, setActiveCorner] = useState(null);
  const [playerIdx, setPlayerIdx] = useState(0);
  const [isWarning, setIsWarning] = useState(false);

  const corners = [
    { pos: [-5, 0, -5], color: '#ff4444' }, // Red
    { pos: [5, 0, -5], color: '#44ff44' },  // Green
    { pos: [-5, 0, 5], color: '#ffbb00' },  // Orange
    { pos: [5, 0, 5], color: '#ff44ff' },   // Purple
  ];

  // EDIT: Dynamic Difficulty Logic
  const gameSpeed = Math.max(600, 2000 - (score * 150));

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const timer = setTimeout(() => {
      const randomCorner = Math.floor(Math.random() * 4);
      setActiveCorner(randomCorner);
      setIsWarning(true);

      // Reaction Window
      setTimeout(() => {
        // DELETE: Random teleporting (Player stays where they clicked)
        // EDIT: Win condition (Must NOT be in the "called" corner)
        if (playerIdx === randomCorner) {
          setGameState('GAMEOVER');
        } else {
          setScore(s => s + 1);
          setIsWarning(false);
          setActiveCorner(null);
        }
      }, gameSpeed);
    }, 1500);

    return () => clearTimeout(timer);
  }, [gameState, playerIdx, score, gameSpeed]);

  const startGame = () => {
    setScore(0);
    setGameState('PLAYING');
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#111' }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 10, 15]} />
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />

        {/* The Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#222" />
        </mesh>

        {/* Player Avatar with Smooth Movement */}
        <Player targetPosition={corners[playerIdx].pos} />

        {/* Corner Slabs */}
        {corners.map((corner, i) => (
          <mesh 
            key={i} 
            position={[corner.pos[0], 0.25, corner.pos[2]]}
            onClick={() => setPlayerIdx(i)}
          >
            <boxGeometry args={[3, 0.5, 3]} />
            <meshStandardMaterial 
              color={corner.color}
              emissive={activeCorner === i && isWarning ? corner.color : '#000'}
              emissiveIntensity={isWarning ? 2 : 0}
              transparent
              opacity={activeCorner === i && isWarning ? 1 : 0.6}
            />
          </mesh>
        ))}

        {/* 3D GAME OVER Message */}
        {gameState === 'GAMEOVER' && (
          <Float speed={2} rotationIntensity={0.5}>
            <Text position={[0, 5, 0]} fontSize={1} color="white">GAME OVER</Text>
          </Float>
        )}
      </Canvas>

      {/* Start game/try again button*/}
      <div style={uiOverlayStyle}>
        <h1>Score: {score}</h1>
        {gameState !== 'PLAYING' && (
          <button onClick={startGame} style={buttonStyle}>
            {gameState === 'START' ? 'START GAME' : 'TRY AGAIN'}
          </button>
        )}
      </div>
    </div>
  );
}

// Additonal Styling
const uiOverlayStyle = { position: 'absolute', top: 20, left: 20, color: 'white', pointerEvents: 'none' };
const buttonStyle = { pointerEvents: 'auto', padding: '10px 20px', fontSize: '20px', cursor: 'pointer' };
