# n8n Flow Sharing App

A static web app for discovering, previewing, and sharing n8n workflows. Uses `@n8n_io/n8n-demo-component` for live workflow previews and Microsoft Dataverse as the backend data store, accessed via n8n workflows using `n8n-nodes-ms-dataverse`.

## Architecture

```
┌─────────────────┐     Webhook API     ┌──────────────┐     OData API     ┌────────────┐
│  Static Web App │ ──────────────────► │  n8n Backend │ ────────────────► │  Dataverse  │
│  (React + Vite) │ ◄────────────────── │  (Webhooks)  │ ◄──────────────── │  (Tables)   │
└─────────────────┘      JSON           └──────────────┘                   └────────────┘
```

## Project Structure

```
├── database/
│   └── schema.md              # Dataverse table schema documentation
├── n8n-workflows/
│   └── n8n-flow-sharing-api.json  # Importable n8n workflow (backend API)
├── src/
│   ├── api.js                 # API client for n8n webhook endpoints
│   ├── App.jsx                # Root app with routing
│   ├── main.jsx               # Entry point
│   ├── index.css              # Tailwind CSS styles
│   ├── components/
│   │   ├── Header.jsx         # Navigation header
│   │   ├── FlowCard.jsx       # Flow listing card
│   │   ├── SearchBar.jsx      # Search input
│   │   └── CategoryFilter.jsx # Category filter pills
│   └── pages/
│       ├── HomePage.jsx       # Flow gallery with search & filter
│       └── FlowDetailPage.jsx # Flow detail with n8n-demo preview
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env.example
```

## Setup

### 1. Dataverse Tables

Create the following tables in your Dataverse environment (see `database/schema.md` for full schema):

- **`timyeung_n8nflow`** — Stores workflow name, description, JSON, author, tags, stats
- **`timyeung_n8ncategory`** — Lookup table for categories (Automation, AI & ML, etc.)
- **`timyeung_n8nflowstat`** — Optional per-day analytics

### 2. n8n Backend Workflow

1. Install the community node: `n8n-nodes-ms-dataverse`
2. Import `n8n-workflows/n8n-flow-sharing-api.json` into your n8n instance
3. Configure the **Dataverse OAuth2** credential with your Azure AD app registration
4. Activate the workflow — it exposes these webhook endpoints:
   - `GET /webhook/n8n-flows` — List published flows (supports `?search=`, `?category=`, `?page=`, `?pageSize=`)
   - `GET /webhook/n8n-flows/categories` — List all categories
   - `GET /webhook/n8n-flows/:id` — Get a single flow with full JSON (also increments view count)

### 3. Frontend

```bash
# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env to set VITE_N8N_WEBHOOK_BASE to your n8n instance URL

# Start dev server
npm run dev

# Build for production
npm run build
```

### 4. Deploy

The `dist/` folder after `npm run build` is a fully static site that can be deployed to:
- Azure Static Web Apps
- Netlify
- Vercel
- Any static hosting

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_N8N_WEBHOOK_BASE` | Base URL of your n8n webhook endpoints | `/api` |

## Dataverse Credentials (n8n)

The n8n workflow requires a **Microsoft Dataverse OAuth2** credential. See the [n8n-nodes-ms-dataverse docs](https://github.com/wtyeung/n8n-nodes-ms-dataverse) for setup:

1. Register an Azure AD App with Dataverse API permissions
2. In n8n, create a "Microsoft Dataverse OAuth2" credential
3. Set the Environment URL (e.g., `https://yourorg.crm.dynamics.com`)
4. Complete the OAuth2 flow

## Features

- Live workflow preview using `@n8n_io/n8n-demo-component`
- Search and filter by category/tags
- Copy workflow JSON to clipboard
- Download workflow as `.json` file
- View counts tracked in Dataverse
- Responsive dark-themed UI
