import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './mainpage.css';
import food from '../images/food.jpeg';
import office from '../images/office.png';
import travel from '../images/travel.jpg';
import defaultImage from '../images/default.png'; // Add a default image

function MainPage() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [textValue, setTextValue] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [result, setResult] = useState('');
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [remark, setRemark] = useState('');
  const [imageSrc, setImageSrc] = useState(defaultImage);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/getdata', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      const { image, remark } = getImageAndRemarkBasedOnData(data);
      setImageSrc(image);
      setRemark(remark);
    }
  }, [data]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setTextValue('');
    setImageFile(null);
    setResult('');
    setError(null);
  };

  const handleTextChange = (event) => {
    setTextValue(event.target.value);
    setResult('');
    setError(null);
  };

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
    setResult('');
    setError(null);
  };

  const handleGraph = () => {
    navigate('/analysis');
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/resetcount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        setData(null); 
        navigate('/');
      } else {
        console.error('Error resetting count list:', response.statusText);
      }
    } catch (error) {
      console.error('Error resetting count list:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const url = 'http://localhost:5000/predict';
    let fetchOptions = {
      method: 'POST',
    };

    if (selectedOption === 'text') {
      fetchOptions.headers = { 'Content-Type': 'application/json' };
      fetchOptions.body = JSON.stringify({ text: textValue });
    } else {
      const formData = new FormData();
      formData.append('file', imageFile);
      fetchOptions.body = formData;
    }

    fetch(url, fetchOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.prediction) {
          setResult(data.prediction);
          setError(null);
        } else if (data.error) {
          setError(data.error);
          setResult('');
        }

        return fetch('http://localhost:5000/getdata', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });
      })
      .then((response) => response.json())
      .then((jsonData) => {
        setData(jsonData); 
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('Failed to get prediction. Please try again.');
        setResult('');
      });
  };

  return (
    <div className="main-container">
      <nav className="navbar">
        <h1 className="navbar-brand">Sap Categorization</h1>
        <div className="navbar-links">
          <button
            className="nav-button"
            onClick={() => handleOptionChange('text')}
          >
            Text
          </button>
          <button
            className="nav-button"
            onClick={() => handleOptionChange('image')}
          >
            Image
          </button>
          <button
            className="nav-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="center-body">
        <div className="content">
          <div className="form-container">
            {selectedOption ? (
              <form onSubmit={handleSubmit}>
                {selectedOption === 'text' ? (
                  <textarea
                    placeholder="Enter your expense"
                    value={textValue}
                    onChange={handleTextChange}
                    className="text-area"
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                )}
                <button type="submit" className="submit-button">
                  Submit
                </button>
                {result && (
                  <div className="result">
                    <h2>Result:</h2>
                    <p>{result}</p>
                  </div>
                )}
                {error && <p className="error">{error}</p>}
              </form>
            ) : (
              <p>Please select an option to get started.</p>
            )}
            <div className="graph-container">
              <button className="graph-button" onClick={handleGraph}>
                View Graph
              </button>
            </div>
          </div>
        </div>
        <div className="output-feeder">
          <img
            src={imageSrc}
            alt="Output Feeder Image"
            className="output-image"
          />
          <p>{remark}</p> 
        </div>
      </div>
    </div>
  );
}

function getImageAndRemarkBasedOnData(data) {
  if (!data || !data.values || !data.values.length) {
    return { image: defaultImage, remark: "No expenditure data available." };
  }

  const maxCountIndex = data.values.indexOf(Math.max(...data.values));
  const images = [food, office, travel]; // Example image paths

  let remark;
  switch (maxCountIndex) {
    case 0:
      remark = "You have a high expenditure in food.";
      break;
    case 1:
      remark = "You have a high expenditure in office supplies.";
      break;
    case 2:
      remark = "You have a high expenditure in travel.";
      break;
    default:
      remark = "Expenditure data is unclear.";
  }

  return { image: images[maxCountIndex], remark };
}

export default MainPage;



//default problems image out-feed