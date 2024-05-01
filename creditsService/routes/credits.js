const express = require('express');
const router = express.Router();
const Credits = require('../models/credits');
const { publishCreditCreatedEvent, publishCreditAddedEvent} = require('../choreographer/choreographer');


// GET all credits
router.get('/', async (req, res) => {
    try {
        const credits = await Credits.find();
        res.json(credits);
        console.log("credits");
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST new credits
router.post('/', async (req, res) => {
    try {
        const newCredits = new Credits({
            userEmail: req.body.userEmail,
            total: req.body.total,
            sub: req.body.sub,
            added: req.body.added,
        });
        const savedCredits = await newCredits.save();
        await publishCreditCreatedEvent(savedCredits);
        res.json(savedCredits);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET credits by user email
router.get('/:userEmail', async (req, res) => {
    try {
        console.log("in creditsService!!!!!!!!!!!!!!")
        const credits = await Credits.find({ userEmail: req.params.userEmail });
        res.json(credits);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT (update) credits by user email
router.put('/', async (req, res) => {
    try {
        if (req.body.added){
            const updatedCredits = await Credits.findOneAndUpdate(
                { userEmail: req.body.userEmail },
                { $set: { added: req.body.added } },
                { new: true }
            );
            if (!updatedCredits) {
                return res.status(404).json({ error: 'Credits not found' });
            }
            await publishCreditAddedEvent(updatedCredits);
            res.json(updatedCredits);
        }else if (req.body.sub){
            const updatedCredits = await Credits.findOneAndUpdate(
                { userEmail: req.body.userEmail },
                { $set: { sub: req.body.sub } },
                { new: true }
            );


            if (!updatedCredits) {
                return res.status(404).json({ error: 'Credits not found' });
            }
            res.json(updatedCredits);
        } else {
            const updatedCredits = await Credits.findOneAndUpdate(
                { userEmail: req.body.userEmail },
                req.body,               //???????????????????
                { new: true }
            );
            if (!updatedCredits) {
                return res.status(404).json({ error: 'Credits not found' });
            }
            res.json(updatedCredits);
        }

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE credits by user email
router.delete('/:userEmail', async (req, res) => {
    try {
        const deletedCredits = await Credits.findOneAndDelete({
            userEmail: req.params.userEmail,
        });
        if (!deletedCredits) {
            return res.status(404).json({ error: 'Credits not found' });
        }
        res.json(deletedCredits);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
