# Diagnóstico y Soluciones - Errores en Consola del Navegador

## 📋 Resumen de Problemas Encontrados

Se encontraron 4 errores principales en la aplicación:

---

## 1. ❌ "La hoja de estilos CSS no se ha cargado - MIME type text/html"

### Problema
```
La hoja de estilos https://www.balonmanosariegos.com/src/App.css no se ha cargado 
porque su tipo MIME, "text/html", no es "text/css".
```

### Causa
El servidor web está sirviendo el archivo CSS como HTML (probablemente un error 404 o redirect que devuelve HTML).

### Solución Frontend
Verifica en tu servidor web (Apache/Nginx):

**Para Apache (.htaccess):**
```apache
# En la raíz o en el directorio /src
<IfModule mod_mime.c>
    AddType text/css .css
    AddType application/javascript .js
    AddType image/webp .webp
</IfModule>
```

**Para Nginx:**
```nginx
location ~* \.css$ {
    add_header Content-Type text/css;
    expires 30d;
}

location ~* \.webp$ {
    add_header Content-Type image/webp;
    expires 30d;
}
```

**Alternativa - Verifica la ruta:**
- ¿El archivo existe en: `public/src/App.css` o `src/App.css`?
- ¿La URL en el HTML es correcta? Debe ser relativa o absoluta correctamente.

---

## 2. ⚠️ Cookie "token" rechazada por SameSite en contexto CORS

### Problema
```
La cookie "token" ha sido rechazada porque se encuentra en un contexto de sitios 
cruzados y su "SameSite" es "Lax" o "Strict".
```

### Causa
La cookie estaba configurada con `sameSite: "Strict"` que rechaza cookies en peticiones CORS.

### ✅ Solución Implementada en Backend
He actualizado el archivo `src/controllers/userController.js`:

**Antes:**
```javascript
res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "Strict",  // ❌ Rechaza CORS
    maxAge: 3600000,
    path: "/",
});
```

**Ahora:**
```javascript
res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,  // true en HTTPS producción
    sameSite: isProduction ? "None" : "Lax",  // ✅ "None" para CORS en HTTPS
    maxAge: 3600000,
    path: "/",
});
```

### ¿Qué debes hacer en el Frontend?
Cuando hagas peticiones DELETE/PUT/POST a la API, asegúrate de incluir:

**Fetch API:**
```javascript
fetch('https://back-bmsariegos-production.up.railway.app/imagenes-cabecera/id', {
    method: 'DELETE',
    credentials: 'include',  // ✅ Importante: envía cookies
    headers: {
        'Content-Type': 'application/json',
    }
})
```

**Axios:**
```javascript
axios.delete('https://back-bmsariegos-production.up.railway.app/imagenes-cabecera/id', {
    withCredentials: true  // ✅ Importante: envía cookies
})
```

---

## 3. ⏱️ Preload de slider1.webp no se usa

### Problema
```
El recurso en "slider1.webp" precargado con precarga de enlace no se usó 
en unos pocos segundos.
```

### Causa
El navegador descarga el archivo porque tiene `<link rel="preload">` pero se carga muy lentamente o no se usa en los primeros segundos.

### Solución Frontend
En tu HTML, verifica:

```html
<!-- Asegúrate que el archivo existe y la ruta es correcta -->
<link rel="preload" as="image" href="/slider1.webp" type="image/webp">

<!-- Úsalo poco después en el CSS o HTML -->
<img src="/slider1.webp" alt="Slider" loading="lazy">
```

**Optimizaciones:**
```html
<!-- Mejor: especifica el tamaño para evitar layout shift -->
<img src="/slider1.webp" alt="Slider" loading="lazy" width="1200" height="600">

<!-- O con picture para responsive -->
<picture>
    <source srcset="/slider1.webp" type="image/webp">
    <img src="/slider1.jpg" alt="Slider" loading="lazy">
</picture>
```

---

## 4. 🔐 Error 401 DELETE imagenes-cabecera

### Problema
```
DELETE https://back-bmsariegos-production.up.railway.app/imagenes-cabecera/690b7324ba7f36ed61fa8072
[HTTP/2 401]
```

### Causa
El token no se está enviando en la cookie o no se está autenticando correctamente.

### ✅ Soluciones

**1. Frontend - Asegura que envías cookies:**
```javascript
// Fetch
const response = await fetch(
    'https://back-bmsariegos-production.up.railway.app/imagenes-cabecera/id',
    {
        method: 'DELETE',
        credentials: 'include',  // ✅ OBLIGATORIO
        headers: {
            'Content-Type': 'application/json'
        }
    }
);

// Axios
const response = await axios.delete(
    'https://back-bmsariegos-production.up.railway.app/imagenes-cabecera/id',
    {
        withCredentials: true  // ✅ OBLIGATORIO
    }
);
```

**2. Backend - Verifica las variables de entorno:**
```bash
# En Railway, asegúrate que tienes configuradas:
ALLOWED_ORIGINS=https://www.balonmanosariegos.com,https://admin.balonmanosariegos.com
JWT_SECRET=tu_clave_segura_aqui
NODE_ENV=production
```

**3. Backend - Verifica que el middleware de autenticación está correcto:**
El archivo `src/routes/imagenCabeceraManage.js` ya tiene:
```javascript
router.delete('/:id', authMiddleware.verificarToken, imagenCabeceraController.deleteImagenCabeceraController);
```
✅ Esto es correcto.

---

## 🛠️ Checklist de Verificación

### Backend (ya corregido ✅)
- [x] Cookie token configurada con `sameSite: "None"` para CORS en producción
- [x] CORS habilitado con credenciales
- [x] Variables de entorno configuradas
- [ ] **Redeploy necesario en Railway**

### Frontend (necesita cambios)
- [ ] Usar `credentials: 'include'` en fetch o `withCredentials: true` en axios
- [ ] Asegurar que `ALLOWED_ORIGINS` incluye el dominio frontend exacto
- [ ] Verificar que el MIME type de CSS es correcto
- [ ] Verificar que las imágenes precargadas se usan rápidamente

### Servidor Web (Apache/Nginx)
- [ ] Configurar MIME types correctos para CSS, JS, WEBP
- [ ] Habilitar compresión GZIP
- [ ] Configurar caché headers
- [ ] Asegurar redirección a HTTPS

---

## 🚀 Próximos Pasos

1. **Redeploy del Backend en Railway** después de estos cambios
2. **Actualiza el Frontend** para usar `credentials: 'include'`
3. **Verifica las variables de entorno** en Railway:
   ```
   ALLOWED_ORIGINS = https://www.balonmanosariegos.com,https://admin.balonmanosariegos.com
   NODE_ENV = production
   JWT_SECRET = [tu clave segura]
   ```
4. **Prueba en navegador:**
   - Abre DevTools (F12)
   - Ve a Console
   - Los errores de cookie y 401 deberían desaparecer
   - El CSS debe cargar correctamente

---

## 📞 Recursos Útiles

- [MDN: SameSite Cookie Attribute](https://developer.mozilla.org/es/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [MDN: CORS y Cookies](https://developer.mozilla.org/es/docs/Web/HTTP/CORS#credenciales_incluidas_en_peticiones_http)
- [Express Cookie Parser](https://expressjs.com/en/resources/middleware/cookie-parser.html)

