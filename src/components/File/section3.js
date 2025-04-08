import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./section3.module.css";
import Search from "../../search";

export default function FileUploadPage() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  const fetchSearchData = async (query) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/search?query=${encodeURIComponent(query)}`);
      setSearchResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error("검색 실패:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("파일을 선택하세요.");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post("http://localhost:3002/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        alert("파일 업로드 완료!");
        setFile(null);
        inputRef.current.value = "";
        fetchFiles();
      } else {
        alert("업로드 실패");
      }
    } catch (error) {
      console.error("업로드 실패:", error);
      alert("업로드 중 오류 발생");
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://localhost:3002/files");
      if (response.data.success) {
        setUploadedFiles(response.data.files);
      }
    } catch (error) {
      console.error("파일 목록 불러오기 실패:", error);
    }
  };

  const handleDownload = async (fileName) => {
    try {
      const response = await axios.get(`http://localhost:3002/download/${fileName}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("다운로드 실패:", error);
      alert("다운로드 중 오류 발생");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className={styles.body}>
      <nav>
        <div className={styles.nav}>
          <div className={styles.logo1}><h2>Logo</h2><span></span></div>
          <ul>
            <li><button className={styles.button} onClick={() => navigate("/main")}>Home</button></li>
            <li><button className={styles.button} onClick={() => navigate("/ChatApp")}>Chat</button></li>
            <li><button className={styles.button} onClick={() => navigate("/file")}>File</button></li>
            <li><button className={styles.button} onClick={() => navigate("/sendEmail")}>Email</button></li>
          </ul>
          <div className={styles.setting}><Link to="/">Setting</Link></div>
        </div>
      </nav>

      <Search
        fetchSearchData={fetchSearchData}
        searchResults={searchResults}
        isLoading={isLoading}
        setSearchText={setSearchText}
        searchText={searchText}
        showResults={showResults}
        setShowResults={setShowResults}
        handleLogout={handleLogout}
      />

      <div className={styles.fileUpload}>
        <h2>파일 업로드 및 다운로드</h2>
        <div className={styles.upload}>
          <input type="file" ref={inputRef} onChange={handleFileChange} />
          <button onClick={handleUpload}>업로드</button>
        </div>

        <h3>업로드된 파일 목록</h3>
        <div className={styles.fileList}>
          {uploadedFiles.length === 0 ? (
            <p>업로드된 파일이 없습니다.</p>
          ) : (
            uploadedFiles.map((fileName, index) => (
              <div key={index} className={styles.fileItem}>
                <span>{fileName}</span>
                <button onClick={() => handleDownload(fileName)}>다운로드</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}