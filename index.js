const express = require('express')
const app = express();
const oracledb = require('oracledb')
require('dotenv').config();

const port = process.env.PORT || 5000

const path = require('path')
const template_path = path.join(__dirname, "./template/views");
console.log(__dirname);
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", template_path);


app.get('/',(req,res)=>{
    res.render("index")
})

app.post('/alldata',async(req,res)=>{
    let cons;
    const {donorname,email,phone,bloodtype,age,gender,address} = req.body;
    try {
        cons = await oracledb.getConnection({     
            user:process.env.USER,
            password:process.env.PASS,  
            connectString: process.env.CONNECT_STRING,
        });

        const data = await cons.execute(
            `SELECT * FROM bdonor`
        )

        console.log(data.rows);
        console.log('Connected Successfully');

    } catch (error) {
        console.log('Oracle not connected');
        console.log(error);
        return
    }

    try {
        const addData = await cons.execute(`INSERT INTO bdonor
        VALUES (:donorname,:email,:phone,:bloodtype,:age,:gender,:address)`,{donorname,email,phone,bloodtype,age,gender,address})
        await cons.commit();
        console.log('Data added Successfully');
        console.log(addData);
        res.redirect('/alldata');
    } catch (error) {
            console.log("Data not added:" + error);
    }
    
})
app.get('/alldata',async (req,res)=>{
            cons = await oracledb.getConnection({     
                        user:process.env.USER,
                        password:process.env.PASS,  
                        connectString: process.env.CONNECT_STRING,
                    });
            let resu=null;
            let rriz=null;
            try {
                        const addData = await cons.execute(`SELECT * FROM BDONOR`)
                         resu=addData.rows;
                         rriz= resu.map((row) => ({
                                     donorname:row[0],
                                     phone:row[1],
                                     email:row[2],
                                     age:row[3],
                                     bloodtype:row[4],
                                     gender:row[5],
                                     address:row[6],
                              }));
                         console.log(rriz);
                        await cons.commit();
                        // console.log('Data added Successfully');
                        // console.log(addData);
                    } catch (error) {
                            console.log("Data not added:" + error);
                    }
            res.render("table",{data:rriz})
})
app.listen(port,()=>{
    console.log(`Server is listening at port ${port}`);
})


