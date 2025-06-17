import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSpring, a } from '@react-spring/three';


function PostPoint({ position, post }) {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);
  
    // spring 애니메이션 정의
    const { scale } = useSpring({
      scale: hovered ? 1.5 : 1,
      config: { tension: 200, friction: 15 }, // 부드러운 움직임 조절
    });
  
    return (
      <a.mesh
        position={position}
        onClick={() => navigate(`/post/${post.id}`)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
        scale={scale}
      >
        <sphereGeometry args={[0.1, 64, 64]} />
        <meshStandardMaterial
          color={hovered ? 'white' : 'skyblue'}
          metalness={0.5}
          roughness={0.1}
        />
      </a.mesh>
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
        <Canvas
          shadows
          camera={{ position: [0, 0, 20], fov: 60 }}
          style={{ backgroundColor: 'black' }}
        >
          {/* 조명 설정 시작 */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={1}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          {/* 조명 설정 끝 */}
  
          <OrbitControls />
          <SphereGroup posts={posts} />
        </Canvas>
      </div>
    );
  }
  
