import mongoose from 'mongoose';
import Logger from '../utils/logger.js';
const connection = (username,password,PORT) => {
    try {
      //https://www.mongodb.com/cloud/atlas     //connection with mongo db using mongoose on port 5000
      //console.log(username+'-'+password+'-'+PORT);
      const DB_URL = `mongodb+srv://${username}:${password}@cluster0.xx7bo1e.mongodb.net/matrix?retryWrites=true&w=majority`;
  
     mongoose.connect(DB_URL,{useNewUrlParser: true, useUnifiedTopology:true})
                                 .then(response => {
                                    console.log(`${response.connection.host}`);
                                    console.log('Database Connected Succesfully');
                                  });
    } catch (error) {
      Logger.error(error.message);
      console.log('Error: ', error.message);
    }
  }
  
  export default connection;

