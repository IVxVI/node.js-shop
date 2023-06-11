const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Shop',
      path: '/products'
    })
  });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId, product => {
    res.render('shop/product-detail', {
      pageTitle: product.title,
      product: product,
      path: '/product-detail'
    });
  })
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      products: products,
      pageTitle: 'Shop',
      path: '/cart'
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (const product of products) {
        const cartProductData = cart.products.find(cartProduct => product.id === cartProduct.id);
        if (cartProductData) {
          cartProducts.push({
            productData: product,
            qty: cartProductData.qty,
          });
        }
      };

      res.render('shop/cart', {
        pageTitle: 'Your cart',
        path: '/cart',
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId, product => {
    Cart.addProduct(productId, product.price)
  });
  
  res.redirect('/cart');
}

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  
  Product.findById(productId, product => {
    Cart.deleteProduct(productId, product.price);
    res.redirect('/cart');
  });
} 

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your orders',
    path: '/orders'
  })
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/'
  })
};
