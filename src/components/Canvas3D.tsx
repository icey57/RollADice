import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Canvas3DProps {
  backgroundColor: string;
  objectColor: string;
  rotationSpeed: number;
  textureUrl: string;
}

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

function Canvas3D({
  backgroundColor,
  objectColor,
  rotationSpeed,
  textureUrl,
}: Canvas3DProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const animationRef = useRef<number | null>(null);

  const [canvasLoading, setCanvasLoading] = useState(true);
  const [textureLoading, setTextureLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    let isSubscribed = true;

    const initCanvas = async () => {
      try {
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
          75,
          container.clientWidth / container.clientHeight,
          0.1,
          1000
        );
        camera.position.z = 5;
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshPhongMaterial({ color: objectColor });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        meshRef.current = mesh;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        const handleResize = () => {
          if (!container || !camera || !renderer) return;
          const width = container.clientWidth;
          const height = container.clientHeight;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        const animate = () => {
          animationRef.current = requestAnimationFrame(animate);
          if (meshRef.current) {
            meshRef.current.rotation.x += 0.01 * rotationSpeed;
            meshRef.current.rotation.y += 0.01 * rotationSpeed;
          }
          renderer.render(scene, camera);
        };

        setTimeout(() => {
          if (isSubscribed) {
            setCanvasLoading(false);
            animate();
          }
        }, 500);

        return () => {
          window.removeEventListener('resize', handleResize);
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
          if (renderer && container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
            renderer.dispose();
          }
        };
      } catch (err) {
        if (isSubscribed) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to initialize 3D canvas'
          );
          setCanvasLoading(false);
        }
      }
    };

    const cleanup = initCanvas();

    return () => {
      isSubscribed = false;
      cleanup.then((cleanupFn) => cleanupFn?.());
    };
  }, [objectColor, rotationSpeed]);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(backgroundColor);
    }
  }, [backgroundColor]);

  useEffect(() => {
    if (
      meshRef.current &&
      meshRef.current.material instanceof THREE.MeshPhongMaterial
    ) {
      meshRef.current.material.color.set(objectColor);
    }
  }, [objectColor]);

  useEffect(() => {
    let isSubscribed = true;

    if (!textureUrl || !meshRef.current) {
      if (
        meshRef.current &&
        meshRef.current.material instanceof THREE.MeshPhongMaterial
      ) {
        meshRef.current.material.map = null;
        meshRef.current.material.needsUpdate = true;
      }
      if (isSubscribed) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTextureLoading('idle');
      }
      return;
    }

    if (isSubscribed) {
      setTextureLoading('loading');
      setError(null);
    }

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      textureUrl,
      (texture) => {
        if (
          isSubscribed &&
          meshRef.current &&
          meshRef.current.material instanceof THREE.MeshPhongMaterial
        ) {
          meshRef.current.material.map = texture;
          meshRef.current.material.needsUpdate = true;
          setTextureLoading('success');
        }
      },
      undefined,
      (err) => {
        if (isSubscribed) {
          setTextureLoading('error');
          setError('Failed to load texture. Please check the URL.');
          console.error('Texture loading error:', err);
        }
      }
    );

    return () => {
      isSubscribed = false;
    };
  }, [textureUrl]);

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
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-lg text-gray-300">Initializing 3D Canvas...</p>
          </div>
        </div>
      )}

      {textureLoading === 'loading' && !canvasLoading && (
        <div className="absolute top-4 right-4 bg-blue-600 bg-opacity-90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            <span className="text-sm text-white">Loading texture...</span>
          </div>
        </div>
      )}

      {textureLoading === 'success' && (
        <div className="absolute top-4 right-4 bg-green-600 bg-opacity-90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm text-white">Texture loaded</span>
          </div>
        </div>
      )}

      {textureLoading === 'error' && error && (
        <div className="absolute top-4 right-4 bg-red-600 bg-opacity-90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg max-w-xs">
          <div className="flex items-start space-x-2">
            <svg
              className="w-5 h-5 text-white flex-shrink-0 mt-0.5"
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
            <span className="text-sm text-white">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Canvas3D;
