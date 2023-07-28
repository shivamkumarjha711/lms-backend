import app from './app.js';
import connectionDB from './config/dbConnection.js';
import cloudinary from 'cloudinary';
import Razorpay from 'razorpay';

const PORT = process.env.PORT || 5000;

// Cloudinary Cofiguration         
cloudinary.v2.config({              // take all configuration from cloudinary website
  cloud_name: 'dpxjuiggo', 
  api_key: '676876765217467', 
  api_secret: 'kZ66aSAcoF5Imy1xZHuF-GS5zMc' 
});

// razor pay configuration
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
})

app.listen(PORT, async () => {
    await connectionDB();
    console.log(`App is running on port ${PORT}`);
})

