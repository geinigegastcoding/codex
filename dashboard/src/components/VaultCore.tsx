"use client";
import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { easing } from 'maath';

// --- AUDIO HOOK ---
const useAudioVolume = () => {
  const volumeRef = useRef(0);

  useEffect(() => {
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let microphone: MediaStreamAudioSourceNode;
    let animationFrame: number;

    const startAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Resume context on first click if it starts suspended
        if (audioContext.state === 'suspended') {
            const resumeAudio = () => {
                audioContext.resume();
                window.removeEventListener('click', resumeAudio);
            };
            window.addEventListener('click', resumeAudio);
        }

        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          volumeRef.current = avg / 255.0; // Normalize 0 to 1
          animationFrame = requestAnimationFrame(updateVolume);
        };
        updateVolume();
      } catch (err) {
        console.error("Microphone access denied or failed", err);
      }
    };

    startAudio();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (audioContext) audioContext.close();
    };
  }, []);

  return volumeRef;
};

const ParticleRing = () => {
  const pointsRef = useRef<THREE.Points>(null!);
  
  const particlesPosition = useMemo(() => {
    const count = 30000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      
      const R = 7.77; // Moved closer to core by ~8%
      const r = (Math.sin(u * 6) * 0.4 + 0.6) * Math.random();
      
      const x = (R + r * Math.cos(v)) * Math.cos(u);
      const y = (R + r * Math.cos(v)) * Math.sin(u);
      const z = r * Math.sin(v) + Math.cos(u * 6) * 0.3;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.z -= 0.0002;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1 - 0.3; 
      pointsRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.02) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particlesPosition, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color={new THREE.Color(0.05, 0.4, 1)} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
};

const MiddleLayer = () => {
    const pointsRef = useRef<THREE.Points>(null!);
    
    const particlesPosition = useMemo(() => {
        const count = 8000;
        const positions = new Float32Array(count * 3);
        for(let i=0; i<count; i++) {
            const u = Math.random() * Math.PI * 2;
            const v = Math.random() * Math.PI * 2;
            const R = 5.5; // Moved closer to core
            const r = Math.random() * 0.8; // Made thicker
            
            const x = (R + r * Math.cos(v)) * Math.cos(u);
            const y = (R + r * Math.cos(v)) * Math.sin(u);
            const z = r * Math.sin(v);
            
            positions[i*3] = x;
            positions[i*3+1] = y;
            positions[i*3+2] = z;
        }
        return positions;
    }, []);

    useFrame((state) => {
        if(pointsRef.current) {
            pointsRef.current.rotation.y -= 0.0004;
            pointsRef.current.rotation.z += 0.0005;
            
            const scale = 1.0 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
            pointsRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[particlesPosition, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.03} color={new THREE.Color(0.1, 0.3, 1)} transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
    );
}

const InnerSphere = () => {
    const pointsRef = useRef<THREE.Points>(null!);
    
    const particlesPosition = useMemo(() => {
        const count = 10000;
        const positions = new Float32Array(count * 3);
        for(let i=0; i<count; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            const r = Math.cbrt(Math.random()) * 3.96; // Scaled by 1.8x
            const sinPhi = Math.sin(phi);
            const x = r * sinPhi * Math.cos(theta);
            const y = r * sinPhi * Math.sin(theta);
            const z = r * Math.cos(phi);
            positions[i*3] = x;
            positions[i*3+1] = y;
            positions[i*3+2] = z;
        }
        return positions;
    }, []);

    useFrame(() => {
        if(pointsRef.current) {
            pointsRef.current.rotation.y += 0.0008;
            pointsRef.current.rotation.z += 0.0005;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[particlesPosition, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.045} color={new THREE.Color(0.0, 0.5, 1)} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
    );
}

const ShootingParticles = () => {
    const pointsRef = useRef<THREE.Points>(null!);
    
    const count = 50;
    const initialPositions = useMemo(() => new Float32Array(count * 3).fill(0), []);
    const velocities = useMemo(() => {
        const vels = new Float32Array(count * 3);
        for(let i=0; i<count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const speed = 0.02 + Math.random() * 0.06;
            vels[i*3] = Math.sin(phi) * Math.cos(theta) * speed;
            vels[i*3+1] = Math.sin(phi) * Math.sin(theta) * speed;
            vels[i*3+2] = Math.cos(phi) * speed;
        }
        return vels;
    }, []);

    useFrame(() => {
        if (!pointsRef.current) return;
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        
        for(let i=0; i<count; i++) {
            positions[i*3] += velocities[i*3];
            positions[i*3+1] += velocities[i*3+1];
            positions[i*3+2] += velocities[i*3+2];
            
            const dSq = positions[i*3]**2 + positions[i*3+1]**2 + positions[i*3+2]**2;
            if (dSq > 144) { 
                if (Math.random() < 0.005) { 
                    positions[i*3] = 0;
                    positions[i*3+1] = 0;
                    positions[i*3+2] = 0;
                }
            }
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[initialPositions, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.08} color={new THREE.Color(0.2, 0.8, 1)} transparent opacity={1.0} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
    );
}

const InteractiveVault = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  const volumeRef = useAudioVolume();

  useFrame((state, delta) => {
    const vol = volumeRef.current;
    let audioBounce = 0;
    
    // When there is enough audio, create a pulsing bounce
    if (vol > 0.05) {
        // Math.sin(time) creates the in-and-out bounce.
        // Speed and magnitude increase with volume.
        audioBounce = Math.abs(Math.sin(state.clock.elapsedTime * (3 + vol * 2))) * (vol * 0.8);
    }

    const targetScale = (hovered ? 1.15 : 1.0) + audioBounce;
    easing.damp3(groupRef.current.scale, targetScale, 0.4, delta);
    
    if (hovered || vol > 0.05) {
        groupRef.current.rotation.y += 0.002 + (vol * 0.01);
        groupRef.current.rotation.x += vol * 0.005;
    }
  });

  return (
    <group 
        ref={groupRef} 
        onPointerOver={() => setHovered(true)} 
        onPointerOut={() => setHovered(false)}
    >
      <ParticleRing />
      <MiddleLayer />
      <InnerSphere />
      <ShootingParticles />
    </group>
  );
};

export default function VaultCore() {
  return (
    <div className="absolute inset-0 cursor-crosshair">
        {/* Pulled camera to 21.5 to make the graph approximately 10% bigger again */}
        <Canvas camera={{ position: [0, 0, 21.5], fov: 50 }} gl={{ alpha: true, antialias: false }}>
            <ambientLight intensity={0.5} />
            <InteractiveVault />
        </Canvas>
    </div>
  );
}
