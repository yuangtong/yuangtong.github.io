# Guía para Poblar la Base de Datos de Sanity

## Problemas Identificados y Soluciones

### ✅ Errores Resueltos

1. **Error de imágenes malformadas en Projects**: Se corrigió la función `mapSanityToUnified` para manejar correctamente las imágenes cuando no hay datos de Sanity.

2. **Fallback a datos estáticos**: El sistema ahora usa automáticamente los datos estáticos cuando Sanity no está disponible o está vacío.

### 🔄 Pendiente: Poblar Base de Datos de Sanity

La base de datos de Sanity está vacía, por lo que necesitas poblarla manualmente.

## Instrucciones para Poblar Sanity

### Paso 1: Acceder a Sanity Studio

1. Asegúrate de que Sanity Studio esté ejecutándose:
   ```bash
   cd studio/portfolio-cms
   npx sanity dev
   ```

2. Abre http://localhost:3333 en tu navegador

### Paso 2: Crear Proyectos

En Sanity Studio, ve a la sección "Projects" y crea los siguientes proyectos:

#### Proyecto 1: Personal Portfolio
- **Title**: Personal Portfolio
- **Slug**: personal-portfolio
- **Short Description**: Modern and interactive portfolio website with dark mode and multilingual support
- **Long Description**: A modern, responsive portfolio website built with React and TypeScript. Features a clean, minimalist design with interactive elements and smooth animations.
- **Technologies**: React, TypeScript, TailwindCSS, Framer Motion, React Router, Vite
- **Live URL**: https://yuangtong.dev
- **GitHub URL**: https://github.com/yuangtong/yuangtong.github.io
- **Category**: web
- **Featured**: true
- **Order**: 1
- **Image URL**: https://images.unsplash.com/photo-1545665277-5937489579f2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D

#### Proyecto 2: Passguard Password Generator
- **Title**: Passguard: Password Generator
- **Slug**: passguard-password-generator
- **Short Description**: A bold web solution built with React
- **Long Description**: Passguard is a robust password generation tool that empowers users to create secure and customizable passwords.
- **Technologies**: React, TypeScript, TailwindCSS, Framer Motion
- **Live URL**: https://yuangtong.github.io/passguard/
- **GitHub URL**: https://github.com/yuangtong/passguard
- **Category**: web
- **Featured**: true
- **Order**: 2
- **Image URL**: https://images.unsplash.com/photo-1634804306598-f2efe3ead034?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D

### Paso 3: Crear Works

En Sanity Studio, ve a la sección "Works" y crea los siguientes trabajos:

#### Work 1: AI-Powered Analytics Dashboard
- **Title**: AI-Powered Analytics Dashboard
- **Slug**: ai-analytics
- **Category**: Web Application
- **Description**: Enterprise analytics platform with AI-driven insights and real-time data visualization.
- **Awards**: Best Enterprise Solution 2023
- **Technologies**: React, TypeScript, Python, TensorFlow
- **Live URL**: #
- **GitHub URL**: #
- **Featured**: true
- **Order**: 1
- **Image URL**: https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=500

#### Work 2: Sustainable Fashion Marketplace
- **Title**: Sustainable Fashion Marketplace
- **Slug**: fashion-marketplace
- **Category**: E-Commerce
- **Description**: Modern marketplace connecting eco-conscious fashion brands with consumers.
- **Awards**: Green Tech Award 2023
- **Technologies**: Next.js, Node.js, PostgreSQL
- **Live URL**: #
- **GitHub URL**: #
- **Featured**: true
- **Order**: 2
- **Image URL**: https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800&h=500

### Paso 4: Subir Imágenes

Para cada proyecto y work:

1. En el campo "Main Image", haz clic en "Select"
2. Selecciona "Upload" y pega la URL de la imagen correspondiente
3. Sanity descargará y almacenará la imagen automáticamente
4. Añade un texto alternativo descriptivo

### Paso 5: Verificar los Datos

Después de crear todos los documentos:

1. Ve a la sección "Vision" en Sanity Studio
2. Ejecuta estas consultas para verificar:

```groq
// Verificar proyectos
*[_type == "project"] | order(order asc) {
  title,
  slug,
  shortDescription,
  technologies,
  featured
}

// Verificar works
*[_type == "work"] | order(order asc) {
  title,
  slug,
  category,
  description,
  tech,
  featured
}
```

### Paso 6: Verificar el Frontend

1. Actualiza tu frontend en http://localhost:5174
2. Los datos de Sanity deberían aparecer automáticamente
3. Los errores de consola deberían desaparecer

## Scripts de Ayuda Creados

### `scripts/import-to-sanity.js`
Ejecuta este script para ver las instrucciones detalladas:
```bash
node scripts/import-to-sanity.js
```

### `scripts/generate-sanity-data.js`
Genera archivos JSON con los datos formateados para Sanity:
```bash
node scripts/generate-sanity-data.js
```

### `scripts/populate-sanity.js`
Script para poblar automáticamente (requiere token de autenticación):
```bash
SANITY_AUTH_TOKEN=tu_token node scripts/populate-sanity.js
```

## Notas Importantes

- **Fallback automático**: Si Sanity no está disponible, la aplicación usará automáticamente los datos estáticos
- **Imágenes**: Las imágenes se almacenan como assets de Sanity para mejor rendimiento
- **Orden**: Usa el campo "order" para controlar el orden de visualización
- **Featured**: Marca como "featured" los elementos que quieres destacar

## Solución de Problemas

### Si sigues viendo errores ERR_FAILED:
1. Verifica que Sanity Studio esté ejecutándose
2. Asegúrate de haber creado al menos un documento de cada tipo
3. Verifica que las imágenes se hayan subido correctamente

### Si las imágenes no se muestran:
1. Verifica que las imágenes se hayan subido como assets de Sanity
2. No uses URLs externas directamente en el campo "image"
3. Usa la función de upload de Sanity Studio

¡Una vez completados estos pasos, tu aplicación debería funcionar perfectamente con datos reales de Sanity!