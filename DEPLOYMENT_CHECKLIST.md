# Deployment Checklist

## Pre-Deployment Issues Fixed ✅

1. ✅ **Hardcoded localhost URLs** - Fixed
   - Frontend now uses `VITE_BACKEND_URL` environment variable
   - Backend now uses `BACKEND_URL` environment variable
   - All API calls are now configurable

2. ✅ **CORS Configuration** - Fixed
   - CORS now uses `FRONTEND_URL` environment variable
   - Defaults to '*' for development, should be set to your domain in production

3. ✅ **Port Configuration** - Fixed
   - Backend PORT now uses `process.env.PORT` (defaults to 3001)
   - Compatible with hosting services that set PORT automatically

## Environment Variables Required

### Frontend (.env)
```env
VITE_BACKEND_URL=https://your-backend-domain.com
```

### Backend (.env in backend/ directory)
```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_PROJECT_ID=your-project-id
PORT=3001
NODE_ENV=production
BACKEND_URL=https://your-backend-domain.com
FRONTEND_URL=https://your-frontend-domain.com
```

## Pre-Deployment Checklist

### Code Issues ✅
- [x] Hardcoded URLs removed
- [x] Environment variables configured
- [x] CORS properly configured
- [x] Port configuration flexible

### Security Checklist
- [ ] `.env` files are in `.gitignore` (already done)
- [ ] No API keys or secrets in code
- [ ] CORS restricted to your domain in production
- [ ] HTTPS enabled for production

### Google Cloud Setup
- [ ] Vertex AI API enabled in Google Cloud Console
- [ ] Service Account created with "Vertex AI User" role
- [ ] Service Account credentials added to backend `.env`
- [ ] Google Cloud Storage bucket created (if using GCS)
- [ ] Billing enabled and monitored

### Testing
- [ ] Test video generation locally
- [ ] Test date filter functionality
- [ ] Test language selection
- [ ] Test cost calculation
- [ ] Test usage analytics

### Deployment Steps

#### Frontend (Vercel/Netlify/etc.)
1. Build: `npm run build`
2. Deploy `dist/` folder
3. Set `VITE_BACKEND_URL` environment variable

#### Backend (Railway/Render/Heroku/etc.)
1. Deploy backend code
2. Set all environment variables from backend `.env.example`
3. Ensure Node.js 18+ is available
4. Set start command: `npm start` (or `node server.js`)

### Post-Deployment
- [ ] Verify frontend connects to backend
- [ ] Test video generation end-to-end
- [ ] Monitor Google Cloud costs
- [ ] Check error logs
- [ ] Verify CORS is working correctly

## Known Limitations

1. **localStorage** - Data is stored in browser localStorage, not persistent across devices
2. **No User Authentication** - Single-user application
3. **No Database** - History stored in localStorage only

## Future Improvements

- [ ] Add database for persistent storage
- [ ] Add user authentication
- [ ] Add video download functionality
- [ ] Add video sharing features
- [ ] Add more detailed analytics

