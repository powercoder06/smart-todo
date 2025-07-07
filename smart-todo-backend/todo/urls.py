from django.urls import path
from .views import (
    CategoryListCreateView,
    CategoryDetailView,
    TaskListCreateView,
    TaskDetailView,
    ContextEntryListCreateView,
    ContextEntryDetailView,
    TaskAISuggestView,         

urlpatterns = [
    # Categories
    path("categories/", CategoryListCreateView.as_view(), name="category-list"),
    path("categories/<int:pk>/", CategoryDetailView.as_view(), name="category-detail"),

    # Tasks
    path("tasks/", TaskListCreateView.as_view(), name="task-list"),
    path("tasks/<int:pk>/", TaskDetailView.as_view(), name="task-detail"),

    # AI suggestion endpoint
    path(
      "tasks/<int:pk>/ai-suggest/",
      TaskAISuggestView.as_view(),
      name="task-ai-suggest"
    ),

    # Context entries
    path("context/", ContextEntryListCreateView.as_view(), name="context-list"),
    path("context/<int:pk>/", ContextEntryDetailView.as_view(), name="context-detail"),
]
