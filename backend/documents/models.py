from django.db import models
from django.conf import settings


class Document(models.Model):

    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='documents/')

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='documents'
    )

    file_size = models.BigIntegerField(default=0)

    sha256_hash = models.CharField(
        max_length=64,
        blank=True,
        db_index=True
    )

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title