"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Award, Upload } from "lucide-react"

function AddCertificate() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    title: "",
    institution: "",
    country: "",
    fieldOfStudy: "",
    completionDate: "",
    serialNumber: "",
    grade: "",
  })
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {

    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    if (!userData.id) {
      navigate("/login")
      return
    }

    setUser(userData)
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]

    if (selectedFile) {

      if (!["application/pdf", "image/jpeg", "image/png"].includes(selectedFile.type)) {
        setFileError("Please select a PDF, JPG, or PNG file")
        setFile(null)
        return
      }


      if (selectedFile.size > 5 * 1024 * 1024) {
        setFileError("File size must be less than 5MB")
        setFile(null)
        return
      }

      setFile(selectedFile)
      setFileError("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      setFileError("Please select a file to upload")
      return
    }

    if (!user) {
      alert("You must be logged in to add a certificate")
      navigate("/login")
      return
    }

    setIsSubmitting(true)

    const formDataToSend = new FormData()

    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key])
    })

    formDataToSend.append("type", "certificate")
    formDataToSend.append("user_id", user.id)
    formDataToSend.append("documentFile", file)

    try {
      const response = await fetch("http://localhost:8000/backend/insert.php", {
        method: "POST",
        body: formDataToSend, 
      })

      const result = await response.json()
      if (result.success) {
        alert(result.message)

        setFormData({
          fullName: "",
          gender: "",
          title: "",
          institution: "",
          country: "",
          fieldOfStudy: "",
          completionDate: "",
          serialNumber: "",
          grade: "",
        })
        setFile(null)
        document.getElementById("certificateFile").value = ""

        navigate("/profile")
      } else {
        alert("Error: " + result.message)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Failed to submit form")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return <div className="container py-8">Loading...</div>
  }

  return (
    <div className="container py-8">
      <div className="mx-auto" style={{ maxWidth: "42rem" }}>
        <div className="flex items-center gap-2 mb-6">
          <Award className="h-6 w-6" style={{ color: "var(--color-primary)" }} />
          <h1 className="text-3xl font-bold">Add Certificate</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="input w-full"
                placeholder="John Smith"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium mb-1">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                className="input w-full"
                value={formData.gender}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Certificate Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="input w-full"
              placeholder="Web Development Bootcamp"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="institution" className="block text-sm font-medium mb-1">
                Issuing Organization
              </label>
              <input
                type="text"
                id="institution"
                name="institution"
                className="input w-full"
                placeholder="Coding Academy"
                value={formData.institution}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-1">
                Issuing Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                className="input w-full"
                placeholder="United States"
                value={formData.country}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fieldOfStudy" className="block text-sm font-medium mb-1">
                Field of Study
              </label>
              <input
                type="text"
                id="fieldOfStudy"
                name="fieldOfStudy"
                className="input w-full"
                placeholder="Web Development"
                value={formData.fieldOfStudy}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="completionDate" className="block text-sm font-medium mb-1">
                Completion Date
              </label>
              <input
                type="date"
                id="completionDate"
                name="completionDate"
                className="input w-full"
                value={formData.completionDate}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="serialNumber" className="block text-sm font-medium mb-1">
                Certificate ID/Serial Number <span className="text-xs text-gray-500">(Optional)</span>
              </label>
              <input
                type="text"
                id="serialNumber"
                name="serialNumber"
                className="input w-full"
                placeholder="CERT-2023-12345"
                value={formData.serialNumber}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="grade" className="block text-sm font-medium mb-1">
                Grade/Score <span className="text-xs text-gray-500">(Optional)</span>
              </label>
              <input
                type="text"
                id="grade"
                name="grade"
                className="input w-full"
                placeholder="Pass, A+, 95%, etc."
                value={formData.grade}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div
            className="rounded-lg p-6 flex flex-col items-center justify-center"
            style={{
              border: "1px dashed #e3e9f0",
              borderRadius: "15px",
              borderColor: "var(--color-border)",
              padding: "10px",
            }}
          >
            <Upload className="h-8 w-8 mb-2" style={{ color: "var(--color-muted-foreground)" }} />
            <h3 className="text-lg font-medium">Upload Certificate</h3>
            <p className="text-sm mb-4" style={{ color: "var(--color-muted-foreground)" }}>
              Drag and drop your certificate file or click to browse
            </p>
            <input
              style={{ margin: "0px auto", border: "1px solid #e3e9f0", padding: "4px 10px", borderRadius: "5px" }}
              type="file"
              className="max-w-sm"
              id="certificateFile"
              name="certificateFile"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              required
              disabled={isSubmitting}
            />
            {fileError && <p className="text-xs mt-2 text-red-500">{fileError}</p>}
            <p className="text-xs mt-2" style={{ color: "var(--color-muted-foreground)" }}>
              Supported format: PDF (max 5MB)
            </p>
          </div>

          <div className="flex justify-content-end">
            <button type="submit" className="btn btn-default" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Certificate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCertificate

