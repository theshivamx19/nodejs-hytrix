import express from 'express';
import route from './routes/route.js';
import './db/connection.js'
import dotenv from 'dotenv'
dotenv.config()
// const router = express.Router();

const app = express()
app.use(express.json())


app.use('/', route)

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})

// import express from 'express';
// import route from './routes/route.js';
// import './db/connection.js';
// import dotenv from 'dotenv';
// dotenv.config();

// const app = express();

// // Establish database connection before using routes
// // ...

// app.use(express.json());
// app.use('/', route);

// app.listen(process.env.PORT, () => {
//     console.log(`Server is running on port ${process.env.PORT}`);
// });
