import { Button } from "@/components/ui/button";

export default function LeaderVote() {
  return (
    <div className="flex flex-col gap-7 justify-center items-center h-full">
      <div className="mb-5">
        <h1 className="text-3xl font-bold">Dirigente: Hernan Dominguez</h1>
        <span>8-970-599</span>
      </div>
      <h1 className="text-3xl">Registrar Votante</h1>
      <Button className="text-xl m-w-56">Ingresar por cedula</Button>
      <Button className="text-xl m-w-56">Escanear Dirigiente con QR</Button>
    </div>
  );
}
