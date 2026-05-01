const express=require('express');
const cors=require('cors');
const path=require('path');
const app=express();

require('./config/db');
const userRoutes=require('./routes/UserRoutes');

app.use(cors());
app.use(express.json());

// ✅ Serve Frontend folder
app.use(express.static(path.join(__dirname, '../Frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/index.html'));
});

app.use('/api',userRoutes);


const port=3000;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});


