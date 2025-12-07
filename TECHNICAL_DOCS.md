# StudyVault - Secure PDF Platform

## Overview
StudyVault is a free, no-login platform for viewing study PDFs with strong security measures to prevent downloading, printing, and sharing.

## Architecture

### Core Technologies
- **Next.js 16** (App Router)
- **Prisma 7** (PostgreSQL database)
- **Vercel Blob** (Secure PDF storage)
- **pdfjs-dist** (Server-side PDF rendering)
- **canvas** (Image generation with watermarks)

### Security Model

#### PDF Storage
- PDFs stored in Vercel Blob with unguessable URLs
- Blob URLs never exposed to client
- All access proxied through API routes

#### Page-by-Page Delivery
```
Client Request → API Route → Fetch from Blob → Render Page → Add Watermark → Return PNG
```

#### Watermarking
Each page includes:
- "StudyVault — Do Not Share"
- Timestamp
- Unique session ID (cookie-based, no login required)
- Diagonal repeated text overlay

#### Anti-Download Protections
- **Right-click disabled** globally
- **Keyboard shortcuts blocked**: Ctrl+P, Ctrl+S, F12, Ctrl+Shift+I
- **Print CSS**: `@media print { body { display: none !important; } }`
- **Transparent overlay** on PDF viewer
- **Images**: `pointer-events: none`, `user-select: none`, `draggable="false"`
- **No caching**: `Cache-Control: private, no-cache, no-store`

## API Routes

### `/api/upload` (POST)
Upload PDF to Vercel Blob and save metadata.

**Body**: FormData
- `file`: PDF file
- `title`: Document title
- `topicId`: Topic ID
- `description`: Optional description

**Response**: `{ success: true, document: {...} }`

### `/api/pdf/[docId]/[page]` (GET)
Serve a single PDF page as watermarked PNG.

**Params**:
- `docId`: Document ID
- `page`: Page number (1-indexed)

**Response**: PNG image buffer

## Database Schema

```prisma
model Subject {
  id          String   @id @default(uuid())
  name        String   @unique
  slug        String   @unique
  description String?
  topics      Topic[]
}

model Topic {
  id          String     @id @default(uuid())
  name        String
  slug        String     @unique
  subjectId   String
  subject     Subject    @relation(...)
  documents   Document[]
}

model Document {
  id          String   @id @default(uuid())
  title       String
  description String?
  blobUrl     String   // Private Vercel Blob URL
  pageCount   Int
  topicId     String
  topic       Topic    @relation(...)
}
```

## Session Management

Session IDs are generated using `uuid` and stored in HTTP-only cookies:
- Cookie name: `studyvault_session`
- Max age: 7 days
- Used for watermarking only (no authentication)

## Deployment

### Environment Variables
```env
DATABASE_URL=postgresql://...
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

### Vercel Deployment
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Database Setup
```bash
npx prisma db push
```

## Usage Flow

1. **Browse**: Home → Subjects → Topics → Documents
2. **View**: Click document → Page-by-page viewer loads
3. **Navigate**: Previous/Next buttons to change pages
4. **Security**: All interactions blocked, watermarked images only

## Limitations

⚠️ **Best-effort security**: Determined users can still screenshot or use screen recording. Watermarks provide traceability via session IDs.

## File Structure

```
app/
  api/
    upload/route.ts
    pdf/[docId]/[page]/route.ts
  document/[id]/page.tsx
  subjects/[slug]/page.tsx
  subjects/[slug]/[topicSlug]/page.tsx
  page.tsx
  layout.tsx
  globals.css
components/
  pdf-viewer.tsx
  security-provider.tsx
lib/
  pdf-server.ts
  session.ts
prisma/
  schema.prisma
  seed.ts
```
