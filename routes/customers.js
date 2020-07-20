const express = require('express');
const router = express.Router();
// Joi is for validation
const Joi = require('joi');

// Connect to mongodb
const mongoose = require('mongoose');

// Defining schema for a customer
const Customer = mongoose.model('Customer', 
    new mongoose.Schema({
        isGold: {
            type: Boolean,
            required: true,
        },
        name: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        }
    }
));

// For POST requests
router.post('/', async(req, res) => {
    //Joi verification of the request body
    const schema = Joi.object({
        isGold: Joi.boolean().required(),
        name: Joi.string().required(),
        phone: Joi.number().required()
    });
    const validationResult = schema.validate(req.body);

    // if the joi validation fails, then send an error
    if(validationResult.error) return res.status(400).send('Invalid request.');

    let addCustomer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    });
    addCustomer = await addCustomer.save();
    res.send(addCustomer);
});

// For GET requests
router.get('/', async(req, res) => {
    const customers = await Customer.find();
    if(customers) {
        return res.status(200).send(customers);
    }
    else {
        return res.status(400).send('Bad Request, No Customers Found!');
    }
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id).catch(err => {
        res.status(404).send('Doesn\'t exist');
    });

    if(!customer) {
        return res.status(400).send('Bad Request, Invalid ID');
    }
    else {
        return res.status(200).send(customer);
    }
});

// For PUT requests
router.put('/:id', async(req, res) => {
    //Joi verification of the request body
    const schema = Joi.object({
        isGold: Joi.boolean().required(),
        name: Joi.string().required(),
        phone: Joi.number().required()
    });
    const validationResult = schema.validate(req.body);

    // if the joi validation fails, then send an error
    if(validationResult.error) return res.status(400).send('Invalid request.');

    // We do not verify if the object exists on the db, we update it first using the id
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        isGold: req.body.isGold,
        name: req.body.name,
        id: req.body.id
    }, { new: true });

    if(!customer) return res.status(404).send('Customer with the ID does not exist');

    res.send(customer);
})

// For DELETE requests
router.delete('/:id', async (req, res) => {
    // We do not verify if the object exists on the db, we delete it first using the id
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if(!customer) {
        return res.status(400).send('No such customer exists.');
    }

    return res.status(200).send(customer);
});

module.exports = router;