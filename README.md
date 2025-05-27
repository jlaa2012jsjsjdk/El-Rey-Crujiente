<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>El Rey Crujiente - Paquetes de Pollo Kentucky</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Arial', sans-serif;
        }

        body {
            background-color: #FFF5E1;
        }

        .header {
            background-color: #D32F2F;
            padding: 20px;
            text-align: center;
            color: white;
        }

        .paquetes-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            padding: 20px;
        }

        .paquete {
            background: white;
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            text-align: center;
        }

        .paquete img {
            width: 100%;
            max-width: 250px;
            height: auto;
            border-radius: 8px;
            margin-bottom: 10px;
        }

        .precio {
            color: #D32F2F;
            font-size: 24px;
            font-weight: bold;
            margin: 10px 0;
        }

        .boton-ordenar {
            background-color: #FFC107;
            color: #000;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.3s;
        }

        .boton-ordenar:hover {
            background-color: #FFA000;
        }

        .contacto {
            background-color: #333;
            color: white;
            padding: 30px;
            text-align: center;
            margin-top: 40px;
        }

        @media (max-width: 768px) {
            .paquetes-container {
                grid-template-columns: 1fr;
            }
       
