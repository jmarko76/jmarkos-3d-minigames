// // Jmarko's Minigames
// // By Devin Avery
// // A collection of simple 3D minigames built with React and Three.js. 
// // Each game features basic mechanics and controls, for quick  fun. 
// // Games include Treefall, Basketball, and more! 
// // Use the onscreen instructions for each game to get started.


// import React, { useState } from 'react';
// import Basketball from './Basketball';
// import Treefall from './Treefall';
// import FourCorners from './FourCorners';
// import Jousting from './Jousting';
// import Pong from './Pong';

// import './App.css';

// const GAMES_LIST = [
//   { id: 'basketball', name: 'Hoop Master', Component: Basketball },
//   { id: 'treefall', name: 'Tree-Fall', Component: Treefall },
//   { id: 'fourcorners', name: 'Four Corners', Component: FourCorners },
//   { id: 'jousting', name: 'Jousting', Component: Jousting },
//   { id: 'pong', name: 'Pong', Component: Pong },
// ];

// export default function App() {
//   // 1. Initialize state with a random index so every refresh is different
//   const [gameIndex, setGameIndex] = useState(() => 
//     Math.floor(Math.random() * GAMES_LIST.length)
//   );

//   const handleGameComplete = () => {
//     // Moves to the next one in the list (sequential)
//     setGameIndex((prev) => (prev + 1) % GAMES_LIST.length);
//   };

//   const ActiveGame = GAMES_LIST[gameIndex].Component;

//   return (
//     <div className="app-main">
//       <div className="hud-overlay">
//         <h1 className="title">Jmarko's Minigames</h1>
//         <div className="stats">
//           <span>Current Game: {GAMES_LIST[gameIndex].name}</span>
//         </div>
//       </div>

//       <div className="game-container">
//         {/* Use a 'key' here to force React to reset the component fully when index changes */}
//         <ActiveGame key={GAMES_LIST[gameIndex].id} onComplete={handleGameComplete} />
//       </div>
//     </div>
//   );
// }