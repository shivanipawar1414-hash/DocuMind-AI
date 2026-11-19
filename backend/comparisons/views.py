from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.exceptions import ValidationError

from documents.models import Document
from processing.models import ExtractedText
from .models import DocumentComparison
from .serializers import DocumentComparisonSerializer
from .services import compare_texts


class DocumentComparisonView(APIView):
    def get(self, request):
        total = DocumentComparison.objects.filter(
        user=request.user
    ).count()

        return Response({
        "total_comparisons": total
    })
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        document_one_id = request.data.get('document_one')
        document_two_id = request.data.get('document_two')

        if not document_one_id or not document_two_id:
            raise ValidationError(
                "Please provide both document IDs."
            )

        if str(document_one_id) == str(document_two_id):
            raise ValidationError(
                "Please select two different documents."
            )

        document_one = Document.objects.filter(
            id=document_one_id,
            owner=request.user
        ).first()

        document_two = Document.objects.filter(
            id=document_two_id,
            owner=request.user
        ).first()

        if not document_one or not document_two:
            raise ValidationError(
                "Document not found."
            )

        text_one = "\n".join(
            ExtractedText.objects.filter(
                document=document_one
            ).order_by('page_number').values_list('text', flat=True)
        )

        text_two = "\n".join(
            ExtractedText.objects.filter(
                document=document_two
            ).order_by('page_number').values_list('text', flat=True)
        )

        changes = compare_texts(text_one, text_two)

        comparison = DocumentComparison.objects.create(
            user=request.user,
            document_one=document_one,
            document_two=document_two,
            result={"changes": changes}
        )

        serializer = DocumentComparisonSerializer(comparison)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )