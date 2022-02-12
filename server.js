
const path = require('path');
const express = require('express');
var cors = require('cors');
const app = express();

const socketIO = require('socket.io');

// configuración del puerto del servidor
const port = process.env.PORT || 3000;

// Ruta a la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Usamos CORS
app.use(cors({
  origin: '*',
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

// Inicio del servidor
const server =  app.listen(port, () => {
    console.log(`Server on port ${port}`)
})

// Inicializamos sokets io con la configuracion del server 
const io  = socketIO(server,
  {  cors: {    origin: '*',   methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']  }
});


io.on('connection', (socket) => {

  console.log('Client connected');

  socket.on('disconnect', () => console.log('Client disconnected'));

  // Escucha los mensajes enviados por el canal de la aplicación
  socket.on('data:resource', (data) => {
    // Envia la data a los clientes conectados
    io.emit('data:resource', data);
    console.log("Data enviada a los clientes");
  })
  
});


setInterval(() => io.emit('time', new Date().toTimeString()), 1000);