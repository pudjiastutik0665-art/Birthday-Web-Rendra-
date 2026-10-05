import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, useGLTF } from "@react-three/drei";

// =====================================================================
// TODO: LETAKKAN URL FILE .GLB / .GLTF CINNAMOROLL KAMU DI BARIS INI.
// CONTOH: taruh file di folder "public/models/cinnamoroll.glb", lalu isi:
//   const MODEL_URL: string | null = "/models/cinnamoroll.glb";
// SELAMA MASIH null, YANG TAMPIL ADALAH MODEL PLACEHOLDER DARI BENTUK BOLA.
// =====================================================================
const MODEL_URL: string | null = null;

/** Loader model asli menggunakan useGLTF. */
function CinnamorollModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  // TODO: ATUR SKALA / POSISI DI SINI JIKA MODEL KAMU TERLALU BESAR ATAU KECIL.
  return <primitive object={scene} scale={1} position={[0, -0.5, 0]} />;
}

/** Placeholder sederhana bergaya Cinnamoroll: badan putih + telinga biru muda. */
function PlaceholderModel() {
  return (
    <group>
      {/* kepala */}
      <mesh>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial color="#ffffff" emissive="#fff6f6" emissiveIntensity={0.45} roughness={0.6} />
      </mesh>
      {/* telinga panjang */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 1.15, 0.15, 0]} rotation={[0, 0, s * -1.1]} scale={[0.35, 1, 0.15]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#aedefc" roughness={0.7} />
        </mesh>
      ))}
      {/* mata */}
      {[-1, 1].map((s) => (
        <mesh key={`e${s}`} position={[s * 0.32, 0.05, 0.93]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color="#2b4a6b" />
        </mesh>
      ))}
      {/* pipi */}
      {[-1, 1].map((s) => (
        <mesh key={`c${s}`} position={[s * 0.5, -0.2, 0.85]} scale={[1, 0.6, 0.4]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#f875aa" />
        </mesh>
      ))}
      {/* badan */}
      <mesh position={[0, -1.15, 0]} scale={[0.75, 0.6, 0.65]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ffffff" emissive="#fff6f6" emissiveIntensity={0.45} roughness={0.6} />
      </mesh>
    </group>
  );
}

export default function Cinnamoroll3D({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas gl={{ alpha: true, antialias: true }} dpr={[1, 2]} camera={{ position: [0, 0, 7], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffdfdf" />
        <directionalLight position={[-6, 2, 4]} intensity={0.4} color="#aedefc" />
        <Float speed={1.4} rotationIntensity={0.4} floatIntensity={1.2}>
          <Suspense fallback={<PlaceholderModel />}>
            {MODEL_URL ? <CinnamorollModel url={MODEL_URL} /> : <PlaceholderModel />}
          </Suspense>
        </Float>
        <OrbitControls autoRotate autoRotateSpeed={1.5} enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
