import { useMemo, useRef, useState, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';

const VaultGalaxy = ({ notes, onSnippetClick }) => {
  const fgRef = useRef();
  const [hoveredNode, setHoveredNode] = useState(null);

  // --- DATA PROCESSING: Flat array -> 3D Physics Graph ---
  const graphData = useMemo(() => {
    const nodes = [];
    const links = [];
    
    const folderSet = new Set();
    const tagSet = new Set();

    notes.forEach((note) => {
      const folderName = note.folder || 'Uncategorized';

      // 1. Create Folder Nodes (The Suns)
      if (!folderSet.has(folderName)) {
        nodes.push({ id: `folder-${folderName}`, name: folderName, group: 'folder', val: 25 });
        folderSet.add(folderName);
      }

      // 2. Create Snippet Nodes (The Moons)
      nodes.push({ 
        id: note._id, 
        name: note.title, 
        group: 'snippet', 
        val: 8, 
        language: note.language,
        fullNote: note 
      });
      
      // Link Snippet to its Folder
      links.push({ source: `folder-${folderName}`, target: note._id });

      // 3. Create Tag Nodes (The Planets)
      if (note.tags && note.tags.length > 0) {
        note.tags.forEach(tag => {
          if (!tagSet.has(tag)) {
            nodes.push({ id: `tag-${tag}`, name: `#${tag}`, group: 'tag', val: 12 });
            tagSet.add(tag);
          }
          // Link Snippet to its Tags
          links.push({ source: note._id, target: `tag-${tag}` });
        });
      }
    });

    return { nodes, links };
  }, [notes]);

  // --- 3D CAMERA CONTROLS ---
  const handleClick = useCallback((node) => {
    if (!fgRef.current) return;

    // Fly camera to the clicked node
    const distance = 80;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

    fgRef.current.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
      node, // lookAt
      1500  // transition duration ms
    );

    // If it's a snippet, trigger the dashboard action (like opening the editor/sandbox)
    if (node.group === 'snippet' && onSnippetClick) {
      onSnippetClick(node.fullNote);
    }
  }, [fgRef, onSnippetClick]);

  // --- CUSTOM 3D RENDERING ---
  const nodeThreeObject = useCallback((node) => {
    // We use a different geometry and glowing material based on the node type
    let color, geometry, material;

    if (node.group === 'folder') {
      color = '#10b981'; // Emerald 500
      geometry = new THREE.DodecahedronGeometry(node.val);
      material = new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 0.5, wireframe: true });
    } else if (node.group === 'tag') {
      color = '#8b5cf6'; // Violet 500
      geometry = new THREE.OctahedronGeometry(node.val);
      material = new THREE.MeshPhongMaterial({ color, emissive: color, emissiveIntensity: 0.8 });
    } else {
      // Snippet node color changes based on language
      const langColors = { javascript: '#f59e0b', python: '#3b82f6', css: '#ec4899', html: '#ef4444', bash: '#14b8a6' };
      color = langColors[node.language] || '#94a3b8';
      geometry = new THREE.SphereGeometry(node.val);
      material = new THREE.MeshPhysicalMaterial({ color, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 });
    }

    const mesh = new THREE.Mesh(geometry, material);
    
    // Add a glowing halo if hovered
    if (hoveredNode === node.id) {
      const haloGeometry = new THREE.SphereGeometry(node.val * 1.4);
      const haloMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.3 });
      mesh.add(new THREE.Mesh(haloGeometry, haloMaterial));
    }

    return mesh;
  }, [hoveredNode]);

  return (
    <div className="relative w-full h-[600px] bg-slate-950 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
      
      {/* Dynamic Glassmorphic Info Panel on Hover */}
      {hoveredNode && (
        <div className="absolute top-6 left-6 z-10 bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-2xl pointer-events-none animate-in fade-in duration-200">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            {graphData.nodes.find(n => n.id === hoveredNode)?.group}
          </p>
          <p className="text-white text-lg font-bold">
            {graphData.nodes.find(n => n.id === hoveredNode)?.name}
          </p>
        </div>
      )}

      {/* The 3D Engine */}
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        backgroundColor="#020617" // slate-950
        nodeThreeObject={nodeThreeObject}
        onNodeHover={(node) => setHoveredNode(node ? node.id : null)}
        onNodeClick={handleClick}
        linkColor={() => 'rgba(16, 185, 129, 0.2)'} // Subtle emerald lasers
        linkWidth={1}
        enableNodeDrag={true}
      />
      
      {/* Navigation Hint */}
      <div className="absolute bottom-6 left-6 z-10 text-slate-500 text-xs font-mono pointer-events-none">
        Left-click: Rotate &middot; Scroll: Zoom &middot; Click Node: Focus Camera
      </div>
    </div>
  );
};

export default VaultGalaxy;