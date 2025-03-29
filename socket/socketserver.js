import { Server } from 'socket.io'

let io

export const init = (server) => {
  // Configuración basada en entorno
  const allowedOrigins = ['https://equipoverde.netlify.app']

  // Iniciamos el socket.io con el servidor HTTP de Express
  io = new Server(server, {
    cors: {
      origin: allowedOrigins, // Permite ambos orígenes
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    console.log('🔌 Cliente conectado:', socket.id)
    console.log('Handshake:', socket.handshake)
    // Enviar un mensaje global, para probar que funciona
    socket.emit('message', 'Hola desde el servidor')

    socket.on('disconnect', () => {
      console.log('🔌 Cliente desconectado:', socket.id)
    })
  })

  console.log(
    `Servidor WebSocket inicializado en puerto ${server.address()?.port || 'desconocido'}`
  )
}

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io no inicializado!')
  }
  return io
}
