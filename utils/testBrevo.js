import Brevo from '@getbrevo/brevo'

/**
 * Utilidad para verificar la instalación y estructura del SDK de Brevo.
 * Imprime por consola el objeto importado y crea una instancia básica
 * para comprobar que las dependencias están correctamente instaladas.
 */

console.log('🦽Brevo:', Brevo) // Muestra qué se está importando exactamente
console.log('🦽API Instance:', new Brevo.TransactionalEmailsApi()) // Verifica la estructura interna
