import { useRef } from "react";
import { motion } from "framer-motion-3d";

export const ConferenceLights = ({ position }) => {
  return (
    <group position={position}>
      {/* 메인 스포트라이트 시각적 표현만 유지 */}
      <motion.mesh
        position={[0, 0, 0]}
        animate={{
          scale: [1, 1.1, 1],
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <cylinderGeometry args={[0.3, 0.5, 0.2, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </motion.mesh>

      {/* 조명 지지대 */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>

      {/* 조명 케이블 */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
    </group>
  );
};
