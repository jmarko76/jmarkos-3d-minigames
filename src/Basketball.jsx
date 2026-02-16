import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function App() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(100, 100, 70);
    light.castShadow = true;
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Court
    const courtGeom = new THREE.PlaneGeometry(20, 10);
    const courtMat = new THREE.MeshStandardMaterial({ color: 0x330000 });
    const court = new THREE.Mesh(courtGeom, courtMat);
    court.receiveShadow = true;
    court.rotation.x = -Math.PI / 2;
    scene.add(court);

    // Basketball hoop
    const rimGeom = new THREE.TorusGeometry(0.5, 0.05, 16, 32);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const rim = new THREE.Mesh(rimGeom, rimMat);
    rim.position.set(0, 3, -8);
    rim.rotation.x = Math.PI / 8;
    rim.castShadow = true;
    scene.add(rim);

    // Backboard
    const backGeom = new THREE.BoxGeometry(2, 1.5, 0.1);
    const backMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const backboard = new THREE.Mesh(backGeom, backMat);
    backboard.position.set(0, 3.2, -8.2);
    backboard.castShadow = true;
    scene.add(backboard);

    // Basketball
    const ballGeom = new THREE.SphereGeometry(0.24, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({ color: 0xff6600 });
    const ball = new THREE.Mesh(ballGeom, ballMat);
    ball.position.set(0, 1, 2);
    ball.castShadow = true;
    scene.add(ball);

    let ballVelocity = new THREE.Vector3(0, 0, 0);
    const gravity = 0.01;
    let isThrown = false;

    // Throw ball on click
    window.addEventListener('click', () => {
      if (!isThrown) {
        ballVelocity.set(0, 0.500, -0.9000);
        isThrown = true;
      }
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (isThrown) {
        ballVelocity.y -= gravity;
        ball.position.add(ballVelocity);

        // Reset if ball falls too far
        if (ball.position.y < -5) {
          ball.position.set(0, 1, 2);
          ballVelocity.set(0, 0, 0);
          isThrown = false;
        }

        // Check if ball went through rim (simple collision)
        const rimDistance = ball.position.distanceTo(rim.position);
        if (rimDistance < 0.6 && ball.position.y < rim.position.y) {
          console.log('Score!');
          ball.position.set(0, 1, 2);
          ballVelocity.set(0, 0, 0);
          isThrown = false;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
}