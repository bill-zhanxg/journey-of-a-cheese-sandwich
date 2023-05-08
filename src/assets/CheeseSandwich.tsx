import { useGLTF } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { LayoutCamera, MotionCanvas, motion } from 'framer-motion-3d';
import { AmbientLight, Group, Mesh, MeshStandardMaterial } from 'three';
import { GLTF } from 'three-stdlib';
import { degToRad } from 'three/src/math/MathUtils.js';
extend({ AmbientLight, Group, Mesh });

type GLTFResult = GLTF & {
	nodes: {
		node_id5: Mesh;
		node_id30: Mesh;
		node_id80: Mesh;
		node_id30_1: Mesh;
	};
	materials: {
		['32']: MeshStandardMaterial;
		['149']: MeshStandardMaterial;
		['217']: MeshStandardMaterial;
		['149']: MeshStandardMaterial;
	};
};

export function CheeseSandwich({ rotate, step }: { rotate: boolean; step: number }) {
	const camera = rotate
		? {
				x: -0.3,
				y: 1.5,
				z: 0.5,
				rotateX: degToRad(-90),
				rotateZ: degToRad(-90),
		  }
		: {
				x: 0,
				y: 0,
				z: 1.5,
				rotateX: 0,
				rotateZ: 0,
		  };
	return (
		<MotionCanvas>
			<LayoutCamera
				initial={{
					z: 3,
				}}
				animate={camera}
				transition={{
					duration: 1,
				}}
			/>
			<Geometry step={step} />
		</MotionCanvas>
	);
}

function Geometry({ step }: { step: number }) {
	const maxStep = 3;
	const { nodes, materials } = useGLTF('/cheese-sandwich.glb') as GLTFResult;
	const initial = {};
	const animate = {
		rotateZ: degToRad(-90),
		x: 0.1,
		y: 1,
	};
	return (
		<group scale={1} dispose={null}>
			<group position={[0, 0.06, 0]}>
				<motion.mesh
					geometry={nodes.node_id30.geometry}
					material={materials['149']}
					position={[0, -0.03, 0.36]}
					animate={step > 0 && step < maxStep ? animate : initial}
					transition={{
						duration: 1,
					}}
					scale={0.35}
				/>
			</group>
			<motion.mesh
				geometry={nodes.node_id5.geometry}
				material={materials['32']}
				position={[0, 0.02, 0.35]}
				animate={step > 1 && step < maxStep ? animate : initial}
				transition={{
					duration: 1,
				}}
				scale={[0.5, 0.01, 0.3]}
			/>
			<group position={[0, 0.11, 0.16]}>
				<motion.mesh
					geometry={nodes.node_id80.geometry}
					material={materials['217']}
					position={[0.01, -0.26, 0.18]}
					animate={step > 2 && step < maxStep ? animate : initial}
					transition={{
						duration: 1,
					}}
					scale={[0.03, 0.02, 0.04]}
				/>
			</group>
			<group position={[0, -0.25, 0]}>
				<motion.mesh
					geometry={nodes.node_id30_1.geometry}
					material={materials['149']}
					position={[0, 0.17, 0.36]}
					scale={0.35}
				/>
			</group>
			<ambientLight color="white" position={[0, -0.222, 0.308]} />
		</group>
	);
}

useGLTF.preload('/cheese-sandwich.glb');
