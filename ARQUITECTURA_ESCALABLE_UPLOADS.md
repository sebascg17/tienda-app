# Arquitectura Escalable de Upload de Archivos

## Visión General

Este proyecto implementa un sistema de upload de archivos **completamente escalable** que funciona tanto con almacenamiento **local** como con **Azure** (u otros proveedores en el futuro) sin cambios en el código del cliente.

## Flujo Actual (Local)

```
Usuario selecciona foto en Profile Component
    ↓
FileUploadService.uploadProfilePhoto()
    ↓
Backend UploadController recibe archivo
    ↓
Servidor guarda en /wwwroot/uploads/profiles/{userId}/{filename}.jpg
    ↓
Servidor devuelve: { filePath: "/uploads/profiles/userId/file.jpg" }
    ↓
Profile Component guarda en sessionStorage
    ↓
MainLayout detecta cambio y actualiza avatar
```

## Arquitectura Escalable

### 1. **Frontend - FileUploadService** (`src/app/core/services/file-upload.service.ts`)

```typescript
// Agnóstico al proveedor
uploadProfilePhoto(file: File, userId: string): Observable<UploadResponse>
```

- **Ventaja**: El cliente NUNCA sabe si está usando local, Azure, AWS, etc.
- El endpoint siempre es `/api/upload/profile-photo`
- El servidor devuelve la URL relativa o completa

### 2. **Backend - UploadController** (`Controllers/UploadController.cs`)

```csharp
// Almacenamiento flexible
[HttpPost("profile-photo")]
public async Task<IActionResult> UploadProfilePhoto(IFormFile file, string userId)
{
    // Lógica actual: guarda en wwwroot/uploads/
    var uploadPath = Path.Combine(_environment.ContentRootPath, "wwwroot", "uploads", "profiles", userId);
    // ... guardar archivo
}
```

## Migración a Azure (Futuro)

### Cambios Necesarios (Solo Backend):

```csharp
// 1. Inyectar servicio de Azure Storage
public UploadController(
    IWebHostEnvironment environment, 
    ILogger<UploadController> logger,
    BlobContainerClient blobClient  // ← Nueva dependencia
) { }

// 2. Cambiar lógica de guardado
[HttpPost("profile-photo")]
public async Task<IActionResult> UploadProfilePhoto(IFormFile file, string userId)
{
    // Opción 1: Guardar en Azure
    var blobName = $"profiles/{userId}/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
    var blobClient = _blobContainerClient.GetBlobClient(blobName);
    
    using (var stream = file.OpenReadStream())
    {
        await blobClient.UploadAsync(stream, overwrite: true);
    }
    
    return Ok(new {
        success = true,
        filePath = $"/uploads/{blobName}",  // ← Cliente recibe misma URL relativa
        fileUrl = blobClient.Uri.AbsoluteUri
    });
}
```

### Cambios en Cliente: **NINGUNO** ✅

- `FileUploadService` sigue siendo el mismo
- `ProfileComponent` sigue siendo el mismo
- El cliente continúa llamando a `/api/upload/profile-photo`
- El servidor maneja toda la lógica de almacenamiento

## Estructura de Carpetas

```
📦 tienda-app/
├── public/assets/
│   └── uploads/          ← Almacenamiento local (temporal)
│       ├── profiles/     ← Fotos de perfil
│       ├── products/     ← Fotos de productos
│       └── documents/    ← Documentos
│
📦 TiendaApi/
├── Controllers/
│   └── UploadController.cs   ← Orquesta uploads (local o Azure)
│
├── wwwroot/
│   └── uploads/          ← Archivos servidos públicamente (local)
│       ├── profiles/
│       ├── products/
│       └── documents/
```

## Configuración para Azure (Futura)

### appsettings.json
```json
{
  "AzureStorageOptions": {
    "ConnectionString": "DefaultEndpointsProtocol=https;AccountName=...",
    "ContainerName": "tienda-uploads",
    "Provider": "Azure"  // ← Switch entre Local/Azure
  }
}
```

### Usar patrón Strategy
```csharp
public interface IStorageProvider
{
    Task<string> UploadFileAsync(IFormFile file, string path);
    Task<bool> DeleteFileAsync(string path);
}

public class LocalStorageProvider : IStorageProvider { }
public class AzureStorageProvider : IStorageProvider { }
```

## URLs Generadas

### Local
```
http://localhost:4200/assets/uploads/profiles/user123/abc123.jpg
```

### Azure (Futuro)
```
https://tiendazapp.blob.core.windows.net/uploads/profiles/user123/abc123.jpg
```

Ambas URLs funcionan de la **misma manera** en el cliente.

## Beneficios de esta Arquitectura

✅ **Escalable**: Cambiar proveedor sin tocar código del cliente
✅ **Flexible**: Soportar múltiples tipos de uploads (perfil, producto, documento)
✅ **Seguro**: Validación en servidor, no en cliente
✅ **Eficiente**: sessionStorage temporal durante sesión
✅ **Profesional**: Patrón usado en producción

## Implementación de Nuevos Upload Types

```typescript
// Cliente: Agregar nuevo tipo
uploadProductImage(file: File, productId: string) {
    return this.fileUploadService.uploadFile(file, 'product', { productId });
}

// Backend: Manejar automáticamente
// El UploadController ya tiene lógica para "product" folder
```

## Testing Local

1. Subir foto en `/profile`
2. Verificar que existe en `/public/assets/uploads/profiles/{userId}/`
3. Avatar en header se actualiza automáticamente

## Próximos Pasos

1. **Implementar base de datos**: Guardar referencia de foto en tabla Usuarios
2. **Agregar validaciones**: Tamaño, tipo, virus scan
3. **Implementar limpieza**: Eliminar fotos antiguas al actualizar
4. **Azure Setup**: Crear Azure Storage Account
5. **Patrón Strategy**: Implementar `IStorageProvider`
