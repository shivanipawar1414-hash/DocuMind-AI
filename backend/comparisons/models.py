from django.db import models
from django.conf import settings
from documents.models import Document


class DocumentComparison(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    document_one = models.ForeignKey(
        Document,
        on_delete=models.CASCADE,
        related_name='comparison_first'
    )

    document_two = models.ForeignKey(
        Document,
        on_delete=models.CASCADE,
        related_name='comparison_second'
    )

    result = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.document_one.title} vs {self.document_two.title}"
