const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();



favoriteRouter.route('/')
.options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
.get(cors.cors,authenticate.verifyUser,(req, res, next) => {
    Favorite.find( { user: req.user._id })
    .populate('user')
    .populate('campsites')
    .then (favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favorite.findOne({user:req.user._id})
        .then(favorite =>{
        if(favorite){
            req.body.forEach(fav =>{
                if(!favorite.campsites.imcludes(fav._id)){
               favorite.campsite.push(fav._id);
        
                 }

            })
            favorite.save()
            .then(favorite => {
                console.log('Campsite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
     } else{
                    favorite.create({user:req.user._id})
                    .then(favorite =>{
                    req.body.forEach(fav =>{
                        if(!favorite.campsites.imcludes(fav._id)){
                    favorite.campsite.push(fav._id);
                }
            });
                 favorite.save()
                .then(favorite => {
                            console.log('Campsite Created ', favorite);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                         })
                       .catch(err => next(err));
                    })
                   .catch(err => next(err));
                 }
             })
        .catch(err => next(err));
    })

    .put(cors.corsWithOptions,authenticate.verifyUser,(req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /partners');
    })
.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favorite.findOneAndDelete()
    .then(favorite => {
        res.statusCode = 200;
        if(favorite){
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
        }else{
            res.setHeader('Content-Type','text/plain');
            res.end('You do not have any favorites to delete.');
        }
    })
    .catch(err => next(err));
});

favoriteRouter.route('/:campsiteId')
.get(cors.cors,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
Favorite.findOne({user:req.user._id})
    .then(favorite =>{
               if(favorite){
                if(!favorite.campsites.includes(req.params.campsiteId)){
               favorite.campsite.push(req.params.campsiteId);
            }
                    favorite.save()
                    .then(favorite => {
                    console.log('Campsite Created ', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch(err => next(err));
            } else{
                     favorite.create({user:req.user._id})
                     .then(favorite =>{
                      favorite.save()
                      .then(favorite => {
                       console.log('Campsite Created ', favorite);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                            })
                        .catch(err => next(err));
                        })
                    .catch(err => next(err));
                    }
                })
            .catch(err => next(err))
         })
.put(cors.corsWithOptions,authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    favorite.findOne()
    .then(favorite => {
        if(favorite){
        if(!favorite.campsite.indexOf(req.params.campsiteId)){
            favorite.campsite.splice(req.params.campsiteId)
           }
                favorite.save()
                then(favorite =>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
           })
              .catch(err => next(err));
          }else{  
            res.setHeader('Content-Type','text/plain');
            res.end('You do not have any favorites to delete.');
         }
    })
    .catch(err => next(err));
});
module.exports = favoriteRouter;