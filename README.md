# Vernissage — Art Gallery

A full-stack art gallery web app built with vanilla HTML/CSS/JS, Node.js, Express, and MySQL.

## Project Structure

```
art-gallery/
├── backend/
│   ├── server.js       ← Express API server
│   ├── schema.sql      ← MySQL schema + seed data
│   ├── package.json
│   └── .env            ← Your DB credentials (edit this!)
└── frontend/
    ├── index.html      ← Gallery grid page
    ├── artwork.html    ← Single artwork detail page
    ├── cart.html       ← Cart + checkout page
    ├── css/
    │   └── styles.css
    └── js/
        ├── cart.js       ← Shared cart utilities
        ├── gallery.js    ← Gallery page logic
        ├── artwork.js    ← Detail page logic
        └── cart-page.js  ← Cart page + order logic
```

## Quick Start

### 1. Set up the database

```bash
mysql -u root -p < backend/schema.sql
```

### 2. Configure environment

Edit `backend/.env` and fill in your MySQL password:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_password
DB_NAME=art_gallery
PORT=3001
```

### 3. Start the backend

```bash
cd backend
npm install
npm start
```

Test it: open `http://localhost:3001/api/artworks` in your browser.

### 4. Serve the frontend

In a second terminal:

```bash
cd frontend
npx serve .
```

Open `http://localhost:3000` in your browser.

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/artworks | All available artworks |
| GET | /api/artworks/:id | Single artwork by ID |
| POST | /api/orders | Place a new order |
| GET | /api/orders | All orders (admin) |

## Development tip

For auto-restart on file save, use nodemon:

```bash
cd backend
npm run dev
```
