import { ArrowLeft, FileQuestion } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function NotFoundPage() {
  return (
    <section className="app-panel flex min-h-80 flex-col items-center justify-center p-8 text-center">
      <FileQuestion size={32} className="text-muted-foreground" aria-hidden="true" />
      <h2 className="mt-4 text-xl font-semibold">Este endereço não existe</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        O endereço pode estar incorreto ou a página não está mais disponível.
      </p>
      <Button className="mt-5" render={<Link to="/" />}>
        <ArrowLeft size={17} aria-hidden="true" />
        Voltar para a visão geral
      </Button>
    </section>
  );
}
