"use client"

import { useState, useEffect } from "react"
import { Award, Download, GraduationCap, Search, CheckCircle, XCircle, Clock } from "lucide-react"

function Dashboard() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [previewOpen, setPreviewOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [documents, setDocuments] = useState([])
  const [isDownloading, setIsDownloading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const documentsPerPage = 12
  const [genderFilter, setGenderFilter] = useState("")
  const [countryFilter, setCountryFilter] = useState("")
  const [institutionFilter, setInstitutionFilter] = useState("")


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("http://localhost:8000/backend/getCertificates.php")

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
          setError(data.message || "Failed to fetch documents")
          console.error("Error fetching data: ", data.message)
        }
      } catch (error) {
        setError(error.message || "An error occurred while fetching documents")
        console.error("Error: ", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".input-wrapper") && !event.target.closest(".dropdown-menu")) {
        setCountryDropdownOpen(false)
        setInstitutionDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const filteredDocuments = documents.filter((doc) => {
    if (doc.validation_status === "rejected") return false

    if (activeTab !== "all" && doc.type !== activeTab) return false

    if (genderFilter && doc.gender !== genderFilter) return false

    if (countryFilter && doc.country !== countryFilter) return false

    if (institutionFilter && doc.institution !== institutionFilter) return false

    if (
      searchTerm &&
      !doc.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !doc.institution?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    return true
  })

  const indexOfLastDocument = currentPage * documentsPerPage
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage
  const currentDocuments = filteredDocuments.slice(indexOfFirstDocument, indexOfLastDocument)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const getPaginationNumbers = () => {
    const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage)

    if (totalPages <= 9) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    } else {
      let startPage = Math.max(1, currentPage - 4)
      const endPage = Math.min(totalPages, startPage + 8)

      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - 8)
      }

      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
    }
  }

  const openPreview = (document) => {
    setSelectedDocument(document)
    setPreviewOpen(true)
  }

  const handleDownload = async (document) => {
    try {
      setIsDownloading(true)

      const downloadUrl = `http://localhost:8000/backend/downloadDocument.php?id=${document.id}&type=${document.type}`

      window.open(downloadUrl, "_blank")

      setTimeout(() => {
        setIsDownloading(false)
      }, 2000)
    } catch (error) {
      console.error("Error initiating download:", error)
      alert("Failed to initiate download: " + error.message)
      setIsDownloading(false)
    }
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

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Documents Hub</h1>
          <p style={{ color: "var(--color-muted-foreground)" }}>Manage and view all your diplomas and certificates</p>
        </div>

        <div className="dashboard-tabs">
          <div className="tabs-list">
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

          <div className="flex justify-between items-center mt-4">
            <div className="relative flex ">
              <Search
                className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4"
                style={{ color: "var(--color-muted-foreground)", margin: "6px 5px 0px 0px", width: "40px" }}
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

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {/* Gender filter - smaller width */}
            <div className="w-32">
              <select className="input w-full" onChange={(e) => setGenderFilter(e.target.value)} value={genderFilter}>
                <option value="">Gender</option>
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

            {/* Clear filters button */}
            <button
              className="btn btn-outline"
              onClick={() => {
                setGenderFilter("")
                setCountryFilter("")
                setInstitutionFilter("")
                setCountrySearchTerm("")
                setInstitutionSearchTerm("")
              }}
            >
              Clear Filters
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p>Loading documents...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full p-3 mb-4" style={{ backgroundColor: "var(--color-muted)" }}>
                <Search className="h-6 w-6" style={{ color: "var(--color-muted-foreground)" }} />
              </div>
              <h3 className="text-lg font-medium">Error loading documents</h3>
              <p style={{ color: "var(--color-muted-foreground)", marginTop: "0.25rem" }}>{error}</p>
            </div>
          ) : (
            <>
              <div className="dashboard-grid mt-6">
                {currentDocuments.map((doc) => (
                  <div key={doc.id} className="card">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold">{doc.title}</h3>
                        <p style={{ color: "var(--color-muted-foreground)" }}>{doc.institution}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Validation Status Icon */}
                        {renderValidationStatus(doc.validation_status)}

                        <span className={`badge ${doc.type === "diploma" ? "badge-default" : "badge-secondary"}`}>
                          {doc.type === "diploma" ? (
                            <GraduationCap className="h-4 w-4 mr-1" />
                          ) : (
                            <Award className="h-4 w-4 mr-1" />
                          )}
                          {doc.type ? doc.type.charAt(0).toUpperCase() + doc.type.slice(1) : "Unknown Type"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Full Name:</span>
                        <span className="text-sm">{doc.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Field of Study:</span>
                        <span className="text-sm">{doc.fieldOfStudy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Completion Date:</span>
                        <span className="text-sm">{new Date(doc.completionDate).toLocaleDateString()}</span>
                      </div>
                      {doc.grade && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Grade/Average:</span>
                          <span className="text-sm">{doc.grade}</span>
                        </div>
                      )}
                      {doc.validation_status && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Status:</span>
                          <span
                            style={{ color: "black" }}
                            className={`text-sm badge border px-2 py-1 rounded  
                            ${
                              doc.validation_status === "validated"
                                ? "border-green-500 text-green-700 dark:border-white dark:text-white"
                                : doc.validation_status === "rejected"
                                  ? "border-red-500 text-red-700 dark:border-white dark:text-white"
                                  : "border-gray-500 text-gray-700 dark:border-white dark:text-white"
                            } bg-white dark:bg-transparent`}
                          >
                            {doc.validation_status.charAt(0).toUpperCase() + doc.validation_status.slice(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <button className="btn btn-outline btn-sm" onClick={() => openPreview(doc)}>
                        Preview
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleDownload(doc)}
                        disabled={isDownloading}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredDocuments.length > 0 && (
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

                    {getPaginationNumbers().map((pageNumber) => (
                      <button
                        style={{ margin: "0px 2px" }}
                        key={pageNumber}
                        className={`btn btn-sm ${currentPage === pageNumber ? "btn-secondary" : "btn-outline"}`}
                        onClick={() => paginate(pageNumber)}
                      >
                        {pageNumber}
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

              {filteredDocuments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full p-3 mb-4" style={{ backgroundColor: "var(--color-muted)" }}>
                    <Search className="h-6 w-6" style={{ color: "var(--color-muted-foreground)" }} />
                  </div>
                  <h3 className="text-lg font-medium">No documents found</h3>
                  <p style={{ color: "var(--color-muted-foreground)", marginTop: "0.25rem" }}>
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {previewOpen && selectedDocument && (
        <div className="dialog-overlay" onClick={() => setPreviewOpen(false)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ marginTop: "30px" }} className="dialog-header">
              <h2 style={{ marginTop: "50px" }} className="dialog-title">
                {selectedDocument.type === "diploma" ? (
                  <GraduationCap
                    className="h-5 w-5 inline-block mr-2"
                    style={{ color: "var(--color-secondary)", marginRight: "5px" }}
                  />
                ) : (
                  <Award
                    className="h-5 w-5 inline-block mr-2"
                    style={{ color: "var(--color-secondary)", marginRight: "5px" }}
                  />
                )}
                {selectedDocument.title}
              </h2>
              <p className="dialog-description">
                {selectedDocument.institution} • {selectedDocument.fieldOfStudy}
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
                  top: "12px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "var(--color-background)",
                  padding: "10px",
                  borderRadius: "25px",
                }}
              >
                <span
                  style={{ marginTop: "2px", paddingLeft: "20px" }}
                  className={`badge ${selectedDocument.type === "diploma" ? "badge-default" : "badge-secondary"}`}
                >
                  {selectedDocument.type.toUpperCase()}
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
                  {selectedDocument.fullName}
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
                  Awarded on {new Date(selectedDocument.completionDate).toLocaleDateString()}
                </p>

                {selectedDocument.validation_status && (
                  <div style={{ marginTop: "1rem" }}>
                    <span
                      className={`badge ${
                        selectedDocument.validation_status === "validated"
                          ? "badge-success"
                          : selectedDocument.validation_status === "rejected"
                            ? "badge-destructive"
                            : "badge-outline"
                      }`}
                    >
                      {selectedDocument.validation_status === "validated"
                        ? "Validated"
                        : selectedDocument.validation_status === "rejected"
                          ? "Rejected"
                          : "Pending Validation"}
                    </span>
                  </div>
                )}
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
                {selectedDocument.serialNumber && (
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-muted-foreground)" }}>Serial Number</p>
                    <p style={{ fontSize: "0.875rem", fontFamily: "monospace" }}>{selectedDocument.serialNumber}</p>
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
              <button
                className="btn btn-secondary"
                onClick={() => handleDownload(selectedDocument)}
                disabled={isDownloading}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

