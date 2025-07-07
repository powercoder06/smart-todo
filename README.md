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
  - Sub Task Prioritization: AI assigns a priority score (0–1).
  - Sub Deadline Suggestions: AI recommends realistic future deadlines.
  - Sub Smart Categorization: AI suggests category tags.
  - Sub Description Enhancement: AI Enhances Task Descriptions.
- Dark/Light Theme: Toggleable via the header.
- Local LLM Hosting with LM Studio (e.g. Llama-3.2-1b-instruct or qwen3-8b).

## 3. Tech Stack

- **Backend**:
  - Sub Python 3.12, Django 5.2.4, Django REST Framework
  - Sub LM Studio (lms CLI + Python SDK) for local LLM
  - Sub SQLite (dev) / Supabase Postgres (prod)
  - Sub django-cors-headers for CORS
- **Frontend**:
  - Sub Next.js 15, React 19
  - Sub Tailwind CSS 4, PostCSS, Autoprefixer
  - Turbopack dev server

## 4. Setup & Installations

### Backend
1. Clone & create venv
```
git clone https://github.com/your-username/smart-todo.git
cd smart-todo/smart-todo-backend
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate
```
2. Install dependencies
```
pip install --upgrade pip
pip install -r requirements.txt
```
3. Environment
Create a .env file in smart-todo-backend/:
```
# Django
SECRET_KEY=your-secret-key
DEBUG=True

# Database (Supabase or local)
DB_ENGINE=django.db.backends.postgresql
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-db-password
DB_HOST=db.basimmdlhpwoizkjarxo.supabase.co
DB_PORT=5432

# LM Studio
LMSTUDIO_MODEL=llama-3.2-1b-instruct
```
4. Migrate & run
```
python manage.py migrate
python manage.py runserver
```

### Frontend
1. Install & start
```
cd ../smart-todo-frontend
npm install
```
2. Environment
Create a .env.local in smart-todo-frontend/:
```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```
3. Dev server
```
npm run dev
```
## 5. Environment Variables

| Name | Description |
| --- | --- |
| `SECRET_KEY` | 	Django secret key |
| `DEBUG` | True or False |
| `DB_ENGINE` | 		e.g. django.db.backends.postgresql |
| `DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT` | 	Database connection |
| `LMSTUDIO_MODEL` | 		LM Studio model identifier (e.g. llama-3.2-1b-instruct)|
| `NEXT_PUBLIC_API_BASE_URL` | 	Frontend ↔ Backend base URL, e.g. http://127.0.0.1:8000/api |


## 6. API Documentation
All endpoints are prefixed with `/api/`.

**Categories**
- GET `/categories/`: List all categories.
- POST `/categories/`:  Create a new category.
```
{ "name": "Work" }
```
- GET `/categories/{id}/`
- PUT `/categories/{id}/`
- DELETE `/categories/{id}/`

**Tasks**
- GET `/tasks/`
```
[
  {
    "id": 1,
    "title": "Buy groceries",
    "description": "...",
    "category": { "id": 2, "name": "Personal", "usage_frequency": 5 },
    "priority_score": 0.85,
    "deadline": "2025-07-10T18:00:00Z",
    "status": "pending",
    "created_at": "2025-07-04T08:00:00Z",
    "updated_at": "2025-07-04T09:00:00Z"
  },
  …
]
```
- POST `/tasks/`
```
{ 
  "title": "Plan trip",
  "description": "Find a cabin near the lake",
  "category_id": 1
}
```
- GET/PUT/DELETE `/tasks/{id}/`

**AI Suggestion**
- POST `/tasks/{id}/ai-suggest/`
Input JSON:
```
{
  "title": "Plan weekend trip",
  "description": "Find a cabin near the lake and book flights",
  "category_id": 1,
  "context_entry_ids": [3, 5]
}
```
Response JSON:
```
{
  "priority_score": 0.75,
  "deadline": "2025-07-10T18:00:00Z",
  "categories": ["Travel", "High-Priority"],
  "enhanced_description": "I’ve expanded your description with recommended dates..."
}
```

**Context Entries**
- GET `/context/`
- POST `/context/`
```
{
  "task_id": 1,
  "content": "Got an email from Airbnb about cabin availability.",
  "source_type": "email"
}
```
-GET/PUT/DELETE `/context/{id}/`

## 7. Sample Data
### Categories
```
INSERT INTO todo_category (name, usage_frequency) VALUES
('Work', 10),
('Personal', 7),
('Urgent', 3);
```
### Tasks
```
INSERT INTO todo_task (title, description, category_id, priority_score, deadline, status)
VALUES
('Wash clothes', 'I have to wash weekend laundry', 1, 0.2, '2025-07-06T12:00:00Z',' pending'),
('Buy groceries', 'Get milk, eggs, bread', 2, 0.5, '2025-07-05T18:00:00Z','pending');
```
### Context Entries
```
INSERT INTO todo_contextentry (task_id, content, source_type, timestamp)
VALUES
(1, 'Reminder: laundry on Monday', 'note', '2025-07-04T09:00:00Z'),
(2, 'WhatsApp: “Don’t forget eggs!”', 'whatsapp','2025-07-04T10:00:00Z');
```
## 8. Requirements
- Backend
```
pip freeze > requirements.txt
```
- Frontend
package.json and package-lock.json are already included.
