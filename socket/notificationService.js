// SERVICIO PARA NOTIFICACIONES PERSONALIZADAS
//Las noticias economicas afectan a determinadas empresas.
//Cada noticia que se guarda en la BD, viene con uno o mas tickers asociados
//Este componente compara esos tickers, con los que tiene el usuario en el Portfolio
//Si coincide con alguno de ellos, la noticia se envia al frontend, para que el usuario
//la lea, con un link a dicha noticia

import User from '../../models/User.js'
import { getIO } from '../socketServer.js'

export const notifyUsersAboutNews = async (news) => {
  try {
    const tickers = news.tickers

    // Encontrar usuarios que estén suscritos a alguno de los tickers de la noticia
    const users = await User.find({
      subscribedTickers: { $in: tickers },
      'newsPreferences.notificationEnabled': true
    })

    const io = getIO()

    // Notificar a cada usuario relevante
    users.forEach((user) => {
      // Verificar nivel de importancia
      if (
        getImportanceLevel(news.importance) >=
        getImportanceLevel(user.newsPreferences.minImportance)
      ) {
        io.to(`user-${user._id}`).emit('personalNewsAlert', {
          userId: user._id,
          newsId: news._id,
          title: news.title,
          tickers: news.tickers.filter((ticker) =>
            user.subscribedTickers.includes(ticker)
          ),
          url: news.url,
          importance: news.importance
        })
      }
    })

    return users.length
  } catch (error) {
    console.error('Error notifying users:', error)
    return 0
  }
}

// Función auxiliar para comparar niveles de importancia
function getImportanceLevel(importance) {
  const levels = { low: 1, medium: 2, high: 3, breaking: 4 }
  return levels[importance] || 2
}
