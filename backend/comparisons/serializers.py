from rest_framework import serializers
from .models import DocumentComparison


class DocumentComparisonSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentComparison
        fields = [
            'id',
            'document_one',
            'document_two',
            'result',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'result',
            'created_at',
        ]