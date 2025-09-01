import { useRef } from "react";
import { motion } from "framer-motion-3d";

export const ConferenceFloor = ({ position }) => {
  return (
    <group position={position}>
      {/* 메인 바닥 타일 */}
      <mesh castShadow receiveShadow position={[0, 0.01, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#2c3e50"
          roughness={0.2}
          metalness={0.05}
        />
      </mesh>

      {/* 바닥 패턴 라인 */}
      <mesh position={[0, 0.02, 0]}>
        <planeGeometry args={[20, 0.1]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>

      <mesh position={[0, 0.02, 0]}>
        <planeGeometry args={[0.1, 20]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>

      {/* 무대 주변 라인 */}
      <motion.mesh
        position={[0, 0.03, -5]}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <planeGeometry args={[12, 0.2]} />
        <meshBasicMaterial color="#3498db" transparent />
      </motion.mesh>

      {/* 좌석 구역 라인 */}
      <motion.mesh
        position={[0, 0.03, 5]}
        animate={{
          opacity: [0.2, 0.4, 0.2],
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          },
        }}
      >
        <planeGeometry args={[16, 0.2]} />
        <meshBasicMaterial color="#95a5a6" transparent />
      </motion.mesh>

      {/* 측면 통로 라인 */}
      <mesh position={[-8, 0.02, 0]}>
        <planeGeometry args={[0.2, 20]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>

      <mesh position={[8, 0.02, 0]}>
        <planeGeometry args={[0.2, 20]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>
    </group>
  );
};
