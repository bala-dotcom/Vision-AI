# Vision AI - Video Generation Platform

A modern web application for generating AI videos using Google Vertex AI Veo 3.1 models.

## Features

- 🎬 **AI Video Generation** - Generate videos using Google Veo 3.1 models
- 🌍 **Multi-Language Support** - Support for Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Hindi, and English
- 💰 **Cost Tracking** - Real-time cost estimation and usage analytics
- 📊 **Usage Analytics** - Date-wise filtering and detailed statistics
- 🎨 **Customizable Settings** - Resolution, duration, aspect ratio, and audio options
- 📱 **Responsive Design** - Modern, professional UI

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **AI**: Google Vertex AI (Veo 3.1)

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Google Cloud Project with Vertex AI API enabled
- Google Cloud Service Account with Vertex AI User role

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Vision AI"
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Configure Environment Variables**

   **Frontend** (create `.env` in root):
   ```env
   VITE_BACKEND_URL=http://localhost:3001
   ```

   **Backend** (create `.env` in `backend/` directory):
   ```env
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_PROJECT_ID=your-project-id
   PORT=3001
   NODE_ENV=development
   ```

### Running Locally

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend Server** (in a new terminal)
   ```bash
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser

## Production Deployment

### Frontend Deployment

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your hosting service (Vercel, Netlify, etc.)

3. **Set environment variable** `VITE_BACKEND_URL` to your backend URL

### Backend Deployment

1. **Deploy to a Node.js hosting service** (Heroku, Railway, Render, etc.)

2. **Set environment variables**:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_PROJECT_ID`
   - `PORT` (usually auto-set by hosting service)
   - `NODE_ENV=production`
   - `BACKEND_URL` (your backend URL)
   - `FRONTEND_URL` (your frontend URL for CORS)

3. **Ensure Google Cloud Storage bucket exists** (if using GCS for video storage)

## Important Notes

- ⚠️ **Never commit `.env` files** - They contain sensitive credentials
- 🔒 **Keep your Google Cloud credentials secure**
- 💰 **Monitor your Google Cloud usage** - Video generation can be expensive
- 🌐 **Update CORS settings** in production to restrict access

## Troubleshooting

### Backend not connecting
- Check if backend is running on the correct port
- Verify `VITE_BACKEND_URL` matches your backend URL
- Check CORS settings

### Video generation fails
- Verify Google Cloud credentials are correct
- Ensure Vertex AI API is enabled in your project
- Check service account has "Vertex AI User" role
- Verify Veo models are available in your region

## License

Private project - All rights reserved
