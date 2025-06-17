// src/components/Layout3D.js
import { Canvas } from '@react-three/fiber';
import { TransparentRotatingSphere } from './SomeSphereComponent';
import { Outlet } from 'react-router-dom';

export default function Layout3D() {
  return (
    <>
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <TransparentRotatingSphere />
      </Canvas>
      <div className="ui-overlay">
        <Outlet />
      </div>
    </>
  );
}
