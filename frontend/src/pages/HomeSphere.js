import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PostPoint({ position, post }) {
  const navigate = useNavigate();
  return (
    <mesh
      position={position}
      onClick={() => navigate(`/post/${post.id}`)}
    >
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="skyblue" />
    </mesh>
  );
}

function generateSpherePositions(count, radius = 8) {
  const points = [];
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(-1 + (2 * i) / count);
    const theta = Math.sqrt(count * Math.PI) * phi;

    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);
    points.push([x, y, z]);
  }
  return points;
}

function SphereGroup({ posts }) {
  const groupRef = useRef();
  const positions = generateSpherePositions(posts.length, 8);

  // 회전 애니메이션
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005;  // 천천히 y축 회전
      groupRef.current.rotation.x += 0.0002;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 투명 회전 구 */}
      <mesh>
        <sphereGeometry args={[8.2, 64, 64]} />
        <meshStandardMaterial
          transparent
          opacity={0.1}
          color="skyblue"
          wireframe
        />
      </mesh>

      {/* 점들 */}
      {posts.map((post, index) => (
        <PostPoint
          key={post.id}
          post={post}
          position={positions[index]}
        />
      ))}
    </group>
  );
}

export default function HomeSphere() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: 'black' }}>
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <SphereGroup posts={posts} />
      </Canvas>
    </div>
  );
}