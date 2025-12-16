# 📱 X-Clone (Twitter Clone)

[English](#english) | [Español](#español)

---

<a name="english"></a>

## 🇬🇧 English

### 📖 Description

X-Clone is a full-stack social media mobile application that replicates the core features of Twitter/X. Built with React Native and Node.js, it allows users to share posts, follow others, interact through likes and comments, and stay connected through real-time notifications.

### 🎯 Problem it Solves

- **Social Connection**: Connect and interact with other users through follows and engagement
- **Content Sharing**: Share thoughts, ideas, and multimedia content with your network
- **Real-time Interaction**: Like, comment, and engage with posts in real-time
- **Discovery**: Find new content and users through hashtag search and trending topics
- **Profile Management**: Customize your presence with profile pictures, banners, and bio
- **Learning Platform**: Complete full-stack project for learning modern mobile and backend development

### 🛠️ Technologies Used

#### Mobile Frontend

- **React Native** - Cross-platform native mobile framework
- **Expo** (SDK 52) - Development platform and build tools
- **TypeScript** - Static typing for JavaScript
- **Expo Router** - File-based routing system
- **NativeWind** - Tailwind CSS for React Native
- **TanStack Query (React Query)** v5 - Server state management and caching
- **Clerk** - Authentication and user management
- **Axios** - HTTP client for API requests
- **date-fns** - Date formatting and manipulation
- **@expo/vector-icons** (Feather) - Icon library
- **expo-image-picker** - Image selection from gallery/camera
- **expo-image-manipulator** - Image editing and manipulation
- **react-native-popup-menu** - Contextual menus
- **react-native-safe-area-context** - Safe area handling

#### Backend API

- **Node.js** - JavaScript runtime
- **Express** - Minimalist web framework
- **MongoDB + Mongoose** - NoSQL database with ODM
- **Clerk** (`@clerk/express`) - Authentication middleware
- **Cloudinary** - Cloud-based image storage and CDN
- **Arcjet** - Rate limiting and bot protection
- **CORS** - Cross-Origin Resource Sharing
- **Multer** - Multipart/form-data file upload handling
- **express-async-handler** - Async error handling

#### Deployment & Services

- **Vercel** - Backend serverless hosting
- **MongoDB Atlas** - Cloud database
- **Cloudinary CDN** - Global image delivery
- **Clerk** - Cloud authentication service

### 📋 Prerequisites

**Backend:**

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Clerk account
- Arcjet account (optional, for security features)

**Mobile:**

- Node.js (v18 or higher)
- Expo CLI
- iOS Simulator (Mac) or Android Studio
- Physical device for testing (recommended)

### ⚙️ Installation

#### 1. Clone the repository

```bash
git clone https://github.com/Boris-Espinosa/X-Clone.git
cd X-Clone
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ARCJET_KEY=your_arcjet_key
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

#### 3. Mobile Setup

```bash
cd ../mobile
npm install
```

Create a `.env` file in the `mobile` directory:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

Start the Expo development server:

```bash
npx expo start
```

### 🚀 Available Scripts

**Backend:**

- `npm run dev` - Start development server with auto-restart
- `npm start` - Start production server

**Mobile:**

- `npx expo start` - Start Expo development server
- `npx expo start --ios` - Open in iOS simulator
- `npx expo start --android` - Open in Android emulator
- `npx expo prebuild` - Generate native code

### 📡 API Endpoints

#### Authentication (`/api/auth`)

| Method | Endpoint     | Description          | Auth Required |
| ------ | ------------ | -------------------- | ------------- |
| POST   | `/sync-user` | Sync user from Clerk | Yes           |

#### Users (`/api/users`)

| Method | Endpoint                | Description                  | Auth Required |
| ------ | ----------------------- | ---------------------------- | ------------- |
| GET    | `/profile/:username`    | Get user profile by username | No            |
| GET    | `/current`              | Get current user profile     | Yes           |
| PATCH  | `/profile`              | Update user profile          | Yes           |
| PATCH  | `/profile-picture`      | Update profile picture       | Yes           |
| PATCH  | `/banner`               | Update banner image          | Yes           |
| POST   | `/follow/:targetUserId` | Follow/unfollow a user       | Yes           |

#### Posts (`/api/posts`)

| Method | Endpoint          | Description          | Auth Required |
| ------ | ----------------- | -------------------- | ------------- |
| POST   | `/`               | Create a new post    | Yes           |
| GET    | `/`               | Get all posts (feed) | No            |
| GET    | `/user/:username` | Get posts by user    | No            |
| DELETE | `/:postId`        | Delete a post        | Yes           |
| POST   | `/:postId/like`   | Like/unlike a post   | Yes           |

#### Comments (`/api/comments`)

| Method | Endpoint           | Description              | Auth Required |
| ------ | ------------------ | ------------------------ | ------------- |
| POST   | `/`                | Create a comment on post | Yes           |
| GET    | `/post/:postId`    | Get comments for a post  | No            |
| DELETE | `/:commentId`      | Delete a comment         | Yes           |
| POST   | `/:commentId/like` | Like/unlike a comment    | Yes           |

#### Notifications (`/api/notifications`)

| Method | Endpoint | Description           | Auth Required |
| ------ | -------- | --------------------- | ------------- |
| GET    | `/`      | Get all notifications | Yes           |
| PATCH  | `/read`  | Mark as read          | Yes           |

### 📝 API Request Examples

#### Sync User (First Login)

```bash
POST /api/auth/sync-user
Authorization: Bearer <clerk_jwt_token>
```

#### Create a Post

```bash
POST /api/posts
Authorization: Bearer <clerk_jwt_token>
Content-Type: multipart/form-data

{
  "content": "Hello World! #ReactNative",
  "image": <file>
}
```

#### Follow a User

```bash
POST /api/users/follow/:targetUserId
Authorization: Bearer <clerk_jwt_token>
```

#### Get User Profile

```bash
GET /api/users/profile/username
```

### 🗂️ Project Structure

```
X-Clone/
├── mobile/                        # React Native app
│   ├── app/                       # Expo Router pages
│   │   ├── (auth)/               # Auth screens
│   │   ├── (tabs)/               # Main tab screens
│   │   │   ├── index.tsx         # Home feed
│   │   │   ├── search.tsx        # Search & hashtags
│   │   │   ├── notifications.tsx # Notifications
│   │   │   ├── messages.tsx      # Messages (TODO)
│   │   │   └── profile.tsx       # User profile
│   │   ├── _layout.tsx           # Root layout
│   │   └── modal.tsx             # Modal screens
│   ├── components/               # Reusable components
│   │   ├── PostCard.tsx          # Post display component
│   │   ├── PostsList.tsx         # Posts feed list
│   │   ├── EditProfileModal.tsx  # Profile editing
│   │   ├── FollowersModal.tsx    # Followers/following list
│   │   ├── CommentsModal.tsx     # Comments section
│   │   └── ZoomPictureModal.tsx  # Image viewer
│   ├── hooks/                    # Custom React hooks
│   │   ├── useCurrentUser.ts     # Current user hook
│   │   ├── usePosts.ts           # Posts management
│   │   ├── useFollow.ts          # Follow/unfollow logic
│   │   ├── useFollowers.ts       # Followers data
│   │   ├── useUserProfile.ts     # User profile fetching
│   │   └── useProfile.ts         # Profile management
│   ├── types/                    # TypeScript definitions
│   ├── utils/                    # Utilities and helpers
│   │   └── api.ts                # Axios API client
│   ├── constants/                # App constants
│   └── package.json
│
├── backend/                      # Node.js API
│   ├── src/
│   │   ├── controllers/          # Business logic
│   │   │   ├── user.controller.js
│   │   │   ├── post.controller.js
│   │   │   ├── comment.controller.js
│   │   │   └── notification.controller.js
│   │   ├── models/               # Mongoose models
│   │   │   ├── user.model.js
│   │   │   ├── post.model.js
│   │   │   ├── comment.model.js
│   │   │   └── notification.model.js
│   │   ├── routes/               # API routes
│   │   │   ├── user.route.js
│   │   │   ├── post.route.js
│   │   │   ├── comment.route.js
│   │   │   └── notification.route.js
│   │   ├── middleware/           # Custom middleware
│   │   │   ├── protectRoute.js   # Auth middleware
│   │   │   └── arcjet.js         # Security middleware
│   │   ├── config/               # Configuration
│   │   │   ├── db.js             # MongoDB connection
│   │   │   └── cloudinary.js     # Cloudinary setup
│   │   └── index.js              # Server entry point
│   └── package.json
│
├── AGENTS.md                     # Development patterns & rules
└── README.md                     # This file
```

### 🔐 Authentication

The application uses **Clerk** for authentication. Users authenticate through Clerk's SDK on the mobile app, and JWT tokens are validated on the backend using Clerk's middleware.

**Authentication Flow:**

1. User signs up/logs in through Clerk (mobile)
2. Clerk returns a JWT token
3. Mobile app stores token and includes it in API requests
4. Backend validates token with Clerk middleware
5. User data is synced to MongoDB on first login

### 📦 Data Models

#### User Model

```javascript
{
  clerkId: String (required, unique),
  email: String (required, unique),
  username: String (required, unique, min 3 chars),
  firstName: String,
  lastName: String,
  profilePicture: String (Cloudinary URL),
  bannerImage: String (Cloudinary URL),
  bio: String (max 120 chars),
  location: String (max 40 chars),
  followers: [ObjectId] (ref: User),
  following: [ObjectId] (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

#### Post Model

```javascript
{
  user: ObjectId (ref: User, required),
  content: String (required, max 280 chars),
  image: String (Cloudinary URL),
  hashtags: [String],
  likes: [ObjectId] (ref: User),
  comments: [ObjectId] (ref: Comment),
  createdAt: Date,
  updatedAt: Date
}
```

#### Comment Model

```javascript
{
  user: ObjectId (ref: User, required),
  post: ObjectId (ref: Post, required),
  content: String (required, max 280 chars),
  likes: [ObjectId] (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

#### Notification Model

```javascript
{
  from: ObjectId (ref: User, required),
  to: ObjectId (ref: User, required),
  type: String (enum: ['follow', 'like', 'comment']),
  post: ObjectId (ref: Post),
  read: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### 🔧 Features

**User Management:**

- ✅ User registration and authentication with Clerk
- ✅ Customizable profiles (picture, banner, bio, location)
- ✅ Follow/unfollow system
- ✅ Followers and following lists with search
- ✅ Profile navigation (own profile + other users)

**Posts:**

- ✅ Create posts with text and images
- ✅ Like/unlike posts
- ✅ Delete own posts
- ✅ Personalized feed (posts from followed users)
- ✅ Automatic hashtag extraction

**Comments:**

- ✅ Comment on posts
- ✅ Like/unlike comments
- ✅ Delete own comments
- ✅ Nested comment display

**Search & Discovery:**

- ✅ Search by hashtags
- ✅ Trending topics
- ✅ Filter posts by hashtag

**Notifications:**

- ✅ Follow notifications
- ✅ Like notifications
- ✅ Comment notifications
- ✅ Mark as read functionality

**UI/UX:**

- ✅ Responsive design with NativeWind
- ✅ Modal interfaces (Edit Profile, Followers, Comments, Image Zoom)
- ✅ Loading states
- ✅ Error handling with user-friendly messages
- ✅ Optimistic UI updates
- ✅ Pull to refresh
- ✅ Safe area handling for notch/status bar

**Security:**

- ✅ JWT authentication with Clerk
- ✅ Rate limiting with Arcjet
- ✅ Bot detection
- ✅ Protected routes
- ✅ Password hashing (handled by Clerk)

### 🏗️ Architecture Patterns

The project follows industry best practices documented in `AGENTS.md`:

**Frontend Patterns:**

- Custom Hooks Pattern for reusable logic
- Query Keys with dependencies for efficient caching
- Optimistic updates with React Query
- SafeAreaView from `react-native-safe-area-context`
- TypeScript interfaces for all data types
- ID + Fetch pattern for navigation (no object serialization)

**Backend Patterns:**

- AsyncHandler for consistent error handling
- Populate strategy for efficient related data fetching
- Early returns for validation
- Security middleware (Arcjet + Clerk)
- Image optimization with Cloudinary transformations

### 🚢 Deployment

**Backend:**

- Deployed on **Vercel** (serverless functions)
- Database on **MongoDB Atlas**
- Images hosted on **Cloudinary CDN**

**Mobile:**

- Built with **Expo EAS Build**
- Distributed via **Expo Go** (development)
- Can be published to App Store / Google Play

### 🧪 Testing

```bash
# Backend tests (not implemented yet)
cd backend
npm test

# Mobile tests (not implemented yet)
cd mobile
npm test
```

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📄 License

ISC

### 👤 Author

**Boris Espinosa**

- GitHub: [@Boris-Espinosa](https://github.com/Boris-Espinosa)

---

<a name="español"></a>

## 🇪🇸 Español

### 📖 Descripción

X-Clone es una aplicación móvil de redes sociales full-stack que replica las características principales de Twitter/X. Construida con React Native y Node.js, permite a los usuarios compartir publicaciones, seguir a otros, interactuar mediante likes y comentarios, y mantenerse conectados a través de notificaciones en tiempo real.

### 🎯 Problema que Resuelve

- **Conexión Social**: Conecta e interactúa con otros usuarios mediante seguimientos y engagement
- **Compartir Contenido**: Comparte pensamientos, ideas y contenido multimedia con tu red
- **Interacción en Tiempo Real**: Da like, comenta e interactúa con publicaciones en tiempo real
- **Descubrimiento**: Encuentra nuevo contenido y usuarios mediante búsqueda de hashtags y temas trending
- **Gestión de Perfil**: Personaliza tu presencia con fotos de perfil, banners y biografía
- **Plataforma de Aprendizaje**: Proyecto full-stack completo para aprender desarrollo móvil y backend moderno

### 🛠️ Tecnologías Utilizadas

#### Frontend Móvil

- **React Native** - Framework multiplataforma para móviles nativos
- **Expo** (SDK 52) - Plataforma de desarrollo y herramientas de build
- **TypeScript** - Tipado estático para JavaScript
- **Expo Router** - Sistema de enrutamiento basado en archivos
- **NativeWind** - Tailwind CSS para React Native
- **TanStack Query (React Query)** v5 - Gestión de estado del servidor y caché
- **Clerk** - Autenticación y gestión de usuarios
- **Axios** - Cliente HTTP para peticiones API
- **date-fns** - Formateo y manipulación de fechas
- **@expo/vector-icons** (Feather) - Biblioteca de iconos
- **expo-image-picker** - Selección de imágenes desde galería/cámara
- **expo-image-manipulator** - Edición y manipulación de imágenes
- **react-native-popup-menu** - Menús contextuales
- **react-native-safe-area-context** - Manejo de áreas seguras

#### API Backend

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web minimalista
- **MongoDB + Mongoose** - Base de datos NoSQL con ODM
- **Clerk** (`@clerk/express`) - Middleware de autenticación
- **Cloudinary** - Almacenamiento de imágenes en la nube y CDN
- **Arcjet** - Rate limiting y protección contra bots
- **CORS** - Intercambio de recursos entre orígenes
- **Multer** - Manejo de subida de archivos multipart/form-data
- **express-async-handler** - Manejo de errores asíncronos

#### Deployment y Servicios

- **Vercel** - Hosting serverless del backend
- **MongoDB Atlas** - Base de datos en la nube
- **Cloudinary CDN** - Entrega global de imágenes
- **Clerk** - Servicio de autenticación en la nube

### 📋 Prerequisitos

**Backend:**

- Node.js (v18 o superior)
- MongoDB (local o Atlas)
- Cuenta de Cloudinary
- Cuenta de Clerk
- Cuenta de Arcjet (opcional, para características de seguridad)

**Móvil:**

- Node.js (v18 o superior)
- Expo CLI
- iOS Simulator (Mac) o Android Studio
- Dispositivo físico para pruebas (recomendado)

### ⚙️ Instalación

#### 1. Clonar el repositorio

```bash
git clone https://github.com/Boris-Espinosa/X-Clone.git
cd X-Clone
```

#### 2. Configuración del Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` en el directorio `backend`:

```env
PORT=5000
MONGODB_URI=tu_cadena_de_conexion_mongodb
CLERK_PUBLISHABLE_KEY=tu_clerk_publishable_key
CLERK_SECRET_KEY=tu_clerk_secret_key
CLOUDINARY_CLOUD_NAME=tu_nombre_de_cloudinary
CLOUDINARY_API_KEY=tu_api_key_de_cloudinary
CLOUDINARY_API_SECRET=tu_api_secret_de_cloudinary
ARCJET_KEY=tu_arcjet_key
NODE_ENV=development
```

Inicia el servidor backend:

```bash
npm run dev
```

#### 3. Configuración de la App Móvil

```bash
cd ../mobile
npm install
```

Crea un archivo `.env` en el directorio `mobile`:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=tu_clerk_publishable_key
```

Inicia el servidor de desarrollo de Expo:

```bash
npx expo start
```

### 🚀 Scripts Disponibles

**Backend:**

- `npm run dev` - Inicia el servidor de desarrollo con reinicio automático
- `npm start` - Inicia el servidor de producción

**Móvil:**

- `npx expo start` - Inicia el servidor de desarrollo de Expo
- `npx expo start --ios` - Abre en el simulador de iOS
- `npx expo start --android` - Abre en el emulador de Android
- `npx expo prebuild` - Genera código nativo

### 📡 Endpoints de la API

#### Autenticación (`/api/auth`)

| Método | Endpoint     | Descripción                     | Requiere Auth |
| ------ | ------------ | ------------------------------- | ------------- |
| POST   | `/sync-user` | Sincronizar usuario desde Clerk | Sí            |

#### Usuarios (`/api/users`)

| Método | Endpoint                | Descripción                       | Requiere Auth |
| ------ | ----------------------- | --------------------------------- | ------------- |
| GET    | `/profile/:username`    | Obtener perfil por username       | No            |
| GET    | `/current`              | Obtener perfil del usuario actual | Sí            |
| PATCH  | `/profile`              | Actualizar perfil de usuario      | Sí            |
| PATCH  | `/profile-picture`      | Actualizar foto de perfil         | Sí            |
| PATCH  | `/banner`               | Actualizar imagen de banner       | Sí            |
| POST   | `/follow/:targetUserId` | Seguir/dejar de seguir usuario    | Sí            |

#### Publicaciones (`/api/posts`)

| Método | Endpoint          | Descripción                       | Requiere Auth |
| ------ | ----------------- | --------------------------------- | ------------- |
| POST   | `/`               | Crear una nueva publicación       | Sí            |
| GET    | `/`               | Obtener todas las publicaciones   | No            |
| GET    | `/user/:username` | Obtener publicaciones por usuario | No            |
| DELETE | `/:postId`        | Eliminar una publicación          | Sí            |
| POST   | `/:postId/like`   | Dar/quitar like a publicación     | Sí            |

#### Comentarios (`/api/comments`)

| Método | Endpoint           | Descripción                        | Requiere Auth |
| ------ | ------------------ | ---------------------------------- | ------------- |
| POST   | `/`                | Crear comentario en publicación    | Sí            |
| GET    | `/post/:postId`    | Obtener comentarios de publicación | No            |
| DELETE | `/:commentId`      | Eliminar un comentario             | Sí            |
| POST   | `/:commentId/like` | Dar/quitar like a comentario       | Sí            |

#### Notificaciones (`/api/notifications`)

| Método | Endpoint | Descripción                      | Requiere Auth |
| ------ | -------- | -------------------------------- | ------------- |
| GET    | `/`      | Obtener todas las notificaciones | Sí            |
| PATCH  | `/read`  | Marcar como leído                | Sí            |

### 📝 Ejemplos de Peticiones a la API

#### Sincronizar Usuario (Primer Login)

```bash
POST /api/auth/sync-user
Authorization: Bearer <clerk_jwt_token>
```

#### Crear una Publicación

```bash
POST /api/posts
Authorization: Bearer <clerk_jwt_token>
Content-Type: multipart/form-data

{
  "content": "¡Hola Mundo! #ReactNative",
  "image": <archivo>
}
```

#### Seguir a un Usuario

```bash
POST /api/users/follow/:targetUserId
Authorization: Bearer <clerk_jwt_token>
```

#### Obtener Perfil de Usuario

```bash
GET /api/users/profile/username
```

### 🗂️ Estructura del Proyecto

```
X-Clone/
├── mobile/                        # App React Native
│   ├── app/                       # Páginas de Expo Router
│   │   ├── (auth)/               # Pantallas de autenticación
│   │   ├── (tabs)/               # Pantallas principales con tabs
│   │   │   ├── index.tsx         # Feed principal
│   │   │   ├── search.tsx        # Búsqueda y hashtags
│   │   │   ├── notifications.tsx # Notificaciones
│   │   │   ├── messages.tsx      # Mensajes (TODO)
│   │   │   └── profile.tsx       # Perfil de usuario
│   │   ├── _layout.tsx           # Layout raíz
│   │   └── modal.tsx             # Pantallas modales
│   ├── components/               # Componentes reutilizables
│   │   ├── PostCard.tsx          # Componente de publicación
│   │   ├── PostsList.tsx         # Lista de publicaciones
│   │   ├── EditProfileModal.tsx  # Edición de perfil
│   │   ├── FollowersModal.tsx    # Lista de seguidores/siguiendo
│   │   ├── CommentsModal.tsx     # Sección de comentarios
│   │   └── ZoomPictureModal.tsx  # Visor de imágenes
│   ├── hooks/                    # Custom hooks de React
│   │   ├── useCurrentUser.ts     # Hook de usuario actual
│   │   ├── usePosts.ts           # Gestión de publicaciones
│   │   ├── useFollow.ts          # Lógica de follow/unfollow
│   │   ├── useFollowers.ts       # Datos de seguidores
│   │   ├── useUserProfile.ts     # Obtención de perfil de usuario
│   │   └── useProfile.ts         # Gestión de perfil
│   ├── types/                    # Definiciones de TypeScript
│   ├── utils/                    # Utilidades y helpers
│   │   └── api.ts                # Cliente API de Axios
│   ├── constants/                # Constantes de la app
│   └── package.json
│
├── backend/                      # API Node.js
│   ├── src/
│   │   ├── controllers/          # Lógica de negocio
│   │   │   ├── user.controller.js
│   │   │   ├── post.controller.js
│   │   │   ├── comment.controller.js
│   │   │   └── notification.controller.js
│   │   ├── models/               # Modelos de Mongoose
│   │   │   ├── user.model.js
│   │   │   ├── post.model.js
│   │   │   ├── comment.model.js
│   │   │   └── notification.model.js
│   │   ├── routes/               # Rutas de la API
│   │   │   ├── user.route.js
│   │   │   ├── post.route.js
│   │   │   ├── comment.route.js
│   │   │   └── notification.route.js
│   │   ├── middleware/           # Middleware personalizado
│   │   │   ├── protectRoute.js   # Middleware de autenticación
│   │   │   └── arcjet.js         # Middleware de seguridad
│   │   ├── config/               # Configuración
│   │   │   ├── db.js             # Conexión a MongoDB
│   │   │   └── cloudinary.js     # Configuración de Cloudinary
│   │   └── index.js              # Punto de entrada del servidor
│   └── package.json
│
├── AGENTS.md                     # Patrones y reglas de desarrollo
└── README.md                     # Este archivo
```

### 🔐 Autenticación

La aplicación utiliza **Clerk** para la autenticación. Los usuarios se autentican a través del SDK de Clerk en la app móvil, y los tokens JWT se validan en el backend usando el middleware de Clerk.

**Flujo de Autenticación:**

1. Usuario se registra/inicia sesión a través de Clerk (móvil)
2. Clerk devuelve un token JWT
3. La app móvil almacena el token y lo incluye en las peticiones API
4. El backend valida el token con el middleware de Clerk
5. Los datos del usuario se sincronizan con MongoDB en el primer login

### 📦 Modelos de Datos

#### Modelo de Usuario

```javascript
{
  clerkId: String (requerido, único),
  email: String (requerido, único),
  username: String (requerido, único, mín 3 caracteres),
  firstName: String,
  lastName: String,
  profilePicture: String (URL de Cloudinary),
  bannerImage: String (URL de Cloudinary),
  bio: String (máx 120 caracteres),
  location: String (máx 40 caracteres),
  followers: [ObjectId] (ref: User),
  following: [ObjectId] (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

#### Modelo de Publicación

```javascript
{
  user: ObjectId (ref: User, requerido),
  content: String (requerido, máx 280 caracteres),
  image: String (URL de Cloudinary),
  hashtags: [String],
  likes: [ObjectId] (ref: User),
  comments: [ObjectId] (ref: Comment),
  createdAt: Date,
  updatedAt: Date
}
```

#### Modelo de Comentario

```javascript
{
  user: ObjectId (ref: User, requerido),
  post: ObjectId (ref: Post, requerido),
  content: String (requerido, máx 280 caracteres),
  likes: [ObjectId] (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

#### Modelo de Notificación

```javascript
{
  from: ObjectId (ref: User, requerido),
  to: ObjectId (ref: User, requerido),
  type: String (enum: ['follow', 'like', 'comment']),
  post: ObjectId (ref: Post),
  read: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### 🔧 Características

**Gestión de Usuarios:**

- ✅ Registro y autenticación con Clerk
- ✅ Perfiles personalizables (foto, banner, bio, ubicación)
- ✅ Sistema de seguir/dejar de seguir
- ✅ Listas de seguidores y siguiendo con búsqueda
- ✅ Navegación de perfiles (propio + otros usuarios)

**Publicaciones:**

- ✅ Crear publicaciones con texto e imágenes
- ✅ Dar/quitar like a publicaciones
- ✅ Eliminar publicaciones propias
- ✅ Feed personalizado (publicaciones de usuarios seguidos)
- ✅ Extracción automática de hashtags

**Comentarios:**

- ✅ Comentar en publicaciones
- ✅ Dar/quitar like a comentarios
- ✅ Eliminar comentarios propios
- ✅ Visualización anidada de comentarios

**Búsqueda y Descubrimiento:**

- ✅ Búsqueda por hashtags
- ✅ Temas en tendencia
- ✅ Filtrar publicaciones por hashtag

**Notificaciones:**

- ✅ Notificaciones de seguimiento
- ✅ Notificaciones de likes
- ✅ Notificaciones de comentarios
- ✅ Funcionalidad de marcar como leído

**UI/UX:**

- ✅ Diseño responsivo con NativeWind
- ✅ Interfaces modales (Editar Perfil, Seguidores, Comentarios, Zoom de Imagen)
- ✅ Estados de carga
- ✅ Manejo de errores con mensajes amigables
- ✅ Actualizaciones optimistas de UI
- ✅ Pull to refresh
- ✅ Manejo de área segura para notch/barra de estado

**Seguridad:**

- ✅ Autenticación JWT con Clerk
- ✅ Rate limiting con Arcjet
- ✅ Detección de bots
- ✅ Rutas protegidas
- ✅ Hashing de contraseñas (manejado por Clerk)

### 🏗️ Patrones de Arquitectura

El proyecto sigue las mejores prácticas de la industria documentadas en `AGENTS.md`:

**Patrones Frontend:**

- Patrón de Custom Hooks para lógica reutilizable
- Query Keys con dependencias para caché eficiente
- Actualizaciones optimistas con React Query
- SafeAreaView desde `react-native-safe-area-context`
- Interfaces TypeScript para todos los tipos de datos
- Patrón ID + Fetch para navegación (sin serialización de objetos)

**Patrones Backend:**

- AsyncHandler para manejo consistente de errores
- Estrategia de Populate para obtención eficiente de datos relacionados
- Early returns para validación
- Middleware de seguridad (Arcjet + Clerk)
- Optimización de imágenes con transformaciones de Cloudinary

### 🚢 Deployment

**Backend:**

- Desplegado en **Vercel** (funciones serverless)
- Base de datos en **MongoDB Atlas**
- Imágenes alojadas en **Cloudinary CDN**

**Móvil:**

- Construido con **Expo EAS Build**
- Distribuido vía **Expo Go** (desarrollo)
- Puede publicarse en App Store / Google Play

### 🧪 Testing

```bash
# Tests del backend (no implementado aún)
cd backend
npm test

# Tests móvil (no implementado aún)
cd mobile
npm test
```

### 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor, siéntete libre de enviar un Pull Request.

1. Haz fork del repositorio
2. Crea tu rama de característica (`git checkout -b feature/CaracteristicaIncreible`)
3. Commit tus cambios (`git commit -m 'Agrega alguna CaracteristicaIncreible'`)
4. Push a la rama (`git push origin feature/CaracteristicaIncreible`)
5. Abre un Pull Request

### 📄 Licencia

ISC

### 👤 Autor

**Boris Espinosa**

- GitHub: [@Boris-Espinosa](https://github.com/Boris-Espinosa)
