from rest_framework import serializers
from .models import Category, Task, ContextEntry, AISuggestion

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'usage_frequency']


class TaskSerializer(serializers.ModelSerializer):
    # When reading, nest the full Category; when writing, accept a category_id
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        help_text="ID of an existing Category"
    )

    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'category',     # nested on GET
            'category_id',  # use on POST/PUT
            'priority_score',
            'deadline',
            'status',
            'created_at',
            'updated_at',
        ]

class ContextEntrySerializer(serializers.ModelSerializer):
    task_id = serializers.PrimaryKeyRelatedField(
        source="task",
        queryset=Task.objects.all(),
        write_only=True
    )

    class Meta:
        model = ContextEntry
        fields = ['id', 'task_id', 'content', 'source_type', 'timestamp', 'insights']



class AISuggestionInputSerializer(serializers.Serializer):
    """
    Input payload for AI suggestions:
    """
    title = serializers.CharField(max_length=255)
    description = serializers.CharField()
    category_id = serializers.IntegerField(required=False)
    # optionally, you could accept a list of context-entry IDs to consider
    context_entry_ids = serializers.ListField(
        child=serializers.IntegerField(), 
        required=False, 
        help_text="List of ContextEntry IDs to use for AI analysis"
    )

class AISuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AISuggestion
        fields = ["id", "task", "generated_text", "created_at"]