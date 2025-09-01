import { useBox } from "@react-three/cannon";
import { useRef } from "react";
import { motion } from "framer-motion-3d";

export const ConferenceStage = ({ position }) => {
  const [ref] = useBox(() => ({
    args: [12, 0.8, 6],
    position,
    type: "Static",
    mass: 0,
  }));

  return (
    <group>
      {/* 메인 무대 플랫폼 */}
      <mesh ref={ref} castShadow receiveShadow position={position}>
        <boxGeometry args={[12, 0.8, 6]} />
        <meshStandardMaterial 
          color="#2c3e50" 
          roughness={0.3} 
          metalness={0.1}
        />
      </mesh>

      {/* 무대 가장자리 LED 조명 */}
      <motion.mesh
        position={[position[0], position[1] + 0.4, position[2] - 3]}
        animate={{
          opacity: [0.5, 1.0, 0.5],
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <boxGeometry args={[12, 0.15, 0.15]} />
        <meshBasicMaterial color="#4a90e2" transparent />
      </motion.mesh>

      <motion.mesh
        position={[position[0], position[1] + 0.4, position[2] + 3]}
        animate={{
          opacity: [0.5, 1.0, 0.5],
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          },
        }}
      >
        <boxGeometry args={[12, 0.15, 0.15]} />
        <meshBasicMaterial color="#4a90e2" transparent />
      </motion.mesh>
      
      {/* 사이드 LED 조명 */}
      <motion.mesh
        position={[position[0] - 6, position[1] + 0.4, position[2]]}
        animate={{
          opacity: [0.3, 0.7, 0.3],
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.2,
          },
        }}
      >
        <boxGeometry args={[0.15, 0.15, 6]} />
        <meshBasicMaterial color="#5dade2" transparent />
      </motion.mesh>
      
      <motion.mesh
        position={[position[0] + 6, position[1] + 0.4, position[2]]}
        animate={{
          opacity: [0.3, 0.7, 0.3],
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.6,
          },
        }}
      >
        <boxGeometry args={[0.15, 0.15, 6]} />
        <meshBasicMaterial color="#5dade2" transparent />
      </motion.mesh>

      {/* 무대 배경 스크린 */}
      <mesh position={[position[0], position[1] + 3, position[2] - 3.5]}>
        <planeGeometry args={[14, 6]} />
        <meshStandardMaterial 
          color="#1a252f" 
          roughness={0.1} 
          metalness={0.8}
        />
      </mesh>
      
      {/* 배경 스크린 테두리 */}
      <mesh position={[position[0], position[1] + 3, position[2] - 3.4]}>
        <boxGeometry args={[14.2, 6.2, 0.1]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>

      {/* 무대 위 대형 스포트라이트 효과 */}
      <motion.mesh
        position={[position[0], position[1] + 5, position[2]]}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.8, 0.4],
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <cylinderGeometry args={[2, 2, 0.2, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
      </motion.mesh>
      
      {/* 추가 스포트라이트 효과 */}
      <motion.mesh
        position={[position[0] - 3, position[1] + 4, position[2]]}
        animate={{
          scale: [0.8, 1.1, 0.8],
          opacity: [0.3, 0.6, 0.3],
          transition: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          },
        }}
      >
        <cylinderGeometry args={[1, 1, 0.1, 32]} />
        <meshBasicMaterial color="#e8f4f8" transparent opacity={0.3} />
      </motion.mesh>
      
      <motion.mesh
        position={[position[0] + 3, position[1] + 4, position[2]]}
        animate={{
          scale: [0.8, 1.1, 0.8],
          opacity: [0.3, 0.6, 0.3],
          transition: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          },
        }}
      >
        <cylinderGeometry args={[1, 1, 0.1, 32]} />
        <meshBasicMaterial color="#e8f4f8" transparent opacity={0.3} />
      </motion.mesh>
    </group>
  );
};
