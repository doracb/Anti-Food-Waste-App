const Claim = require('../models/claim');
const Food = require('../models/food');
const User = require('../models/user');
const { Op } = require('sequelize');

exports.createClaim = async (req, res) => {
    try {
        const { food_id, claimant_id } = req.body;
        if (!food_id || !claimant_id) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const foodItem = await Food.findByPk(food_id);
        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }
        if (!foodItem.is_available) {
            return res.status(400).json({ message: 'Food item is not available for claim' });
        }

        const acceptedClaim = await Claim.findOne({
            where: { food_id, status: 'accepted' }
        });
        if (acceptedClaim) {
            return res.status(400).json({ message: 'This food item has already been claimed' });
        }

        const claim = await Claim.create({
            food_id,
            claimant_id,
        });
        res.status(201).json(claim);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getUserClaims = async (req, res) => {
    try {
        const userId = req.params.userId;
        const claims = await Claim.findAll({
            where: { claimant_id: userId },
            include: [
                {
                    model: Food,
                    attributes: ['id', 'name', 'category', 'quantity_value', 'quantity_unit', 'is_available']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        return res.status(200).json(claims);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateClaimStatus = async (req, res) => {
    try {
        const claimId = req.params.id;
        const { status, userId } = req.body;

        if (!["pending", "accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const claim = await Claim.findByPk(claimId);
        if (!claim) {
            return res.status(404).json({ message: 'Claim not found' });
        }

        const foodItem = await Food.findByPk(claim.food_id);
        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        if (foodItem.user_id !== userId) {
            return res.status(403).json({ message: 'You are not authorized to update this claim' });
        }

        if (status === 'accepted') {
            const alreadyAccepted = await Claim.findOne({
                where: {
                    food_id: claim.food_id,
                    status: 'accepted'
                }
            });

            if (alreadyAccepted && alreadyAccepted.id !== claim.id) {
                return res.status(400).json({ message: 'Another user has already claimed this food item' });
            }

            await foodItem.update({ is_available: false });
            await Claim.update(
                { status: 'rejected' },
                {
                    where: {
                        food_id: claim.food_id,
                        id: { [Op.ne]: claim.id },
                        status: 'pending'
                    }
                }
            );
        }

        await claim.update({ status });
        res.status(200).json(claim);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getClaimsForMyFoods = async (req, res) => {
    try {
        const ownerId = req.params.ownerId;
        const claims = await Claim.findAll({
            include: [
                {
                    model: Food,
                    where: { user_id: ownerId },
                    attributes: ['id', 'name', 'is_available']
                },
                {
                    model: User,
                    as: 'claimant',
                    attributes: ['id', 'name', 'username', 'city']
                }
            ],
        });
        res.status(200).json(claims);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};