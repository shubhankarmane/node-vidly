const express = require('express');
const router = express.Router();

const Joi = require('joi');

const genres = [
    { id: 1, genre: 'Action' },
    { id: 2, genre: 'Horror' },
    { id: 3, genre: 'Sci-Fi' },
    { id: 4, genre: 'Romance' },
    { id: 5, genre: 'Comedy' },
    { id: 6, genre: 'Crime' },
    { id: 7, genre: 'Adventure' },
    { id: 8, genre: 'Drama' },
    { id: 9, genre: 'Thriller' },
    { id: 10, genre: 'Animation' },
];

router.get('/', (req, res) => {
    if(genres) {
        return res.status(200).send(genres);
    }
    else {
        return res.status(400).send('Bad Request, No Genres Found!');
    }
});

router.get('/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) {
        return res.status(400).send('Bad Request, Invalid ID');
    }
    else {
        return res.status(200).send(genre);
    }
});

router.post('/', (req, res) => {
    const schema = Joi.object({
        genre: Joi.string().required(),
    });

    const validationResult = schema.validate(req.body);
    if(validationResult.error) {
        return res.status(400).send('Genre is invalid.');
    }
    else {
        const addGenre = {
            id: genres.length + 1,
            genre: req.body.genre
        }
        genres.push(addGenre);
        return res.status(200).send(addGenre);
    }
});

router.delete('/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) {
        return res.status(400).send('No such genre exists.');
    }
    else {
        genres.splice(genres.indexOf(genre), 1);
        return res.status(200).send('Deleted Successfully.');
    }
});

router.put('/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(genre) {
        const schema = Joi.object({
            genre: Joi.string().required(),
        });
        const validatationResult = schema.validate(req.body);
        if(validatationResult.error) {
            return res.status(400).send('Invalid data received.');
        }
        else {
            const index = genres.indexOf(genre);
            genres[index] = { id: parseInt(req.params.id), genre: req.body.genre };
            return res.status(200).send(genres[index]);
        }
    }
    else {
        return res.status(404).send('No such genre.');
    }
});

module.exports = router;