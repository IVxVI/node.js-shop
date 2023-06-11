const fs = require('fs');
const path = require('path');
const dataFilePath = path.join(
  path.dirname(require.main.filename),
  'data', 
  'products.json'
);

const Cart = require('./cart');

const getProductsFromFile = (callback) => {
  fs.readFile(dataFilePath, (err, fileContent) => {
    if(err) {
      callback([]);
    }

    callback(JSON.parse(fileContent));
  });
}

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    getProductsFromFile(products => {
      if(this.id) {
        const existingProductIndex = products.findIndex(product => product.id === this.id)
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        
        fs.writeFile(dataFilePath, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else{
        this.id = Math.random().toString();
        products.push(this); 
        fs.writeFile(dataFilePath, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    })
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

  static findById(id, callback) {
    getProductsFromFile(products => {
      const product = products.find(prod => prod.id === id);
      callback(product);
    })
  }

  static deleteById(id) {
    getProductsFromFile(products => {
      const filteredProducts = products.filter(product => product.id !== id);
      fs.writeFile(dataFilePath, JSON.stringify(filteredProducts), (err) => {
        console.log(err);
      });

      const productToDelete = products.find(product => product.id === id);

      Cart.deleteProduct(id, productToDelete.price);
    })
  }
}
