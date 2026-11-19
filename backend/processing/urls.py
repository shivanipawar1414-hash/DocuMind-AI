from django.urls import path
from .views import ExtractedTextListView, DocumentSearchView
from .ai_views import (AIDocumentSummaryView,AIDocumentChatView,AIDocumentRiskView
)
urlpatterns = [
    path(
        'documents/<int:document_id>/text/',
        ExtractedTextListView.as_view(),
        name='extracted-text-list'
    ),

    path(
        'search/',
        DocumentSearchView.as_view(),
        name='document-search'
    ),
    path(
    'ai-summary/',
    AIDocumentSummaryView.as_view(),
    name='ai-document-summary'
),
path('ai-chat/', AIDocumentChatView.as_view(), name='ai-document-chat'),
path('ai-risk/', AIDocumentRiskView.as_view(), name='ai-document-risk'),
]