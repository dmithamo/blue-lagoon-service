# Quick Start Guide - Blue Lagoon Hotels Reservation System

## Single Command Deployment (Docker)

```bash
cd /Users/dmithamo/dev/swork/scs6124-soa/blue-lagoon-service
docker-compose up --build
```

Access:
- **Frontend:** http://localhost (port 80)
- **Backend API:** http://localhost:8080 (port 8080)

---

## Development Mode (Recommended for Learning)

### Terminal 1: Backend (Spring Boot)

```bash
cd backend
./gradlew bootRun
```

Backend will start on `http://localhost:8080`

### Terminal 2: Frontend (Angular Dev Server)

```bash
cd frontend
npm start
# or ng serve
```

Frontend will start on `http://localhost:4200` with automatic proxy to backend API

---

## Project Structure

```
blue-lagoon-service/
├── backend/                    # Spring Boot REST API
│   ├── src/
│   ├── build.gradle           
│   ├── Dockerfile             # Backend Docker image
│   └── .dockerignore
│
├── frontend/                   # Angular 21 UI (Tailwind CSS)
│   ├── src/app/
│   │   ├── components/        # Header, Footer
│   │   ├── pages/             # Home, Reservations, About, Contact
│   │   └── app.routes.ts      # Routing configuration
│   ├── package.json
│   ├── tailwind.config.js
│   ├── proxy.conf.json        # Dev server proxy to API
│   ├── Dockerfile             # Frontend Docker image
│   ├── nginx.conf             # Production nginx config
│   └── .dockerignore
│
├── docker-compose.yml         # Single command deployment
├── README.md                  # Full documentation
└── QUICKSTART.md             # This file

```

---

## What's Included

### ✅ Frontend (Angular 21)
- Modern UI with Tailwind CSS
- Responsive Header & Footer components
- 4 Pages: Home, Reservations, About, Contact
- Router configured for SPA navigation
- Proxy configuration for API integration

### ✅ Backend (Spring Boot)
- RESTful API ready for implementation
- Gradle build system
- Docker-ready configuration
- Ready for JPA/Hibernate integration

### ✅ Docker
- Multi-stage build for optimized images
- Nginx reverse proxy (frontend)
- Docker Compose for easy deployment
- Health checks for both services
- Network isolation and connectivity

### ✅ Documentation
- Comprehensive README with:
  - Roy Fielding's 6 REST Constraints explained
  - Detailed REST vs SOAP analysis
  - API documentation
  - Docker deployment guide
- Git history with meaningful commits

---

## Key Files for Your Assignment

1. **README.md** - Questions 1 & 2 responses:
   - ✅ Roy Fielding's 6 REST Constraints (with Blue Lagoon examples)
   - ✅ REST vs SOAP detailed comparison

2. **frontend/src/app/pages/reservations/reservations.html**
   - Question 3: Reservation request form with proper inputs

3. **backend/** (ready for API implementation)
   - Question 4: REST endpoints to be implemented

4. **docker-compose.yml**
   - Single command deployment: `docker-compose up --build`

---

## Testing the System

### Frontend Tests
- Visit http://localhost:4200 (dev mode) or http://localhost (docker)
- Navigate through pages (Home, Reservations, About, Contact)
- Test responsive design on mobile

### Backend Tests
- Health check: `curl http://localhost:8080/actuator/health`
- Ready for API implementation

---

## Next Implementation Steps

1. **Backend API Endpoints** (Question 4)
   ```
   POST /api/reservations    → Create reservation
   GET  /api/reservations/{id} → Get reservation
   ```

2. **Database Layer**
   - Add JPA entities
   - Configure MySQL/PostgreSQL

3. **Frontend Integration**
   - Connect reservation form to API
   - Add success/error handling
   - Display confirmation details

---

## Commands Reference

```bash
# Development
cd backend && ./gradlew bootRun          # Start backend
cd frontend && npm start                 # Start frontend

# Docker
docker-compose up --build                # Start all services
docker-compose down                      # Stop all services
docker-compose logs -f frontend          # View frontend logs
docker-compose logs -f backend           # View backend logs

# Git
git log --oneline                        # View commit history
git status                               # Check changes
```

---

## Assignment Submission Checklist

- ✅ Directory structure: backend/ and frontend/
- ✅ Angular v21 UI with Tailwind CSS
- ✅ Header and Footer components
- ✅ Routing configured
- ✅ README with Q1 & Q2 answers
- ✅ REST API endpoints designed (in README)
- ✅ Reservation form UI (Q3)
- ✅ Docker configuration (single command deployment)
- ✅ Git history with meaningful commits

---

**Status:** Ready for backend API implementation and database integration

**Last Updated:** April 17, 2025
