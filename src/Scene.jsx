import { Suspense } from "react";
import { Ground } from "./components/Ground";
import { Car } from "./Car";
import { Lights } from "./components/Lights";
import { Loading } from "./components/Loading";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { onResetCar, isStartScene, isModalOpen } from "./utils/atom";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import ResetBtn from "./components/ResetBtn";
import { Stats } from "@react-three/drei";
import DrawCall from "./components/DrawCall";
import Modal from "./components/Modal";
import { useState } from "react";

export function Scene() {
  const onReset = useRecoilValue(onResetCar);
  const isStart = useRecoilValue(isStartScene);
  const modalOpen = useRecoilValue(isModalOpen);
  const setModalOpen = useSetRecoilState(isModalOpen);
  const [currentStage, setCurrentStage] = useState(null);

  const openModal = (stageType) => {
    setCurrentStage(stageType);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <>
      <Canvas
        mode="concurrent"
        shadows
        camera={{ fov: 45, position: [1.5, 2, 6] }}
      >
        <fog attach="fog" args={["#a97629", 10, 10]} />
        <Lights />
        <Physics broadphase="SAP" gravity={[0, -2.6, 0]} allowSleep>
          <Suspense fallback={<Loading />}>
            <Ground onOpenModal={openModal} />
            {onReset & isStart ? <Car /> : null}
          </Suspense>
        </Physics>
        {/* <Stats/>
          <DrawCall/> */}
      </Canvas>
      {isStart && <ResetBtn />}

      {/* 모달 컴포넌트 */}
      <Modal isOpen={modalOpen} onClose={closeModal} stageType={currentStage} />
    </>
  );
}
