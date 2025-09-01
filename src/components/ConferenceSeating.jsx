import { useBox } from "@react-three/cannon";
import { useRef } from "react";

export const ConferenceSeating = ({ position, rows = 3, seatsPerRow = 8 }) => {
  const [ref] = useBox(() => ({
    args: [rows * 2.5, 0.3, seatsPerRow * 1.8],
    position,
    type: "Static",
    mass: 0,
  }));

  const seats = [];
  for (let row = 0; row < rows; row++) {
    for (let seat = 0; seat < seatsPerRow; seat++) {
      const x = position[0] + (row - rows / 2) * 2.5;
      const z = position[2] + (seat - seatsPerRow / 2) * 1.8;
      const y = position[1] + 0.15;

      seats.push(
        <group key={`seat-${row}-${seat}`} position={[x, y, z]}>
          {/* 좌석 바닥 */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.0, 0.15, 1.0]} />
            <meshStandardMaterial 
              color="#2c3e50" 
              roughness={0.4} 
              metalness={0.2}
            />
          </mesh>
          {/* 좌석 등받이 */}
          <mesh position={[0, 0.4, -0.3]} castShadow receiveShadow>
            <boxGeometry args={[1.0, 0.8, 0.2]} />
            <meshStandardMaterial 
              color="#34495e" 
              roughness={0.3} 
              metalness={0.1}
            />
          </mesh>
        </group>
      );
    }
  }

  return (
    <group>
      {/* 좌석 플랫폼 */}
      <mesh ref={ref} castShadow receiveShadow position={position}>
        <boxGeometry args={[rows * 2.5, 0.3, seatsPerRow * 1.8]} />
        <meshStandardMaterial 
          color="#1a252f" 
          roughness={0.6} 
          metalness={0.05}
        />
      </mesh>

      {/* 개별 좌석들 */}
      {seats}

      {/* 좌석 구분선 및 통로 */}
      {Array.from({ length: rows - 1 }, (_, i) => (
        <mesh
          key={`divider-${i}`}
          position={[
            position[0] + (i - rows / 2 + 1) * 2.5,
            position[1] + 0.2,
            position[2],
          ]}
        >
          <boxGeometry args={[0.15, 0.4, seatsPerRow * 1.8]} />
          <meshStandardMaterial color="#34495e" />
        </mesh>
      ))}
      
      {/* 좌석 구역 가장자리 조명 */}
      <mesh position={[position[0], position[1] + 0.05, position[2] + seatsPerRow * 0.9 + 0.5]}>
        <boxGeometry args={[rows * 2.5, 0.05, 0.1]} />
        <meshBasicMaterial color="#5dade2" transparent opacity={0.3} />
      </mesh>
      
      <mesh position={[position[0], position[1] + 0.05, position[2] - seatsPerRow * 0.9 - 0.5]}>
        <boxGeometry args={[rows * 2.5, 0.05, 0.1]} />
        <meshBasicMaterial color="#5dade2" transparent opacity={0.3} />
      </mesh>
      
      {/* 좌석 번호 표시를 위한 사이드 패널 */}
      <mesh position={[position[0] - rows * 1.25 - 0.5, position[1] + 0.5, position[2]]}>
        <boxGeometry args={[0.2, 1.0, seatsPerRow * 1.8]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      
      <mesh position={[position[0] + rows * 1.25 + 0.5, position[1] + 0.5, position[2]]}>
        <boxGeometry args={[0.2, 1.0, seatsPerRow * 1.8]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
    </group>
  );
};
