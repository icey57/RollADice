import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

interface DiceCanvasProps {
  diceType: 'd20' | 'd100';
  rollCount: number;
  skipAnimation: boolean;
  onRollComplete: (results: number[]) => void;
  triggerRoll: boolean;
  onRollStart: () => void;
}

interface DiceBody {
  mesh: THREE.Mesh;
  body: CANNON.Body;
  geometry: THREE.BufferGeometry;
  faceNormals: THREE.Vector3[];
}

function DiceCanvas({ diceType, rollCount, skipAnimation, onRollComplete, triggerRoll, onRollStart }: DiceCanvasProps) {
  const [isRolling, setIsRolling] = useState(false);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 5, 10], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#1a1a2e']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        
        <DiceScene
          diceType={diceType}
          rollCount={rollCount}
          skipAnimation={skipAnimation}
          onRollComplete={onRollComplete}
          triggerRoll={triggerRoll}
          onRollStart={onRollStart}
          setIsRolling={setIsRolling}
        />
        
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2}
        />
        
        <gridHelper args={[20, 20, '#444', '#222']} />
      </Canvas>

      {isRolling && (
        <div className="absolute top-4 left-4 bg-blue-600 bg-opacity-90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            <span className="text-sm text-white">Rolling dice...</span>
          </div>
        </div>
      )}
    </div>
  );
}

interface DiceSceneProps {
  diceType: 'd20' | 'd100';
  rollCount: number;
  skipAnimation: boolean;
  onRollComplete: (results: number[]) => void;
  triggerRoll: boolean;
  onRollStart: () => void;
  setIsRolling: (rolling: boolean) => void;
}

function DiceScene({ 
  diceType, 
  rollCount, 
  skipAnimation, 
  onRollComplete, 
  triggerRoll,
  onRollStart,
  setIsRolling
}: DiceSceneProps) {
  const worldRef = useRef<CANNON.World | null>(null);
  const diceRef = useRef<DiceBody[]>([]);
  const settlingTimerRef = useRef<number>(0);
  const isRollingRef = useRef(false);
  const floorBodyRef = useRef<CANNON.Body | null>(null);
  const wallBodiesRef = useRef<CANNON.Body[]>([]);

  useEffect(() => {
    const world = new CANNON.World();
    world.gravity.set(0, -30, 0);
    world.defaultContactMaterial.friction = 0.3;
    world.defaultContactMaterial.restitution = 0.4;
    worldRef.current = world;

    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body({ mass: 0, shape: floorShape });
    floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(floorBody);
    floorBodyRef.current = floorBody;

    const wallThickness = 0.5;
    const arenaSize = 10;
    const wallHeight = 5;

    const walls = [
      { pos: [0, wallHeight / 2, -arenaSize / 2], rot: [0, 0, 0] },
      { pos: [0, wallHeight / 2, arenaSize / 2], rot: [0, 0, 0] },
      { pos: [-arenaSize / 2, wallHeight / 2, 0], rot: [0, Math.PI / 2, 0] },
      { pos: [arenaSize / 2, wallHeight / 2, 0], rot: [0, Math.PI / 2, 0] },
    ];

    walls.forEach(({ pos, rot }) => {
      const wallShape = new CANNON.Box(new CANNON.Vec3(arenaSize / 2, wallHeight / 2, wallThickness / 2));
      const wallBody = new CANNON.Body({ mass: 0, shape: wallShape });
      wallBody.position.set(pos[0], pos[1], pos[2]);
      wallBody.quaternion.setFromEuler(rot[0], rot[1], rot[2]);
      world.addBody(wallBody);
      wallBodiesRef.current.push(wallBody);
    });

    return () => {
      if (worldRef.current) {
        diceRef.current.forEach(dice => {
          if (dice.body && worldRef.current) {
            worldRef.current.removeBody(dice.body);
          }
          if (dice.geometry) {
            dice.geometry.dispose();
          }
        });
        diceRef.current = [];

        if (floorBodyRef.current) {
          worldRef.current.removeBody(floorBodyRef.current);
        }
        wallBodiesRef.current.forEach(wall => {
          if (worldRef.current) {
            worldRef.current.removeBody(wall);
          }
        });
        wallBodiesRef.current = [];
      }
    };
  }, []);

  const createD20Geometry = useCallback(() => {
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const vertices = geometry.attributes.position.array;
    const faceNormals: THREE.Vector3[] = [];
    
    for (let i = 0; i < vertices.length; i += 9) {
      const v1 = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
      const v2 = new THREE.Vector3(vertices[i + 3], vertices[i + 4], vertices[i + 5]);
      const v3 = new THREE.Vector3(vertices[i + 6], vertices[i + 7], vertices[i + 8]);
      
      const edge1 = v2.clone().sub(v1);
      const edge2 = v3.clone().sub(v1);
      const normal = edge1.cross(edge2).normalize();
      
      faceNormals.push(normal);
    }

    return { geometry, faceNormals };
  }, []);

  const createD100Geometry = useCallback(() => {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const faceCount = 100;
    const faceNormals: THREE.Vector3[] = [];
    
    for (let i = 0; i < faceCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / faceCount);
      const theta = Math.sqrt(faceCount * Math.PI) * phi;
      
      const x = Math.cos(theta) * Math.sin(phi);
      const y = Math.cos(phi);
      const z = Math.sin(theta) * Math.sin(phi);
      
      faceNormals.push(new THREE.Vector3(x, y, z).normalize());
    }

    return { geometry, faceNormals };
  }, []);

  const createDice = useCallback((type: 'd20' | 'd100', index: number) => {
    const { geometry, faceNormals } = type === 'd20' ? createD20Geometry() : createD100Geometry();
    
    const material = new THREE.MeshStandardMaterial({
      color: type === 'd20' ? '#3b82f6' : '#8b5cf6',
      metalness: 0.3,
      roughness: 0.4,
    });

    const mesh = new THREE.Mesh(geometry, material);
    const spacing = 2.5;
    const offsetX = (index - (rollCount - 1) / 2) * spacing;
    mesh.position.set(offsetX, 5 + index * 0.5, 0);

    const shape = type === 'd20' 
      ? createIcosahedronShape() 
      : new CANNON.Sphere(1);

    const body = new CANNON.Body({
      mass: 1,
      shape: shape,
      position: new CANNON.Vec3(offsetX, 5 + index * 0.5, 0),
      linearDamping: 0.3,
      angularDamping: 0.3,
    });

    if (worldRef.current) {
      worldRef.current.addBody(body);
    }

    return { mesh, body, geometry, faceNormals };
  }, [rollCount, createD20Geometry, createD100Geometry]);

  const createIcosahedronShape = () => {
    const phi = (1 + Math.sqrt(5)) / 2;
    const vertices = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
    ].map(v => new CANNON.Vec3(v[0] / 2, v[1] / 2, v[2] / 2));

    const faces = [
      [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
      [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
      [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
      [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
    ];

    return new CANNON.ConvexPolyhedron({ vertices, faces });
  };

  const applyRollImpulse = useCallback((dice: DiceBody[]) => {
    dice.forEach(diceBody => {
      const impulse = new CANNON.Vec3(
        (Math.random() - 0.5) * 15,
        Math.random() * 5 + 10,
        (Math.random() - 0.5) * 15
      );
      diceBody.body.applyImpulse(impulse, new CANNON.Vec3(0, 0, 0));

      const torque = new CANNON.Vec3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      diceBody.body.applyTorque(torque);
    });
  }, []);

  const checkSettled = useCallback((dice: DiceBody[]) => {
    return dice.every(diceBody => {
      const velocity = diceBody.body.velocity.length();
      const angularVelocity = diceBody.body.angularVelocity.length();
      return velocity < 0.1 && angularVelocity < 0.1;
    });
  }, []);

  const getFaceValue = useCallback((diceBody: DiceBody, type: 'd20' | 'd100') => {
    const upVector = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion(
      diceBody.body.quaternion.x,
      diceBody.body.quaternion.y,
      diceBody.body.quaternion.z,
      diceBody.body.quaternion.w
    );

    let maxDot = -Infinity;
    let faceIndex = 0;

    diceBody.faceNormals.forEach((normal, index) => {
      const transformedNormal = normal.clone().applyQuaternion(quaternion);
      const dot = transformedNormal.dot(upVector);
      
      if (dot > maxDot) {
        maxDot = dot;
        faceIndex = index;
      }
    });

    return type === 'd20' ? faceIndex + 1 : faceIndex + 1;
  }, []);

  const rollDice = useCallback(() => {
    if (isRollingRef.current) return;

    if (skipAnimation) {
      onRollStart();
      setIsRolling(true);
      
      const results: number[] = [];
      for (let i = 0; i < rollCount; i++) {
        const maxValue = diceType === 'd20' ? 20 : 100;
        results.push(Math.floor(Math.random() * maxValue) + 1);
      }
      
      setTimeout(() => {
        onRollComplete(results);
        setIsRolling(false);
      }, 500);
      
      return;
    }

    onRollStart();
    setIsRolling(true);
    isRollingRef.current = true;
    settlingTimerRef.current = 0;

    diceRef.current.forEach(dice => {
      if (worldRef.current) {
        worldRef.current.removeBody(dice.body);
      }
      dice.geometry.dispose();
    });
    diceRef.current = [];

    const newDice: DiceBody[] = [];
    for (let i = 0; i < rollCount; i++) {
      const dice = createDice(diceType, i);
      newDice.push(dice);
    }
    diceRef.current = newDice;

    setTimeout(() => {
      applyRollImpulse(newDice);
    }, 100);
  }, [
    skipAnimation,
    rollCount,
    diceType,
    onRollComplete,
    onRollStart,
    setIsRolling,
    createDice,
    applyRollImpulse
  ]);

  useEffect(() => {
    if (triggerRoll && !isRollingRef.current) {
      rollDice();
    }
  }, [triggerRoll, rollDice]);

  useFrame((_, delta) => {
    if (!worldRef.current || diceRef.current.length === 0) return;

    worldRef.current.step(1 / 60, delta, 3);

    diceRef.current.forEach(dice => {
      dice.mesh.position.copy(dice.body.position as any);
      dice.mesh.quaternion.copy(dice.body.quaternion as any);
    });

    if (isRollingRef.current) {
      if (checkSettled(diceRef.current)) {
        settlingTimerRef.current += delta;
        
        if (settlingTimerRef.current > 0.5) {
          const results = diceRef.current.map(dice => getFaceValue(dice, diceType));
          onRollComplete(results);
          setIsRolling(false);
          isRollingRef.current = false;
          settlingTimerRef.current = 0;
        }
      } else {
        settlingTimerRef.current = 0;
      }
    }
  });

  return (
    <>
      {diceRef.current.map((dice, index) => (
        <primitive key={index} object={dice.mesh} />
      ))}
    </>
  );
}

export default DiceCanvas;
