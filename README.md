# Simplified Cloud-Based Document Management System

## Objective
Develop a basic yet functional web-based document management system using **Next.js, AdonisJS, and Inertia** within one week.

---

## Project Overview
Create a simplified system that allows users to upload, store, and retrieve documents.  
The system should be:
- Web-based
- User-friendly
- Scalable (via database + object storage)

---

## Technical Requirements

### Frontend
- Framework: **Next.js** with **Inertia.js** (bridging frontend & backend)
- Features:
  - Simple UI for uploading documents
  - Listing of uploaded documents
  - *Optional*: User login & dashboard

### Backend
- Framework: **AdonisJS**
- Features:
  - RESTful API or Inertia responses for document upload & retrieval
  - File handling with AdonisJS `Drive` provider
  - Store document metadata in the database
- Storage: AdonisJS **Drive**
  - Local storage in development
  - S3 / DigitalOcean Spaces / Supabase Storage in production

### Database
- **PostgreSQL** (MySQL or SQLite optional for dev)
- Tables:
  - `users` (if authentication enabled)
  - `documents` (id, user_id, filename, path, uploaded_at, etc.)

### User Authentication (Optional)
- AdonisJS **Auth**
  - Session-based or token-based
  - Includes login, registration, password reset

---

## Deliverables
- Fully functional web app:
  - Document upload
  - Document retrieval & listing
  - *Optional*: Authenticated user dashboard
- Clean, modular code with **Next.js + AdonisJS + Inertia**
- Configurable storage (local & cloud)

---

## Evaluation Criteria
- Functionality & compliance with requirements
- Code quality, modularity, and organization
- Effective use of **AdonisJS + Inertia + Next.js** stack

---

## Time Frame
- Project completion: **1 week**
