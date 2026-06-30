# HouseIQ

HouseIQ is an AI-powered real estate analytics platform that helps users predict property prices, explore market trends, and receive personalized property recommendations. The project combines Machine Learning, Data Science, FastAPI, and React to provide an interactive and data-driven experience for buyers, investors, and researchers.

## Project Overview

The application consists of a FastAPI backend that performs data processing, machine learning inference, and analytics, along with a React frontend that provides an interactive and responsive user interface.

The platform includes:

- Property Price Prediction
- Market Analysis Dashboard
- Property Recommendation System
- Interactive Data Visualization
- Word Cloud Analysis
- Market Heatmaps

## Features

### Property Price Prediction

- Predict property prices using a trained Machine Learning model.
- Supports multiple cities and localities.
- Uses property details such as area, property type, furnishing status, and amenities.
- Returns estimated property price instantly.

### Market Analysis

- Interactive bubble map displaying average property prices by locality.
- Market summary statistics.
- Dynamic charts generated from selected columns.
- Multiple chart types including:
  - Bar Chart
  - Horizontal Bar Chart
  - Pie Chart
  - Line Chart
  - Area Chart
  - Scatter Plot
- Word Cloud visualization of property amenities.

### Recommendation System

- Personalized property recommendations based on:
  - Budget
  - Minimum Area
  - Maximum Area
  - City
  - Locality
  - Preferred Amenities
- Recommendation score calculation.
- Amenity matching percentage.
- Detailed property information displayed using dialog boxes.

## Technology Stack

### Frontend

- React
- TypeScript
- TanStack Router
- Tailwind CSS
- Recharts
- Plotly
- Axios

### Backend

- FastAPI
- Pandas
- NumPy
- Scikit-learn
- Joblib
- Matplotlib
- WordCloud
- Geopy

### Machine Learning

- Scikit-learn
- Feature Engineering
- Data Preprocessing
- Regression Model

## Project Structure

```
HouseIQ
│
├── backend
│   ├── dataset
│   ├── models
│   ├── services
│   ├── routers
│   ├── utils
│   ├── main.py
│   └── requirements.txt
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## API Endpoints

### General

```
GET /cities
GET /localities/{city}
GET /amenities
GET /columns
```

### Price Prediction

```
POST /predict
```

### Market Analysis

```
GET /market-map/{city}
POST /custom-graph
GET /wordcloud
```

### Recommendations

```
POST /recommend
```

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/HouseIQ.git
cd HouseIQ
```

### Backend Setup

```bash
cd backend
python -m venv venv
```

Activate virtual environment.

Windows

```bash
venv\Scripts\activate
```

Linux/macOS

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run backend

```bash
uvicorn main:app --reload
```

Backend will start at

```
http://127.0.0.1:8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will start at

```
http://localhost:8080
```

## Machine Learning Workflow

1. Data Collection
2. Data Cleaning
3. Feature Engineering
4. Feature Encoding
5. Model Training
6. Model Evaluation
7. Model Serialization
8. Prediction using FastAPI

## Dataset

The project uses residential property listings collected from multiple Indian cities. The dataset contains information such as:

- City
- Locality
- Society Name
- Property Type
- Built-up Area
- Price
- Average Price per Square Foot
- Amenities
- Furnishing Status
- Latitude
- Longitude

## Future Improvements

- Authentication and User Accounts
- Property Comparison
- Property Image Gallery
- Mortgage Calculator
- Recently Viewed Properties
- Saved Properties
- Price Trend Forecasting
- Nearby Schools and Hospitals
- Property Similarity Search
- Real-time Property Listings

## Screenshots

Add screenshots of:

- Home Page
- Price Prediction
- Market Analysis
- Bubble Map
- Word Cloud
- Recommendation System

## Author

Rushit Devani

## License

This project is developed for educational and portfolio purposes.
