# 🚀 Solución Rápida para Poblar Sanity

## Problema Actual
- Sanity está vacío (0 proyectos, 0 trabajos)
- El frontend muestra errores de red porque no encuentra datos
- Necesitamos poblar la base de datos manualmente

## ✅ Solución Paso a Paso

### Opción 1: Población Manual (Recomendada - 5 minutos)

1. **Abrir Sanity Studio**
   ```
   http://localhost:3333
   ```

2. **Crear Proyectos**
   - Hacer clic en "Project" en el menú lateral
   - Crear nuevo documento con estos datos:

   **Proyecto 1: Personal Portfolio**
   - Title: `Personal Portfolio`
   - Slug: `personal-portfolio`
   - Short Description: `Modern and interactive portfolio website with dark mode and smooth animations.`
   - Long Description: `A comprehensive portfolio website showcasing my work and skills. Built with modern web technologies, featuring a responsive design, dark/light mode toggle, smooth animations, and an intuitive user interface.`
   - Technologies: `React`, `TypeScript`, `TailwindCSS`, `Framer Motion`, `Vite`
   - Live URL: `https://yuangtong.github.io`
   - GitHub URL: `https://github.com/yuangtong/yuangtong.github.io`
   - Category: `web`
   - Featured: ✅ (checked)
   - Order: `1`
   - Image: Subir desde URL: `https://images.unsplash.com/photo-1545665277-5937489579f2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`

   **Proyecto 2: Passguard**
   - Title: `Passguard - Password Generator`
   - Slug: `passguard`
   - Short Description: `Secure password generation tool with customizable options.`
   - Long Description: `Passguard is a robust password generation tool that empowers users to create secure and customizable passwords.`
   - Technologies: `React`, `TypeScript`, `TailwindCSS`, `Framer Motion`
   - Live URL: `https://yuangtong.github.io/passguard/`
   - GitHub URL: `https://github.com/yuangtong/passguard`
   - Category: `web`
   - Featured: ✅ (checked)
   - Order: `2`
   - Image: Subir desde URL: `https://images.unsplash.com/photo-1634804306598-f2efe3ead034?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`

3. **Crear Trabajos**
   - Hacer clic en "Work" en el menú lateral
   - Crear nuevo documento con estos datos:

   **Trabajo 1: AI Analytics**
   - Title: `AI-Powered Analytics Dashboard`
   - Slug: `ai-analytics`
   - Category: `Web Application`
   - Description: `Enterprise analytics platform with AI-driven insights and real-time data visualization.`
   - Awards: `Best Enterprise Solution 2023`
   - Tech: `React`, `TypeScript`, `Python`, `TensorFlow`
   - Live URL: `#`
   - GitHub URL: `#`
   - Featured: ✅ (checked)
   - Order: `1`
   - Image: Subir desde URL: `https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=500`

   **Trabajo 2: Fashion Marketplace**
   - Title: `Sustainable Fashion Marketplace`
   - Slug: `fashion-marketplace`
   - Category: `E-Commerce`
   - Description: `Modern marketplace connecting eco-conscious fashion brands with consumers.`
   - Awards: `Green Tech Award 2023`
   - Tech: `Next.js`, `Node.js`, `PostgreSQL`
   - Live URL: `#`
   - GitHub URL: `#`
   - Featured: ✅ (checked)
   - Order: `2`
   - Image: Subir desde URL: `https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800&h=500`

### Opción 2: Con Token de API (Automática)

1. **Obtener Token de Sanity**
   - Ir a https://sanity.io/manage
   - Seleccionar tu proyecto
   - Ir a API > Tokens
   - Crear nuevo token con permisos de "Editor"

2. **Agregar Token al Script**
   - Editar `scripts/auto-populate-sanity.js`
   - Descomentar y agregar: `token: 'tu-token-aqui'`
   - Ejecutar: `node scripts/auto-populate-sanity.js`

## 🔍 Verificación

Después de poblar los datos:

1. **Verificar en Sanity Studio**
   ```
   http://localhost:3333
   ```
   - Deberías ver 2 proyectos y 2 trabajos

2. **Verificar en Frontend**
   ```
   http://localhost:5174
   ```
   - Los errores de red deberían desaparecer
   - Los proyectos y trabajos deberían mostrarse correctamente

## 🎯 Resultado Esperado

- ✅ Sanity poblado con datos de ejemplo
- ✅ Frontend funcionando sin errores de red
- ✅ Proyectos y trabajos visibles en la interfaz
- ✅ Imágenes cargadas correctamente

---

**Tiempo estimado: 5-10 minutos**
**Dificultad: Fácil** 🟢