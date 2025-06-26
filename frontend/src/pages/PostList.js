// src/pages/PostList.js

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { a, useSpring } from '@react-spring/three';
import { OrbitControls } from '@react-three/drei';

function CircularPostPoint({ position, post, currentUserId }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const isMine = Number(currentUserId) && post.user_id === Number(currentUserId);

  const { scale } = useSpring({
    scale: hovered ? 1.5 : 1,
    config: { tension: 200, friction: 15 }
  });

  return (
    <a.mesh
      position={position}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => navigate(`/post/${post.id}`)}
    >
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial
        color={isMine ? (hovered ? '#ffb300' : '#ffd54f') : (hovered ? '#b3e5fc' : 'skyblue')}
      />
    </a.mesh>
  );
}


function generateCirclePositions(count, radius = 5) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const x = radius * Math.cos(angle);
    const y = 0;
    const z = radius * Math.sin(angle);
    positions.push([x, y, z]);
  }
  return positions;
}

function CircularPostGroup({ posts, currentUserId }) {
  const groupRef = useRef();
  const positions = generateCirclePositions(posts.length, 4);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {posts.map((post, i) => (
        <CircularPostPoint
          key={post.id}
          post={post}
          position={positions[i]}
          currentUserId={currentUserId}
        />
      ))}
    </group>
  );
}

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const currentUserId = sessionStorage.getItem('user_id'); // 또는 context 등
  console.log('currentUserId:', currentUserId);
  useEffect(() => {
    axios.get('http://localhost:8000/posts/')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: 'black' }}>
      <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls />
        <CircularPostGroup posts={posts} currentUserId={currentUserId} />
      </Canvas>
    </div>
  );
}