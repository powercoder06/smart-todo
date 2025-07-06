from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from .models import Category, Task, ContextEntry
from .serializers import (
    CategorySerializer,
    TaskSerializer,
    ContextEntrySerializer,
    AISuggestionSerializer,
    AISuggestionInputSerializer
)
from .ai import generate_task_suggestions

# ---- CRUD endpoints ----

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class ContextEntryListCreateView(generics.ListCreateAPIView):
    queryset = ContextEntry.objects.all().order_by('timestamp')
    serializer_class = ContextEntrySerializer

class ContextEntryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ContextEntry.objects.all()
    serializer_class = ContextEntrySerializer


class TaskAISuggestView(APIView):
    """
    POST /api/tasks/<pk>/ai-suggest/
    Returns a JSON dict with priority_score, deadline, categories, and enhanced_description.
    """
    def post(self, request, pk):
        # Validate the incoming AI‐input payload (title, description, category_id, context_entry_ids)
        inp = AISuggestionInputSerializer(data=request.data)
        inp.is_valid(raise_exception=True)

        # Run your LM Studio pipeline
        try:
            suggestions = generate_task_suggestions(inp.validated_data)
            return Response(suggestions, status=status.HTTP_200_OK)
        except Exception as e:
            # Always return 200 with a stub, so the frontend can merge fields without
            # a hard failure
            stub = {
                "priority_score": 0.5,
                "deadline":       "2025-07-10T12:00:00Z",
                "categories":     ["General"],
                "enhanced_description": (
                    "Stubbed because AI call failed: " + str(e)
                )
            }
            return Response(stub, status=status.HTTP_200_OK)


