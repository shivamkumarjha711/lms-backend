import app from './app.js';
import connectionDB from './config/dbConnection.js';
import cloudinary from 'cloudinary'

const PORT = process.env.PORT || 5000;

// Cloudinary Cofiguration         
cloudinary.v2.config({              // take all configuration from cloudinary website
  cloud_name: 'dpxjuiggo', 
  api_key: '676876765217467', 
  api_secret: 'kZ66aSAcoF5Imy1xZHuF-GS5zMc' 
});

app.listen(PORT, async () => {
    await connectionDB();
    console.log(`App is running on port ${PORT}`);
})

