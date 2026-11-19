from django.shortcuts import render
from rest_framework import generics, permissions
from .models import ExtractedText
from .serializers import ExtractedTextSerializer
from django.db.models import Q

class ExtractedTextListView(generics.ListAPIView):

    serializer_class = ExtractedTextSerializer

    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        document_id = self.kwargs['document_id']

        return ExtractedText.objects.filter(
            document_id=document_id,
            document__owner=self.request.user
        ).order_by('page_number')

class DocumentSearchView(generics.ListAPIView):

    serializer_class = ExtractedTextSerializer

    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        query = self.request.query_params.get('q', '')

        return ExtractedText.objects.filter(
            document__owner=self.request.user
        ).filter(
            Q(text__icontains=query) |
            Q(document__title__icontains=query)
        ).order_by('document_id', 'page_number')