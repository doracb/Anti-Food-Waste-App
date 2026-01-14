const { Group, GroupMember, User, Food } = require('../models');
const { Op } = require('sequelize');

exports.createGroup = async (req, res) => {
    try {
        const { name, owner_id } = req.body;
        const owner = await User.findByPk(owner_id);

        if (!owner) {
            return res.status(404).json({ message: 'Owner not found' });
        }

        if (!name || !owner_id) {
            return res.status(400).json({ message: 'Name and owner_id are mandatory' });
        }

        const group = await Group.create({
            name,
            owner_id
        });

        await GroupMember.create({
            group_id: group.id,
            user_id: owner_id,
            tag: 'owner'
        });

        res.status(201).json(group);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};

exports.getGroupById = async (req, res) => {
    try {
        const { group_id } = req.params;

        const group = await Group.findByPk(group_id, {
            include: [
                {
                    model: User,
                    as: 'members',
                    through: { attributes: ['tag'] }
                }
            ]
        });

        if (!group) return res.status(404).json({ message: 'Group not found' });

        res.json(group);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};

exports.addMember = async (req, res) => {
    try {
        const { group_id } = req.params;

        const { user_id, tag } = req.body;

        if (!user_id) {
            return res.status(400).json({ message: 'user_id is mandatory' })
        }

        const existingMember = await GroupMember.findOne({
            where: {
                group_id,
                user_id
            }
        });

        if (existingMember) {
            return res.status(400).json({ message: 'User is already a member of the group' });
        }

        const member = await GroupMember.create({
            group_id,
            user_id,
            tag: tag || null
        });

        res.status(201).json(member);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};

exports.updateTag = async (req, res) => {
    try {
        const { group_id, user_id } = req.params;

        const group = await Group.findByPk(group_id);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const member = await GroupMember.findOne({
            where: {
                group_id,
                user_id
            }
        });

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        member.tag = req.body.tag;
        await member.save();

        res.json(member);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};

exports.getGroupMembers = async (req, res) => {
    try {
        const { group_id } = req.params;
        const members = await GroupMember.findAll({
            where: { group_id },
            include: [{ model: User }]
        });

        res.json(members);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};

exports.getUserGroups = async (req, res) => {
    try {
        const { user_id } = req.params;
        const groups = await Group.findAll({
            include: {
                model: User,
                as: 'members',
                through: { attributes: [] },
                where: { id: user_id }
            }
        });

        res.json(groups);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};

exports.transferOwnership = async (req, res) => {
    try {
        const { group_id } = req.params;
        const { old_owner_id, new_owner_id } = req.body;

        const group = await Group.findByPk(group_id);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        if (group.owner_id !== old_owner_id) {
            return res.status(403).json({ message: "Only the current group owner can transfer ownership" });
        }

        const newOwnerMember = await GroupMember.findOne({
            where: {
                group_id,
                user_id: new_owner_id
            }
        });

        if (!newOwnerMember) {
            return res.status(400).json({ message: "New owner must be a member of the group" });
        }

        group.owner_id = new_owner_id;
        await group.save();

        return res.status(200).json({ message: "Ownership transferred successfully", group });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};

exports.leaveGroup = async (req, res) => {
    try {
        const {group_id} = req.params;
        const {user_id} = req.body;

        const group = await Group.findByPk(group_id);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const members = await GroupMember.findAll({
             where: { group_id: group.id },
             order: [['createdAt', 'ASC']]
        });

        const isOwner = group.owner_id === user_id;

        if (members.length === 1 && isOwner) {
            await GroupMember.destroy({ where: { group_id: group.id } });
            await group.destroy();
            return res.status(200).json({ message: "Group deleted -  the last member has left" });
        }

        if (isOwner) {
            const otherMembers = members.filter(m => m.user_id !== user_id);
            const newOwner = otherMembers[0];
            group.owner_id = newOwner.user_id;
            await group.save();
        }

        await GroupMember.destroy({ where: { group_id, user_id } });

        res.status(204).send();
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        const { group_id } = req.params;
        const { owner_id } = req.body;

        const group = await Group.findByPk(group_id);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        if(group.owner_id !== owner_id) {
            return res.status(403).json({ message: "Only the group owner can delete the group" });
        }

        await GroupMember.destroy({ where: { group_id } });
        await group.destroy();

        return res.status(204).send();
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};

exports.getGroupFoods = async (req, res) => {
    try {
        const { group_id } = req.params;

        const members = await GroupMember.findAll({
            where: { group_id },
            attributes: ['user_id'] 
        });

        if (!members.length) {
            return res.json([]);
        }

        const memberIds = members.map(m => m.user_id);

        const foods = await Food.findAll({
            where: {
                user_id: { [Op.in]: memberIds },
                is_available: true  
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'city']
                }
            ],
            order: [['expiration_date', 'ASC']]
        });

        res.json(foods);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};