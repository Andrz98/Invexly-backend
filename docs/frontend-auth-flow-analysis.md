# Análisis inicial del frontend (flujo de autenticación)

## Contexto
Este documento resume el comportamiento del frontend compartido por el equipo para alinear el backend antes de nuevos cambios funcionales.

## Flujo observado

### 1) Restauración de sesión al cargar la app
- `AuthProvider` ejecuta `checkSession()` en `useEffect`.
- `checkSession()` llama a `POST /auth/refresh-token` con `credentials: 'include'`.
- Si la respuesta es `2xx`, el frontend espera `data.user` y marca sesión activa.
- Si la respuesta es no-OK (`401/403/...`), degrada a deslogueado sin romper UI.

### 2) Login
- `login()` usa `POST /auth/login` con `withCredentials: true`.
- Espera payload de usuario y tokens/cookies válidos desde backend.

### 3) Logout
- `logout()` usa `POST /auth/logout` con `withCredentials: true`.
- Si recibe `200`, limpia estado local y navega a `/`.

### 4) Validación puntual de token
- Existe `getUserSession()` que usa `GET /auth/validate-token` con credenciales.
- Si responde `401`, el frontend interpreta “sin sesión” y devuelve `null`.

## Contrato backend mínimo que este frontend necesita

### CORS con credenciales
- `Access-Control-Allow-Origin` debe ser explícito (sin wildcard) para el origen frontend.
- `Access-Control-Allow-Credentials: true` en solicitudes reales y preflight.
- `OPTIONS` debe responder de forma consistente con la request final.

### Cookies cross-site
- `HttpOnly: true` para tokens sensibles.
- `Secure: true` en producción.
- `SameSite: 'none'` en producción cross-site.
- `Path` y `Domain` coherentes para que el navegador reenvíe cookies.

### Endpoints y estados esperados
- `POST /auth/refresh-token`
  - `200` con `{ user: ... }` si hay refresh token válido.
  - `401/403` controlado cuando no hay sesión o token inválido.
- `GET /auth/validate-token`
  - `200` con usuario cuando sesión válida.
  - `401` controlado cuando no hay token.

## Riesgos detectados por la lectura del frontend
- Si `VITE_API_BASE` no está definido, el frontend omite check de sesión.
- El frontend mezcla dos estrategias de restore:
  - principal: `refresh-token`
  - secundaria: `validate-token`
- Si en producción falla una sola política de cookies/CORS, el estado cae a deslogueado.

## Próximos pasos propuestos (sin implementar todavía)
1. Validar en navegador real que `refresh-token` y `validate-token` envían y reciben cookies.
2. Capturar en backend logs con: `origin`, presencia de cookie y status por endpoint.
3. Revisar configuración de proxy/plataforma (headers y forwarding de cookies).
4. Ajustar de forma mínima backend según evidencia real de DevTools + logs.

## Nota operativa
No se aplican cambios funcionales en este documento. Es solo baseline de entendimiento para diseñar la siguiente iteración con menor riesgo.
