from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=50)
    usage_frequency = models.IntegerField(default=0)

class Task(models.Model):
    STATUS_CHOICES = (("pending", "Pending"), ("done", "Done"))

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True) 
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    priority_score = models.FloatField(default=0.0)
    deadline = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ContextEntry(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="context_entries", null =True, blank =True)
    SOURCE_CHOICES = (("email", "Email"), ("whatsapp", "WhatsApp"), ("note", "Note"))

    content = models.TextField()
    source_type = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    insights = models.TextField(blank=True)

class AISuggestion(models.Model):
    task        = models.ForeignKey(Task, on_delete=models.CASCADE)
    generated_text = models.TextField()
    created_at  = models.DateTimeField(auto_now_add=True)
