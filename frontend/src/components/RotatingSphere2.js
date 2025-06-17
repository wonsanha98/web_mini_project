// src/components/RotatingSphere2.js
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function Sphere() {
  const meshRef = useRef();

  useFrame(() => {
    meshRef.current.rotation.y += 0.001;
    meshRef.current.rotation.x += 0.0005;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2, 100, 100]} />
      <meshStandardMaterial color="skyblue" wireframe />
    </mesh>
  );
}

export default function RotatingSphere2() {
  return (
    <div style={{ width: '100%', height: '239px' }}>
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} />
        <Sphere />
      </Canvas>
    </div>
  );
}
