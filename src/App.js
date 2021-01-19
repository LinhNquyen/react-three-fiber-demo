import "./App.css";
import React, { Suspense, useRef } from "react";
import {
  Canvas,
  useFrame,
  useLoader,
  useThree,
  extend,
} from "react-three-fiber";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

extend({ OrbitControls });

const Loading = () => {
  return (
    <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[1, 16, 16]} />
      <meshStandardMaterial
        attach="material"
        color="white"
        transparent
        opacity={0.6}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
};

const Model = () => {
  const mesh = useRef();
  const materials = useLoader(MTLLoader, "assets/ring3.mtl");
  const object = useLoader(OBJLoader, "assets/ring3.obj", (loader) => {
    materials.preload();
    materials.setMaterials(loader);
  });

  return <primitive object={object} ref={mesh} color="red" />;
};

const CameraControls = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  const controls = useRef();
  useFrame((state) => {
    controls.current.update();
  });
  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      enableZoom
      maxDistance={25}
      minDistance={10}
      maxPolarAngle={Math.PI}
      minPolarAngle={0}
      rotateSpeed={0.5}
    />
  );
};

const App = () => {
  return (
    <Canvas style={{ width: "100vw", height: "100vh" }}>
      <CameraControls />
      <ambientLight intensity={0.5} />
      <spotLight position={[150, 150, 150]} intensity={0.5} />
      <pointLight position={[0, 0, -20]} intensity={0.55} />
      <Suspense fallback={<Loading />}>
        <Model />
      </Suspense>
    </Canvas>
  );
};

export default App;
