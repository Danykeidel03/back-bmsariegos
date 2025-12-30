# 🚂 Configuración de Variables de Entorno en Railway

## ⚠️ IMPORTANTE: Configurar ANTES de deployar

Para que el backend funcione correctamente en Railway, debes configurar estas **variables de entorno** en el panel de Railway.

### 📋 Variables Requeridas

```bash
# MongoDB - OBTÉN TU URI DESDE MONGODB ATLAS
MONGODB_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster.mongodb.net/TU_DATABASE

# JWT - GENERA UNA CLAVE ALEATORIA SEGURA
JWT_SECRET=tu_clave_jwt_super_segura_y_aleatoria
JWT_EXPIRE=1h

# API Key - CREA UNA CLAVE ÚNICA PARA TU API
API_KEY=tu-api-key-unica

# Server
PORT=3005
NODE_ENV=production

# CORS - Agrega los dominios de tu frontend
ALLOWED_ORIGINS=https://www.tudominio.com,https://tudominio.com
```

---

## 🔧 Pasos para Configurar en Railway

### 1. Ir al Dashboard de Railway
1. Abre [railway.app](https://railway.app)
2. Selecciona tu proyecto

### 2. Agregar Variables de Entorno
1. Ve a la pestaña **Variables**
2. Haz clic en **"New Variable"**
3. Agrega cada variable con sus valores reales
4. **NUNCA compartas estas variables públicamente**

### 3. Re-deploy
Después de agregar todas las variables, Railway hará redeploy automático.

---

## 🔐 IMPORTANTE: Seguridad

- ❌ **NUNCA** commitees archivos `.env` al repositorio
- ❌ **NUNCA** incluyas credenciales en archivos markdown o documentación
- ✅ Usa `.gitignore` para excluir `.env`
- ✅ Usa `.env.example` sin valores reales como plantilla
- ✅ Genera contraseñas seguras y únicas para producción

---

## 🐛 Troubleshooting

### Error 502 Bad Gateway
- Verifica que TODAS las variables estén configuradas
- Revisa los logs en Railway

### CORS bloqueado
- Verifica que `ALLOWED_ORIGINS` incluya el dominio del frontend
- NO uses espacios después de las comas

---

## 📝 Generar Credenciales Seguras

Para generar una clave JWT segura, ejecuta en tu terminal:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
