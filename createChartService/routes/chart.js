const express = require('express');
const router = express.Router();
const Chart = require('../models/chart');
const {publishChartCreatedEvent,publishCreditSubEvent} = require("../choreographer/choreographer");

//PERITTOOOO!!!!!!!!!
// GET all index
router.get('/', async (req, res) => {
    try {
        const charts = await Chart.find();
        res.json(charts);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST a new chart
router.post('/', async (req, res) => {
    try {
        const newChart = new Chart({
            type: req.body.type,
            cost: req.body.cost,
            chartName: req.body.chartName,
            createdOn: req.body.createdOn,
            userEmail: req.body.userEmail,
            form: req.body.form
        });
        const savedChart = await newChart.save();
        const quotas ={userEmail: req.body.userEmail,sub: req.body.cost}
        await publishCreditSubEvent(quotas);
        await publishChartCreatedEvent(savedChart);
        res.json(savedChart);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.error(error);
    }
});
//PERITTOOOO!!!!!!!!!
// GET a specific chart by ID
router.get('/:id', async (req, res) => {
    try {
        const chart = await Chart.find({userEmail: req.params.id});
        if (!chart) {
            return res.status(404).json({ error: 'Chart not found' });
        }
        res.json(chart);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});
//PERITTOOOO!!!!!!!!!
// PUT (update) a specific chart by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedChart = await Chart.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updatedChart) {
            return res.status(404).json({ error: 'Chart not found' });
        }
        res.json(updatedChart);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

//PERITTOOOO!!!!!!!!!
// DELETE a specific chart by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedChart = await Chart.findByIdAndDelete(req.params.id);
        if (!deletedChart) {
            return res.status(404).json({ error: 'Chart not found' });
        }
        res.json(deletedChart);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
