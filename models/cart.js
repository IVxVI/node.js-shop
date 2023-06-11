const fs = require('fs');
const path = require('path');

const userPath = path.join(
  path.dirname(require.main.filename),
  'data',
  'cart.json'
)

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(userPath, (err, fileContent) => {
      let cart = {
        products: [],
        totalPrice: 0,
      }

      if(!err) {
        cart = JSON.parse(fileContent);
      }

      const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;

      if(existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1};
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(userPath, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  };

  static deleteProduct(id, productPrice) {
    fs.readFile(userPath, (err, fileContent) => {
      if(err) {
        return;
      }

      const updatedCart = { ...JSON.parse(fileContent) };
      const productToDelete = updatedCart.products.find(product => product.id === id);

      if(!productToDelete) {
        return;
      }

      const productQty = productToDelete.qty;
      updatedCart.products = updatedCart.products.filter(product => product.id !== id);
      
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;
      
      fs.writeFile(userPath, JSON.stringify(updatedCart), err => {
        console.log(err);
      });
    });
  };

  static getCart(callback) {
    fs.readFile(userPath, (err, fileContent) => {
      if(err) return callback(null);
      
      callback(JSON.parse(fileContent));
    })
  }

};
