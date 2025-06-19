# Meeting Scheduler

A full-stack web application that helps executive board members pick a meeting time that works for everyone. Built with React, Express.js, and MongoDB.

## Features

- **Availability Submission**: Users can submit their availability for meetings
- **Interactive Time Grid**: Visual grid showing Monday-Friday, 9AM-9PM time slots
- **Real-time Heatmap**: Admin view showing most common available times
- **Best Time Calculation**: Automatically finds the time slot(s) with highest overlap
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React.js with functional components and hooks
- **Backend**: Express.js with MongoDB and Mongoose
- **Database**: MongoDB Atlas
- **Styling**: CSS with responsive design

## Project Structure

```
MeetingScheduler/
├── frontend/          # React application
│   ├── src/
│   │   ├── pages/     # React components
│   │   └── App.js     # Main app component
│   └── package.json
├── backend/           # Express.js server
│   ├── server.js      # Main server file
│   └── package.json
└── README.md
```

## Local Development Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   PORT=5001
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5001`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:5001
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000`

## API Endpoints

- `POST /api/availability` - Submit user availability
- `GET /api/availability` - Get all availabilities with summary
- `GET /api/best-time` - Get the best meeting time(s)
- `DELETE /api/availability` - Clear all data (admin only)

## Usage

1. **Submit Availability**: Visit `/availability` to submit your availability
2. **View Results**: Visit `/results` to see the heatmap and best times
3. **Generate Test Data**: Use the "Generate Example Data" button on the results page
4. **Clear Data**: Use the "Clear All Data" button to reset the database

## Deployment

### Backend (Render.com)
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables:
   - `NODE_ENV=production`
   - `MONGODB_URI=your_mongodb_atlas_uri`
   - `FRONTEND_URL=your_frontend_url`

### Frontend (Netlify/Vercel)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variable:
   - `REACT_APP_API_URL=your_backend_url`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE). 