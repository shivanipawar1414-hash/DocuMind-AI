from django.urls import path
from .views import DocumentComparisonView

urlpatterns = [
    path(
        '',
        DocumentComparisonView.as_view(),
        name='document-comparison'
    ),
]