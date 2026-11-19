from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from .models import Document
from .serializers import DocumentSerializer
import hashlib
from processing.services import extract_pdf_text
from processing.models import ExtractedText

class DocumentUploadView(generics.CreateAPIView):

    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):

        uploaded_file = self.request.FILES['file']

        file_hash = calculate_sha256(uploaded_file)

        if Document.objects.filter(
            owner=self.request.user,
            sha256_hash=file_hash
    ).exists():
            raise ValidationError(
            "This PDF has already been uploaded."
        )

        document = serializer.save(
            owner=self.request.user,
            file_size=uploaded_file.size,
            sha256_hash=file_hash
    )

        extracted_pages = extract_pdf_text(document.file.path)

        for page in extracted_pages:
            ExtractedText.objects.create(
            document=document,
            page_number=page['page'],
            text=page['text']
        )

        serializer.save(owner=self.request.user,file_size=uploaded_file.size,sha256_hash=file_hash)


class DocumentListView(generics.ListAPIView):

    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Document.objects.filter(owner=self.request.user)



def calculate_sha256(file):
    sha256 = hashlib.sha256()

    for chunk in file.chunks():
        sha256.update(chunk)

    file.seek(0)

    return sha256.hexdigest()

class DocumentDetailView(generics.RetrieveDestroyAPIView):

    serializer_class = DocumentSerializer

    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Document.objects.filter(owner=self.request.user)