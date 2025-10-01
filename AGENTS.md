# 🤖 AGENTS.md - Reglas y Patrones del Proyecto X-Clone

## 📋 Tabla de Contenidos
- [Arquitectura General](#arquitectura-general)
- [Frontend (React Native + Expo)](#frontend-react-native--expo)
- [Backend (Node.js + Express)](#backend-nodejs--express)
- [Patrones de Código](#patrones-de-código)
- [Gestión de Estado](#gestión-de-estado)
- [Validaciones y Límites](#validaciones-y-límites)
- [Seguridad](#seguridad)
- [Herramientas y Configuración](#herramientas-y-configuración)

---

## 🏗️ Arquitectura General

### Stack Tecnológico
- **Frontend**: React Native + Expo + TypeScript
- **Backend**: Node.js + Express + MongoDB
- **Autenticación**: Clerk
- **Almacenamiento de imágenes**: Cloudinary
- **Estado**: React Query (TanStack Query)
- **Estilos**: NativeWind (Tailwind CSS para React Native)
- **Seguridad**: Arcjet (Rate limiting, Bot detection)

### Estructura de Carpetas
```
mobile/
├── app/                    # Rutas de Expo Router
│   ├── (auth)/            # Rutas de autenticación
│   └── (tabs)/            # Rutas principales con tabs
├── components/            # Componentes reutilizables
├── hooks/                 # Custom hooks
├── types/                 # Definiciones de TypeScript
├── utils/                 # Utilidades y helpers
└── data/                  # Datos mock/estáticos

backend/
├── src/
│   ├── controllers/       # Lógica de negocio
│   ├── models/           # Modelos de Mongoose
│   ├── routes/           # Definiciones de rutas
│   ├── middleware/       # Middleware personalizado
│   └── config/           # Configuraciones
```

---

## 📱 Frontend (React Native + Expo)

### Patrones de Componentes

#### 1. Importaciones Ordenadas
```typescript
// Librerías externas primero
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Hooks y utilidades locales
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { formatDate } from '@/utils/formatters';

// Tipos
import { Post, User } from '@/types';
```

#### 2. SafeAreaView - Regla Crítica
```typescript
// ✅ CORRECTO - Siempre importar desde react-native-safe-area-context
import { SafeAreaView } from 'react-native-safe-area-context';

// ❌ INCORRECTO - NUNCA usar desde react-native
import { SafeAreaView } from 'react-native';
```

#### 3. Estructura de Componentes
```typescript
interface ComponentProps {
  // Props tipadas explícitamente
}

const Component = ({ prop1, prop2 }: ComponentProps) => {
  // Hooks al inicio
  const { data, isLoading } = useQuery();
  const [state, setState] = useState();
  
  // Funciones helper
  const handleAction = () => {
    // Lógica
  };
  
  // Early returns para loading/error
  if (isLoading) return <Loading />;
  if (error) return <Error />;
  
  // JSX principal
  return (
    <SafeAreaView>
      {/* Contenido */}
    </SafeAreaView>
  );
};
```

### Custom Hooks

#### 1. Patrón de API Hooks
```typescript
export const useCustomHook = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['key'],
    queryFn: () => apiCall(api),
    select: (res) => res.data.field,
  });
  
  const mutation = useMutation({
    mutationFn: (data) => apiCall(api, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['key'] });
    },
    onError: (error) => {
      Alert.alert('Error', 'User-friendly message');
    },
  });
  
  return {
    data: data || [],
    isLoading,
    error,
    refetch,
    mutate: mutation.mutate,
    isPending: mutation.isPending,
  };
};
```

#### 2. Gestión de Formularios
```typescript
export const useFormHook = () => {
  const [formData, setFormData] = useState(initialState);
  
  const updateField = (field: string, value: string) => {
    // Solo trimStart() durante la escritura
    setFormData(prev => ({ ...prev, [field]: value.trimStart() }));
  };
  
  const cleanFormData = (data) => {
    // .trim() completo solo al guardar
    return Object.keys(data).reduce((acc, key) => ({
      ...acc,
      [key]: data[key].trim()
    }), {});
  };
  
  const validate = (cleanedData) => {
    // Validaciones después del trim
    if (!cleanedData.requiredField) {
      Alert.alert('Error', 'Field is required');
      return false;
    }
    return true;
  };
  
  const save = () => {
    const cleanedData = cleanFormData(formData);
    if (!validate(cleanedData)) return;
    // Proceder con datos limpios
  };
};
```

### Validaciones de UI

#### 1. Límites de Texto
```typescript
// Para campos de una línea
const limitLines = (text: string, maxLines: number) => {
  const lines = text.split('\n');
  return lines.length > maxLines 
    ? lines.slice(0, maxLines).join('\n') 
    : text;
};

// Para bio con límite visual realista
const limitTextByLinesAndLength = (text: string, maxLines: number, charsPerLine: number) => {
  const limitedByLines = limitLines(text, maxLines);
  const maxChars = maxLines * charsPerLine;
  return limitedByLines.length > maxChars 
    ? limitedByLines.substring(0, maxChars) 
    : limitedByLines;
};
```

#### 2. TextInput Configuración
```typescript
// Campo de una línea
<TextInput
  numberOfLines={1}
  maxLength={30}
  // SIN multiline para campos de una línea
  onChangeText={(text) => handleTextChange('field', text, 1)}
/>

// Campo multilínea
<TextInput
  numberOfLines={3}
  multiline
  textAlignVertical='top'
  onChangeText={(text) => handleTextChange('bio', text, 3, 40)}
/>
```

---

## 🚀 Backend (Node.js + Express)

### Estructura de Controladores

#### 1. Patrón de Controller
```javascript
import AsyncHandler from 'express-async-handler';
import { getAuth } from '@clerk/express';

export const controllerFunction = AsyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  
  // Validaciones de entrada
  if (!requiredField) {
    return res.status(400).json({ message: 'Field is required' });
  }
  
  // Lógica de negocio
  const result = await Model.findOne({ clerkId: userId });
  
  if (!result) {
    return res.status(404).json({ message: 'Not found' });
  }
  
  // Respuesta exitosa
  res.status(200).json({ data: result });
});
```

#### 2. Manejo de Imágenes (Cloudinary)
```javascript
// Patrón para subida de imágenes
if (req.file) {
  try {
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: 'social_media_posts',
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto' },
        { format: 'auto' },
      ],
    });
    
    imageUrl = uploadResponse.secure_url;
  } catch (cloudinaryError) {
    // Fallback o manejo de error
  }
}
```

### Modelos (MongoDB + Mongoose)

#### 1. Consistencia de Campos
```javascript
// ✅ SIEMPRE usar 'profilePicture' (no profileImage)
const userSchema = new mongoose.Schema({
  profilePicture: {
    type: String,
    default: '',
  },
  // Otros campos...
});
```

#### 2. Poblado de Referencias
```javascript
// Patrón para populate anidado
const posts = await Post.find()
  .populate('user', 'username firstName lastName profilePicture')
  .populate({
    path: 'comments',
    populate: {
      path: 'user',
      select: 'username firstName lastName profilePicture',
    }
  });
```

---

## 🔄 Gestión de Estado

### React Query Patterns

#### 1. Query Keys Consistentes
```typescript
// Usar arrays para query keys
queryKey: ['posts']                    // Posts generales
queryKey: ['userPosts', username]      // Posts específicos de usuario
queryKey: ['currentUser']              // Usuario actual
queryKey: ['notifications']            // Notificaciones
```

#### 2. Invalidación de Cache
```typescript
// Invalidar múltiples queries relacionadas
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['posts'] });
  queryClient.invalidateQueries({ queryKey: ['userPosts', username] });
  queryClient.invalidateQueries({ queryKey: ['currentUser'] });
}
```

---

## ✅ Validaciones y Límites

### Límites de Caracteres
```typescript
// Límites estándar del proyecto
const LIMITS = {
  firstName: 30,
  lastName: 30,
  username: 20,
  bio: 120,           // 3 líneas × 40 chars
  location: 40,
  postContent: 280,   // Límite tipo Twitter
  commentContent: 280,
};
```

### Validación de Entrada
```typescript
// Patrón de validación
const validateInput = (data) => {
  // Limpiar primero
  const cleaned = Object.keys(data).reduce((acc, key) => ({
    ...acc,
    [key]: data[key].trim()
  }), {});
  
  // Validar después
  const errors = [];
  if (!cleaned.requiredField) errors.push('Required field missing');
  
  return { isValid: errors.length === 0, errors, cleanedData: cleaned };
};
```

---

## 🔒 Seguridad

### Middleware de Autenticación
```javascript
// Patrón de protección de rutas
export const protectRoute = async (req, res, next) => {
  if (!req.auth().isAuthenticated) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};
```

### Headers de Seguridad
```typescript
// Headers requeridos para móvil
const api = axios.create({
  headers: {
    "User-Agent": "X-Clone-Mobile",
    "X-Arcjet-Allow": "mobile-app",
    "X-App-Platform": Platform.OS,
    "X-App-Version": "1.0.0",
  }
});
```

---

## 🛠️ Herramientas y Configuración

### Git y Versionado

#### 1. Estructura de Branches
```bash
main                    # Rama principal
feature/nombre         # Nuevas características
fix/problema          # Correcciones de bugs
edit-Profile          # Ejemplo de rama específica
```

#### 2. Commits Limpios
```bash
# Antes de sincronizar con main
git status              # Verificar cambios
git add .              # Agregar cambios
git commit -m "Descriptive message"
git pull origin main   # Sincronizar
```

### Debugging y Logs

#### 1. ❌ NO HACER - Console.log de Imágenes
```typescript
// ❌ NUNCA hacer esto
console.log(post.user.profilePicture);
console.log("Image URL:", imageUrl);
```

#### 2. ✅ Logs Útiles
```typescript
// ✅ Logs informativos apropiados
console.log("User synced successfully:", response.data.message);
console.error("API Error:", error.response?.data?.message);
```

---

## 📝 Reglas de Código Limpio

### 1. Naming Conventions
- **Componentes**: PascalCase (`PostCard`, `EditProfileModal`)
- **Hooks**: camelCase con prefijo `use` (`useCurrentUser`, `useUserPosts`)
- **Variables**: camelCase (`isLoading`, `userPosts`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_FILE_SIZE`)

### 2. File Organization
- Un componente por archivo
- Exports default al final
- Imports organizados por tipo
- Interfaces antes del componente

### 3. Error Handling
```typescript
// UI: Siempre mostrar mensajes amigables
Alert.alert('Error', 'User-friendly message');

// Backend: Logs detallados para debugging
console.error('Detailed error for debugging:', error);
```

### 4. Performance
- Usar `React.memo` para componentes que re-renderizan frecuentemente
- Lazy loading para pantallas grandes
- Optimizar imágenes con Cloudinary transformations
- Cache con React Query para datos remotos

---

## 🚨 Reglas Críticas

### ❌ NUNCA HACER:
1. Importar `SafeAreaView` desde `'react-native'`
2. Console.log de URLs de imágenes en producción
3. Usar `profileImage` (siempre `profilePicture`)
4. Trim en tiempo real en formularios (solo al guardar)
5. Commits directos a `main` sin PR

### ✅ SIEMPRE HACER:
1. Validar entrada de usuario antes de enviar al backend
2. Manejar estados de loading y error en UI
3. Invalidar cache apropiadamente después de mutaciones
4. Usar tipos de TypeScript para todas las interfaces
5. Testear en dispositivos reales antes de hacer commit

---

## 📚 Documentación Adicional

Para más detalles sobre implementaciones específicas, revisar:
- `/mobile/hooks/` - Custom hooks patterns
- `/backend/src/controllers/` - API endpoint patterns
- `/mobile/components/` - UI component patterns
- `/mobile/types/` - TypeScript definitions

---

**Última actualización**: Octubre 2025
**Proyecto**: X-Clone (React Native + Node.js)
**Mantenido por**: Equipo de desarrollo