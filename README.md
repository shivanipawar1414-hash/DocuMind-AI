# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.














# DocuMind AI – Smart Document Intelligence System

## 1. Project Overview

DocuMind AI is an AI-powered document management and intelligence system. It helps users upload, manage, search, compare, and understand PDF documents easily.

The project uses Artificial Intelligence to generate document summaries, answer questions, and identify possible risks in documents.

The main goal is to save users' time and reduce manual work.

## 2. Problem Statement

Managing multiple PDF documents manually is time-consuming. Users often face difficulties finding important information, comparing documents, and understanding long documents.

DocuMind AI provides a single platform to make document management faster, easier, and smarter.

## 3. Main Features

- **User Authentication:** Secure registration and login using JWT authentication.
- **PDF Upload:** Upload and manage PDF documents.
- **Text Extraction:** Extract text from PDF files using PyMuPDF.
- **Smart Search:** Search for specific information inside uploaded PDFs.
- **PDF Comparison:** Compare two PDF documents and identify changes.
- **AI Document Summary:** Generate short summaries of long documents.
- **AI Question Answering:** Ask questions and receive answers based on document content.
- **Smart Risk Detection:** Identify possible document risks, such as missing signatures and unclear payment terms.
- **Analytics Dashboard:** View document statistics and activity.
- **Duplicate Detection:** Identify duplicate PDF uploads.

## 4. Technologies Used

### Frontend
- React.js
- JavaScript
- HTML
- CSS
- Axios
- Vite

### Backend
- Python
- Django
- Django REST Framework
- REST APIs
- Simple JWT

### Database
- MySQL

### AI and Document Processing
- Google Gemini API
- PyMuPDF

### Development Tools
- Visual Studio Code
- Postman
- Git
- GitHub

## 5. Project Architecture

The application follows a client-server architecture.

1. React.js provides the user interface.
2. Axios sends requests from the frontend to the backend.
3. Django REST Framework handles API requests and business logic.
4. MySQL stores application and document-related information.
5. PyMuPDF extracts text from PDF files.
6. Gemini AI supports document summaries, question answering, and risk analysis.

## 6. Installation and Setup

### Step 1: Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd smart_document_intelligence
```

### Step 2: Backend Setup

Open the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
.\venv\Scripts\Activate
```

Install the required packages:

```bash
pip install django djangorestframework djangorestframework-simplejwt mysqlclient pymupdf google-genai python-dotenv django-cors-headers
```

Configure your MySQL database and environment variables in the backend `.env` file.

Example environment variables:

```env
SECRET_KEY=your_django_secret_key
DEBUG=True
DB_NAME=smart_document_db
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
GEMINI_API_KEY=your_gemini_api_key
```

Run database migrations:

```bash
python manage.py migrate
```

Start the Django server:

```bash
python manage.py runserver
```

Backend URL:

`http://127.0.0.1:8000/`

### Step 3: Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm run dev
```

Frontend URL:

`http://localhost:5173/`

## 7. How to Use the Application

1. Register a new account or log in.
2. Upload PDF documents.
3. View uploaded documents in My Documents.
4. Search for information inside PDFs.
5. Compare two PDF documents.
6. Generate AI summaries.
7. Ask questions about uploaded documents.
8. Run Smart Risk Detection.
9. View document analytics.

## 8. Benefits of the Project

- Saves time when working with large PDF documents.
- Reduces manual document-reading work.
- Makes document searching easier.
- Helps users identify changes between documents.
- Provides AI-based document understanding.
- Helps identify possible document risks.
- Keeps document management in one platform.

## 9. Future Enhancements

- Deploy the application to the cloud.
- Add support for Word and Excel documents.
- Improve document security.
- Add advanced AI-powered document analysis.
- Add document sharing and collaboration.
- Improve automated testing and error handling.

## 10. Project Purpose

This project demonstrates full-stack web development, REST API integration, database management, document processing, authentication, and AI integration.

**Project Name:** DocuMind AI – Smart Document Intelligence System

**Developed Using:** React.js, Python, Django REST Framework, MySQL and Google Gemini AI.
