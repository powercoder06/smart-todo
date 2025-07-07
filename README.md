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

## 1. Screenshots

### Dashboard
![image](https://github.com/user-attachments/assets/7add74de-ca49-43d9-a308-1e5962fc68af)

### Context 
![image](https://github.com/user-attachments/assets/67bc00d5-c4e6-457d-8d05-9bc12108ac66)

### Edit Task
![image](https://github.com/user-attachments/assets/bf098053-35ed-4dd8-832f-5dfd4ebeb19e)

## 2. Features
- Task Management: CRUD tasks with title, description, category, status, priority, deadline.
- Context Entries: Store free-form notes, emails, WhatsApp snippets.
- AI Integration:
Task Prioritization: AI assigns a priority score (0–1).
Deadline Suggestions: AI recommends realistic future deadlines.
Smart Categorization: AI suggests category tags.
Description Enhancement: AI Enhances Task Descriptions.
- Dark/Light Theme: Toggleable via the header.
- Local LLM Hosting with LM Studio (e.g. Llama-3.2-1b-instruct or qwen3-8b).

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
