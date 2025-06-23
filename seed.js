const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user.model');
const Post = require('./models/post.model');
const MarketplaceItem = require('./models/marketplace.model');

// --- CONFIGURATION ---
const MONGO_URI = 'mongodb://localhost:27017/playlink';

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Post.deleteMany({});
        await MarketplaceItem.deleteMany({});
        console.log('Cleared existing data.');

        // --- Create Users ---
        const users = [];
        const userPasswords = ['pass123', 'pass123', 'pass123'];
        const userDetails = [
            { username: 'CyberNinja', email: 'ninja@playlink.com' },
            { username: 'GlitchQueen', email: 'queen@playlink.com' },
            { username: 'PixelPete', email: 'pete@playlink.com' },
        ];

        for (let i = 0; i < userDetails.length; i++) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userPasswords[i], salt);
            const avatar = `https://placehold.co/150x150/00ffff/0a0c10?text=${userDetails[i].username.charAt(0).toUpperCase()}`;
            
            const user = new User({ ...userDetails[i], password: hashedPassword, avatar });
            users.push(await user.save());
        }
        console.log(`${users.length} users created.`);

        // --- Create Forum Posts ---
        const posts = [
            { title: 'Welcome to the new Playlink forums!', content: 'This is the first post on our brand new platform. Discuss anything game-related here!', author: users[0]._id },
            { title: 'What are you playing this weekend?', content: 'I\'m diving back into Elden Ring. Anyone else on a FromSoft kick?', author: users[1]._id },
            { title: 'Tips for new Valorant players?', content: 'Just started playing and could use some advice on agents and maps. Help a noob out!', author: users[2]._id },
        ];
        await Post.insertMany(posts);
        console.log(`${posts.length} posts created.`);

        // --- Create Marketplace Items ---
        const items = [
            { itemName: 'Legendary Sword Skin', description: 'A rare, glowing sword skin for the game "BladeMasters". One of a kind.', price: 500, seller: users[0]._id },
            { itemName: 'Armored Mount', description: 'A fully-armored rhino mount. Fast and intimidating.', price: 350, seller: users[1]._id },
            { itemName: 'XP Boost (24 Hours)', description: 'Double your experience points for 24 hours. Great for leveling up fast.', price: 100, seller: users[0]._id },
        ];
        await MarketplaceItem.insertMany(items);
        console.log(`${items.length} marketplace items created.`);

        console.log('Database seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
};

seedData();