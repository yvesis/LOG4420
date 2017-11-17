var express = require("express");
var router = express.Router();
var Product = require('../models/productModel');


// get prudcts - /api/products
router.get("/", function (req, res) {
  if (req.query.criteria) {
    var criteria = sorting.find(s => s.name == req.query.criteria);
    if (criteria) {
      criteria = criteria.fn;
    } else {
      return res.status(400).json({ title: 'Invalide criteria !' });
    }
  }
  if (req.query.category) {
    var category = categorys.includes(req.query.category) ? req.query.category : null;
    if (!category) {
      return res.status(400).json({ title: 'Invalide category !' });
    }
    Product.find({ 'category': category }, function (err, products) {
      if (err) {
        return res.status(400).json({
          title: 'An error has occured !',
          error: err
        });
      }
      products = products.sort(criteria);
      res.status(200).json(products);
    });
  } else {
    Product.find({}, function (err, products) {
      if (err) {
        return res.status(400).json({
          title: 'An error has occured !',
          error: err
        });
      }
      products = products.sort(sortByPriceASC);
      res.status(200).json(products);
    });
  }
  
});


router.get("/:id", function (req, res) {
  console.log(req.params.id)
  Product.findOne({id: req.params.id}, function (err, product) {
    if (err || !product) {
      return res.status(404).json({
        title: 'product ID not found!',
      });
    }
    res.status(200).json(product);
  });
});


  // save product - /api/products
  router.post("/", function(req, res) {
    var body = req.body;
    var product = new Product();
    product.id = body.id;
    product.name = body.name;
    product.price = body.price;
    product.image = body.image;
    product.category = body.category;
    product.description = body.description;
    body.features.forEach(function(feature) {
       product.features.push(feature);
    });

    product.save((err, product)=>{
      if (err){
        return res.status(400).json({
          title: 'An error has occured !',
          error : err
        });
      }
      res.status(201).json({
        title : 'Product Saved.'
      });
    });

  });

  // delete specific product - /api/products/:id
  router.delete('/:id', function (req, res) { 
    Product.remove({id: req.params.id}, 
      function (err, product) {
        if (err){
          return res.status(404).json({
            title: 'An error has occured !',
            error : err
          });
        }
        res.status(204).json({
          title : 'Product Deleted.'
        });
    });
});

  // Delete all products /api/products
  router.delete('/', function (req, res) { 
    Product.remove({}, 
      function (err, product) {
        if (err){
          return res.status(404).json({
            title: 'An error has occured !',
            error : err
          });
        }
        res.status(204).json({
          title : 'Products Deleted'
        });
    });
  });


function sortByPriceASC(a, b) {
  return a.price - b.price;
}

function sortByPriceDESC(a, b) {
  return b.price - a.price;
}

function sortByNameASC(a, b) {
  return a.name == b.name ? 0 : a.name < b.name ? -1 : 1;
}
function sortByNameDESC(a, b) {
  return a.name == b.name ? 0 : b.name < a.name ? -1 : 1;
}

var sorting = [{name:'alpha-asc',fn:sortByNameASC}, {name:'alpha-dsc',fn:sortByNameDESC},
               {name:'price-asc',fn:sortByPriceASC}, {name:'price-dsc',fn:sortByPriceDESC}];

var categorys = ['cameras','computers','consoles','screens'];




module.exports = router;