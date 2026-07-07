import React, { useRef, useState, useEffect, Suspense } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { usePresenter } from './PresenterContext';

// Error Boundary to catch missing avatar.glb
class AvatarErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// 3D Avatar Loader and Animator
function Model({ isPlaying, viseme }) {
  // Tries to load the avatar.glb from public folder
  const { scene } = useGLTF('/avatar.glb');
  const [skinnedMeshes, setSkinnedMeshes] = useState([]);
  
  useEffect(() => {
    const meshes = [];
    scene.traverse((child) => {
      if (child.isMesh && child.morphTargetDictionary) {
        meshes.push(child);
      }
    });
    setSkinnedMeshes(meshes);
  }, [scene]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Subtle breathing and floating
    scene.position.y = Math.sin(t * 1.5) * 0.02 - 1.5; 
    
    // Mouse tracking
    const mouseX = state.pointer.x * 0.4;
    const mouseY = state.pointer.y * 0.3;
    scene.rotation.y = THREE.MathUtils.lerp(scene.rotation.y, mouseX, 0.1);
    scene.rotation.x = THREE.MathUtils.lerp(scene.rotation.x, -mouseY, 0.1);

    // Reset visemes
    skinnedMeshes.forEach(mesh => {
      if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) return;
      Object.keys(mesh.morphTargetDictionary).forEach(key => {
        if (key.startsWith('viseme_')) {
          const index = mesh.morphTargetDictionary[key];
          mesh.morphTargetInfluences[index] = THREE.MathUtils.lerp(mesh.morphTargetInfluences[index], 0, 0.3);
        }
      });
    });

    // Apply active viseme
    if (isPlaying && viseme !== 'sil') {
      const mapping = {
        'open': 'viseme_aa',
        'narrow': 'viseme_ou',
        'dental': 'viseme_FF',
        'mid': 'viseme_E'
      };
      const targetViseme = mapping[viseme];
      
      skinnedMeshes.forEach(mesh => {
        if (mesh.morphTargetDictionary[targetViseme] !== undefined) {
          const index = mesh.morphTargetDictionary[targetViseme];
          mesh.morphTargetInfluences[index] = THREE.MathUtils.lerp(mesh.morphTargetInfluences[index], 1, 0.5);
        }
      });
    }
  });

  return <primitive object={scene} dispose={null} scale={2} position={[0, -1.5, 0]} />;
}

// Original Cyber Orb (used as fallback)
function FallbackOrb() {
  const { viseme, isPlaying } = usePresenter();
  
  const headGroupRef = useRef();
  const leftEyeRef = useRef();
  const rightEyeRef = useRef();
  const mouthRef = useRef();
  const ringRef = useRef();
  const ring2Ref = useRef();
  const particleGroupRef = useRef();

  const [blink, setBlink] = useState(false);
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 120);
    }, 3500 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  const [particles] = useState(() => {
    const temp = [];
    for (let i = 0; i < 40; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 3
        ],
        speed: 0.2 + Math.random() * 0.5,
        scale: 0.02 + Math.random() * 0.04
      });
    }
    return temp;
  });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (headGroupRef.current) {
      headGroupRef.current.position.y = Math.sin(t * 1.5) * 0.08 - 0.2;
      headGroupRef.current.position.x = Math.cos(t * 0.6) * 0.04;
      
      const mouseX = state.pointer.x * 0.4;
      const mouseY = state.pointer.y * 0.3;
      headGroupRef.current.rotation.y = THREE.MathUtils.lerp(headGroupRef.current.rotation.y, mouseX, 0.1);
      headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, -mouseY, 0.1);
    }

    if (leftEyeRef.current && rightEyeRef.current) {
      const targetScaleY = blink ? 0.05 : 1;
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, targetScaleY, 0.4);
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, targetScaleY, 0.4);

      const saccadeX = Math.sin(t * 0.5) * 0.05;
      const saccadeY = Math.cos(t * 0.8) * 0.03;
      leftEyeRef.current.position.x = -0.3 + saccadeX;
      leftEyeRef.current.position.y = 0.2 + saccadeY;
      rightEyeRef.current.position.x = 0.3 + saccadeX;
      rightEyeRef.current.position.y = 0.2 + saccadeY;
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.5;
      ringRef.current.rotation.y = t * 0.8;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -t * 0.4;
      ring2Ref.current.rotation.z = t * 0.6;
    }

    if (mouthRef.current) {
      const bars = mouthRef.current.children;
      for (let i = 0; i < bars.length; i++) {
        let targetHeight = 0.08;

        if (isPlaying) {
          const wavePhase = t * 25 + i * 1.5;
          if (viseme === 'open') {
            targetHeight = 0.4 + Math.sin(wavePhase) * 0.2;
          } else if (viseme === 'narrow') {
            targetHeight = 0.25 + Math.cos(wavePhase) * 0.1;
          } else if (viseme === 'mid') {
            targetHeight = 0.3 + Math.sin(wavePhase) * 0.15;
          } else if (viseme === 'dental') {
            targetHeight = 0.18 + Math.cos(wavePhase) * 0.08;
          } else {
            targetHeight = 0.2 + Math.sin(wavePhase) * 0.1;
          }
        } else {
          targetHeight = 0.08 + Math.sin(t * 3 + i * 0.5) * 0.02;
        }

        bars[i].scale.y = THREE.MathUtils.lerp(bars[i].scale.y, targetHeight * 10, 0.25);
      }
    }

    if (particleGroupRef.current) {
      const pChildren = particleGroupRef.current.children;
      for (let i = 0; i < pChildren.length; i++) {
        pChildren[i].position.y += Math.sin(t + i) * 0.001 * particles[i].speed;
      }
    }
  });

  return (
    <group>
      <group ref={particleGroupRef}>
        {particles.map((p, idx) => (
          <mesh key={idx} position={p.position}>
            <sphereGeometry args={[p.scale, 8, 8]} />
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.35} />
          </mesh>
        ))}
      </group>
      <group ref={headGroupRef} position={[0, -0.2, 0]} scale={[0.8, 0.8, 0.8]}>
        <mesh>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshPhysicalMaterial 
            color="#0b1329" 
            roughness={0.15} 
            metalness={0.8}
            transparent 
            opacity={0.7}
            transmission={0.4}
            thickness={0.8}
            envMapIntensity={1}
          />
        </mesh>
        <mesh scale={[0.4, 0.4, 0.4]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#06b6d4" toneMapped={false} />
        </mesh>
        <mesh ref={leftEyeRef} position={[-0.3, 0.2, 0.7]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.3, 0.2, 0.7]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
        <group ref={mouthRef} position={[0, -0.3, 0.75]}>
          {[-0.2, -0.15, -0.1, -0.05, 0, 0.05, 0.1, 0.15, 0.2].map((xOffset, idx) => (
            <mesh key={idx} position={[xOffset, 0, 0]}>
              <boxGeometry args={[0.02, 0.1, 0.02]} />
              <meshBasicMaterial color="#8b5cf6" />
            </mesh>
          ))}
        </group>
        <group ref={ringRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.2, 0.015, 8, 64]} />
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.6} />
          </mesh>
        </group>
        <group ref={ring2Ref}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[1.3, 0.01, 8, 64]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.4} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// 2D Holographic Photo Loader
function PhotoAvatar({ isPlaying, viseme }) {
  // Try to load avatar.png from public folder
  const texture = useLoader(THREE.TextureLoader, '/avatar.png');
  const groupRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Gentle floating
      groupRef.current.position.y = Math.sin(t * 2) * 0.05 - 0.2;
      
      // Look at mouse
      const mouseX = state.pointer.x * 0.2;
      const mouseY = state.pointer.y * 0.2;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX, 0.1);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseY, 0.1);

      // Pulse when speaking
      if (isPlaying) {
        let targetScale = 1;
        if (viseme === 'open') targetScale = 1.05;
        else if (viseme === 'narrow') targetScale = 1.02;
        else if (viseme === 'dental') targetScale = 1.03;
        else if (viseme === 'mid') targetScale = 1.04;
        
        groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.3));
      } else {
        groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, 1, 0.1));
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Glow behind the photo when speaking */}
      {isPlaying && (
        <mesh position={[0, 0, -0.1]}>
          <planeGeometry args={[2.8, 3.8]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
        </mesh>
      )}
      {/* The actual photo */}
      <mesh>
        <planeGeometry args={[2.5, 3.5]} />
        <meshBasicMaterial map={texture} transparent={true} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function Avatar() {
  const { viseme, isPlaying } = usePresenter();
  
  return (
    <AvatarErrorBoundary fallback={<FallbackOrb />}>
      <Suspense fallback={<FallbackOrb />}>
        {/* We use the 3D Model here, which falls back to the Orb if avatar.glb is missing */}
        <Model isPlaying={isPlaying} viseme={viseme} />
      </Suspense>
    </AvatarErrorBoundary>
  );
}
