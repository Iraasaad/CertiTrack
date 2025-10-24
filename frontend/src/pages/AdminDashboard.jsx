"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Award, GraduationCap, FileText, CheckCircle, AlertTriangle, Clock, Check, X } from "lucide-react"

function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [validationDialog, setValidationDialog] = useState({ open: false, document: null, status: "", notes: "" })
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    if (!userData.id || userData.role !== "admin") {
      return
    }

    setUser(userData)
    fetchDocuments(userData.id)
  }, [])

  const fetchDocuments = async (adminId) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`http://localhost:8000/backend/getPendingDocuments.php?admin_id=${adminId}&limit=10`)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const text = await response.text()
      let data

      try {
        data = JSON.parse(text)
      } catch (e) {
        console.error("Failed to parse JSON:", text)
        throw new Error("Invalid JSON response from server")
      }

      if (data.success) {
        setDocuments(data.data)
      } else {
        throw new Error(data.message || "Failed to fetch documents")
      }
    } catch (error) {
      setError("An error occurred while fetching documents: " + error.message)
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleValidateDocument = async (document, status, notes = "") => {
    try {
      if (!user || user.role !== "admin") {
        setError("Unauthorized: Admin privileges required")
        return
      }

      const response = await fetch("http://localhost:8000/backend/validateDocument.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document_id: document.id,
          status: status,
          notes: notes,
          admin_id: user.id,
          type: document.type,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setDocuments(
          documents.map((doc) =>
            doc.id === document.id && doc.type === document.type ? { ...doc, validation_status: status } : doc,
          ),
        )

        if (validationDialog.open) {
          setValidationDialog({ open: false, document: null, status: "", notes: "" })
        }
      } else {
        throw new Error(data.message || "Failed to validate document")
      }
    } catch (error) {
      setError("An error occurred while validating the document: " + error.message)
      console.error("Error:", error)
    }
  }

  const openValidationDialog = (document, status) => {
    setValidationDialog({
      open: true,
      document,
      status,
      notes: "",
    })
  }

  const getStatusCounts = () => {
    const counts = {
      total: documents.length,
      pending: 0,
      validated: 0,
      rejected: 0,
      diplomas: {
        total: 0,
        pending: 0,
        validated: 0,
        rejected: 0,
      },
      certificates: {
        total: 0,
        pending: 0,
        validated: 0,
        rejected: 0,
      },
    }

    documents.forEach((doc) => {
      const status = doc.validation_status || "pending"
      counts[status]++

      if (doc.type === "diploma") {
        counts.diplomas.total++
        counts.diplomas[status]++
      } else if (doc.type === "certificate") {
        counts.certificates.total++
        counts.certificates[status]++
      }
    })

    return counts
  }

  const stats = getStatusCounts()

  if (isLoading) {
    return (
      <div className="container py-8">
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p style={{ color: "var(--color-muted-foreground)" }}>Welcome back, {user?.name || "Admin"}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start mb-4">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-primary text-primary-foreground">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium opacity-80">Total Documents</p>
                <h3 className="text-3xl font-bold mt-1">{stats.total}</h3>
              </div>
              <div className="p-2 rounded-full bg-primary-foreground/20">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="card bg-secondary text-secondary-foreground">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium opacity-80">Diplomas</p>
                <h3 className="text-3xl font-bold mt-1">{stats.diplomas.total}</h3>
              </div>
              <div className="p-2 rounded-full bg-secondary-foreground/20">
                <GraduationCap className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="card bg-muted">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--color-muted-foreground)" }}>
                  Certificates
                </p>
                <h3 className="text-3xl font-bold mt-1">{stats.certificates.total}</h3>
              </div>
              <div
                className="p-2 rounded-full"
                style={{ backgroundColor: "var(--color-muted-foreground)", opacity: 0.2 }}
              >
                <Award className="h-5 w-5" style={{ color: "var(--color-foreground)" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Document Status */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Document Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="flex flex-col items-center p-4 rounded-lg border"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="p-3 rounded-full mb-2" style={{ backgroundColor: "rgba(234, 179, 8, 0.1)" }}>
                <Clock className="h-6 w-6" style={{ color: "rgb(234, 179, 8)" }} />
              </div>
              <h3 className="text-xl font-bold">{stats.pending}</h3>
              <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                Pending
              </p>
            </div>

            <div
              className="flex flex-col items-center p-4 rounded-lg border"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="p-3 rounded-full mb-2" style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}>
                <CheckCircle className="h-6 w-6" style={{ color: "rgb(34, 197, 94)" }} />
              </div>
              <h3 className="text-xl font-bold">{stats.validated}</h3>
              <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                Validated
              </p>
            </div>

            <div
              className="flex flex-col items-center p-4 rounded-lg border"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="p-3 rounded-full mb-2" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}>
                <AlertTriangle className="h-6 w-6" style={{ color: "rgb(239, 68, 68)" }} />
              </div>
              <h3 className="text-xl font-bold">{stats.rejected}</h3>
              <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                Rejected
              </p>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Documents</h2>
            <Link to="/admin-validation" className="text-sm font-medium" style={{ color: "var(--color-primary)" }}>
              View All
            </Link>
          </div>

          {documents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {documents.slice((currentPage - 1) * 6, currentPage * 6).map((doc) => (
                  <div
                    key={`${doc.type}-${doc.id}`}
                    className="border rounded-lg p-3"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      {doc.type === "diploma" ? (
                        <GraduationCap className="h-5 w-5" style={{ color: "var(--color-primary)" }} />
                      ) : (
                        <Award className="h-5 w-5" style={{ color: "var(--color-primary)" }} />
                      )}
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

                    <h3 className="font-medium text-sm truncate">{doc.title}</h3>
                    <p className="text-xs truncate" style={{ color: "var(--color-muted-foreground)" }}>
                      {doc.institution}
                    </p>
                    <p className="text-xs truncate" style={{ color: "var(--color-muted-foreground)" }}>
                      {doc.user_name || "Unknown User"}
                    </p>

                    <div className="flex justify-end gap-1 mt-3">
                      {doc.validation_status !== "rejected" && (
                        <button
                          className="btn btn-outline btn-xs"
                          onClick={() => openValidationDialog(doc, "rejected")}
                          title="Reject"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}

                      {doc.validation_status !== "validated" && (
                        <button
                          className="btn btn-default btn-xs"
                          onClick={() => handleValidateDocument(doc, "validated")}
                          title="Validate"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      )}

                      {doc.validation_status !== "pending" && (
                        <button
                          className="btn btn-outline btn-xs"
                          onClick={() => handleValidateDocument(doc, "pending")}
                          title="Mark as Pending"
                        >
                          <Clock className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {documents.length > 6 && (
                <div className="flex justify-center mt-6">
                  <div className="flex space-x-2">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>

                    
                    {(() => {
                      const totalPages = Math.ceil(documents.length / 6)
                      let startPage = Math.max(1, currentPage - 2)
                      const endPage = Math.min(totalPages, startPage + 4)

                      
                      if (endPage - startPage < 4) {
                        startPage = Math.max(1, endPage - 4)
                      }

                      const pageNumbers = []
                      for (let i = startPage; i <= endPage; i++) {
                        pageNumbers.push(
                          <button
                            key={i}
                            className={`btn btn-sm ${currentPage === i ? "btn-secondary" : "btn-outline"}`}
                            onClick={() => setCurrentPage(i)}
                          >
                            {i}
                          </button>,
                        )
                      }
                      return pageNumbers
                    })()}

                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setCurrentPage((prev) => Math.min(Math.ceil(documents.length / 6), prev + 1))}
                      disabled={currentPage === Math.ceil(documents.length / 6)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center border rounded-lg">
              <div className="rounded-full p-3 mb-4" style={{ backgroundColor: "var(--color-muted)" }}>
                <FileText className="h-6 w-6" style={{ color: "var(--color-muted-foreground)" }} />
              </div>
              <h3 className="text-lg font-medium">No documents found</h3>
              <p style={{ color: "var(--color-muted-foreground)", marginTop: "0.25rem" }}>
                There are no documents in the system yet
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Validation Dialog */}
      {validationDialog.open && (
        <div className="dialog-overlay" onClick={() => setValidationDialog({ ...validationDialog, open: false })}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2 className="dialog-title">
                {validationDialog.status === "validated" ? "Validate Document" : "Reject Document"}
              </h2>
              <p className="dialog-description">
                {validationDialog.status === "validated"
                  ? "Confirm that this document is valid and authentic."
                  : "Please provide a reason for rejecting this document."}
              </p>
            </div>

            <div className="mt-4">
              <label htmlFor="notes" className="block text-sm font-medium mb-1">
                {validationDialog.status === "validated" ? "Validation Notes (Optional)" : "Rejection Reason"}
              </label>
              <textarea
                id="notes"
                className="input w-full h-24"
                placeholder={
                  validationDialog.status === "validated"
                    ? "Add any notes about this validation..."
                    : "Explain why this document is being rejected..."
                }
                value={validationDialog.notes}
                onChange={(e) => setValidationDialog({ ...validationDialog, notes: e.target.value })}
                required={validationDialog.status === "rejected"}
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                className="btn btn-outline"
                onClick={() => setValidationDialog({ ...validationDialog, open: false })}
              >
                Cancel
              </button>
              <button
                className={`btn ${validationDialog.status === "validated" ? "btn-default" : "btn-destructive"}`}
                onClick={() =>
                  handleValidateDocument(validationDialog.document, validationDialog.status, validationDialog.notes)
                }
                disabled={validationDialog.status === "rejected" && !validationDialog.notes}
              >
                {validationDialog.status === "validated" ? "Validate" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard

