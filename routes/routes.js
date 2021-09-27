const express = require('express');
const router = express.Router();
const axios = require("axios");

router.post('/mean-median', (req,res) =>{

    const  median = (arr) => {
        const mid = Math.floor(arr.length / 2)
        return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
    };
    
    const mean = (arr) => {
        return arr.reduce((sum,el) => sum + el) / arr.length
    }
    
    try {
        let arr = req.body.array;
        let result = [];
        let initialLenght = arr.length;
        let start = 0;
        let temp = [];
        for (let i = 0; i < initialLenght - 1; i++) {
            if(arr[i]  > arr[i+1]){
                temp.push(arr.slice(start,i + 1))
                start = i + 1;
            } 
        }
        temp.push(arr.slice(start));
    
        for (let j = 0; j < temp.length; j++) {
            result.push({
                mean: mean(temp[j]),
                median: median(temp[j])
            });
            
        }

        res.status(200).send({
            status:200,
            result
        });
    } catch (error) {
        res.status(400).send({
            status:400,
            message: error.message
        });
    }

  
})


router.post('/convert', async (req,res) =>{
    try {
        let dataRequest = req.body;
        let result = [];
        const host = 'api.frankfurter.app';
        for (let i = 0; i < dataRequest.length; i++) {
            const {data} = await axios.get(`https://${host}/latest?amount=${dataRequest[i].amount}&from=${dataRequest[i].currency}&to=USD`);
            result.push(data.rates.USD)
        }
        res.status(200).send({
            status:200,
            result
        });
        
    } catch (error) {
        res.status(400).send({
            status:400,
            message: error.message
        });
    }
  
})

router.post('/lembar-uang', async (req,res) =>{
    let money = [1000,2000,5000,10000,20000,50000,100000];
    let count = 0;
    let countLembar = 0;
    let initialLenght = money.length;
    let harga = req.body.harga;
    let lembar = req.body.lembar;
    let temp = []

    if(lembar === 1){
        money = money.filter(el => {return el > harga});
        res.status(200).send({
            status:200,
            data: Math.min(...money)
        })
    }

    for (let i = initialLenght - 1; i >= 0 ; i--) { 

        if(count + money[i] <= harga){
            count = count + money[i];
            countLembar++;
            temp.push(money[i])
        }
        
    }

    if(countLembar !== lembar){
        for (let i = 0; i < temp.length; i++) {
            let check = money.indexOf(temp[i]/2);
            if(check !== -1){
                temp[i] = temp[i]/2;
                temp.push(temp[i])
                countLembar++;
            }
            if(countLembar === lembar) break;
            
        }
    }

    res.status(200).send({
        status:200,
        data: temp.sort((a,b) => {return a-b})
    })

  
})

module.exports = {
    routes: router
}