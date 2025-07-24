import jwt from 'jsonwebtoken'
import { parseDurationToMs } from '../time/parseDurationToMs.js'

/**
 * Firma un access token JWT y lo envía como cookie segura.
 *
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {string} userId - ID del usuario a firmar.
 * @param {string} [expiresIn='15m'] - Tiempo de expiración del token (ej: '15m', '1h').
 * @returns {string} - Token firmado.
 */

export const signAndSendAccessToken = (res, userId, expiresIn = '15m') => {
  // Firmo el token
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn })

  // Envío el token como cookie segura
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: parseDurationToMs(expiresIn)
  })

  return token
}
