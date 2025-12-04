const User = require('./user');
const Food = require('./food');
const Group = require('./group');
const Claim = require('./claim');
const GroupMember = require('./groupMember');

User.hasMany(Food, {foreignKey: 'user_id'});
Food.belongsTo(User, {foreignKey: 'user_id'});

User.hasMany(Claim, {foreignKey: 'claimant_id'});
Claim.belongsTo(User, {foreignKey: 'claimant_id'});

Food.hasMany(Claim, {foreignKey: 'food_id'});
Claim.belongsTo(User, {foreignKey: 'food_id'});

User.belongsToMany(Group, {through: 'GroupMembers', foreignKey: 'user_id'});
Group.belongsToMany(User, {through: 'GroupMembers', foreignKey: 'group_id'});

module.exports = {User, Food, Group, Claim, GroupMember};