const { Group, GroupMember, User } = require('../models')

exports.createGroup = async (req, res) => {
    try {
        const { name, owner_id } = req.body;

        if(!name || !owner_id) return res.status(400).json({message: 'Name and owner_id are mandatory'});

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
        res.status(400).json({error: err.message});
    }
};

exports.getGroupById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const group = await Group.findByPk(id , {
            include: [
                {
                    model: User,
                    through: { attributes: ['tag']}
                }
            ]
        });

        if(!group) return res.status(404).json({message: 'Group not found'});

        res.json(group);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

exports.addMember = async (req, res) => {
    try {
        const{ id: group_id } = req.params;

        const { user_id, tag } = req.body;
        
        if(!user_id) return res.status(400).json({ message: 'user_id is mandatory' })

        const member = await GroupMember.create({
            group_id,
            user_id,
            tag: tag || null
        });

         res.status(201).json(member);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

exports.updateTag = async (req, res) => {
    try {
        const { group_id, user_id } = req.params;
        const member = await GroupMember.findOne({
            where: {
                group_id,
                user_id
            }
        });

        if(!member) return res.status(404).json({message: "Member not found"});

        member.tag = req.body.tag;
        await member.save();

        res.json(member);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

exports.getGroupMember = async (req, res) => {
    try {
        const { group_id } = req.params;
        const members = await GroupMember.findAll({
            where: { group_id },
            include: [{model: User}]
        });

        res.json(members);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

exports.getUserGroups = async (req, res) => {
    try {
        const { user_id } = req.params;
        const groups = await Group.findAll({
            include: {
                model: User,
                through: { attributes: [] },
                where: { id: user_id }
            }
        });

        res.json(groups);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};