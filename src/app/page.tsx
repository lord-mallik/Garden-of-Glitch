import { GameScene } from "@/components/game/GameScene";
import { HUD } from "@/components/ui/HUD";
import { CrashScreen } from "@/components/ui/CrashScreen";

export default function Home() {
  return (
    <main className="w-full h-full">
      <CrashScreen />
      <HUD />
      <GameScene />
    </main>
  );
}
