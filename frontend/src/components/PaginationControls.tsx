// frontend/src/components/PaginationControls.tsx

import { Button } from "@/components/ui/button";

// Defini a interface de props que este componente precisa para funcionar.
// Ele é um componente "burro", ou seja, só recebe os dados e as funções que precisa,
// sem ter lógica de busca de dados própria. Isso o torna bem reutilizável.
interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

// Decidi criar um componente separado só para os controles de paginação.
// Isso deixa meu App.tsx mais limpo e me permite reutilizar esses controles em outro lugar, se precisar.
export function PaginationControls({ currentPage, totalPages, onPageChange }: PaginationControlsProps) {
    // Adicionei uma lógica simples para não renderizar nada se houver apenas uma página.
    // Não faz sentido mostrar os botões de controle nesse caso.
    if (totalPages <= 1) {
        return null;
    }
    
    return (
        <div className="flex items-center justify-end space-x-2 py-4">
            <span className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
            </span>
            {/* A lógica do 'disabled' é importante para a experiência do usuário,
                evitando que ele clique em 'Anterior' na primeira página ou 'Próxima' na última. */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Anterior
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Próxima
            </Button>
        </div>
    );
}