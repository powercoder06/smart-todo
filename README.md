# Smart Todo List with AI Integration

A full-stack task management app featuring:
- AI-powered suggestions: Priority scoring, deadline recommendations, smart categorization, and enhanced descriptions.
- Context-aware: Ingest notes, emails, and WhatsApp snippets to inform AI.
- Modern stack: Django REST Framework backend, Next.js + Tailwind CSS frontend.
- Local LLM hosting via LM Studio, no external API keys required.

## Table of Contents 
1. Screenshots
2. Features
3. Tech Stack
4. Setup & Installation
  - Backend
  - Frontend
5. Environment Variables
6. API Documentation
7. Sample Data
8. Requirements

## Setup

### Backend
```
cd smart-todo-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# edit .env
python manage.py migrate
python manage.py runserver
```

### Frontend
```
cd smart-todo-frontend
npm install
cp .env.local.example .env.local
# edit .env.local
npm run dev
```

## API
- GET/POST /api/tasks/
- GET/PUT/DELETE /api/tasks/{id}/
- POST /api/tasks/{id}/ai-suggest/
- GET/POST /api/context/
- GET/PUT/DELETE /api/context/{id}/
