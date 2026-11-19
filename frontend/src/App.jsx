
import { useEffect, useState } from 'react'
import API from './api'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(localStorage.getItem('access_token'))
  const [documents, setDocuments] = useState([])
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')

  const [documentOne, setDocumentOne] = useState('')
  const [documentTwo, setDocumentTwo] = useState('')
  const [comparisonResult, setComparisonResult] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [totalComparisons, setTotalComparisons] = useState(0)
  const [riskAnalysis, setRiskAnalysis] = useState('')
  
const generateAISummary = async (documentId) => {
  try {
    const response = await API.post(
      'processing/ai-summary/',
      { document_id: documentId },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    alert(response.data.summary)

  } catch (error) {
    console.log(error.response?.data || error.message)
    alert(JSON.stringify(error.response?.data || error.message))
    alert('Failed to generate AI Summary')
  }
}

const askAIQuestion = async (documentId, question) => {
  try {
    const response = await API.post(
      'processing/ai-chat/',
      {
        document_id: documentId,
        question: question
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    alert(response.data.answer)

  } catch (error) {
    console.log(error.response?.data || error.message)
    alert(JSON.stringify(error.response?.data || error.message))
  }
}


const generateAIRiskAnalysis = async (documentId) => {
  try {
    const response = await API.post(
      'processing/ai-risk/',
      { document_id: documentId },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    setRiskAnalysis(response.data.risk_analysis)

  } catch (error) {
    console.log(error.response?.data || error.message)
    alert(JSON.stringify(error.response?.data || error.message))
  }
}
  // Load documents
  const loadDocuments = async (accessToken) => {
    try {
      const response = await API.get('documents/', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      setDocuments(response.data)
    } catch (error) {
      console.error(error)
      setMessage('Could not load documents. Please login again.')
    }
  }

  // Delete Document
const deleteDocument = async (documentId) => {
  const confirmDelete = window.confirm(
    'Are you sure you want to delete this document?'
  )

  if (!confirmDelete) return

  try {
    await API.delete(`documents/${documentId}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    setMessage('Document deleted successfully!')
    await loadDocuments(token)

  } catch (error) {
    console.error(error)
    setMessage('Could not delete document.')
  }
}

  // Load total comparisons
const loadComparisonCount = async (accessToken) => {
  try {
    const response = await API.get('comparisons/', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    setTotalComparisons(response.data.total_comparisons)

  } catch (error) {
    console.error('Comparison count error:', error)
  }
}



  // Login
const login = async (e) => {
  e.preventDefault()

  try {
    const response = await API.post('token/', {
      username,
      password
    })

    localStorage.setItem('access_token', response.data.access)
    localStorage.setItem('refresh_token', response.data.refresh)

    setToken(response.data.access)
    setMessage('Login successful!')

    loadDocuments(response.data.access)
    loadComparisonCount(response.data.access)

  } catch (error) {
    console.error(error)
    setMessage('Invalid username or password.')
  }
}

  // Upload PDF
  const uploadDocument = async (e) => {
    e.preventDefault()

    if (!file) {
      setMessage('Please select a PDF file.')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('file', file)

    try {
      await API.post('documents/upload/', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setMessage('PDF uploaded successfully!')
      setTitle('')
      setFile(null)

      e.target.reset()
      loadDocuments(token)

    } catch (error) {
      console.error(error)
      setMessage('Upload failed. Please check your PDF and try again.')
    }
  }

  // Search Documents
  const searchDocuments = async (e) => {
    e.preventDefault()

    if (!searchQuery.trim()) {
      setSearchResults([])
      setMessage('Please enter a search keyword.')
      return
    }

    try {
      const response = await API.get(
        `processing/search/?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setSearchResults(response.data)
      setMessage('Search completed successfully!')

    } catch (error) {
      console.error(error)
      setMessage('Search failed. Please try again.')
    }
  }

  // Compare two PDFs
  const compareDocuments = async (e) => {
    e.preventDefault()

    if (!documentOne || !documentTwo) {
      setMessage('Please select both documents.')
      return
    }

    if (documentOne === documentTwo) {
      setMessage('Please select two different documents.')
      return
    }

    try {
      const response = await API.post(
        'comparisons/',
        {
          document_one: documentOne,
          document_two: documentTwo
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setComparisonResult(response.data.result.changes)
      setTotalComparisons(prev => prev + 1)
      setMessage('Documents compared successfully!')

    } catch (error) {
      console.error(error)
      setMessage('Comparison failed. Please try again.')
    }
  }



  
 // Automatically load documents when dashboard opens


useEffect(() => {
  if (token) {
    loadDocuments(token)
    loadComparisonCount(token)
  }
}, [token])


  // Logout
  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')

    setToken(null)
    setDocuments([])
    setComparisonResult(null)
    setDocumentOne('')
    setDocumentTwo('')
    setSearchQuery('')
    setSearchResults([])

    setMessage('Logged out successfully.')
  }

  return (
    <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2>SmartDocs</h2>
        <p>Document Intelligence</p>

        <nav>
          <a href="#dashboard">Dashboard</a>
          <a href="#upload">Upload Documents</a>
          <a href="#search">Search Documents</a>
          <a href="#documents">My Documents</a>
          <a href="#comparison">Compare Documents</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        <header id="dashboard">
          <h1>Smart Document Intelligence</h1>
          <p>Manage and compare your PDF documents.</p>
        </header>

        {!token ? (

          /* Login Section */
          <section className="card">
            <h2>User Login</h2>

            <form onSubmit={login}>
              <input
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />

              <br /><br />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />

              <br /><br />

              <button type="submit">Login</button>
            </form>
          </section>

        ) : (

          <>

            {/* Upload Section */}
            <section className="card" id="upload">
              <h2>Upload PDF Document</h2>

              <form onSubmit={uploadDocument}>

                <input
                  type="text"
                  placeholder="Document title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />

                <br /><br />

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={e => setFile(e.target.files[0])}
                  required
                />

                <br /><br />

                <button type="submit">Upload PDF</button>

              </form>
            </section>

            {/* Analytics Chart */}

<section className="card analytics-section">

  <h2>Document Analytics</h2>
  <p>Overview of your project activity</p>

  <div className="chart-item">
    <span>Total Documents: {documents.length}</span>

    <div className="chart-track">
      <div
        className="chart-bar documents-bar"
        style={{
          width: `${documents.length / Math.max(documents.length, totalComparisons, 1) * 100}%`
        }}
      ></div>
    </div>
  </div>

  <div className="chart-item">
    <span>Total Comparisons: {totalComparisons}</span>

    <div className="chart-track">
      <div
        className="chart-bar comparisons-bar"
        style={{
          width: `${totalComparisons / Math.max(documents.length, totalComparisons, 1) * 100}%`
        }}
      ></div>
    </div>
  </div>

</section>

            {/* Dashboard Statistics */}

<div className="stats">

  <div className="card">
    <h3>Total Documents</h3>
    <h2>{documents.length}</h2>
  </div>

  <div className="card">
    <h3>Total Comparisons</h3>
    <h2>{totalComparisons}</h2>
  </div>

  <div className="card">
    <h3>Total PDF Storage</h3>
    <h2>
      {(documents.reduce(
        (total, doc) => total + doc.file_size, 0
      ) / (1024 * 1024)).toFixed(2)} MB
    </h2>
  </div>

</div>

            {/* Search Section */}
            <section className="card" id="search">

              <h2>Search Documents</h2>

              <form onSubmit={searchDocuments}>

                <input
                  type="text"
                  placeholder="Search by keyword..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />

                <button type="submit">Search</button>

              </form>

              {searchResults.map(result => (

                <div className="document-item" key={result.id}>

                  <h3>Document ID: {result.document}</h3>

                  <p>Page Number: {result.page_number}</p>

                  <p>{highlightText(result.text, searchQuery)}</p>

                </div>

              ))}

            </section>

            {/* Documents Section */}
            <section className="card" id="documents">

              <h2>My Documents ({documents.length})</h2>
              {riskAnalysis && (
  <div className="card">
    <h2>Smart Risk Analysis Results</h2>
    <pre style={{ whiteSpace: 'pre-wrap' }}>
      {riskAnalysis}
    </pre>
  </div>
)}

              <button onClick={() => loadDocuments(token)}>
                Refresh Documents
              </button>

              {documents.map(doc => (

                

                <div className="document-item" key={doc.id}>

                  <h3>{doc.title}</h3>
                  <input
  type="text"
  id={`question-${doc.id}`}
  placeholder="Ask a question about this PDF"
/>

<button
  onClick={() => {
    const question = document.getElementById(`question-${doc.id}`).value

    if (question.trim()) {
      askAIQuestion(doc.id, question)
    } else {
      alert('Please enter a question')
    }
  }}
>
  Ask AI
</button>
<button
  onClick={() => generateAIRiskAnalysis(doc.id)}
  style={{ marginTop: '10px', marginLeft: '10px' }}
>
  Detect Document Risks
</button>



                  <p>Document ID: {doc.id}</p>

                  <p>File size: {doc.file_size} bytes</p>

                  <button
                    onClick={() => deleteDocument(doc.id)}
                    style={{ background: '#dc2626', marginTop: '10px' }}
                    >
                     Delete Document
                  </button>

                  <button
  onClick={() => generateAISummary(doc.id)}
  style={{ marginTop: '10px', marginLeft: '10px' }}
>
  Generate AI Summary
</button>

                </div>

              ))}



            </section>


            <button
  onClick={() => deleteDocument(doc.id)}
  style={{ background: '#dc2626', marginTop: '10px' }}
>
  Delete Document
</button>

            {/* Comparison Section */}
            <section className="card" id="comparison">

              <h2>Compare PDF Documents</h2>

              <form onSubmit={compareDocuments}>

                <label>First Document</label>

                <br /><br />

                <select
                  value={documentOne}
                  onChange={e => setDocumentOne(e.target.value)}
                  required
                >
                  <option value="">Select First PDF</option>

                  {documents.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.title} (ID: {doc.id})
                    </option>
                  ))}

                </select>

                <br /><br />

                <label>Second Document</label>

                <br /><br />

                <select
                  value={documentTwo}
                  onChange={e => setDocumentTwo(e.target.value)}
                  required
                >
                  <option value="">Select Second PDF</option>

                  {documents.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.title} (ID: {doc.id})
                    </option>
                  ))}

                </select>

                <br /><br />

                <button type="submit">
                  Compare Documents
                </button>

              </form>

            </section>

            {/* Comparison Results Table */}
            {comparisonResult !== null && (

              <section className="card">

                <h2>Comparison Results</h2>

                {comparisonResult.length > 0 ? (

                  <table className="comparison-table">

                    <thead>
                      <tr>
                        <th>Field</th>
                        <th>Old Value</th>
                        <th>New Value</th>
                      </tr>
                    </thead>

                    <tbody>

                      {comparisonResult.map((change, index) => (

                        <tr key={index}>

                          <td>
                            {change.field.replace('_', ' ').toUpperCase()}
                          </td>

                          <td>{change.old_value}</td>

                          <td>{change.new_value}</td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                ) : (

                  <p>No changes found in the supported fields.</p>

                )}

              </section>

            )}

            {/* Logout */}
            <button onClick={logout}>Logout</button>

          </>

        )}

        <p>{message}</p>

      </main>
    </div>
  )
}

export default App


function highlightText(text, keyword) {
  if (!keyword.trim()) return text

  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escapedKeyword})`, 'gi'))

  return parts.map((part, index) =>
    part.toLowerCase() === keyword.toLowerCase()
      ? <mark key={index}>{part}</mark>
      : part
  )
}