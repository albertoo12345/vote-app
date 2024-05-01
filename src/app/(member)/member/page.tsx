import { Button } from "@/components/ui/button";

export default function Hompepage() {
  return (
    <div className="flex  flex-col gap-5 justify-center items-center h-full">
      <Button className="text-xl w-56">Voto con Dirigente</Button>
      <Button className="text-xl w-56">Voto Suelto</Button>
    </div>
  );
}
