from django.db import models
from documents.models import Document


class ExtractedText(models.Model):

    document = models.ForeignKey(
        Document,
        on_delete=models.CASCADE,
        related_name='extracted_texts'
    )

    page_number = models.PositiveIntegerField()

    text = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.document.title} - Page {self.page_number}"