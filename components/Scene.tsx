import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Tree } from './Tree';
import { TreeMode } from '../types';
import { COLORS } from '../constants';

interface SceneProps {
  mode: TreeMode;
}

export const Scene: React.FC<SceneProps> = ({ mode }) => {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        camera={{ position: [0, 2, 18], fov: 45, near: 0.1, far: 1000 }}
        gl={{ 
            antialias: true, 
            toneMappingExposure: 1.1,
        }}
        dpr={[1, 2]} 
        shadows
      >
        <color attach="background" args={['#020202']} />
        
        {/* --- LIGHTING --- */}
        <ambientLight intensity={1.5} color="#ffffff" />
        
        <hemisphereLight args={['#fff0f0', '#050505', 2]} />
        
        {/* Main Golden Spotlight */}
        <spotLight 
          position={[10, 20, 10]} 
          angle={0.4} 
          penumbra={1} 
          intensity={800} 
          distance={200}
          color={COLORS.WARM_LIGHT} 
          castShadow 
          shadow-bias={-0.0001}
        />
        
        {/* Fill Light */}
        <pointLight position={[-10, 5, -10]} intensity={200} color="#bfdbfe" distance={50} />

        {/* --- ENVIRONMENT --- */}
        <Environment preset="city" blur={0.8} background={false} />

        {/* --- CONTENT --- */}
        <Suspense fallback={null}>
          <group position={[0, -2, 0]}>
            <Tree mode={mode} />
            
            {/* Floor Reflection */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
              <planeGeometry args={[200, 200]} />
              <meshStandardMaterial 
                color="#050505" 
                roughness={0.1} 
                metalness={0.8} 
              />
            </mesh>
          </group>
        </Suspense>

        {/* --- PARTICLES --- */}
        <Stars radius={60} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
        <Sparkles 
            count={400} 
            scale={12} 
            size={4} 
            speed={0.3} 
            opacity={0.8} 
            color={COLORS.GOLD} 
            position={[0, 2, 0]}
        />

        {/* --- POST PROCESSING --- */}
        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={1} 
            mipmapBlur 
            intensity={1.2} 
            radius={0.5} 
          />
          <Vignette eskil={false} offset={0.1} darkness={0.8} />
        </EffectComposer>

        {/* --- CONTROLS --- */}
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 1.9}
          minDistance={10}
          maxDistance={40}
          autoRotate={mode === TreeMode.ASSEMBLED}
          autoRotateSpeed={0.5}
          target={[0, 2, 0]}
        />
      </Canvas>
    </div>
  );
};