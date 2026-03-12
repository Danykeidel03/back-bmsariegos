# TODO - TODOS LOS CAMBIOS A REALIZAR

**Generado:** 2026-03-12  
**Estado:** En desarrollo  
**Total de tareas:** 22

---

## 📋 ÍNDICE RÁPIDO

- [🚨 CRÍTICOS (3)](#críticos-p0)
- [🔴 ALTOS (5)](#altos-p1)
- [🟡 MEDIOS (4)](#medios-p2)
- [🟢 BAJOS (5)](#bajos-p3)
- [⚙️ FUNCIONALIDADES (5)](#funcionalidades-p4)

---

## 🚨 CRÍTICOS (P0)

### ✅ 1. Credenciales Cloudinary Expuestas
**Estado:** DONE  
**Severidad:** P0  
**Rama:** `hotfix/critical-security-fixes`

- [x] Mover credenciales a `.env`
- [x] Actualizar `src/config/cloudinary.js` para usar `process.env`
- [x] Verificar que `.env` está en `.gitignore`
- [ ] Regenerar credenciales en Cloudinary (manual)
- [ ] Verificar que uploads siguen funcionando

**Commit:** `fix: move Cloudinary credentials to environment variables`

---

### ✅ 2. CORS Completamente Roto
**Estado:** DONE  
**Severidad:** P0  
**Rama:** `hotfix/critical-security-fixes`

- [x] Fijar lógica CORS en `src/app.js` (rechazar orígenes no autorizados)
- [x] Cambiar `callback(null, true)` a `callback(new Error(...))` en else
- [ ] Verificar que CORS bloquea orígenes no autorizados
- [ ] Probar con curl o Postman

**Commit:** `fix: enforce CORS policy to reject unauthorized origins`

**Verificar:**
```bash
# Debe ser rechazado
curl -H "Origin: https://malicious.com" -v http://localhost:3005/health

# Debe funcionar
curl -H "Origin: http://localhost:3000" -v http://localhost:3005/health
```

---

### ✅ 3. JWT_SECRET Débil
**Estado:** DONE  
**Severidad:** P0  
**Ubicación:** `.env`

- [x] Generar JWT_SECRET fuerte (256-bit crypto)
- [x] Actualizar `.env` con nuevo secret
- [ ] Verificar que JWT tokens siguen siendo válidos
- [ ] Documentar que se debe cambiar en producción

**Comando:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Nota:** Cambio en `.env` (no commiteable), se actualiza manualmente en producción.

---

## 🔴 ALTOS (P1)

### 4. Validación de Email Débil
**Estado:** PENDIENTE  
**Severidad:** P1  
**Ubicación:** `src/validations/` (crear si no existe)

**Problema:**
```javascript
// ❌ ACTUAL - Solo busca "@"
if (typeof mail !== 'string' || !mail.includes('@')) {
    return res.status(400).json({ error: 'Email no válido' });
}
```

**Solución:**
- Usar `express-validator` para validar emails
- Aplicar a todas las rutas que reciben emails
- Normalizar emails (lowercase)

**Archivos a revisar:**
- `src/routes/userManage.js` - POST /user/register
- Cualquier otro endpoint que acepte emails

**Checklist:**
- [ ] Crear archivo `src/validations/userValidations.js`
- [ ] Implementar validación con `express-validator`
- [ ] Aplicar a rutas POST de usuarios
- [ ] Tests para validaciones

---

### 5. N+1 Queries en MongoDB
**Estado:** PENDIENTE  
**Severidad:** P1  
**Ubicación:** Controllers (múltiples)

**Problema:**
```javascript
// ❌ MALO - Loop dentro de query
const teams = await Team.find();
for (let team of teams) {
    team.players = await Player.find({ teamId: team._id });
}
```

**Solución:**
- Usar `.populate()` de Mongoose
- Usar `Promise.all()` para parallelizar
- Usar aggregation pipelines si es complejo

**Archivos a revisar:**
- `src/controllers/teamController.js`
- `src/controllers/matchController.js`
- `src/controllers/userController.js`
- Buscar patterns de loops con queries dentro

**Checklist:**
- [ ] Auditar todos los controllers para N+1
- [ ] Usar `.populate()` donde sea posible
- [ ] Usar aggregation para casos complejos
- [ ] Documentar índices necesarios en MongoDB

---

### 6. Endpoints sin Autenticación
**Estado:** PENDIENTE  
**Severidad:** P1  
**Ubicación:** `src/routes/`

**Problema:**
Algunos endpoints administrativos (DELETE, PUT en usuarios/equipos) no requieren JWT

**Solución:**
- Aplicar middleware de autenticación a rutas sensibles
- Verificar que operaciones destructivas requieren auth
- Implementar roles/permisos si no existen

**Checklist:**
- [ ] Auditar todas las rutas en `src/routes/`
- [ ] Proteger endpoints DELETE y PUT
- [ ] Proteger endpoints administrativos
- [ ] Documentar autenticación requerida por endpoint

**Middleware existente:**
```javascript
// Usar en rutas protegidas
const authMiddleware = require('../middlewares/authMiddleware');
router.delete('/:id', authMiddleware, controller.delete);
```

---

### 7. Rutas sin Validación de Input
**Estado:** PENDIENTE  
**Severidad:** P1  
**Ubicación:** `src/routes/` y `src/controllers/`

**Problema:**
No todos los inputs se validan en servidor antes de usar

**Solución:**
- Validar todos los inputs con `express-validator`
- Sanitizar datos antes de guardar
- Revisar tipos de dato esperados

**Checklist:**
- [ ] Crear validaciones para cada ruta
- [ ] Aplicar middleware de validación
- [ ] Sanitizar datos sensibles (emails, URLs)
- [ ] Tests para validaciones

---

## 🟡 MEDIOS (P2)

### 8. Logging Pobre
**Estado:** PENDIENTE  
**Severidad:** P2  
**Ubicación:** `src/middlewares/` y controllers

**Problema:**
- Logs inconsistentes
- No hay niveles de log (debug, info, warn, error)
- Mucho `console.log()` directo

**Solución:**
- Usar librería como `winston` o `pino`
- Estruturar logs (timestamp, level, mensaje, contexto)
- No loguear datos sensibles

**Checklist:**
- [ ] Crear logger centralizado
- [ ] Reemplazar `console.log()` con logger
- [ ] Configurar niveles por ambiente
- [ ] Documentar qué se loguea y qué no

---

### 9. Cache sin Límite de Memoria
**Estado:** PENDIENTE  
**Severidad:** P2  
**Ubicación:** Si hay caché implementado

**Problema:**
Caché indefinida sin TTL causa memory leaks

**Solución:**
- Implementar TTL (Time To Live)
- Limitar tamaño máximo de caché
- Invalidar caché al actualizar datos

**Checklist:**
- [ ] Auditar si hay caché implementado
- [ ] Agregar TTL a cachés existentes
- [ ] Documentar estrategia de invalidación

---

### 10. Respuestas API Inconsistentes
**Estado:** PENDIENTE  
**Severidad:** P2  
**Ubicación:** `src/controllers/`

**Problema:**
Diferentes endpoints retornan formatos diferentes

**Solución:**
```javascript
// ✅ ESTÁNDAR
{
  status: 'success' | 'error',
  statusCode: number,
  data: {},
  message: string,
  timestamp: ISO string,
  errors?: []
}
```

**Checklist:**
- [ ] Crear utility para respuestas consistentes
- [ ] Auditar todos los endpoints
- [ ] Actualizar controllers para usar utility
- [ ] Documentar formato de respuesta API

---

### 11. Código Duplicado Masivo
**Estado:** PENDIENTE  
**Severidad:** P2  
**Ubicación:** `src/controllers/`

**Problema:**
Funciones comunes repetidas en múltiples controllers

**Solución:**
- Extraer lógica común a servicios
- Usar herencia o composición
- Crear helpers/utils compartidos

**Checklist:**
- [ ] Auditar controllers para duplicación
- [ ] Crear `src/services/` para lógica común
- [ ] Refactorizar controllers para usar servicios
- [ ] Documentar patrones de código

---

## 🟢 BAJOS (P3)

### 12. Typos y Nombres Confusos
**Estado:** PENDIENTE  
**Severidad:** P3  
**Ubicación:** Código general

**Problema:**
Variables y funciones con nombres poco descriptivos

**Checklist:**
- [ ] Buscar typos comunes
- [ ] Renombrar variables genéricas (data, temp, etc)
- [ ] Usar nombres en inglés o español consistentemente

---

### 13. Comentarios Obvios
**Estado:** PENDIENTE  
**Severidad:** P3  
**Ubicación:** Código general

**Problema:**
Comentarios que solo repiten el código

```javascript
// ❌ MALO
i++; // incrementar i

// ✅ BUENO
// Avanzar al siguiente usuario si el actual está inactivo
i++;
```

**Checklist:**
- [ ] Limpiar comentarios obvios
- [ ] Agregar comentarios para lógica compleja

---

### 14. Indentación Inconsistente
**Estado:** PENDIENTE  
**Severidad:** P3  
**Ubicación:** Código general

**Solución:**
- Usar Prettier para formatear automáticamente
- Configurar ESLint

**Checklist:**
- [ ] Instalar y configurar Prettier
- [ ] Ejecutar `prettier --write .`
- [ ] Agregar pre-commit hook

---

### 15. Variables Mágicas (números hardcodeados)
**Estado:** PENDIENTE  
**Severidad:** P3  
**Ubicación:** `src/controllers/`

**Problema:**
```javascript
// ❌ MALO
if (age > 18) { }
const limit = 100;

// ✅ BUENO
const LEGAL_AGE = 18;
const DEFAULT_PAGE_LIMIT = 100;
```

**Checklist:**
- [ ] Identificar números mágicos
- [ ] Mover a constantes con nombres descriptivos
- [ ] Centralizar configuración

---

### 16. Sin Manejo de Errores en Async
**Estado:** PENDIENTE  
**Severidad:** P3  
**Ubicación:** `src/controllers/`

**Problema:**
Promises no siempre tienen `.catch()`

**Solución:**
- Usar try/catch en async/await
- Agregar error handler middleware

**Checklist:**
- [ ] Revisar todos los async/await
- [ ] Agregar try/catch donde falta
- [ ] Testar error cases

---

## ⚙️ FUNCIONALIDADES (P4)

### 17. Tests Faltando
**Estado:** PENDIENTE  
**Severidad:** P4  
**Ubicación:** `tests/` o `__tests__/`

**Checklist:**
- [ ] Crear estructura de tests
- [ ] Instalar Jest o Mocha
- [ ] Escribir tests para controllers principales
- [ ] Configurar code coverage
- [ ] Agregar `npm test` a package.json

---

### 18. Documentación Incompleta
**Estado:** PENDIENTE  
**Severidad:** P4  
**Ubicación:** Documentación general

**Checklist:**
- [ ] Actualizar README.md con instrucciones
- [ ] Documentar setup de desarrollo
- [ ] Documentar variables de entorno
- [ ] Crear API documentation (Swagger)

---

### 19. Sin HTTPS en Producción
**Estado:** PENDIENTE  
**Severidad:** P4  
**Ubicación:** Configuración de deployment

**Checklist:**
- [ ] Configurar HTTPS en producción
- [ ] Usar certificados válidos (Let's Encrypt)
- [ ] Redirigir HTTP a HTTPS
- [ ] Configurar HSTS headers

---

### 20. Conexión a BD sin Retry
**Estado:** PENDIENTE  
**Severidad:** P4  
**Ubicación:** `src/config/database.js`

**Checklist:**
- [ ] Agregar retry logic para conexión MongoDB
- [ ] Configurar timeouts
- [ ] Documentar fallback

---

### 21. No hay Health Checks
**Estado:** PENDIENTE  
**Severidad:** P4  
**Ubicación:** Ya existe `/health` endpoint

**Checklist:**
- [x] Health check endpoint existe (`/health`)
- [ ] Revisar BD en health check
- [ ] Documentar health check

---

### 22. Dependencias sin Auditoría
**Estado:** PENDIENTE  
**Severidad:** P4  
**Ubicación:** `package.json`

**Checklist:**
- [ ] Ejecutar `npm audit`
- [ ] Actualizar dependencias vulnerables
- [ ] Documentar versiones pinned

---

## 📊 RESUMEN DE PROGRESO

```
┌─────────────────────────────────────────┐
│ CRÍTICOS (P0)    ███░░░░░░░░  3/3  100% │
│ ALTOS (P1)       ░░░░░░░░░░░  0/5    0% │
│ MEDIOS (P2)      ░░░░░░░░░░░  0/5    0% │
│ BAJOS (P3)       ░░░░░░░░░░░  0/5    0% │
│ FUNCIONALIDADES  ░░░░░░░░░░░  0/5    0% │
├─────────────────────────────────────────┤
│ TOTAL            ███░░░░░░░░  3/22  14% │
└─────────────────────────────────────────┘
```

---

## 🔄 PRÓXIMOS PASOS

### Inmediato (Hoy)
- [x] Mergear rama `hotfix/critical-security-fixes`
- [ ] Actualizar `.env` en producción con nuevas credenciales
- [ ] Regenerar Cloudinary API key

### Corto Plazo (Esta semana)
- [ ] Implementar validaciones (P1 #4)
- [ ] Auditar y fijar N+1 queries (P1 #5)
- [ ] Proteger endpoints sin auth (P1 #6)

### Mediano Plazo (Este mes)
- [ ] Implementar logging centralizado (P2 #8)
- [ ] Estandarizar respuestas API (P2 #10)
- [ ] Refactorizar código duplicado (P2 #11)
- [ ] Agregar tests (P4 #17)

### Largo Plazo (Próximo mes)
- [ ] Documentación completa (P4 #18)
- [ ] HTTPS en producción (P4 #19)
- [ ] Auditoría de dependencias (P4 #22)

---

## 📝 NOTAS

- Cada tarea tiene un número para referenciarla en commits
- Los cambios seguirán el workflow de ramas y commits atómicos
- Se documentarán en CHANGELOG.md
- Se creará una rama por cada tarea o grupo de tareas relacionadas

**Última actualización:** 2026-03-12 14:00 UTC
