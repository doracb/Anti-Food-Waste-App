const { User, Group, Claim, Food, GroupMember } = require('../models');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const normalizeCity = (city) => {
    if (!city) return null;
    return city
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
};

exports.register = async (req, res) => {
    try {
        if (req.body.city) {
            req.body.city = normalizeCity(req.body.city);
        }
        const user = await User.create(req.body);

        const token = generateToken(user.id);

        res.status(201).json({ ...user.toJSON(), token });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: 'Email and password are mandatory' });

        const user = await User.findOne({ where: { email } });

        if (!user || user.password !== password) return res.status(401).json({ message: 'Invalid credentials' });

        const token = generateToken(user.id);

        res.json({ ...user.toJSON(), token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const { user_id } = req.params;

        const user = await User.findByPk(user_id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { user_id } = req.params;

        const user = await User.findByPk(user_id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (req.body.city) {
            req.body.city = normalizeCity(req.body.city);
        }

        await user.update(req.body);

        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getUsersInCity = async (req, res) => {
    try {
        let { city } = req.params;

        if (city) {
            city = normalizeCity(city);
        }

        const users = await User.findAll({
            where: { city }
        });

        res.json(users);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.searchUser = async (req, res) => {
    const { q } = req.query;
    try {
        if (!q) return res.status(400).json({ message: 'Query parameter q is mandatory' });

        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username: q },
                    { email: q }
                ]
            }
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        const user = await User.findByPk(user_id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const ownedGroups = await Group.findAll({ where: { owner_id: user_id } });
        for (const group of ownedGroups) {
            const otherMembers = await GroupMember.findAll({
                where: {
                    group_id: group.id,
                    user_id: { [Op.ne]: user_id }
                },
                order: [['createdAt', 'ASC']]
            });

            if (otherMembers.length === 0) {
                await GroupMember.destroy({ where: { group_id: group.id } });
                await group.destroy();
                continue;
            }
            const newOwner = otherMembers[0];
            group.owner_id = newOwner.user_id;
            await group.save();
        }

        await GroupMember.destroy({ where: { user_id } });
        await Claim.destroy({ where: { claimant_id: user_id } });
        await Food.destroy({ where: { user_id } });

        await user.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};