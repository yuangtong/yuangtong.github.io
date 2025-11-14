# 🚀 Guía de Implementación: Contentful + Supabase

## 📋 Índice
1. Configuración de Contentful CMS
2. Configuración de Supabase
3. Variables de Entorno
4. Implementación de Código
5. Testing y Validación
6. Deployment
7. Mantenimiento

---

## 1. Configuración de Contentful CMS

### 1.1 Crear Cuenta y Espacio

1. Registrarse en Contentful (https://www.contentful.com)
2. Crear un nuevo Space para el proyecto
3. Obtener credenciales: Space ID y Access/Preview Tokens en Settings > API Keys

### 1.2 Crear Modelos de Contenido

#### 1.2.1 Modelo: Project
```
Content Type ID: project
Fields:
├── title (Short text) - Required
├── slug (Short text) - Required, Unique
├── description (Long text) - Required
├── longDescription (Rich text)
├── technologies (Short text, List)
├── category (Short text) - Required
├── featured (Boolean)
├── status (Short text) - completed | in-progress | planned
├── startDate (Date)
├── endDate (Date)
├── githubUrl (Short text)
├── liveUrl (Short text)
├── images (Media, Multiple)
├── thumbnail (Media) - Required
├── order (Integer)
└── seo (Object)
    ├── metaTitle
    ├── metaDescription
    └── keywords (List)
```

#### 1.2.2 Modelo: Blog Post
```
Content Type ID: blogPost
Fields:
├── title, slug (Unique), excerpt, content (Rich text)
├── author, publishDate, featured, tags (List), category
├── readTime (Integer)
├── featuredImage (Media), gallery (Media, Multiple)
├── status: draft | published | archived
└── seo (Object): metaTitle, metaDescription, keywords
```

#### 1.2.3 Modelo: Work Experience
```
Content Type ID: workExperience
Fields:
├── company, position (Required)
├── description (Rich text), startDate (Required), endDate, current
├── location, technologies (List)
├── achievements (Rich text), companyLogo (Media), companyUrl
└── order (Integer)
```

#### 1.2.4 Modelo: Site Settings
```
Content Type ID: siteSettings
Fields:
├── siteName (Required), siteDescription
├── contactEmail
├── socialLinks (github, linkedin, twitter, instagram)
├── heroTitle, heroSubtitle, aboutText (Rich text)
├── resumeFile (Media), profileImage (Media)
└── testimonials (Reference, Multiple)
```

### 1.3 Webhooks (Opcional)
```
Settings > Webhooks > Add webhook
URL: https://tu-dominio.com/api/revalidate
Triggers: publish/unpublish/delete
```

---

## 2. Configuración de Supabase

### 2.1 Crear Proyecto y Credenciales
- Registrarse en Supabase (https://supabase.com)
- Crear proyecto
- Obtener `Project URL`, `Anon Key` y `Service Role Key` en Settings > API

### 2.2 Esquemas de Base de Datos

#### 2.2.1 Tabla: contact_form_entries
```sql
CREATE TABLE contact_form_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  message TEXT NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255),
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  source VARCHAR(100)
);
CREATE INDEX idx_contact_entries_email ON contact_form_entries(email);
CREATE INDEX idx_contact_entries_created_at ON contact_form_entries(created_at);
CREATE INDEX idx_contact_entries_status ON contact_form_entries(status);
```

#### 2.2.2 Tabla: cv_download_entries
```sql
CREATE TABLE cv_download_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  position VARCHAR(255),
  reason TEXT,
  download_type VARCHAR(50) DEFAULT 'pdf',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  downloaded BOOLEAN DEFAULT FALSE,
  download_count INTEGER DEFAULT 0
);
CREATE INDEX idx_cv_downloads_email ON cv_download_entries(email);
CREATE INDEX idx_cv_downloads_created_at ON cv_download_entries(created_at);
```

#### 2.2.3 Tabla: analytics_entries
```sql
CREATE TABLE analytics_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB,
  page_url VARCHAR(500),
  referrer VARCHAR(500),
  user_agent TEXT,
  ip_address INET,
  session_id VARCHAR(255),
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_analytics_event_type ON analytics_entries(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_entries(created_at);
CREATE INDEX idx_analytics_session_id ON analytics_entries(session_id);
```

#### 2.2.4 Tabla: subscribers
```sql
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  source VARCHAR(100),
  preferences JSONB DEFAULT '{}',
  confirmed BOOLEAN DEFAULT FALSE,
  confirmation_token VARCHAR(255)
);
CREATE UNIQUE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_status ON subscribers(status);
```

### 2.3 RLS (Row Level Security)
```sql
ALTER TABLE contact_form_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_download_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert for all users" ON contact_form_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select for authenticated users" ON contact_form_entries FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow insert for all users" ON cv_download_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for all users" ON analytics_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for all users" ON subscribers FOR INSERT WITH CHECK (true);
```

### 2.4 Funciones y Triggers
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contact_entries_updated_at
  BEFORE UPDATE ON contact_form_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 3. Variables de Entorno

Crear `.env.local`:
```
VITE_CONTENTFUL_SPACE_ID=
VITE_CONTENTFUL_ACCESS_TOKEN=
VITE_CONTENTFUL_PREVIEW_TOKEN=
VITE_CONTENTFUL_ENVIRONMENT=master
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:5173
VITE_ENABLE_ANALYTICS=true
```

---

## 4. Implementación de Código

Instalar dependencias:
```
npm install @contentful/rich-text-react-renderer @supabase/supabase-js
npm install -D @types/node
```

Servicios a completar:
- `src/services/contentful.ts`: cliente, fetchers, rich text renderer, util `getImageUrl`
- `src/services/supabase.ts`: cliente, inserciones, lecturas, analytics, util IP/Session
- Hooks: `src/hooks/useContentful.ts` para projects, posts, work

### 4.1 Modelo de Contentful: TimelineEntry (interno)

```
Content Type ID: timelineEntry
Fields:
├── title (Short text) - Required
├── organization (Short text)
├── description (Long text)
├── startDate (Date) - Required
├── endDate (Date)
├── dateRangeDisplay (Short text) - Ej: "2024 – Present" (opcional)
├── iconKey (Short text) - enum: briefcase | graduation | award | code | management | milestone
└── order (Integer) - Required (para ordenación ascendente)

Notas:
- Si `dateRangeDisplay` no se rellena, se formateará a partir de `startDate` y `endDate`.
- `iconKey` se mapea directamente al UI de la Timeline.
- Se recomienda separar este modelo de WorkExperience.
```

Adapter mínimo listo en código:
```
// src/types/contentful.ts
export interface TimelineEntryFields { /* ya definido */ }
export type TimelineEntry = ContentfulEntry<TimelineEntryFields>;

// src/services/contentful.ts
contentfulService.getTimeline(): Promise<CareerMilestone[]> // stub y mapper
contentfulService.mapTimelineEntryToMilestone(entry: TimelineEntry): CareerMilestone
```

---

## 5. Testing y Validación

Local:
```
npm run dev
// En consola del navegador
await contentfulService.getProjects()
await supabaseService.healthCheck()
```

---

## 6. Deployment

Configurar variables en Netlify/Vercel y hacer build:
```
npm run build
npm run preview
```

---

## 7. Mantenimiento

- Monitoreo de logs (Supabase) y modelos (Contentful)
- Rotación de claves y backups regulares
- Optimizaciones de caché y rendimiento