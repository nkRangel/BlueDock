@echo off
title Servidor Principal - BlueDock e Rede

echo =======================================================
echo  INICIANDO AMBIENTE DE SERVICOS DA LOJA
echo =======================================================
echo.

echo -- ETAPA 1: Conectando a unidade de rede (Z:)... --
NET USE Z: /DELETE /YES
NET USE Z: \\SERVIDOR\HPS /YES
echo Unidade de rede Z: conectada com sucesso.
echo.

echo -- ETAPA 2: Iniciando Servidor Backend do BlueDock... --
REM Abre uma nova janela, entra na pasta backend e inicia o servidor.
start "Backend BlueDock" cmd /k "cd backend && node server.js"
echo Servidor Backend iniciado.
echo.

echo -- ETAPA 3: Iniciando Servidor Frontend (Modo Rede)... --
REM Entra na pasta frontend e roda em modo DEV com acesso liberado para a rede.
REM Isso garante que o IP 192.168.x.x funcione nos outros computadores.
start "Frontend BlueDock" cmd /k "cd frontend && npm run dev -- --host"
echo Servidor Frontend iniciado.
echo.

echo =======================================================
echo  TUDO INICIADO!
echo.
echo  - Unidade de rede Z: Conectada.
echo  - Backend: Rodando na porta 3001.
echo  - Frontend: Rodando na porta 5173 (Acessivel via IP).
echo.
echo  Para acessar de outro PC, olhe o IP "Network" na janela do Frontend.
echo  Pode fechar esta janela principal.
echo =======================================================
echo.

pause