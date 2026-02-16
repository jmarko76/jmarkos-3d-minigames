import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Pong3D() {
    const containerRef = useRef(null);
    const [scores, setScores] = useState({ left: 0, right: 0 });

    useEffect(() => {
        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 50;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);

        // Paddles
        const paddleGeometry = new THREE.BoxGeometry(2, 10, 2);
        const paddleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        
        const leftPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
        leftPaddle.position.x = -40;
        scene.add(leftPaddle);
        
        const rightPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
        rightPaddle.position.x = 40;
        scene.add(rightPaddle);

        // Ball
        const ballGeometry = new THREE.SphereGeometry(1, 16, 16);
        const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);
        scene.add(ball);

        // Lighting
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(10, 10, 10);
        scene.add(light);
        scene.add(new THREE.AmbientLight(0x404040));

        // Game variables
        let ballVelocity = { x: 300.0, y: 300.0, z: 0 };
        const keys = {};
        let gameScores = { left: 0, right: 0 };

        window.addEventListener('keydown', (e) => keys[e.key] = true);
        window.addEventListener('keyup', (e) => keys[e.key] = false);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Paddle movement
            if (keys['w'] && leftPaddle.position.y < 20) leftPaddle.position.y += 1;
            if (keys['s'] && leftPaddle.position.y > -20) leftPaddle.position.y -= 1;
            if (keys['ArrowUp'] && rightPaddle.position.y < 20) rightPaddle.position.y += 1;
            if (keys['ArrowDown'] && rightPaddle.position.y > -20) rightPaddle.position.y -= 1;

            // Ball movement
            ball.position.x += ballVelocity.x;
            ball.position.y += ballVelocity.y;

            // Boundary collisions
            if (ball.position.y > 30 || ball.position.y < -30) ballVelocity.y *= -1;
            
            // Scoring
            if (ball.position.x > 50) {
                gameScores.left++;
                setScores({ ...gameScores });
                ball.position.set(0, 0, 0);
                ballVelocity = { x: 0.5, y: 0.3, z: 0 };
            }
            if (ball.position.x < -50) {
                gameScores.right++;
                setScores({ ...gameScores });
                ball.position.set(0, 0, 0);
                ballVelocity = { x: -0.5, y: 0.3, z: 0 };
            }

            // Paddle collisions
            if (Math.abs(ball.position.x - leftPaddle.position.x) < 5 && 
                    Math.abs(ball.position.y - leftPaddle.position.y) < 10) {
                ballVelocity.x *= -1;
            }
            if (Math.abs(ball.position.x - rightPaddle.position.x) < 5 && 
                    Math.abs(ball.position.y - rightPaddle.position.y) < 10) {
                ballVelocity.x *= -1;
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
            renderer.dispose();
            containerRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <>
            <div ref={containerRef} />
            <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: '32px', fontWeight: 'bold' }}>
                {scores.left} - {scores.right}
            </div>
        </>
    );
}