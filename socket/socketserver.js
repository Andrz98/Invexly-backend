//Este componente implementa el Web Socket
//Permite se informe al Front, cuando se produce un evento en el Backend
import { Server } from 'socket.io'

let io

export const init = (server) => {
  // Iniciamos el socket.io con el servidor HTTP de Express
  io = new Server(server, {
    cors: {
      origin: 'https://front-roan-ten.vercel.app/', //  Aqui apunto al frontend
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    console.log('🔌 Cliente conectado:', socket.id)
    // Enviar un mensaje global, para probar que funciona
    socket.emit('message', 'Hola desde el servidor')

    socket.on('disconnect', () => {
      console.log('❌ Cliente desconectado:', socket.id)
    })
  })

  console.log('Servidor WebSocket escuchando en puerto 3000')
}

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io no inicializado!')
  }
  return io
}
