import { TetrisGame } from "../components/TetrisGame";
import PWAInstallButton from "@/components/PWAInstallButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <PWAInstallButton />
      <TetrisGame />
    </div>
  );
};

export default Index;
