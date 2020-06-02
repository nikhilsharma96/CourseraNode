const express = require('express');
const authenticate = require('../authenticate');
const mongoose = require('mongoose');
const cors = require('./cors');
const bodyParser = require('body-parser');
const favorites = require('../models/favorite');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/').options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,authenticate.verifyUser, (req,res,next) => {
    favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    favorites.findOne({user: req.user._id})
    .then((favorite)=>{
        if(favorite){
            for (i=0;i<req.body.length;i++){
                if (favorite.dishes.indexOf(req.body[i]._id)===-1){
                    favorite.dishes.push(req.body[i]._id);
                }
            }
            favorite.save()
            .then((favorite)=>{
                console.log('favorite added! ',favorite);
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(favorite);
            },(err)=>{
                next(err);
            })
        }
        else{
            favorites.create({"user": req.user._id,"dishes":req.body})
            .then((favorite)=>{
                console.log('favorite created! ',favorite);
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(favorite);
            },(err)=>{
                next(err);
            })
        }
    })
    .catch((err)=>{
        next(err);
    })
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.setHeader('Content-Type','text/json');
    res.end('PUT operation not supported on /dishes');
}) 

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    favorites.findOneAndRemove({user: req.user._id},(err, resp)=>{
        if (err){
            return next(err);
        }
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    })
})



favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions,(req, res)=>{ res.sendStatus(200); })
.get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.setHeader('Content-Type','text/json');
    res.end('GET operation not supported on /favorites/'+req.params.dishId);
})

.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    favorites.findOne({user:req.user._id})
    .then((favorite)=>{
        if (favorite){
            if(favorite.dishes.indexOf(req.params.dishId)=== -1)
                favorite.dishes.push(req.params.dishId);
                favorite.save()
                .then((favorite)=>{
                    console.log('favorite added! '+favorite+' with dishId'+ req.params.dishId);
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorite);
                },(err)=>{
                    next(err);
            })
        }
        else{
            favorites.create({"user": req.user._id,"dishes":req.params.dishId})
            .then((favorite)=>{
                console.log('favorite created! ',favorite);
                res.statusCode=200;
                res.setHeader=('Content-Type','application/json');
                res.json(favorite);
            },(err)=>{
                next(err);
            })
        }
    })
    .catch((err)=>{
        next(err);
    })
})

.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.setHeader('Content-Type','text/json');
    res.end('PUT operation not supported on /favorites/'+req.params.dishId);
})

.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    favorites.findOne({user:req.user._id})
    .then((favorite)=>{
        if (favorite){
            var ind = favorite.dishes.indexOf(req.params.dishId);
            if(ind>=0){
                favorite.dishes.splice(ind,1);
                favorite.save()
                .then((favorite)=>{
                    console.log('Favorite Dish Deleted!',favorite);
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorite);
                },(err)=>{  
                    next(err);
                })
            }
            else{
                res.statusCode=404;
                res.setHeader('Content-Type','application/json');
                res.end('Dish '+req.params.dishId+' not in your list');                
            }
        }
        else{
            res.statusCode=404;
            res.setHeader('Content-Type','application/json');
            res.end('favorite not found');
        }
    })
    .catch((err)=>{
        next(err);
    });
});

module.exports = favoriteRouter; 


