import { EntropyBlock } from "./EntropyBlock";

export function LevelManager() {
  return (
    <group>
      {/* Ground - The "Safe" Zone */}
      <EntropyBlock position={[0, -2, 0]} size={[10, 2, 10]} color="#222" instabilityThreshold={1000} />
      
      {/* The Garden Path - Becomes unstable */}
      <EntropyBlock position={[0, -2, -10]} size={[4, 2, 4]} color="#333" instabilityThreshold={100} />
      <EntropyBlock position={[0, -1, -15]} size={[3, 2, 3]} color="#444" instabilityThreshold={200} disappearThreshold={600} />
      <EntropyBlock position={[2, 0, -20]} size={[2, 1, 2]} color="#555" instabilityThreshold={300} disappearThreshold={500} />
      <EntropyBlock position={[-2, 1, -25]} size={[2, 1, 2]} color="#666" instabilityThreshold={400} disappearThreshold={400} />
      
      {/* The Glitch Stairs */}
      {Array.from({ length: 10 }).map((_, i) => (
        <EntropyBlock 
            key={`stair-${i}`}
            position={[0, 2 + i, -30 - (i*3)]} 
            size={[4, 0.5, 4]} 
            color={`hsl(${i * 30}, 50%, 50%)`}
            instabilityThreshold={100 + (i * 50)} 
            disappearThreshold={300 + (i * 50)}
        />
      ))}
      
      {/* The Goal */}
      <EntropyBlock 
        position={[0, 15, -70]} 
        size={[10, 1, 10]} 
        color="#fbbf24" // Gold
        type="fixed"
        instabilityThreshold={2000} // Stable until end
      />
    </group>
  );
};
