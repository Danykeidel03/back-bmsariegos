# 📝 Ejemplos de Código Frontend Actualizado

## Para Trabajar con la API del Backend Correctamente

---

## 1. Configuración Global con Axios

Si usas Axios, crea un archivo de configuración:

```javascript
// src/api/axiosConfig.js o similar
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://back-bmsariegos-production.up.railway.app';

// Crear instancia de Axios con configuración global
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,  // ✅ IMPORTANTE: Incluir cookies en todas las peticiones
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para logging (opcional)
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            console.error('No autorizado - token expirado o inválido');
            // Redirigir a login si es necesario
        }
        return Promise.reject(error);
    }
);

export default apiClient;
```

**Uso:**
```javascript
import apiClient from './api/axiosConfig';

// Todas las peticiones usarán withCredentials: true automáticamente
apiClient.delete('/imagenes-cabecera/id').catch(err => {
    if (err.response?.status === 401) console.log('No autorizado');
});
```

---

## 2. Operaciones de Login

```javascript
// src/services/authService.js
import apiClient from './api/axiosConfig';

export const loginUser = async (email, password) => {
    try {
        const response = await apiClient.post('/user/login', {
            mail: email,
            pass: password
        });
        
        // La cookie 'token' se guarda automáticamente
        console.log('✅ Login exitoso:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error al login:', error.response?.data);
        throw error;
    }
};
```

---

## 3. Operaciones de Imágenes

### Obtener Imágenes (GET)
```javascript
export const getImagenesCabecera = async () => {
    try {
        const response = await apiClient.get('/imagenes-cabecera');
        return response.data;
    } catch (error) {
        console.error('Error al obtener imágenes:', error);
        throw error;
    }
};
```

### Subir Imagen (POST)
```javascript
export const uploadImagenCabecera = async (imageFile, urlImagen = null) => {
    try {
        const formData = new FormData();
        formData.append('photo', imageFile);
        if (urlImagen) {
            formData.append('urlImagen', urlImagen);
        }
        
        const response = await apiClient.post('/imagenes-cabecera', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        console.log('✅ Imagen subida:', response.data);
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            alert('No tienes permiso. Por favor inicia sesión');
        } else if (error.response?.data?.code === 11002) {
            alert('Máximo 4 imágenes permitidas');
        }
        throw error;
    }
};
```

### Eliminar Imagen (DELETE) - ⚠️ REQUIERE AUTENTICACIÓN
```javascript
export const deleteImagenCabecera = async (imageId) => {
    try {
        const response = await apiClient.delete(`/imagenes-cabecera/${imageId}`);
        console.log('✅ Imagen eliminada:', response.data);
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            console.error('❌ No autorizado - verifica que has iniciado sesión');
            alert('Debes iniciar sesión para eliminar imágenes');
        } else if (error.response?.status === 404) {
            console.error('❌ Imagen no encontrada');
        }
        throw error;
    }
};
```

---

## 4. Usando Fetch API (sin Axios)

Si prefieres no usar Axios:

```javascript
// src/services/fetchService.js

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://back-bmsariegos-production.up.railway.app';

export const fetchAPI = async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: 'include',  // ✅ IMPORTANTE: Incluir cookies
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en la API');
    }

    return response.json();
};

// Uso:
export const deleteImagenCabecera = (imageId) => {
    return fetchAPI(`/imagenes-cabecera/${imageId}`, {
        method: 'DELETE'
    });
};

export const loginUser = (email, password) => {
    return fetchAPI('/user/login', {
        method: 'POST',
        body: JSON.stringify({
            mail: email,
            pass: password
        })
    });
};
```

---

## 5. Component de Login (React Ejemplo)

```jsx
// src/components/LoginForm.jsx
import { useState } from 'react';
import apiClient from '../api/axiosConfig';

export default function LoginForm({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await apiClient.post('/user/login', {
                mail: email,
                pass: password
            });

            console.log('✅ Login exitoso');
            // La cookie 'token' se guarda automáticamente
            
            if (onLoginSuccess) {
                onLoginSuccess(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Error al iniciar sesión');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" disabled={loading}>
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
        </form>
    );
}
```

---

## 6. Component de Galería (React Ejemplo)

```jsx
// src/components/GaleriaImagenes.jsx
import { useEffect, useState } from 'react';
import apiClient from '../api/axiosConfig';

export default function GaleriaImagenes() {
    const [imagenes, setImagenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        cargarImagenes();
    }, []);

    const cargarImagenes = async () => {
        try {
            const response = await apiClient.get('/imagenes-cabecera');
            setImagenes(response.data.data || []);
        } catch (err) {
            setError('Error al cargar imágenes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = async (imageId) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
            return;
        }

        try {
            await apiClient.delete(`/imagenes-cabecera/${imageId}`);
            console.log('✅ Imagen eliminada');
            cargarImagenes(); // Recargar lista
        } catch (err) {
            if (err.response?.status === 401) {
                alert('Debes iniciar sesión para eliminar imágenes');
            } else {
                alert('Error al eliminar la imagen');
            }
            console.error(err);
        }
    };

    if (loading) return <p>Cargando imágenes...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="galeria">
            {imagenes.map((imagen) => (
                <div key={imagen._id} className="imagen-item">
                    <img 
                        src={imagen.urlImagen || imagen.foto} 
                        alt="Imagen cabecera"
                        loading="lazy"
                    />
                    <button 
                        onClick={() => handleEliminar(imagen._id)}
                        className="btn-eliminar"
                    >
                        Eliminar
                    </button>
                </div>
            ))}
        </div>
    );
}
```

---

## 7. Verificar Estado de Autenticación

```javascript
export const checkAuthStatus = async () => {
    try {
        // Una petición que requiera autenticación
        const response = await apiClient.get('/user/profile'); // Ajusta según tu endpoint
        return { isAuthenticated: true, user: response.data };
    } catch (error) {
        if (error.response?.status === 401) {
            return { isAuthenticated: false };
        }
        throw error;
    }
};
```

---

## 8. Variables de Entorno (.env)

Crea un archivo `.env` en la raíz de tu proyecto frontend:

```env
# .env (desarrollo)
REACT_APP_API_URL=http://localhost:3005

# .env.production (producción)
REACT_APP_API_URL=https://back-bmsariegos-production.up.railway.app
```

---

## 🧪 Checklist de Verificación

- [ ] Todas las peticiones a `/imagenes-cabecera` usan `credentials: 'include'`
- [ ] Todas las peticiones a endpoints protegidos se hacen DESPUÉS del login
- [ ] El login se ejecuta y guarda la cookie automáticamente
- [ ] En DevTools → Network, la cookie `token` aparece en los headers
- [ ] En DevTools → Console, no hay errores de CORS o SameSite
- [ ] Las peticiones DELETE devuelven 200 en lugar de 401

---

## 💡 Tips de Debugging

```javascript
// Ver cookies actuales en el navegador
console.log('Cookies:', document.cookie);

// Verificar un header específico (en DevTools → Network)
// Click en una petición → Headers → Cookie

// Test de petición protegida
fetch('https://back-bmsariegos-production.up.railway.app/imagenes-cabecera', {
    credentials: 'include'
}).then(r => r.json()).then(console.log);
```

