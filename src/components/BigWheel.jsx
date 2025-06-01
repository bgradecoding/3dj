import React, { useEffect, useRef, useState, Suspense } from "react";
import { Html, useGLTF } from "@react-three/drei";
import { motion } from "framer-motion-3d";

// 모델 프리로드 제거 (문제가 될 수 있음)
// useGLTF.preload(`/assets/models/bigwheel.glb`);

export function BigWheel({ position }) {
  console.log("BigWheel 컴포넌트 렌더링 시작");
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const groupRef = useRef();

  const gltf = useGLTF(`/assets/models/bigwheel.glb`);
  const { nodes, materials } = gltf;

  // 컴포넌트 마운트 시점 확인
  useEffect(() => {
    console.log("BigWheel 컴포넌트 마운트됨");
    try {
      if (gltf) {
        console.log("gltf 객체 확인:", gltf);
        setIsModelLoaded(true);
      }
    } catch (error) {
      console.error("gltf 처리 중 에러:", error);
      setLoadError(error);
    }
    return () => console.log("BigWheel 컴포넌트 언마운트됨");
  }, [gltf]);

  // nodes와 materials 상태 변경 추적
  useEffect(() => {
    if (nodes && materials) {
      const nodeKey = Object.keys(nodes)[0];
      const materialKey = Object.keys(materials)[0];
      console.log("모델 상세 구조:", {
        node: {
          key: nodeKey,
          type: nodes[nodeKey].type,
          geometry: nodes[nodeKey].geometry,
          material: nodes[nodeKey].material,
        },
        material: {
          key: materialKey,
          type: materials[materialKey].type,
          properties: Object.keys(materials[materialKey]),
        },
      });
    }
  }, [nodes, materials]);

  const [info, setInfo] = useState(false);

  // 로딩 중이거나 에러가 있을 때 시각적 피드백 제공
  if (!gltf || loadError) {
    console.log("로딩 상태:", { hasGltf: !!gltf, loadError });
    return (
      <group position={position}>
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color={loadError ? "red" : "gray"} />
        </mesh>
        {loadError && (
          <Html center>
            <div style={{ color: "red", background: "white", padding: "4px" }}>
              모델 로딩 실패: {loadError.message}
            </div>
          </Html>
        )}
      </group>
    );
  }

  // 모델의 노드가 예상한 구조와 다른 경우를 처리
  const modelNode = nodes["artef_node_332cdd01-4499-4cd5-a933-090dd720484e"];
  if (!modelNode) {
    console.error("모델 노드를 찾을 수 없습니다:", Object.keys(nodes));
    return (
      <group position={position}>
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="orange" />
        </mesh>
        <Html center>
          <div style={{ color: "orange", background: "white", padding: "4px" }}>
            모델 노드를 찾을 수 없습니다
          </div>
        </Html>
      </group>
    );
  }

  return (
    <Suspense
      fallback={
        <group position={position}>
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="yellow" />
          </mesh>
        </group>
      }
    >
      <motion.group
        ref={groupRef}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 3,
          duration: 0.3,
        }}
        position={position}
      >
        <group scale={1.5} position={[0, 0, 0]}>
          <primitive
            object={modelNode.clone()}
            castShadow
            receiveShadow
            rotation={[0, Math.PI, 0]}
          />
        </group>
        {info ? (
          <Html center>
            <div className="information">데구르르...</div>
          </Html>
        ) : null}
      </motion.group>
    </Suspense>
  );
}
