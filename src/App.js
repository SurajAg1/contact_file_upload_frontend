import React, { useState } from 'react';
import './App.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const allowedFileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
  
    if (selectedFile) {
      const fileName = selectedFile.name.toLowerCase();
      const isCsvOrExcel = /\.(csv|xls|xlsx)$/i.test(fileName);
  
      if (isCsvOrExcel) {
        setFile(selectedFile);
      } else {
        alert('Please select a valid CSV, XLS, or XLSX file.');
        // Optionally, you can clear the file input
        event.target.value = null;
      }
    }
  };
  

  const handleUpload = () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log('File uploaded successfully:', data);
        setTableData(data.data || []);
        setCurrentPage(1); // Reset to the first page after uploading a new file
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  // Calculate the range of rows to display for the current page
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  // Define a constant header row
  const headerRow = ["name", "email", "number"];

  return (
    <div>
      <div className='upload'>
        <input type="file" onChange={handleFileChange} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
        <button onClick={handleUpload}>Upload</button>
      </div>
      {tableData.length > 0 && (
        <div>
          <table>
            <thead>
              <tr>
                {headerRow.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.slice(startIndex, endIndex).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className='page'>
            <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous Page</button>
            <span> Page {currentPage} </span>
            <button onClick={handleNextPage} disabled={endIndex >= tableData.length}>Next Page</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
