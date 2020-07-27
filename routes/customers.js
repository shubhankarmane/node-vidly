const express = require('express');
const router = express.Router();
const {Customer, validateCustomer} = require('../models/customer');
const auth = require('../middleware/auth');

// For POST requests
router.post('/', auth, async(req, res, next) => {
    try {
        const validationResult = validateCustomer(req.body);
        // if the joi validation fails, then send an error
        if(validationResult.error) return res.status(400).send(validationResult.error.details[0].message);
        let addCustomer = new Customer({
            isGold: req.body.isGold,
            name: req.body.name,
            phone: req.body.phone
        });
        addCustomer = await addCustomer.save();
        res.send(addCustomer);
    }
    catch(ex) {
        next(ex);
    }
});

// For GET requests
router.get('/', async(req, res, next) => {
    try {
        const customers = await Customer.find();
        if(customers)  return res.status(200).send(customers);
        return res.status(404).send('Couldn\'t find customers!');
    }
    catch(ex) {
        next(ex);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if(!customer) return res.status(404).send('Couldn\'t find customer!');
        return res.status(200).send(customer);
    }
    catch(ex) {
        next(ex);
    }
});

// For PUT requests
router.put('/:id', auth, async(req, res, next) => {
    try {
        const validationResult = validateCustomer(req.body);
        // if the joi validation fails, then send an error
        if(validationResult.error) return res.status(400).send(validationResult.error.details[0].message);
        // We do not verify if the object exists on the db, we update it first using the id
        const customer = await Customer.findByIdAndUpdate(req.params.id, {
            isGold: req.body.isGold,
            name: req.body.name,
            phone: req.body.phone
        }, { new: true });
        if(!customer) return res.status(404).send('Couldn\'t find customer!');
        res.send(customer);
    }
    catch(ex) {
        next(ex);
    }
})

// For DELETE requests
router.delete('/:id', auth, async (req, res, next) => {
    try {
        // We do not verify if the object exists on the db, we delete it first using the id
        const customer = await Customer.findByIdAndRemove(req.params.id);
        if(!customer) return res.status(404).send('Couldn\'t find customer!');
        return res.status(200).send(customer);
    }
    catch(ex) {
        next(ex);
    }
});

module.exports = router;