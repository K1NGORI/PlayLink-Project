const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user.model');
const Post = require('./models/post.model');
const MarketplaceItem = require('./models/marketplace.model');

const MONGO_URI = 'mongodb://localhost:27017/playlink';

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected for seeding...');

        await User.deleteMany({});
        await Post.deleteMany({});
        await MarketplaceItem.deleteMany({});
        console.log('Cleared existing data.');

        const users = [];
        const userDetails = [
            { username: 'CyberNinja', email: 'ninja@playlink.com' },
            { username: 'GlitchQueen', email: 'queen@playlink.com' },
            { username: 'PixelPete', email: 'pete@playlink.com' },
        ];
        for (const detail of userDetails) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('pass123', salt);
            const avatar = `https://placehold.co/150x150/00ffff/0a0c10?text=${detail.username.charAt(0).toUpperCase()}`;
            users.push(await new User({ ...detail, password: hashedPassword, avatar }).save());
        }
        console.log(`${users.length} users created.`);

        const posts = [
            { title: 'Welcome to the new Playlink forums!', content: 'This is the first post on our brand new platform. Discuss anything game-related here!', author: users[0]._id },
            { title: 'What are you playing this weekend?', content: 'I\'m diving back into Elden Ring. Anyone else on a FromSoft kick?', author: users[1]._id },
            { title: 'Tips for new Valorant players?', content: 'Just started playing and could use some advice on agents and maps. Help a noob out!', author: users[2]._id },
        ];
        await Post.insertMany(posts);
        console.log(`${posts.length} posts created.`);

        const items = [
            { itemName: 'Legendary Sword Skin', description: 'A rare, glowing sword skin.', price: 500, seller: users[0]._id, imageUrl: 'https://i.imgur.com/TH8aG53.png' },
            { itemName: 'Armored Rhino Mount', description: 'A fully-armored rhino mount.', price: 350, seller: users[1]._id, imageUrl: 'https://i.imgur.com/9C2bC2f.png' },
            { itemName: '24 Hour XP Boost', description: 'Double your XP for 24 hours.', price: 100, seller: users[0]._id, imageUrl: 'https://i.imgur.com/kY3Kk1n.png' },
            { itemName: 'Mythic Helmet', description: 'A helmet forged in dragon fire.', price: 750, seller: users[2]._id, imageUrl: 'https://i.imgur.com/uQfFw78.png' },
        ];
        await MarketplaceItem.insertMany(items);
        console.log(`${items.length} marketplace items created for presentation.`);

        console.log('Database seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
    }
};

seedData();