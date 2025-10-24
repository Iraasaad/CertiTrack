"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Award,
  GraduationCap,
  Trash2,
  User,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react"

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [documents, setDocuments] = useState([])
  const [activeTab, setActiveTab] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const documentsPerPage = 3

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}")

    if (!userData.id) {
      navigate("/login")
      return
    }

    setUser(userData)
    fetchUserDocuments(userData.id)
  }, [navigate])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

  const fetchUserDocuments = async (userId) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`http://localhost:8000/backend/getCertificates.php?user_id=${userId}`)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        console.log("Document data:", data.data[0]) 
        setDocuments(data.data)
      } else {
        setError(data.message || "Failed to fetch documents")
      }
    } catch (error) {
      setError("An error occurred while fetching documents")
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteDocument = async (id) => {
    try {
      const response = await fetch("http://localhost:8000/backend/deleteDocument.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document_id: id,
          user_id: user.id,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setDocuments(documents.filter((doc) => doc.id !== id))
        setDeleteDialogOpen(false)
      } else {
        setError(data.message || "Failed to delete document")
      }
    } catch (error) {
      setError("An error occurred while deleting the document")
      console.error("Error:", error)
    }
  }

  const openDeleteDialog = (document) => {
    setDocumentToDelete(document)
    setDeleteDialogOpen(true)
  }

  const renderValidationStatus = (status) => {
    if (!status || status === "pending") {
      return <Clock className="h-4 w-4 text-yellow-500" title="Pending Validation" />
    } else if (status === "validated") {
      return <CheckCircle className="h-4 w-4 text-green-500" title="Validated" />
    } else if (status === "rejected") {
      return <XCircle className="h-4 w-4 text-red-500" title="Rejected" />
    }
    return null
  }

  const filteredDocuments = documents.filter((doc) => {
    if (activeTab === "all") return true
    return doc.type === activeTab
  })

  const indexOfLastDocument = currentPage * documentsPerPage
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage
  const currentDocuments = filteredDocuments.slice(indexOfFirstDocument, indexOfLastDocument)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage)

  if (isLoading) {
    return (
      <div className="container py-8">
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="container profile-container">
      <div className="profile-header">
        <h1 className="profile-title">Profile</h1>
        <p className="profile-description">Manage your account and documents</p>
      </div>

      <div className="profile-layout">
        {/* User Information Sidebar */}
        <div className="profile-sidebar">
          <div className="user-info-card">
            <h2 className="text-xl font-bold mb-4">User Information</h2>
            <div className="user-avatar-container">
              <div className="user-avatar">
                <User className="user-avatar-icon" />
              </div>
              <h2 className="user-name">{user?.name || "User"}</h2>
              <p className="user-email">{user?.email || "user@example.com"}</p>
            </div>

            <div className="user-stats">
              <div className="stat-item">
                <span className="stat-label">Diplomas</span>
                <span className="badge badge-outline">{documents.filter((doc) => doc.type === "diploma").length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Certificates</span>
                <span className="badge badge-outline">
                  {documents.filter((doc) => doc.type === "certificate").length}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Documents</span>
                <span style={{ paddingLeft: "45px" }} className="badge badge-default">
                  {documents.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-content">
          <div className="document-tabs tabs-list">
            <button
              className={`tabs-trigger ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Documents
            </button>
            <button
              className={`tabs-trigger ${activeTab === "diploma" ? "active" : ""}`}
              onClick={() => setActiveTab("diploma")}
            >
              Diplomas
            </button>
            <button
              className={`tabs-trigger ${activeTab === "certificate" ? "active" : ""}`}
              onClick={() => setActiveTab("certificate")}
            >
              Certificates
            </button>
          </div>

          <div className="document-list">
            {filteredDocuments.length > 0 ? (
              <>
                {currentDocuments.map((doc) => (
                  <div key={doc.id} className="document-card">
                    <div className="document-header">
                      <div className="document-title-container">
                        {doc.type === "diploma" ? (
                          <GraduationCap style={{ marginTop: "-7px" }} className="document-icon" />
                        ) : (
                          <Award style={{ marginTop: "-7px" }} className="document-icon" />
                        )}
                        <h3 className="document-title">{doc.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.validation_status && (
                          <div className="flex items-center gap-1">
                            {renderValidationStatus(doc.validation_status)}
                            <span
                              className={`badge ${
                                doc.validation_status === "validated"
                                  ? "badge-success"
                                  : doc.validation_status === "rejected"
                                    ? "badge-destructive"
                                    : "badge-outline"
                              }`}
                            >
                              {doc.validation_status === "validated"
                                ? "Validated"
                                : doc.validation_status === "rejected"
                                  ? "Rejected"
                                  : "Pending"}
                            </span>
                          </div>
                        )}
                        <span
                          style={{ paddingLeft: "25px" }}
                          className={`badge ${doc.type === "diploma" ? "badge-default" : "badge-secondary"}`}
                        >
                          {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                        </span>
                      </div>
                    </div>

                    <p className="document-institution">{doc.institution}</p>

                    {/* Display rejection reason if document is rejected */}
                    {doc.validation_status === "rejected" && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start mb-4 mt-2">
                        <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">Rejection Reason:</p>
                          <p className="text-sm">{doc.validation_notes || "No reason provided"}</p>
                        </div>
                      </div>
                    )}

                    <div className="document-details">
                      <div className="detail-item">
                        <span className="detail-label">Field of Study</span>
                        <span className="detail-value">{doc.fieldOfStudy}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Graduation Date</span>
                        <span className="detail-value">{new Date(doc.completionDate).toLocaleDateString()}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Serial Number</span>
                        <span className="detail-value">{doc.serialNumber || "N/A"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Grade/Average</span>
                        <span className="detail-value">{doc.grade || "N/A"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Status</span>
                        <span
                          className={`detail-value flex items-center gap-1
                          ${
                            doc.validation_status === "validated"
                              ? "text-green-600"
                              : doc.validation_status === "rejected"
                                ? "text-red-600"
                                : "text-yellow-600"
                          }`}
                        >
                          {renderValidationStatus(doc.validation_status)}
                          {doc.validation_status
                            ? doc.validation_status.charAt(0).toUpperCase() + doc.validation_status.slice(1)
                            : "Pending"}
                        </span>
                      </div>
                      {doc.validation_status === "rejected" && (
                        <div className="detail-item">
                          <span className="detail-label">Rejection Reason</span>
                          <span className="detail-value" style={{ color: "var(--color-destructive)" }}>
                            {doc.validation_notes || "No reason provided"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="document-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => openDeleteDialog(doc)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {filteredDocuments.length > documentsPerPage && (
                  <div className="pagination-container">
                    <div className="pagination">
                      <button
                        className="pagination-button"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                      </button>

                      <div className="pagination-info">
                        Page {currentPage} of {totalPages}
                      </div>

                      <button
                        className="pagination-button"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon-container">
                  {activeTab === "diploma" ? (
                    <GraduationCap className="empty-state-icon" />
                  ) : activeTab === "certificate" ? (
                    <Award className="empty-state-icon" />
                  ) : (
                    <User className="empty-state-icon" />
                  )}
                </div>
                <h3 className="empty-state-title">No {activeTab === "all" ? "documents" : activeTab + "s"} found</h3>
                <p className="empty-state-description">
                  {activeTab === "diploma"
                    ? "You haven't added any diplomas yet. Add your first diploma to get started."
                    : activeTab === "certificate"
                      ? "You haven't added any certificates yet. Add your first certificate to get started."
                      : "You haven't added any documents yet. Add your first document to get started."}
                </p>
                <Link to={activeTab === "diploma" ? "/add-diploma" : "/add-certificate"}>
                  <button className="btn btn-default">
                    Add {activeTab === "all" ? "Document" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {deleteDialogOpen && documentToDelete && (
        <div className="dialog-overlay" onClick={() => setDeleteDialogOpen(false)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2 className="dialog-title">Are you sure?</h2>
              <p className="dialog-description">
                This will permanently delete this document. This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button className="btn btn-outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-default" onClick={() => deleteDocument(documentToDelete.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile

