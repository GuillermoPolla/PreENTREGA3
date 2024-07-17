const path = require('path');
const connectDB = require(path.join(__dirname, '../../config/config'));const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

class ProductManager {
    constructor() {
        this.collection = null;
        this.initialize();
    }

    async initialize() {
        await connectDB();
        this.collection = mongoose.connection.collection('products');
    }

    async getProducts(limit) {
        if (!this.collection) await this.initialize();
        return await this.collection.find().limit(limit || 0).toArray();
    }

    async getProductById(id) {
        if (!this.collection) await this.initialize();
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    async addProduct(product) {
        if (!this.collection) await this.initialize();
        const result = await this.collection.insertOne(product);
        return result.insertedId ? await this.collection.findOne({ _id: result.insertedId }) : null;
    }

    async updateProduct(id, updatedFields) {
        if (!this.collection) await this.initialize();
        const result = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updatedFields },
            { returnOriginal: false }
        );
        return result.value;
    }

    async deleteProduct(id) {
        if (!this.collection) await this.initialize();
        await this.collection.deleteOne({ _id: new ObjectId(id) });
    }
}

module.exports = ProductManager;
