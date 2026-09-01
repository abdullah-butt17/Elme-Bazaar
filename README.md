<div align="center">

# 🛍️ ELME Bazaar

### Modern Full-Stack Fashion E-Commerce Platform

**ELME Bazaar — Men's Fashion · BR Collection — Women's Fashion**

A responsive, production-ready e-commerce platform built to provide a modern online shopping experience with product management, secure administration, order processing, email notifications, and WhatsApp integration.

<br />

![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-API-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?logo=render&logoColor=white)

<br />

**Frontend:** React + TypeScript + Vite  
**Backend:** Node.js + Express.js  
**Database:** MongoDB Atlas  
**Deployment:** Vercel + Render

</div>

---

## 📖 About the Project

**ELME Bazaar** is a full-stack fashion e-commerce application that brings two clothing brands together in one online shopping platform:

- **ELME Bazaar** — Men's Fashion
- **BR Collection** — Women's Fashion

The platform provides customers with a clean and responsive shopping experience while giving administrators complete control over products, categories, orders, store information, and customer communication.

The application follows a modern frontend/backend architecture with persistent cloud database storage and third-party integrations for images, transactional emails, and customer communication.

---

## ✨ Key Features

### 🛍️ Customer Storefront

- Modern responsive user interface
- Men's and women's fashion sections
- Product browsing
- Product detail pages
- Product image galleries
- Search functionality
- Category filtering
- Collection filtering
- Fabric filtering
- Product sorting
- Featured products
- New arrivals
- Sale pricing
- Stock availability
- Shopping cart
- Checkout flow
- Cash on Delivery ordering
- Order tracking
- WhatsApp customer support
- Responsive mobile navigation

---

## 👗 Product Organization

The application uses a structured product hierarchy.

### ELME Bazaar

Dedicated to men's fashion with products organized into relevant categories and collections.

### BR Collection

Women's products are organized into:

#### Stitched

```text
Stitched
├── 2 Piece
├── 3 Piece
├── Kurta
├── Shirt
├── Co-ord Set
├── Trouser
└── Maxi / Dress
```

#### Unstitched

```text
Unstitched
├── 1 Piece
├── 2 Piece
└── 3 Piece
```

### Fabric

Fabric is maintained as a separate product attribute instead of being part of the category hierarchy.

Supported fabric options include:

```text
Lawn
Cotton
Khaddar
Linen
Chiffon
Organza
Silk
Jacquard
Cambric
```

This allows customers to filter products independently by category, collection, and fabric.

---

## 🛒 Shopping & Checkout

Customers can browse products, select available options, add items to their cart, and complete their order through the checkout system.

```text
Browse Products
      ↓
Product Details
      ↓
Add to Cart
      ↓
Shopping Cart
      ↓
Checkout
      ↓
Customer Information
      ↓
Cash on Delivery
      ↓
Order Created
      ↓
Confirmation Email
```

---

## 📦 Order Management

Each customer order is stored in MongoDB and assigned a unique order reference.

The order lifecycle supports:

```text
Pending
   ↓
Confirmed
   ↓
Processing
   ↓
Shipped
   ↓
Delivered
```

Orders can also be cancelled where permitted by the order workflow.

Administrators can manage order information including:

- Customer details
- Ordered products
- Order totals
- Delivery charges
- Order status
- Courier information
- Tracking codes
- Shipping progress

---

## 🔎 Order Tracking

Customers can track their orders using their unique order reference.

Tracking information can include:

- Order reference
- Current order status
- Courier name
- Tracking code
- Shipping status

This allows customers to check their order progress without needing an account.

---

## 🔐 Admin Dashboard

The application contains a protected administration dashboard for managing the store.

### Product Management

Administrators can:

- Add products
- Edit products
- Delete products
- Upload product images
- Configure categories
- Configure collections
- Select fabrics
- Manage available sizes
- Manage colors
- Set prices
- Set sale prices
- Update stock status
- Mark products as featured
- Manage new arrivals

### Order Management

Administrators can:

- View customer orders
- Review order information
- Change order status
- Add courier information
- Add tracking codes
- Manage the order lifecycle

### Store Settings

Store information can be managed dynamically through the administration panel, including:

- Business information
- Contact details
- WhatsApp number
- Address
- Social media information
- Other configurable store settings

---

## 📧 Email Notifications

The backend integrates transactional email functionality.

Emails can be automatically sent for events such as:

### Customer

- Order confirmation
- Order status changes
- Shipping updates
- Tracking information

### Administrator

- New order notifications

Transactional email delivery is handled through **Brevo**.

---

## 💬 WhatsApp Integration

WhatsApp support is integrated throughout the storefront.

The business WhatsApp number is managed through the **Admin Settings** panel instead of being hardcoded into frontend components.

```text
Admin Settings
      ↓
WhatsApp Number
      ↓
Backend / Store Settings
      ↓
Frontend
      ↓
WhatsApp Contact Buttons
```

This allows the store owner to update the WhatsApp number without changing the application source code.

---

# 🧰 Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript | Type-safe frontend development |
| Vite | Development and build tooling |
| Tailwind CSS | Styling |
| TanStack Router | Client-side routing |
| Framer Motion | UI animations |
| React Icons | Icons |
| Axios | API communication |

---

## Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcrypt | Password hashing |
| Express Validator | Request validation |
| Helmet | HTTP security |
| CORS | Cross-origin configuration |

---

## Cloud & External Services

| Service | Purpose |
|---|---|
| MongoDB Atlas | Cloud database |
| Cloudinary | Product image storage |
| Brevo | Transactional emails |
| Vercel | Frontend deployment |
| Render | Backend deployment |
| GitHub | Source control |

---

# 🏗️ Application Architecture

```text
                     ┌──────────────────────┐
                     │       Customer       │
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │   React Frontend     │
                     │      (Vercel)        │
                     └──────────┬───────────┘
                                │
                           HTTPS / REST
                                │
                                ▼
                     ┌──────────────────────┐
                     │ Node.js + Express API│
                     │       (Render)       │
                     └──────────┬───────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
      ┌───────────────┐ ┌──────────────┐ ┌───────────────┐
      │ MongoDB Atlas │ │  Cloudinary  │ │    Brevo      │
      │   Database    │ │    Images    │ │     Email     │
      └───────────────┘ └──────────────┘ └───────────────┘
```

---

# 📁 Project Structure

```text
elmebazaar/
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── data/
│   │   ├── lib/
│   │   ├── routes/
│   │   ├── store/
│   │   └── ...
│   │
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   └── server/
│       │
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── validators/
│       │
│       ├── .env.example
│       └── package.json
│
├── .gitignore
├── LICENSE
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Before running the application locally, install:

- Node.js
- npm
- Git

You will also need your own credentials for the external services used by the application.

---

## 1. Clone the Repository

```bash
git clone <repository-url>
```

Navigate into the project:

```bash
cd elmebazaar
```

---

# 💻 Frontend Setup

Navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a local `.env` file.

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

The Vite development server will provide the local frontend URL.

---

# ⚙️ Backend Setup

From the project root:

```bash
cd backend/server
```

Install dependencies:

```bash
npm install
```

Create your local `.env` file.

Example:

```env
NODE_ENV=development
PORT=5000

MONGO_URI=
JWT_SECRET=

ADMIN_EMAIL=

BREVO_API_KEY=
BREVO_SENDER_EMAIL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CLIENT_URL=http://localhost:5173
```

> The exact environment variables required may depend on your backend configuration.

Start the backend:

```bash
npm run dev
```

or, depending on the scripts configured in `package.json`:

```bash
npm start
```

---

# 🌐 Production Deployment

The project uses separate frontend and backend deployments.

## Frontend — Vercel

Recommended Vercel configuration:

```text
Framework Preset:   Vite
Root Directory:     frontend
Install Command:    npm install
Build Command:      npm run build
Output Directory:   dist
```

Production frontend environment:

```env
VITE_API_URL=https://YOUR-BACKEND.onrender.com/api
```

---

## Backend — Render

Recommended Render configuration:

```text
Runtime:            Node
Branch:             main
Root Directory:     backend/server
Build Command:      npm install
Start Command:      npm start
NODE_ENV:           production
```

The backend should use Render's provided port:

```js
const PORT = process.env.PORT || 5000;
```

The frontend production origin should also be configured in the backend environment:

```env
CLIENT_URL=https://elmebazaar.vercel.app
```

---

# 🔄 Production Architecture

```text
https://elmebazaar.vercel.app
              │
              │ API Requests
              ▼
https://your-backend.onrender.com/api
              │
              ├──── MongoDB Atlas
              │
              ├──── Cloudinary
              │
              └──── Brevo
```

---

# 🔒 Environment Variables & Security

Production credentials are **not stored in this repository**.

The following must never be committed:

```text
.env
.env.local
.env.production
API keys
Database credentials
JWT secrets
Passwords
Private service credentials
```

The repository should contain only safe example files such as:

```text
frontend/.env.example
backend/server/.env.example
```

Example files should contain variable names but **never real secrets**.

---

## 🔐 Security Features

The backend architecture includes security practices such as:

- JWT authentication
- Password hashing
- Protected administrator routes
- Request validation
- CORS configuration
- Security headers
- Environment-based secrets
- Restricted administrative functionality

---

# 📱 Responsive Design

The application is designed to work across:

- 🖥️ Desktop
- 💻 Laptop
- 📱 Mobile
- 📟 Tablet

The product catalog, navigation, shopping cart, checkout, filters, and administrative interfaces are designed with responsive layouts.

---

# 🎯 Project Goals

The project was developed to create a practical full-stack e-commerce solution that combines:

- Modern UI/UX
- Real-world product management
- REST API development
- Database integration
- Authentication
- Cloud image management
- Transactional email
- Order processing
- Responsive design
- Production deployment

---

# 🗺️ Future Improvements

Potential future additions include:

- 💳 Online payment gateway
- 👤 Customer accounts
- ❤️ Persistent wishlists
- ⭐ Product reviews and ratings
- 🎟️ Coupon and discount management
- 📊 Advanced admin analytics
- 📉 Inventory alerts
- 🧾 PDF invoices
- 🚚 Shipping provider integration
- 🔔 Customer notifications
- 📈 Sales reports
- 🔍 Advanced product search
- 📦 Inventory management

---

# 👨‍💻 Developer

### Abdullah Butt

**AI & Software Developer**

Interested in:

`Artificial Intelligence` · `Machine Learning` · `Full-Stack Development` · `Python` · `React` · `Node.js`

GitHub: **@abdullah-butt17**

---

# 📄 License

This project is licensed under the **MIT License**.

See the `LICENSE` file for additional information.

---

# ⚠️ Disclaimer

This repository intentionally excludes production credentials and sensitive configuration.

Anyone cloning the project must configure their own:

- MongoDB database
- Cloudinary account
- Transactional email credentials
- JWT secret
- Environment variables
- Deployment configuration

Never commit real `.env` files or private API credentials to GitHub.

---

<div align="center">

### ELME Bazaar

**Fashion for Him & Her**

Built with React, Node.js, Express & MongoDB.

⭐ If you find this project useful, consider giving the repository a star.

</div>
