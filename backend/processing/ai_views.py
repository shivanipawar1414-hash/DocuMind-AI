

from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from google import genai

from documents.models import Document
from .models import ExtractedText


class AIDocumentSummaryView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        document_id = request.data.get("document_id")

        if not document_id:
            return Response(
                {"error": "Document ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not settings.GEMINI_API_KEY:
            return Response(
                {"error": "Gemini API key is not configured"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        try:
            document = Document.objects.get(
                id=document_id,
                owner=request.user
            )

            pages = ExtractedText.objects.filter(
                document=document
            ).order_by("page_number")

            if not pages.exists():
                return Response(
                    {"error": "No extracted text found for this PDF"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            document_text = "\n".join(
                [
                    f"Page {page.page_number}: {page.text}"
                    for page in pages
                ]
            )

            document_text = document_text[:30000]

            client = genai.Client(
                api_key=settings.GEMINI_API_KEY
            )

            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents=(
                    "Summarize this document in simple English. "
                    "Include the main idea and important points. "
                    "Do not invent information.\n\n"
                    + document_text
                )
            )

            return Response({
                "document_title": document.title,
                "summary": response.text
            })

        except Document.DoesNotExist:
            return Response(
                {"error": "Document not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AIDocumentChatView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        document_id = request.data.get("document_id")
        question = request.data.get("question")

        if not document_id or not question:
            return Response(
                {"error": "Document ID and question are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            document = Document.objects.get(
                id=document_id,
                owner=request.user
            )

            pages = ExtractedText.objects.filter(
                document=document
            ).order_by("page_number")

            if not pages.exists():
                return Response(
                    {"error": "No extracted text found for this PDF"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            document_text = "\n".join(
                page.text for page in pages
            )[:30000]

            client = genai.Client(
                api_key=settings.GEMINI_API_KEY
            )

            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents=(
                    "Answer the question using only the document below. "
                    "If the answer is not present, say so.\n\n"
                    f"Document:\n{document_text}\n\n"
                    f"Question: {question}"
                )
            )

            return Response({
                "document_title": document.title,
                "question": question,
                "answer": response.text
            })

        except Document.DoesNotExist:
            return Response(
                {"error": "Document not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AIDocumentRiskView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        document_id = request.data.get("document_id")

        if not document_id:
            return Response(
                {"error": "Document ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            document = Document.objects.get(
                id=document_id,
                owner=request.user
            )

            pages = ExtractedText.objects.filter(
                document=document
            ).order_by("page_number")

            if not pages.exists():
                return Response(
                    {"error": "No extracted text found"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            document_text = "\n".join(
                page.text for page in pages
            )[:30000]

            client = genai.Client(
                api_key=settings.GEMINI_API_KEY
            )

            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents=(
                    "Analyze this document for possible risks. "
                    "Check for missing signatures, unclear payment terms, "
                    "penalties, deadlines and missing important details. "
                    "List each possible risk with its reason. "
                    "Do not invent risks. If no risks are found, say so.\n\n"
                    + document_text
                )
            )

            return Response({
                "document_title": document.title,
                "risk_analysis": response.text
            })

        except Document.DoesNotExist:
            return Response(
                {"error": "Document not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )