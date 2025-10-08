# 🏆 Scraper de Clasificación - BM Sariegos

## 📋 Descripción
Sistema de scraping para obtener múltiples clasificaciones, una por cada equipo en la base de datos.

## 🚀 Endpoints Disponibles

### 1. Obtener Todas las Clasificaciones
```
GET /api/clasificaciones
```
**Respuesta:**
```json
{
  "status": 200,
  "message": "Todas las clasificaciones obtenidas exitosamente",
  "data": {
    "teamId1": {
      "teamName": "FISIOPAT BM. SARIEGOS",
      "category": "Senior",
      "division": "Primera",
      "clasificacion": [...]
    }
  }
}
```

### 2. Obtener Clasificación por Equipo
```
GET /api/clasificacion/:teamId
```

### 3. Actualizar URL de Clasificación
```
PUT /team/:id/clasificacion-url
```
**Body:**
```json
{
  "clasificacionUrl": "https://resultadosbalonmano.isquad.es/clasificacion.php?..."
}
```

## ⚡ Características

- **Caché inteligente**: Los datos se almacenan en caché por 30 minutos
- **Manejo de errores**: Respuestas de respaldo si falla el scraping
- **Datos limpios**: Parseo inteligente de la información
- **Timeout**: 10 segundos máximo por petición

## 🔧 Uso en Frontend

```javascript
// Obtener clasificación
const getClasificacion = async () => {
  try {
    const response = await fetch('/api/clasificacion');
    const data = await response.json();
    return data.data; // Array de equipos
  } catch (error) {
    console.error('Error:', error);
  }
};

// Refrescar datos
const refreshClasificacion = async () => {
  try {
    const response = await fetch('/api/clasificacion/refresh', {
      method: 'POST'
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## 📊 Estructura de Datos

Cada equipo contiene:
- `posicion`: Posición en la tabla
- `nombre`: Nombre del equipo
- `puntos`: Puntos totales
- `partidosJugados`: Partidos jugados
- `ganados`: Partidos ganados
- `empatados`: Partidos empatados
- `perdidos`: Partidos perdidos

## 🛠️ Configuración

La URL de scraping está configurada en:
`src/services/scrapingService.js`

Para cambiar la competición, modifica la variable `FEDERATION_URL`.