## ⚙️ Documentación de Funcionalidades y Rutas de Edición

Esta guía está diseñada para administradores y desarrolladores que necesiten realizar modificaciones o entender el funcionamiento interno de la plataforma TeeReserve Golf.

### 📁 Editar Campos de Golf

- **Ruta Frontend:** `/admin/courses`
- **Ruta API:** `PATCH /api/admin/courses/:id`
- **Permite:**
  - Cambiar nombre del campo
  - Modificar imágenes (ver ruta del bucket o carpeta pública `/public/images/courses`)
  - Cambiar descripción o ubicación
  - Ajustar disponibilidad y horarios
  - Cambiar precios (green fee) por hora o jugador

### 💰 Modificar Precios y Tarifas

- **Ruta:** `/admin/courses/:id/edit`
- **Campo editable:** `pricePerPlayer` o `greenFee`
- **Validación:** número entero positivo, en pesos mexicanos

#### 🖼️ Cambiar Imágenes de los Campos

- **Carpeta de imágenes:** `/public/images/courses/`
- **Ruta editable en la base de datos:** tabla `GolfCourse`, columna `imageUrl`
- **Sube nuevas imágenes** respetando proporción 16:9 o 4:3

---

### 👥 Roles y Gestión de Usuarios

- **Roles Disponibles:**
  - `Client` (Jugador): puede reservar y acumular puntos
  - `Promoter` (Afiliado): puede generar referidos con comisiones
  - `Admin`: administra campos, usuarios y reservas
  - `Super Admin`: tiene control total (usuarios, roles, comisiones, configuraciones globales)

- **Ruta gestión de usuarios:** `/admin/users`
- **Ruta gestión de afiliados:** `/admin/affiliates`

#### 💸 Comisiones de Afiliados

- **API:** `/api/admin/affiliates`
- **Base de datos:** tabla `Affiliate`
- **Campos configurables:**
  - Porcentaje de comisión
  - Código de referido
  - Historial de reservas originadas

- **Asegúrate que todos los accesos estén protegidos por roles** (`Super Admin` y `Admin`).
- **Verifica que `Super Admin` tenga acceso a `/admin/super-admin`**, y los `Admin` comunes no.

