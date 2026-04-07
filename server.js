const http = require('http');
const fs = require('fs');
const path = require('path');

// El puerto se adapta si estás en la nube o en Termux
const PORT = process.env.PORT || 8158;

const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error cargando el sitio');
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
    } else if (req.url === '/buscar' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { codigo } = JSON.parse(body);
                const jugadores = JSON.parse(fs.readFileSync(path.join(__dirname, 'jugadores.json'), 'utf8'));
                const jugador = jugadores.find(j => j.id === codigo.toUpperCase());
                
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(jugador || null));
            } catch (e) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: "Formato de datos inválido" }));
            }
        });
    } else {
        res.writeHead(404);
        res.end('No encontrado');
    }
});

server.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
