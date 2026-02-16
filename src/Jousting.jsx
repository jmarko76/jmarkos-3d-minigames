import { useRevoluteJoint } from '@react-three/rapier';
import React, { use, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { HorizontalBlurShader } from 'three/examples/jsm/Addons.js';

export default function Jousting() {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);

        camera.position.z = 10;

        // Platform
        const platformGeom = new THREE.BoxGeometry(30, 1, 5);
        const platformMat = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const platform = new THREE.Mesh(platformGeom, platformMat);
        scene.add(platform);

        // Cube 1 (left)
        const cubeGeom = new THREE.BoxGeometry(1, 1, 1);
        const cubeMat1 = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
        const cube1 = new THREE.Mesh(cubeGeom, cubeMat1);
        cube1.position.set(-12, 1, 0);
        scene.add(cube1);

        // Cube 2 (right)
        const cubeMat2 = new THREE.MeshPhongMaterial({ color: 0x0000FF });
        const cube2 = new THREE.Mesh(cubeGeom, cubeMat2);
        cube2.position.set(12, 1, 0);
        scene.add(cube2);

        // Lighting
        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(0, 10, 10);
        scene.add(light);
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));

        // Movement
        const speed = 0.2;
        const keys = {};

        window.addEventListener('keydown', (e) => (keys[e.key] = true));
        window.addEventListener('keyup', (e) => (keys[e.key] = false));

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Cube 1 controls (A/D)
            if (keys['a'] && cube1.position.x > -14) cube1.position.x -= speed;
            if (keys['d'] && cube1.position.x < 14) cube1.position.x += speed;

            // Cube 2 controls (ArrowLeft/ArrowRight)
            if (keys['ArrowLeft'] && cube2.position.x > -14) cube2.position.x -= speed;
            if (keys['ArrowRight'] && cube2.position.x < 14) cube2.position.x += speed;

            // Collision detection
            const distance = Math.abs(cube1.position.x - cube2.position.x);
            if (distance < 1) {
                cube1.position.x = -12;
                cube2.position.x = 12;
            }

            renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            containerRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div ref={containerRef}>
            <div style={{ position: 'absolute', top: 10, color: '#fff', fontFamily: 'Arial' }}>
                <p>Red Cube: A/D | Blue Cube: Arrow Keys</p>
            </div>
        </div>
    );
}