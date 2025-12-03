import React, { useMemo, useRef, useState, useLayoutEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NEEDLE_COUNT, ORNAMENT_COUNT, TREE_HEIGHT, TREE_RADIUS, COLORS } from '../constants';
import { TreeMode } from '../types';

interface TreeProps {
  mode: TreeMode;
}

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

export const Tree: React.FC<TreeProps> = ({ mode }) => {
  const needlesRef = useRef<THREE.InstancedMesh>(null);
  const ornamentsRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // --- DATA GENERATION ---
  const needleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < NEEDLE_COUNT; i++) {
      const y = Math.random() * TREE_HEIGHT;
      // Cone shape logic
      const radiusAtY = ((TREE_HEIGHT - y) / TREE_HEIGHT) * TREE_RADIUS;
      const r = Math.random() * radiusAtY; 
      const theta = Math.random() * Math.PI * 2;
      
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      
      // Explosion direction
      const dir = new THREE.Vector3(x, y, z).normalize().multiplyScalar(Math.random() * 5 + 2);

      data.push({
        initialPos: new THREE.Vector3(x, y - 5, z), // Offset y to center vertically
        rotation: new THREE.Euler(Math.random() * 0.5, Math.random() * Math.PI * 2, 0),
        scale: Math.random() * 0.5 + 0.5,
        velocity: dir
      });
    }
    return data;
  }, []);

  const ornamentData = useMemo(() => {
    const data = [];
    const palette = [COLORS.GOLD, COLORS.RED_VELVET, COLORS.ROYAL_BLUE, COLORS.SILVER, COLORS.GOLD];
    for (let i = 0; i < ORNAMENT_COUNT; i++) {
      const y = Math.random() * TREE_HEIGHT;
      const radiusAtY = ((TREE_HEIGHT - y) / TREE_HEIGHT) * TREE_RADIUS;
      // Push to surface
      const r = radiusAtY * (0.9 + Math.random() * 0.2); 
      const theta = Math.random() * Math.PI * 2;
      
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      
      const dir = new THREE.Vector3(x, y, z).normalize().multiplyScalar(Math.random() * 8 + 5);

      data.push({
        initialPos: new THREE.Vector3(x, y - 5, z),
        scale: Math.random() * 0.4 + 0.3,
        color: palette[Math.floor(Math.random() * palette.length)],
        velocity: dir
      });
    }
    return data;
  }, []);

  // --- ANIMATION STATE ---
  const [currentFactor, setCurrentFactor] = useState(0);

  // --- UPDATE LOGIC ---
  const updateMatrices = useCallback((factor: number) => {
    // Update Needles
    if (needlesRef.current) {
      let i = 0;
      for (const d of needleData) {
        const x = d.initialPos.x + d.velocity.x * factor * 3;
        const y = d.initialPos.y + d.velocity.y * factor * 3;
        const z = d.initialPos.z + d.velocity.z * factor * 3;
        
        tempObject.position.set(x, y, z);
        tempObject.rotation.set(
            d.rotation.x + factor, 
            d.rotation.y + factor, 
            d.rotation.z
        );
        const s = d.scale * (1 - factor * 0.8);
        tempObject.scale.set(s, s, s);
        tempObject.updateMatrix();
        needlesRef.current.setMatrixAt(i, tempObject.matrix);
        i++;
      }
      needlesRef.current.instanceMatrix.needsUpdate = true;
    }

    // Update Ornaments
    if (ornamentsRef.current) {
        let i = 0;
        for (const d of ornamentData) {
          const x = d.initialPos.x + d.velocity.x * factor * 5;
          const y = d.initialPos.y + d.velocity.y * factor * 5;
          const z = d.initialPos.z + d.velocity.z * factor * 5;

          tempObject.position.set(x, y, z);
          tempObject.rotation.set(factor * i, factor * i, 0);
          const s = d.scale * (1 - factor * 0.5);
          tempObject.scale.set(s, s, s);
          tempObject.updateMatrix();
          ornamentsRef.current.setMatrixAt(i, tempObject.matrix);
          i++;
        }
        ornamentsRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [needleData, ornamentData]);

  // --- INITIALIZATION ---
  useLayoutEffect(() => {
    // Force initial update to ensure tree is visible on first render
    updateMatrices(0);

    // Set initial colors for ornaments
    if (ornamentsRef.current) {
        ornamentData.forEach((d, i) => {
            tempColor.set(d.color);
            ornamentsRef.current!.setColorAt(i, tempColor);
        });
        ornamentsRef.current.instanceColor!.needsUpdate = true;
    }
  }, [ornamentData, updateMatrices]);

  // --- LOOP ---
  useFrame((state, delta) => {
    const target = mode === TreeMode.DISPERSED ? 1 : 0;
    
    // Smooth lerp
    const newFactor = THREE.MathUtils.lerp(currentFactor, target, delta * 2);
    
    // Only skip if absolutely static and already rendered once
    if (Math.abs(newFactor - currentFactor) < 0.00001 && Math.abs(newFactor - target) < 0.00001) {
        return;
    }
    
    setCurrentFactor(newFactor);
    updateMatrices(newFactor);
  });

  return (
    <group ref={groupRef}>
        {/* --- CENTRAL TRUNK --- */}
        <mesh position={[0, 1, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.4, 1.2, TREE_HEIGHT * 0.8, 16]} />
            <meshStandardMaterial color="#2d1b0e" roughness={0.9} />
        </mesh>

        {/* --- STAR ON TOP --- */}
        <mesh position={[0, TREE_HEIGHT - 4.5, 0]}>
            <octahedronGeometry args={[1.2, 0]} />
            <meshStandardMaterial 
                color={COLORS.GOLD} 
                emissive={COLORS.GOLD}
                emissiveIntensity={3}
                toneMapped={false}
            />
            <pointLight distance={15} intensity={80} color={COLORS.GOLD} />
        </mesh>

        {/* --- NEEDLES --- */}
        <instancedMesh 
            ref={needlesRef} 
            args={[undefined, undefined, NEEDLE_COUNT]}
            castShadow
            receiveShadow
            frustumCulled={false} // Prevent disappearing when dispersed
        >
            <coneGeometry args={[0.2, 0.6, 5]} />
            <meshStandardMaterial 
                color={COLORS.EMERALD} 
                roughness={0.3}
                metalness={0.2}
            />
        </instancedMesh>

        {/* --- ORNAMENTS --- */}
        <instancedMesh 
            ref={ornamentsRef} 
            args={[undefined, undefined, ORNAMENT_COUNT]}
            castShadow
            receiveShadow
            frustumCulled={false}
        >
            <sphereGeometry args={[1, 24, 24]} />
            <meshStandardMaterial 
                color="white" 
                roughness={0.1} 
                metalness={0.9}
                envMapIntensity={1.2}
            />
        </instancedMesh>
    </group>
  );
};