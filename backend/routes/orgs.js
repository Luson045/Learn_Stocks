// backend/routes/orgs.js
const express = require('express');
const router = express.Router();
const Org = require('../models/org');
const All = require('../models/all');
const finnhub = require('finnhub');
require('dotenv').config();
const all_org_id=process.env.ALL;
//const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

// Get stock data for an organization
router.get('/all', async (req, res) =>{
    try{
        const alldata = await All.findById(all_org_id);
        //console.log(alldata.names);
        return res.status(200).send(alldata.names);
    }catch{
        return res.status(400).send("failed to fetch");
    }
});
router.get('/:org_name', async (req, res) => {
    const org_name = req.params.org_name;
    //console.log(org_name);
    try {
        const orgData = await Org.findOne({ org_name });

        if (!orgData) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        return res.status(200).send(orgData);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: 'Failed to retrieve stock data' });
    }
});

module.exports = router;
