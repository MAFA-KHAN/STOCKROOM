# STOCKROOM — E-Commerce Inventory & Stock Management Dashboard

A modern, high-performance E-Commerce Inventory & Stock Management SaaS application engineered with React 18 and Vite. Designed to manage product catalogs, real-time stock levels, multi-parameter filtering, and audit logging.

---

## Architectural Comparison: Client-Side Rendering (CSR) vs. Server-Side Rendering (SSR)

Client-Side Rendering (CSR) and Server-Side Rendering (SSR) represent two distinct rendering strategies for modern web applications. In a CSR architecture—such as this Vite + React SPA—the web server delivers a minimal HTML shell along with packaged JavaScript bundles. The browser executes this JavaScript, mounts the React component tree, and dynamically manipulates the DOM. Server-side computation is minimal, shifting execution to the client device.

Conversely, Server-Side Rendering (SSR)—implemented by frameworks like Next.js—executes React components on the server for each request. The server fetches required data, renders the component hierarchy into a complete HTML document, and streams it to the browser. The user sees meaningful content immediately, followed by a hydration step where client JavaScript binds event listeners to the pre-rendered markup.

When evaluating performance, SEO, and hosting for an enterprise application, trade-offs emerge:

1. **Performance & Interactivity**: CSR exhibits a slower First Contentful Paint (FCP) because clients must download and execute large JavaScript bundles before displaying UI. However, once loaded, subsequent interactions—such as searching inventory, toggling stock, and filtering categories—execute instantly in memory without round-trips. SSR improves initial load and Time to First Byte (TTFB), though Time to Interactive (TTI) remains tied to hydration.
2. **SEO & Indexability**: SSR delivers fully rendered HTML directly to search crawlers, ensuring indexability for public product pages. CSR relies on crawlers executing dynamic JavaScript, which can delay indexing.
3. **Hosting Costs & Complexity**: CSR compiles to static HTML, CSS, and JS, allowing free, globally distributed deployment on static CDNs like Netlify or Vercel. SSR requires active Node.js runtimes or serverless containers, increasing infrastructure overhead.

For this internal STOCKROOM Inventory Dashboard, CSR is the superior choice because administrative tools operate behind authentication where SEO is unnecessary, while client-side speed and zero-maintenance static hosting maximize efficiency.

---

## Technical Stack & Architecture

- **Build Engine**: Vite 6.0
- **Framework**: React 18 (Functional & Class Components)
- **State & Storage**: React Hooks (`useState`, `useEffect`, `useContext`, `useRef`, `useMemo`, `useCallback`), Browser `localStorage`
- **Component Paradigms**:
  - `src/components/class/AuditLogger.jsx`: Class component with `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`.
  - `src/components/functional/`: Modern modular functional components.
  - `src/context/ThemeContext.jsx`: Global theme provider for Light and Dark modes.
  - `src/hooks/useInventory.js`: Custom encapsulated hook managing inventory state, persistence, and dynamic document titles.
- **Icons**: Lucide React

---

## Getting Started Locally

### Prerequisites
- Node.js (version 18 or higher)
- npm (version 9 or higher)

### Installation & Execution
```bash
# 1. Clone repository
git clone https://github.com/MAFA-KHAN/web_assignment.git
cd web_assignment

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The application will be live at `http://localhost:5173/`.

### Production Build
```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

---

## Deployment Guide (Netlify / Vercel)

### Option 1: One-Click Netlify Deployment
1. Push your repository to GitHub.
2. Sign in to [Netlify](https://www.netlify.com/).
3. Click **Add new site** > **Import an existing project** > **GitHub**.
4. Select `stockroom-inventory-dashboard`.
5. Verify build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **Deploy Site**.

### Option 2: Vercel Deployment
1. Sign in to [Vercel](https://vercel.com/).
2. Click **Add New...** > **Project** and import your repository.
3. Framework preset will automatically detect **Vite**.
4. Click **Deploy**.

---

## Brand Signature
Powered by **Mafa**
