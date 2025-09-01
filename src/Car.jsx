import { useBox, useRaycastVehicle } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { useWheels } from "./utils/useWheels";
import { useVehicleControls } from "./utils/useVehicleControls";
import { Vector3 } from "three";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isStartScene, stage1, stage2, stage4, stage5 } from "./utils/atom";
import { motion } from "framer-motion-3d";
import useFollowCam from "./utils/useFollowCam";
import { CarModel } from "./components/CarModel";
import { Wheel } from "./components/Wheel";

const FORWARD_BOUNDARY = 5.5;
const BACKWARD_BOUNDARY = -6;

export function Car() {
  const { pivot } = useFollowCam();
  const worldPosition = useMemo(() => new Vector3(), []);
  const setStage1 = useSetRecoilState(stage1);
  const setStage2 = useSetRecoilState(stage2);
  const setStage4 = useSetRecoilState(stage4);
  const setStage5 = useSetRecoilState(stage5);
  const isStart = useRecoilValue(isStartScene);

  const position = [0, 0.1, 0];
  let width, height, front, wheelRadius, mass;

  width = 0.16;
  height = 0.18;
  front = 0.17;
  wheelRadius = 0.05;
  mass = 150;

  const chassisBodyArgs = [width, height, front * 2];

  const [chassisBody, chassisApi] = useBox(
    () => ({
      args: chassisBodyArgs,
      position,
      allowSleep: false,
      rotation: [0, Math.PI, 0],
      mass: mass,
      // 자동차가 뒤집히지 않도록 회전 제한 추가
      material: {
        friction: 0.7,
        restitution: 0.3,
      },
    }),
    useRef(null)
  );

  const vehiclePos = useRef([0, 0, 0]);

  const [wheels, wheelInfos] = useWheels(width, height, front, wheelRadius);

  const [vehicle, vehicleApi] = useRaycastVehicle(
    () => ({
      chassisBody,
      wheelInfos,
      wheels,
    }),
    useRef(null)
  );

  useEffect(() => {
    chassisApi.velocity.subscribe((v) => (vehiclePos.current = v));
  }, [chassisApi]);

  useVehicleControls(vehicleApi, chassisApi);

  useFrame(() => {
    if (vehiclePos.current[2] > FORWARD_BOUNDARY) {
      chassisApi.position.set(0, 0.2, 0);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(0, 0.5, 0);
      return;
    }
    if (vehiclePos.current[2] < BACKWARD_BOUNDARY) {
      chassisApi.position.set(0, 0.2, 0);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(0, 0.5, 0);
      return;
    }

    // 자동차가 뒤집혔을 때 자동으로 복구
    if (chassisBody.current) {
      const rotation = chassisBody.current.rotation;
      const angleX = Math.abs(rotation.x);
      const angleZ = Math.abs(rotation.z);
      const angleY = Math.abs(rotation.y - Math.PI); // Y축 회전은 Math.PI가 정상

      // X축이나 Z축으로 30도 이상 기울어졌으면 뒤집힌 것으로 판단 (더 민감하게)
      if (angleX > Math.PI / 6 || angleZ > Math.PI / 6) {
        // 현재 위치를 유지하면서 자동차를 바로 세움
        const currentPosition = chassisApi.position.get();

        // 완전히 정지시키고 똑바로 세움
        chassisApi.velocity.set(0, 0, 0);
        chassisApi.angularVelocity.set(0, 0, 0);
        chassisApi.rotation.set(0, Math.PI, 0);

        // 약간 위로 올려서 안정성 확보
        chassisApi.position.set(
          currentPosition[0],
          Math.max(currentPosition[1], 0.3),
          currentPosition[2]
        );
      }
    }
  });

  useFrame(() => {
    if (isStart) {
      makeFollowCam();
      makeStage1();
      makeStage2();
      makeStage4();
      makeStage5();

      // 강력한 뒤집힘 방지 로직 추가
      if (chassisBody.current) {
        const rotation = chassisBody.current.rotation;
        const position = chassisBody.current.position;

        // 각 축의 회전각 계산
        const angleX = Math.abs(rotation.x);
        const angleZ = Math.abs(rotation.z);
        const angleY = Math.abs(rotation.y - Math.PI);

        // 뒤집힘 감지 조건 (더 정교하게)
        const isFlippedX = angleX > Math.PI / 6; // 30도
        const isFlippedZ = angleZ > Math.PI / 6; // 30도
        const isFlippedY = angleY > Math.PI / 3; // 60도

        // 뒤집힘 상태이거나 높이가 너무 낮으면 복구
        if (isFlippedX || isFlippedZ || isFlippedY || position.y < 0.1) {
          // 현재 위치 저장
          const currentPos = chassisApi.position.get();

          // 완전히 정지
          chassisApi.velocity.set(0, 0, 0);
          chassisApi.angularVelocity.set(0, 0, 0);

          // 똑바로 세우기
          chassisApi.rotation.set(0, Math.PI, 0);

          // 안정적인 높이로 위치 조정
          chassisApi.position.set(
            currentPos[0],
            Math.max(currentPos[1], 0.3),
            currentPos[2]
          );
        }
      }
    }
  });

  function makeFollowCam() {
    chassisBody?.current.getWorldPosition(worldPosition);
    pivot.position.lerp(worldPosition, 0.9);
  }

  function makeStage1() {
    const chassisPosition = new Vector3().setFromMatrixPosition(
      chassisBody.current.matrixWorld
    );
    if (
      Math.abs(3.1 - chassisPosition.x) < 0.7 &&
      Math.abs(5.1 - chassisPosition.z) < 0.6
    ) {
      setStage1(true);
    } else {
      setStage1(false);
    }
  }

  function makeStage2() {
    const chassisPosition = new Vector3().setFromMatrixPosition(
      chassisBody.current.matrixWorld
    );
    if (
      Math.abs(-3 - chassisPosition.x) < 0.8 &&
      Math.abs(5.5 - chassisPosition.z) < 0.8
    ) {
      setStage2(true);
    } else {
      setStage2(false);
    }
  }

  function makeStage4() {
    const chassisPosition = new Vector3().setFromMatrixPosition(
      chassisBody.current.matrixWorld
    );
    if (
      Math.abs(5 - chassisPosition.x) < 0.7 &&
      Math.abs(4 - chassisPosition.z) < 0.6
    ) {
      setStage4(true);
    } else {
      setStage4(false);
    }
  }

  function makeStage5() {
    const chassisPosition = new Vector3().setFromMatrixPosition(
      chassisBody.current.matrixWorld
    );
    if (
      Math.abs(7 - chassisPosition.x) < 0.7 &&
      Math.abs(4 - chassisPosition.z) < 0.6
    ) {
      setStage5(true);
    } else {
      setStage5(false);
    }
  }

  return (
    <>
      <motion.group
        initial={{ scale: 0 }}
        animate={isStart ? { scale: 1 } : { scale: 0 }}
        ref={vehicle}
        name="vehicle"
      >
        <group ref={chassisBody} position={[0, 0.2, 0]} name="chassisBody">
          <CarModel />
        </group>
        <Wheel castShadow wheelRef={wheels[0]} radius={wheelRadius} />
        <Wheel
          castShadow
          wheelRef={wheels[1]}
          radius={wheelRadius}
          lefSide={true}
        />
        <Wheel castShadow wheelRef={wheels[2]} radius={wheelRadius} />
        <Wheel
          castShadow
          wheelRef={wheels[3]}
          radius={wheelRadius}
          lefSide={true}
        />
      </motion.group>
    </>
  );
}
