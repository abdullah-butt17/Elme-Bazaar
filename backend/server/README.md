# ELME Bazaar — Backend API

_Where Tradition Meets Elegance_

Production-quality Node.js/Express/MongoDB backend for the ELME Bazaar fashion catalog and BR Collection. Replaces the React frontend's mock data with a real database-backed API.

The platform supports men's clothing from ELME Bazaar and women's unstitched suits from BR Collection. Customers can place orders through WhatsApp, while products, categories, collections, settings, and website content are managed through a secure Admin Portal.

## Tech Stack

Node.js · Express.js · MongoDB Atlas · Mongoose · JWT · bcrypt · Cloudinary · Multer · Helmet · CORS · express-validator · express-rate-limit · express-mongo-sanitize · Morgan · Jest/Supertest

## Getting Started

```bash
cd server
npm install
cp .env.example .env   # then fill in your real Mongo URI, JWT secret, Cloudinary keys, etc.
npm run seed:admin     # creates the first admin login from ADMIN_EMAIL/ADMIN_PASSWORD in .env
npm run dev            # starts on http://localhost:5000