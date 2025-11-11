import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Rule, RollResult, DiceSkin } from '../types';
import { rollMultipleTimes } from '../utils/dice';
import { getSkinById } from '../utils/skins';

interface Canvas3DProps {
  rule: Rule;
  numberOfRolls: number;
  targetValue: number | undefined;
  currentSkinId: string;
  skins: DiceSkin[];
  isRolling: boolean;
  onRoll: (result: RollResult) => void;
  onRollingEnd: () => void;
}

function Canvas3D({
  rule,
  numberOfRolls,
  targetValue,
  currentSkinId,
  skins,
  isRolling,
  onRoll,
  onRollingEnd,
}: Canvas3DProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const diceRef = useRef<THREE.Mesh | null>(null);
  const animationRef = useRef<number | null>(null);
  const [canvasLoading, setCanvasLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const diceStateRef = useRef<{
    isAnimating: boolean;
    velocity: THREE.Vector3;
    angularVelocity: THREE.Vector3;
    startTime: number;
    targetTime: number;
  }>({
    isAnimating: false,
    velocity: new THREE.Vector3(0, 0, 0),
    angularVelocity: new THREE.Vector3(0, 0, 0),
    startTime: 0,
    targetTime: 1500,
  });

  const createDiceMaterial = (skinId: string): THREE.Material[] => {
    const skin = getSkinById(skinId, skins.filter((s) => s.type === 'custom'));
    
    const materials: THREE.Material[] = [];
    
    if (skin && skin.imageUrl) {
      const loader = new THREE.TextureLoader();
      try {
        const texture = loader.load(skin.imageUrl);
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        const material = new THREE.MeshPhongMaterial({
          map: texture,
          shininess: 100,
        });
        for (let i = 0; i < 6; i++) {
          materials.push(material);
        }
      } catch {
        const fallbackColor = skin.colors?.primary || '#CD853F';
        const material = new THREE.MeshPhongMaterial({
          color: fallbackColor,
          shininess: 100,
        });
        for (let i = 0; i < 6; i++) {
          materials.push(material);
        }
      }
    } else {
      const fallbackColor = skin?.colors?.primary || '#CD853F';
      const material = new THREE.MeshPhongMaterial({
        color: fallbackColor,
        shininess: 100,
      });
      for (let i = 0; i < 6; i++) {
        materials.push(material);
      }
    }

    return materials;
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      setCanvasLoading(true);
      setError(null);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x1a1a2e);
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        75,
        canvasRef.current.clientWidth / canvasRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 4;
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      canvasRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const materials = createDiceMaterial(currentSkinId);
      const dice = new THREE.Mesh(geometry, materials);
      dice.castShadow = true;
      dice.receiveShadow = true;
      scene.add(dice);
      diceRef.current = dice;

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
      directionalLight.position.set(5, 5, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.camera.left = -10;
      directionalLight.shadow.camera.right = 10;
      directionalLight.shadow.camera.top = 10;
      directionalLight.shadow.camera.bottom = -10;
      scene.add(directionalLight);

      const handleResize = () => {
        if (!canvasRef.current || !camera || !renderer) return;
        const width = canvasRef.current.clientWidth;
        const height = canvasRef.current.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', handleResize);

      const animate = () => {
        animationRef.current = requestAnimationFrame(animate);

        if (diceRef.current && diceStateRef.current.isAnimating) {
          const state = diceStateRef.current;
          const elapsed = Date.now() - state.startTime;
          const progress = Math.min(elapsed / state.targetTime, 1);

          if (progress < 0.7) {
            diceRef.current.rotation.x += state.angularVelocity.x * 0.02;
            diceRef.current.rotation.y += state.angularVelocity.y * 0.02;
            diceRef.current.rotation.z += state.angularVelocity.z * 0.02;
          } else {
            const decelerationFactor = 1 - ((progress - 0.7) / 0.3) ** 2;
            diceRef.current.rotation.x +=
              state.angularVelocity.x * 0.02 * decelerationFactor;
            diceRef.current.rotation.y +=
              state.angularVelocity.y * 0.02 * decelerationFactor;
            diceRef.current.rotation.z +=
              state.angularVelocity.z * 0.02 * decelerationFactor;
          }

          if (progress >= 1) {
            state.isAnimating = false;
          }
        } else if (diceRef.current) {
          diceRef.current.rotation.x += 0.005;
          diceRef.current.rotation.y += 0.008;
        }

        renderer.render(scene, camera);
      };

      setTimeout(() => {
        setCanvasLoading(false);
        animate();
      }, 500);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (rendererRef.current && canvasRef.current) {
          try {
            canvasRef.current.removeChild(rendererRef.current.domElement);
          } catch {
            // Element already removed
          }
          rendererRef.current.dispose();
        }
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize 3D canvas');
      setCanvasLoading(false);
    }
  }, []);

  useEffect(() => {
    if (diceRef.current) {
      const materials = createDiceMaterial(currentSkinId);
      if (Array.isArray(materials)) {
        (diceRef.current as any).material = materials;
      } else {
        diceRef.current.material = materials as any;
      }
    }
  }, [currentSkinId, skins]);

  useEffect(() => {
    if (isRolling && diceRef.current && !diceStateRef.current.isAnimating) {
      diceStateRef.current.isAnimating = true;
      diceStateRef.current.startTime = Date.now();
      diceStateRef.current.angularVelocity = new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );

      const animationTime = skipAnimation ? 300 : 1500;
      diceStateRef.current.targetTime = animationTime;

      const delayBeforeResult = skipAnimation ? 200 : 1200;
      const resultTimeout = setTimeout(() => {
        if (!skipAnimation) {
          const result = rollMultipleTimes(rule, numberOfRolls, targetValue);
          onRoll(result);
        } else {
          const result = rollMultipleTimes(rule, numberOfRolls, targetValue);
          onRoll(result);
        }
        onRollingEnd();
        setSkipAnimation(false);
      }, delayBeforeResult);

      return () => {
        clearTimeout(resultTimeout);
      };
    }
  }, [isRolling, rule, numberOfRolls, targetValue, skipAnimation, onRoll, onRollingEnd]);

  if (error && canvasLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-center p-6 max-w-md">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-400 mb-2">
            Rendering Error
          </h3>
          <p className="text-gray-400 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={canvasRef} className="w-full h-full" />

      {canvasLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4" />
            <p className="text-lg text-gray-300">初始化 3D 骰子...</p>
          </div>
        </div>
      )}

      {isRolling && !canvasLoading && (
        <div className="absolute bottom-6 left-6 right-6 flex gap-2">
          <button
            onClick={() => setSkipAnimation(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors text-sm"
            aria-label="Skip animation"
          >
            跳过动画
          </button>
        </div>
      )}
    </div>
  );
}

export default Canvas3D;
