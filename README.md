# Developer Portfolio

Modern portfolio website with Three.js 3D globe showing career journey.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

Deploy `dist/` folder to Vercel/Netlify.

## Architecture

- **Vite** - Build tool, dev server
- **React + TypeScript** - UI framework
- **React Router** - Client-side routing with lazy loading
- **TanStack Query** - Data fetching, caching
- **Three.js** - 3D graphics via React Three Fiber + Drei
- **Tailwind CSS** - Utility-first styling

### Folder Structure

```
src/
├── main.tsx              # Entry point, routing setup
├── App.tsx               # Layout with navigation
├── pages/                # Route components (lazy loaded)
│   ├── Landing.tsx       # Hero page
│   ├── Experience.tsx    # 3D globe with career markers
│   ├── Projects.tsx      # Filterable project grid
│   ├── About.tsx         # Bio + skills
│   └── Blog.tsx          # RSS feed
├── components/
│   ├── Nav.tsx           # Responsive navigation
│   ├── ProjectCard.tsx
│   ├── ExperiencePanel.tsx
│   └── three/            # Three.js components
│       ├── Globe.tsx
│       ├── Marker.tsx
│       └── StarField.tsx
├── hooks/
│   └── useMediaQuery.ts  # Responsive + reduced motion
├── services/             # Data layer (TanStack Query wrappers)
│   ├── experiences.ts
│   ├── projects.ts
│   └── blog.ts
├── data/                 # Static JSON
│   ├── experiences.json
│   └── projects.json
└── types/
    └── index.ts
```

## Adding Content

### Experiences

Edit `src/data/experiences.json`:

```json
{
  "id": "unique-id",
  "type": "work",
  "title": "Job Title",
  "company": "Company Name",
  "location": "City, Country",
  "coords": [x, y, z],
  "period": "2020 - 2023",
  "description": "What you did",
  "tech": ["React", "Node.js"]
}
```

**Coordinate Conversion (lat/lon → xyz):**

Globe radius = 1.5. Use this formula:

```js
const radius = 1.5
const phi = (90 - lat) * (Math.PI / 180)
const theta = (lon + 180) * (Math.PI / 180)
const x = -(radius * Math.sin(phi) * Math.cos(theta))
const y = radius * Math.cos(phi)
const z = radius * Math.sin(phi) * Math.sin(theta)
```

**Type:** `"work"` (blue marker) or `"study"` (orange marker)

### Projects

Edit `src/data/projects.json`:

```json
{
  "id": "unique-id",
  "title": "Project Name",
  "description": "Brief description",
  "tech": ["React", "TypeScript"],
  "github": "https://github.com/...",
  "demo": "https://demo.com"
}
```

**Future GitHub API:**
Replace import in `src/services/projects.ts` with:

```ts
const response = await fetch('https://api.github.com/users/USERNAME/repos')
return response.json()
```

### Blog RSS Feed

Update `RSS_URL` in `src/services/blog.ts`:

```ts
const RSS_URL = 'https://your-blog.com/rss'
```

Uses CORS proxy (`allorigins.win`) to fetch feed. If proxy fails, alternatives:
- Deploy own proxy
- Use backend endpoint
- Switch RSS source

## Features

### 3D Globe Experience

- Interactive globe with career location markers
- Blue markers = work experience
- Orange markers = study/education
- Click marker → camera zooms → detail panel opens
- Auto-rotation (disabled with prefers-reduced-motion)
- WebGL fallback for unsupported browsers

### Navigation

- Desktop: floating nav bar (top center)
- Mobile: hamburger menu (slide-in drawer)
- Active route highlighting

### Performance

- Route-based code splitting (React.lazy)
- Image lazy loading
- TanStack Query caching (15min for blog)
- Vite asset optimization

### Accessibility

- Keyboard navigation
- Reduced motion support (stops globe rotation)
- Semantic HTML
- ARIA labels

## Key Files

- **`src/main.tsx`** - Router + QueryClient initialization
- **`src/pages/Experience.tsx`** - 3D scene orchestration
- **`src/components/three/Globe.tsx`** - Main globe mesh
- **`src/components/three/Marker.tsx`** - Clickable location markers
- **`src/services/blog.ts`** - RSS parser with DOMParser
- **`tailwind.config.js`** - Dark mode + custom colors

## Notes

- **SEO:** Limited for SPA. Use Vite SSG plugin or framework mode for better SEO.
- **CV Download:** Replace `public/cv.pdf` with actual resume.
- **Blog:** Requires valid RSS feed. Empty state shown if unavailable.
- **Three.js:** Uses React Three Fiber (declarative Three.js) + Drei (helpers).

## License

MIT
