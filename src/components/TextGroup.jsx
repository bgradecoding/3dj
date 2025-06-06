import React from "react";
import { useBox } from "@react-three/cannon";
import { Text3D } from "@react-three/drei";

const DEFAULT_LETTER_SPACING = 0.5;
const fontUrl = "/assets/fonts/Pretendard.json";

const Letter = ({ offset, offsetY, offsetZ, mass = 1, text }) => {
  const [ref] = useBox(() => ({
    mass,
    position: [offset, offsetY, offsetZ],
    args: [text ? text.length * 0.2 : 0, 0.2, 0.1], // Adjust dimensions as needed
  }));

  if (!text) {
    return null;
  }

  return (
    <mesh ref={ref}>
      <Text3D
        castShadow
        font={fontUrl}
        color="white"
        height={0.1}
        lineHeight={0.5}
        size={0.3}
        fontSize={0.3}
        letterSpacing={DEFAULT_LETTER_SPACING}
      >
        {text}
      </Text3D>
    </mesh>
  );
};

const Text3DComponent = ({ text, textPosition, mass }) => {
  return (
    <group>
      {text.split("").map((letter, idx) => (
        <Letter
          key={idx}
          offset={textPosition.x + idx * 0.3}
          offsetY={textPosition.y}
          offsetZ={textPosition.z}
          mass={mass}
          text={letter}
        />
      ))}
    </group>
  );
};

export function TextGroup() {
  return (
    <>
      <Text3DComponent
        text="AX Playground"
        textPosition={{ x: -5, y: 6, z: 8 }}
        mass={1}
      />
    </>
  );
}
