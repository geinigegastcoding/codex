"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import ForceGraph2D, { ForceGraphMethods as FG2DMethods } from "react-force-graph-2d";
import ForceGraph3D, { ForceGraphMethods as FG3DMethods } from "react-force-graph-3d";
import * as THREE from "three";
import type { GraphData, GraphNode } from "@/lib/kennis";

type Mode = "2d" | "3d" | "demo";

// Helper to generate dense demo data
function generateDemoData(): GraphData {
  const nodes: GraphNode[] = [];
  const links: { source: string; target: string }[] = [];
  
  // Core node
  nodes.push({ id: "CORE", name: "J.A.R.V.I.S. Core", val: 50 });
  
  // Create clusters
  const numClusters = 8;
  for (let c = 0; c < numClusters; c++) {
    const clusterId = `C${c}`;
    nodes.push({ id: clusterId, name: `Sector ${c}`, val: 15 });
    links.push({ source: "CORE", target: clusterId });
    
    // Nodes in cluster
    const clusterNodes = 15 + Math.random() * 20;
    for (let i = 0; i < clusterNodes; i++) {
      const nodeId = `N${c}-${i}`;
      nodes.push({ id: nodeId, name: `Node ${c}-${i}`, val: 3 + Math.random() * 5 });
      links.push({ source: clusterId, target: nodeId });
      
      // Random cross-links
      if (Math.random() > 0.8) {
        links.push({ source: nodeId, target: "CORE" });
      }
      if (i > 0 && Math.random() > 0.6) {
        links.push({ source: nodeId, target: `N${c}-${i-1}` });
      }
    }
  }

  // Inter-cluster links
  for(let i=0; i<30; i++) {
    const src = `C${Math.floor(Math.random() * numClusters)}`;
    const tgt = `N${Math.floor(Math.random() * numClusters)}-${Math.floor(Math.random() * 10)}`;
    links.push({ source: src, target: tgt });
  }

  return { nodes, links };
}

export default function VaultGraph({ data }: { data: GraphData }) {
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState<Mode>("2d");
  
  const fg2dRef = useRef<FG2DMethods>(null);
  const fg3dRef = useRef<FG3DMethods>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);

  const demoData = useMemo(() => generateDemoData(), []);
  const activeData = mode === "demo" ? demoData : data;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && containerRef.current) {
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      setDimensions({
        width: w > 0 ? w : 800,
        height: h > 0 ? h : 600
      });
    }
  }, [isMounted, data, mode]);

  // Setup orbital rings for 3D modes
  useEffect(() => {
    if ((mode === "3d" || mode === "demo") && fg3dRef.current) {
      const scene = fg3dRef.current.scene();
      
      // Check if rings exist
      if (!scene.getObjectByName("orbitalRings")) {
        const ringsGroup = new THREE.Group();
        ringsGroup.name = "orbitalRings";
        
        const createRing = (radius: number, opacity: number) => {
          const geo = new THREE.RingGeometry(radius, radius + 2, 128);
          const mat = new THREE.MeshBasicMaterial({ 
            color: 0x06b6d4, 
            side: THREE.DoubleSide, 
            transparent: true, 
            opacity: opacity 
          });
          const ring = new THREE.Mesh(geo, mat);
          ring.rotation.x = Math.PI / 2; // Flat plane
          return ring;
        };

        ringsGroup.add(createRing(300, 0.15));
        ringsGroup.add(createRing(600, 0.08));
        ringsGroup.add(createRing(900, 0.05));
        
        // Add ambient dust
        const particlesGeo = new THREE.BufferGeometry();
        const particlesCount = 2000;
        const posArray = new Float32Array(particlesCount * 3);
        for(let i = 0; i < particlesCount * 3; i++) {
          posArray[i] = (Math.random() - 0.5) * 2000;
        }
        particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particleMat = new THREE.PointsMaterial({
          size: 2,
          color: 0x06b6d4,
          transparent: true,
          opacity: 0.4
        });
        const particlesMesh = new THREE.Points(particlesGeo, particleMat);
        ringsGroup.add(particlesMesh);

        scene.add(ringsGroup);
      }
    }
  }, [mode, activeData]);

  if (!isMounted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center border border-cyan-900/40 bg-slate-950/80">
        <div className="w-16 h-16 border-4 border-cyan-900 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
        <div className="text-[10px] text-cyan-600 uppercase tracking-widest animate-pulse">Initializing Kennis Network Protocol...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex gap-2 justify-end">
        {(["2d", "3d", "demo"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-1 text-xs uppercase tracking-widest border transition-all ${
              mode === m 
                ? "bg-cyan-900/80 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.4)]" 
                : "border-cyan-800/50 text-cyan-600 hover:border-cyan-500 hover:text-cyan-400"
            }`}
          >
            {m} MODE
          </button>
        ))}
      </div>

      <div ref={containerRef} className="w-full min-h-[600px] flex-1 relative border border-cyan-900/40 bg-slate-950/80 shadow-[inset_0_0_50px_rgba(6,182,212,0.05)] cursor-crosshair overflow-hidden group">
        
        {/* Decorative Overlays */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <h2 className="text-[10px] uppercase text-cyan-500 font-bold tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
            KENNIS VAULT {mode.toUpperCase()}-NET
          </h2>
          <p className="text-[9px] text-cyan-700 mt-1 uppercase">Nodes: {activeData.nodes.length} | Links: {activeData.links.length}</p>
        </div>

        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1f0923] via-[#0d0716] to-[#05020a]">
          {mode === "2d" ? (
            <ForceGraph2D
              ref={fg2dRef as any}
              graphData={activeData}
              width={dimensions.width}
              height={dimensions.height}
              nodeLabel="name"
              nodeColor={(node: any) => node.id === hoverNode?.id || node.id === "CORE" ? '#4ade80' : '#06b6d4'}
              nodeRelSize={4}
              linkColor={() => 'rgba(8,145,178,0.4)'}
              linkWidth={1}
              linkDirectionalParticles={2}
              linkDirectionalParticleWidth={1.5}
              linkDirectionalParticleSpeed={0.005}
              onNodeHover={(node: any) => setHoverNode(node)}
              onNodeClick={(node: any) => {
                fg2dRef.current?.centerAt(node.x, node.y, 1000);
                fg2dRef.current?.zoom(4, 2000);
              }}
              backgroundColor="rgba(0,0,0,0)" 
            />
          ) : (
            <ForceGraph3D
              ref={fg3dRef as any}
              graphData={activeData}
              width={dimensions.width}
              height={dimensions.height}
              nodeLabel="name"
              backgroundColor="rgba(0,0,0,0)"
              showNavInfo={true} // Re-enable nav info so user knows it's 3D
              nodeThreeObject={(node: any) => {
                const isCore = node.id === "CORE";
                const isHovered = node.id === hoverNode?.id;
                
                const size = isCore ? 25 : Math.max(2, node.val || 2);
                
                // Color palette matching the reference (Cyan, Orange, Red)
                const colors = [0x06b6d4, 0xf97316, 0xf43f5e];
                // Deterministic pseudo-random color based on node ID string length
                const paletteColor = colors[node.id.length % colors.length];
                const color = isCore ? 0xff3b6b : (isHovered ? 0x4ade80 : paletteColor);
                
                const group = new THREE.Group();
                
                // Solid core
                const coreMat = new THREE.MeshPhongMaterial({ color, emissive: color, emissiveIntensity: isCore ? 0.8 : 0.4 });
                const coreMesh = new THREE.Mesh(
                  isCore ? new THREE.OctahedronGeometry(size * 0.6, 0) : new THREE.SphereGeometry(size * 0.6, 16, 16), 
                  coreMat
                );
                group.add(coreMesh);
                
                // Glowing aura
                const auraMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: isCore ? 0.2 : 0.15 });
                const auraMesh = new THREE.Mesh(
                  isCore ? new THREE.OctahedronGeometry(size, 0) : new THREE.SphereGeometry(size, 16, 16), 
                  auraMat
                );
                group.add(auraMesh);

                return group;
              }}
              linkWidth={0.2}
              linkColor={(link: any) => link.source.id === "CORE" || link.target.id === "CORE" ? 'rgba(255,59,107,0.4)' : 'rgba(100,116,139,0.2)'}
              linkDirectionalParticles={mode === "demo" ? 2 : 1}
              linkDirectionalParticleWidth={1.5}
              linkDirectionalParticleSpeed={0.003}
              linkDirectionalParticleColor={(link: any) => link.source.id === "CORE" ? '#ff3b6b' : '#38bdf8'}
              onEngineStop={() => {
                // Once layout is stable, zoom to fit beautifully
                fg3dRef.current?.zoomToFit(1000, 150);
              }}
              onNodeHover={(node: any) => setHoverNode(node)}
              onNodeClick={(node: any) => {
                if (!fg3dRef.current) return;
                const distance = 150;
                const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z || 0.1);
                fg3dRef.current.cameraPosition(
                  { x: node.x * distRatio, y: node.y * distRatio, z: node.z ? node.z * distRatio : distance }, 
                  node, 
                  2000
                );
              }}
            />
          )}
        </div>

        {hoverNode && (
          <div className="absolute bottom-4 left-4 z-10 pointer-events-none bg-cyan-950/90 border border-cyan-500 p-2 backdrop-blur-md">
            <div className="text-[10px] text-cyan-600 uppercase mb-1">Target Identified:</div>
            <div className="text-sm font-bold text-cyan-100">{hoverNode.name}</div>
          </div>
        )}
      </div>
    </div>
  );
}
