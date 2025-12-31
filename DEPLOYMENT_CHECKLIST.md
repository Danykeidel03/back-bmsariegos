# 🚀 Checklist de Deployment - Correcciones de Errores

## ✅ Backend - Cambios Completados

Estos cambios ya han sido implementados en el código:

- [x] Configuración de CORS mejorada en `src/app.js`
- [x] Cookie token con `sameSite: "None"` para CORS en producción en `src/controllers/userController.js`
- [x] Documentación mejorada en `.env.example`
- [x] Guías de solución en `ERRORS_FIX.md`

### Archivos Modificados:
1. **src/app.js** - Lineas 15-57
2. **src/controllers/userController.js** - Lineas 58-70
3. **.env.example** - Documentación mejorada

---

## 🔧 Variables de Entorno en Railway (CRÍTICO)

Verifica que estas variables están configuradas exactamente así en tu proyecto Railway:

```
MONGODB_URI = mongodb+srv://[usuario]:[password]@[cluster].mongodb.net/[database]?retryWrites=true&w=majority
JWT_SECRET = [tu clave segura aquí - mínimo 32 caracteres]
JWT_EXPIRE = 1h
API_KEY = [tu API key]
NODE_ENV = production
ALLOWED_ORIGINS = https://www.balonmanosariegos.com,https://admin.balonmanosariegos.com
```

**⚠️ IMPORTANTE:** 
- `NODE_ENV` DEBE ser `production` para que HTTPS/SameSite=None funcione
- `ALLOWED_ORIGINS` debe incluir exactamente tus dominios frontend (sin barras al final)
- Después de cambiar variables, haz un **redeploy**

---

## 🔄 Pasos de Deployment

### 1. En tu máquina local:

```bash
# Verifica los cambios
git status

# Debería mostrar:
# src/app.js
# src/controllers/userController.js
# .env.example

# Revisa los cambios
git diff

# Haz commit
git add src/app.js src/controllers/userController.js .env.example
git commit -m "fix: Corrección de SameSite cookie para CORS y configuración CORS mejorada"

# Push a tu repositorio
git push origin main
```

### 2. En Railway:

**Opción A - Si tienes GitHub Integration (recomendado):**
- Los cambios se despliegan automáticamente al hacer push
- Espera 2-5 minutos para que se complete el deployment
- Verifica en Railway → Deployments que la versión fue exitosa

**Opción B - Manual (si no usas GitHub Integration):**
- Abre tu proyecto en Railway
- Ve a Settings → Build & Deploy
- Haz clic en "Deploy"
- O usa Railway CLI: `railway up`

### 3. Verifica el deployment:

```bash
# Espera 2-5 minutos después de que termina el deployment

# Prueba 1: Health check
curl https://back-bmsariegos-production.up.railway.app/health

# Respuesta esperada:
# {"status":"healthy","uptime":123.456,"timestamp":"..."}

# Prueba 2: Login (reemplaza con datos válidos)
curl -X POST https://back-bmsariegos-production.up.railway.app/user/login \
  -H "Content-Type: application/json" \
  -d '{"mail":"test@example.com","pass":"password"}' \
  -v

# Busca en la respuesta:
# Set-Cookie: token=...; Path=/; HttpOnly; Secure; SameSite=None
```

---

## 🌐 Frontend - Cambios Necesarios

### Archivo `.env` o `.env.production`

```env
REACT_APP_API_URL=https://back-bmsariegos-production.up.railway.app
```

### Actualizar Llamadas API

**Busca en tu código:**
- Cualquier llamada a `fetch()` que vaya a la API
- Configuración de Axios
- Peticiones DELETE a `/imagenes-cabecera`

**Reemplaza:**

#### Con Fetch:
```javascript
// ANTES
fetch(`${API_URL}/imagenes-cabecera/${id}`, { method: 'DELETE' })

// DESPUÉS
fetch(`${API_URL}/imagenes-cabecera/${id}`, { 
    method: 'DELETE',
    credentials: 'include'  // ← Agregar esta línea
})
```

#### Con Axios:
```javascript
// ANTES
const api = axios.create({ baseURL: API_URL })

// DESPUÉS
const api = axios.create({ 
    baseURL: API_URL,
    withCredentials: true  // ← Agregar esta línea
})
```

### Archivos a revisar en Frontend:
- [ ] Configuración de Axios/Fetch
- [ ] `loginUser()` - debe estar presente
- [ ] `deleteImagenCabecera()` - debe incluir credenciales
- [ ] Cualquier otra petición a la API

---

## 🧪 Pruebas Post-Deployment

### En el Navegador (en la página de admin/login):

1. **Abre DevTools** (F12 → Console)

2. **Prueba 1 - Login:**
   ```javascript
   // Prueba conectividad con el login
   fetch('https://back-bmsariegos-production.up.railway.app/user/login', {
       method: 'POST',
       credentials: 'include',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ mail: 'admin@example.com', pass: 'password' })
   }).then(r => r.json()).then(console.log)
   ```

3. **Prueba 2 - Verificar Cookie:**
   ```javascript
   // Ver si la cookie se guardó
   console.log('Cookies:', document.cookie)
   // Debería mostrar: token=...
   ```

4. **Prueba 3 - Obtener Imágenes:**
   ```javascript
   fetch('https://back-bmsariegos-production.up.railway.app/imagenes-cabecera', {
       credentials: 'include'
   }).then(r => r.json()).then(console.log)
   ```

5. **Prueba 4 - Eliminar Imagen (requiere estar logueado):**
   ```javascript
   // Primero haz login (Prueba 1), luego:
   fetch('https://back-bmsariegos-production.up.railway.app/imagenes-cabecera/[ID_IMAGEN]', {
       method: 'DELETE',
       credentials: 'include'
   }).then(r => r.json()).then(console.log)
   ```

### En DevTools → Network Tab:

Haz una petición (cualquiera) y verifica:

- [x] Status code es 200 (o el esperado)
- [x] En Headers → Cookie hay: `token=...`
- [x] No hay errores CORS en Console
- [x] Response es válido (no error 401)

### En DevTools → Storage Tab:

- [x] Ve a Cookies → tu dominio
- [x] Debería haber una cookie llamada `token`
- [x] `SameSite` debe ser `None` (en producción)
- [x] `Secure` debe estar chequeado (en HTTPS)

---

## ❌ Errores Comunes y Soluciones

### Error: "Cookie rechazada por SameSite"
**Causa:** `NODE_ENV` no es `production`  
**Solución:** Verifica en Railway que `NODE_ENV=production`

### Error: 401 Unauthorized en DELETE
**Causa:** No se envía `credentials: 'include'` en la petición  
**Solución:** Actualiza tu código frontend según `FRONTEND_EXAMPLES.md`

### Error: CORS bloqueado
**Causa:** Tu dominio frontend no está en `ALLOWED_ORIGINS`  
**Solución:** Verifica exactitud en Railway (sin barras, con https)

### CSS sin cargar (MIME type text/html)
**Causa:** Error en servidor web (Apache/Nginx)  
**Solución:** Ver `ERRORS_FIX.md` - Sección 1

### Preload de imágenes lento
**Causa:** Optimización de frontend  
**Solución:** Ver `ERRORS_FIX.md` - Sección 3

---

## 📋 Resumen Visual

```
┌─────────────────────────────────────────┐
│        BACKEND (Ya Completado ✅)        │
├─────────────────────────────────────────┤
│ • CORS configurado                      │
│ • Cookie con SameSite=None              │
│ • Middleware de auth correcto           │
│ • Variables de entorno listas           │
└─────────────────────────────────────────┘
                  ↓
            REDEPLOY EN
            RAILWAY
                  ↓
┌─────────────────────────────────────────┐
│      FRONTEND (Necesita Cambios ⚠️)     │
├─────────────────────────────────────────┤
│ • Agregar credentials: 'include'        │
│ • Actualizar llamadas API               │
│ • Revisar .env                          │
│ • Hacer build y deploy                  │
└─────────────────────────────────────────┘
                  ↓
           PRUEBAS FINALES
           (Ver arriba)
```

---

## ✨ Post-Deployment

Una vez que todo funcione:

1. **Documenta lo aprendido** para el equipo
2. **Crea scripts** de testing automático si es posible
3. **Monitorea** errores en los primeros días
4. **Actualiza README.md** con instrucciones de development
5. **Limpia** archivos de debug de la consola del navegador

---

## 📞 Recursos Rápidos

- Railway Dashboard: https://railway.app/dashboard
- GitHub: https://github.com (para ver commits)
- DevTools Documentation: F12 en navegador
- API Test: `CTRL+ALT+R` en Chrome (REST Client)

---

## ✅ Checklist Final

- [ ] Backend código actualizado ✅ 
- [ ] Variables en Railway configuradas
- [ ] Git commit y push realizado
- [ ] Railway deployment completado
- [ ] Frontend código actualizado
- [ ] Frontend build y deploy realizado
- [ ] Pruebas en navegador exitosas
- [ ] No hay errores en Console
- [ ] No hay errores CORS
- [ ] Cookies se guardan correctamente
- [ ] DELETE imagenes funciona sin 401
- [ ] CSS carga correctamente
- [ ] Equipo informado de cambios

