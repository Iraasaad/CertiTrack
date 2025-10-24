"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Award, Check, Download, Eye, GraduationCap, Search, X } from "lucide-react"

function AdminValidation() {
  const navigate = useNavigate()
  const location = useLocation()
  const [documents, setDocuments] = useState([])
  const [activeTab, setActiveTab] = useState("pending")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [validationDialog, setValidationDialog] = useState({ open: false, document: null, status: "", notes: "" })
  const [previewOpen, setPreviewOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const documentsPerPage = 10
  const [typeFilter, setTypeFilter] = useState("")
  const [genderFilter, setGenderFilter] = useState("")
  const [countryFilter, setCountryFilter] = useState("")
  const [institutionFilter, setInstitutionFilter] = useState("")
  const [fieldFilter, setFieldFilter] = useState("")
  const [typeSearchTerm, setTypeSearchTerm] = useState("")
  const [genderSearchTerm, setGenderSearchTerm] = useState("")
  const [countrySearchTerm, setCountrySearchTerm] = useState("")
  const [institutionSearchTerm, setInstitutionSearchTerm] = useState("")
  const [fieldSearchTerm, setFieldSearchTerm] = useState("")
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false)
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false)
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false)
  const [institutionDropdownOpen, setInstitutionDropdownOpen] = useState(false)
  const [fieldDropdownOpen, setFieldDropdownOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".input-wrapper") && !event.target.closest(".dropdown-menu")) {
        setTypeDropdownOpen(false)
        setGenderDropdownOpen(false)
        setCountryDropdownOpen(false)
        setInstitutionDropdownOpen(false)
        setFieldDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.id || user.role !== "admin") {
      navigate("/login")
      return
    }

    const params = new URLSearchParams(location.search)
    const statusParam = params.get("status")
    if (statusParam && ["pending", "validated", "rejected"].includes(statusParam)) {
      setActiveTab(statusParam)
    }

    fetchDocuments(user.id)
  }, [navigate, location.search])

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (user.id) {
      fetchDocuments(user.id)
    }
  }, [activeTab])

  const fetchDocuments = async (adminId) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`http://localhost:8000/backend/getPendingDocuments.php?admin_id=${adminId}`)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        const filteredDocs = data.data.filter((doc) => {
          const status = doc.validation_status || "pending"
          return status === activeTab
        })
        setDocuments(filteredDocs)
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

  const handleValidateDocument = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")

      if (!user.id || user.role !== "admin") {
        setError("Unauthorized: Admin privileges required")
        return
      }

      const response = await fetch("http://localhost:8000/backend/validateDocument.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document_id: validationDialog.document.id,
          status: validationDialog.status,
          notes: validationDialog.notes,
          admin_id: user.id,
        }),
      })

      const data = await response.json()

      if (data.success) {
        if (activeTab === "pending") {
          setDocuments(documents.filter((doc) => doc.id !== validationDialog.document.id))
        }
        setValidationDialog({ open: false, document: null, status: "", notes: "" })
      } else {
        setError(data.message || "Failed to validate document")
      }
    } catch (error) {
      setError("An error occurred while validating the document")
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

  const openPreview = (document) => {
    setSelectedDocument(document)
    setPreviewOpen(true)
  }

  const handleDownload = async (document) => {
    try {
      const downloadUrl = `http://localhost:8000/backend/downloadDocument.php?id=${document.id}&type=${document.type}`

      window.open(downloadUrl, "_blank")
    } catch (error) {
      console.error("Error initiating download:", error)
      alert("Failed to initiate download: " + error.message)
    }
  }

  const filteredDocuments = documents.filter((doc) => {
    
    if (typeFilter && doc.type !== typeFilter) return false

    if (genderFilter && doc.gender !== genderFilter) return false

    if (countryFilter && doc.country !== countryFilter) return false

    if (institutionFilter && doc.institution !== institutionFilter) return false

    const fieldOfStudy = doc.fieldOfStudy || doc.field_of_study
    if (fieldFilter && fieldOfStudy !== fieldFilter) return false

    if (
      searchTerm &&
      !doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !doc.institution?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !doc.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !doc.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    return true
  })

  const indexOfLastDocument = currentPage * documentsPerPage
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage
  const currentDocuments = filteredDocuments.slice(indexOfFirstDocument, indexOfLastDocument)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Admin Validation</h1>
          <p style={{ color: "var(--color-muted-foreground)" }}>Validate user documents</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start mb-4">
            <div className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0">⚠️</div>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="dashboard-tabs">
          <div className="tabs-list">
            <button
              className={`tabs-trigger ${activeTab === "pending" ? "active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              Pending
            </button>
            <button
              className={`tabs-trigger ${activeTab === "validated" ? "active" : ""}`}
              onClick={() => setActiveTab("validated")}
            >
              Validated
            </button>
            <button
              className={`tabs-trigger ${activeTab === "rejected" ? "active" : ""}`}
              onClick={() => setActiveTab("rejected")}
            >
              Rejected
            </button>
          </div>

          <div style={{ marginRight: "10px" }} className="flex justify-between items-center mt-4">
            <div className="relative flex">
              <Search
                className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4"
                style={{ color: "var(--color-muted-foreground)", marginTop: "8px", marginRight: "5px" }}
              />
              <input
                type="search"
                placeholder="Search documents..."
                className="input pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {/* Document Type filter - smaller width */}
            <div className="relative w-40">
              <select className="input w-full pr-8" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="">All Types</option>
                <option value="diploma">Diploma</option>
                <option value="certificate">Certificate</option>
              </select>
            </div>

            {/* Gender filter - smaller width */}
            <div className="relative w-32">
              <select
                className="input w-full pr-8"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Country filter with search */}
            <div className="relative w-48">
              <select
                className="input w-full pr-8"
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
              >
                <option value="">All Countries</option>
                {Array.from(new Set(documents.map((doc) => doc.country).filter(Boolean))).map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Institution filter with search */}
            <div className="relative w-48">
              <select
                className="input w-full pr-8"
                value={institutionFilter}
                onChange={(e) => setInstitutionFilter(e.target.value)}
              >
                <option value="">All Institutions</option>
                {Array.from(new Set(documents.map((doc) => doc.institution).filter(Boolean))).map((institution) => (
                  <option key={institution} value={institution}>
                    {institution}
                  </option>
                ))}
              </select>
            </div>

            {/* Field of Study filter with search */}
            <div className="relative w-48">
              <select
                className="input w-full pr-8"
                value={fieldFilter}
                onChange={(e) => setFieldFilter(e.target.value)}
              >
                <option value="">All Fields</option>
                {Array.from(
                  new Set(documents.map((doc) => doc.fieldOfStudy || doc.field_of_study).filter(Boolean)),
                ).map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear filters button */}
            <button
              className="btn btn-outline"
              onClick={() => {
                setTypeFilter("")
                setGenderFilter("")
                setCountryFilter("")
                setInstitutionFilter("")
                setFieldFilter("")
                setTypeSearchTerm("")
                setGenderSearchTerm("")
                setCountrySearchTerm("")
                setInstitutionSearchTerm("")
                setFieldSearchTerm("")
              }}
            >
              Clear Filters
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p>Loading documents...</p>
            </div>
          ) : (
            <div className="space-y-4 mt-6">
              {currentDocuments.length > 0 ? (
                currentDocuments.map((doc) => (
                  <div key={doc.id} className="card">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {doc.type === "diploma" ? (
                          <GraduationCap className="h-5 w-5" style={{ color: "var(--color-primary)" }} />
                        ) : (
                          <Award className="h-5 w-5" style={{ color: "var(--color-primary)" }} />
                        )}
                        <h3 className="text-lg font-bold">{doc.title}</h3>
                      </div>
                      <span className={`badge ${doc.type === "diploma" ? "badge-default" : "badge-secondary"}`}>
                        {doc.type?.charAt(0).toUpperCase() + doc.type?.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium">Submitted By</p>
                        <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                          {doc.user_name || "Unknown"} ({doc.user_email || "No email"})
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Institution</p>
                        <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                          {doc.institution}, {doc.country}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Field of Study</p>
                        <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                          {doc.fieldOfStudy || doc.field_of_study}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Completion Date</p>
                        <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                          {new Date(doc.completionDate || doc.completion_date).toLocaleDateString()}
                        </p>
                      </div>
                      {(doc.serialNumber || doc.serial_number) && (
                        <div>
                          <p className="text-sm font-medium">Serial Number</p>
                          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                            {doc.serialNumber || doc.serial_number}
                          </p>
                        </div>
                      )}
                      {doc.grade && (
                        <div>
                          <p className="text-sm font-medium">Grade/Average</p>
                          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                            {doc.grade}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">Submission Date</p>
                        <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                          {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      {activeTab !== "pending" && (
                        <div>
                          <p className="text-sm font-medium">Validation Date</p>
                          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                            {doc.validation_date ? new Date(doc.validation_date).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button className="btn btn-outline btn-sm" onClick={() => openPreview(doc)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </button>

                      <button className="btn btn-outline btn-sm" onClick={() => handleDownload(doc)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </button>

                      {activeTab === "pending" && (
                        <>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => openValidationDialog(doc, "rejected")}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </button>
                          <button
                            className="btn btn-default btn-sm"
                            onClick={() => openValidationDialog(doc, "validated")}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Validate
                          </button>
                        </>
                      )}
                    </div>

                    {(activeTab === "validated" || activeTab === "rejected") && doc.validation_notes && (
                      <div className="mt-4 p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium">Validation Notes:</p>
                        <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                          {doc.validation_notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
                  <div className="rounded-full p-3 mb-4" style={{ backgroundColor: "var(--color-muted)" }}>
                    <Search className="h-6 w-6" style={{ color: "var(--color-muted-foreground)" }} />
                  </div>
                  <h3 className="text-lg font-medium">No {activeTab} documents found</h3>
                  <p style={{ color: "var(--color-muted-foreground)", marginTop: "0.25rem" }}>
                    There are no documents with {activeTab} status at this time.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {filteredDocuments.length > documentsPerPage && (
                <div className="flex justify-center mt-6">
                  <div className="flex space-x-2">
                    <button
                      style={{ margin: "0px 2px" }}
                      className="btn btn-outline btn-sm"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.ceil(filteredDocuments.length / documentsPerPage) }).map((_, index) => (
                      <button
                        style={{ margin: "0px 2px" }}
                        key={index}
                        className={`btn btn-sm ${currentPage === index + 1 ? "btn-secondary" : "btn-outline"}`}
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      style={{ margin: "0px 2px" }}
                      className="btn btn-outline btn-sm"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === Math.ceil(filteredDocuments.length / documentsPerPage)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
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
                onClick={handleValidateDocument}
                disabled={validationDialog.status === "rejected" && !validationDialog.notes}
              >
                {validationDialog.status === "validated" ? "Validate" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Dialog */}
      {previewOpen && selectedDocument && (
        <div className="dialog-overlay" onClick={() => setPreviewOpen(false)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ marginTop: "30px" }} className="dialog-header">
              <h2 className="dialog-title">
                {selectedDocument.type === "diploma" ? (
                  <GraduationCap className="h-5 w-5 inline-block mr-2" style={{ color: "var(--color-secondary)" }} />
                ) : (
                  <Award className="h-5 w-5 inline-block mr-2" style={{ color: "var(--color-secondary)" }} />
                )}
                {selectedDocument.title}
              </h2>
              <p className="dialog-description">
                {selectedDocument.institution} • {selectedDocument.fieldOfStudy || selectedDocument.field_of_study}
              </p>
            </div>

            <div
              className="border rounded lg p-6 my-4 relative"
              style={{
                background: "linear-gradient(to bottom right, rgba(26, 93, 58, 0.05), rgba(212, 175, 55, 0.05))",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "var(--color-background)",
                  padding: "0 16px",
                }}
              >
                <span
                  style={{ marginTop: "25px" }}
                  className={`badge ${selectedDocument.type === "diploma" ? "badge-default" : "badge-secondary"}`}
                >
                  {selectedDocument.type?.toUpperCase()}
                </span>
              </div>

              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <h2
                  style={{ marginTop: "10px", fontSize: "1.5rem", fontWeight: "bold", color: "var(--color-primary)" }}
                >
                  {selectedDocument.institution}
                </h2>
                <p style={{ color: "var(--color-muted-foreground)" }}>This is to certify that</p>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginTop: "0.5rem" }}>
                  {selectedDocument.fullName || selectedDocument.user_name || "Document Owner"}
                </h3>
                <p style={{ color: "var(--color-muted-foreground)", marginTop: "0.5rem" }}>
                  has successfully completed the requirements for
                </p>
                <h4 style={{ fontSize: "1.125rem", fontWeight: "500", marginTop: "0.5rem" }}>
                  {selectedDocument.title}
                </h4>

                {selectedDocument.grade && (
                  <>
                    <p style={{ color: "var(--color-muted-foreground)", marginTop: "0.5rem" }}>with a grade of</p>
                    <p
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: "500",
                        color: "var(--color-secondary)",
                        marginTop: "0.25rem",
                      }}
                    >
                      {selectedDocument.grade}
                    </p>
                  </>
                )}

                <p style={{ color: "var(--color-muted-foreground)", marginTop: "1rem" }}>
                  Awarded on{" "}
                  {new Date(selectedDocument.completionDate || selectedDocument.completion_date).toLocaleDateString()}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "1.5rem",
                  marginLeft: "10px",
                  marginRight: "10px",
                  paddingTop: "1rem",
                  borderTop: "1px solid rgba(26, 93, 58, 0.1)",
                }}
              >
                {(selectedDocument.serialNumber || selectedDocument.serial_number) && (
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-muted-foreground)" }}>Serial Number</p>
                    <p style={{ fontSize: "0.875rem", fontFamily: "monospace" }}>
                      {selectedDocument.serialNumber || selectedDocument.serial_number}
                    </p>
                  </div>
                )}
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-muted-foreground)" }}>Issued in</p>
                  <p style={{ fontSize: "0.875rem" }}>{selectedDocument.country}</p>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button className="btn btn-outline" onClick={() => setPreviewOpen(false)}>
                Close
              </button>
              <button className="btn btn-secondary" onClick={() => handleDownload(selectedDocument)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>

              {activeTab === "pending" && (
                <>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setPreviewOpen(false)
                      openValidationDialog(selectedDocument, "rejected")
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </button>
                  <button
                    className="btn btn-default"
                    onClick={() => {
                      setPreviewOpen(false)
                      openValidationDialog(selectedDocument, "validated")
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Validate
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminValidation

