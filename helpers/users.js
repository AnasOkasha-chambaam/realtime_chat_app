let users = [];

module.exports.joinUser = (id, name, room) => {
    const user = {id,name,room};
    users.push(user); 
    return user;
};

module.exports.findById = (id) => {
    return users.find(user => user.id === id);
};

module.exports.removeUser = (id) => {
    users = users.filter(user => user.id !== id);
};

module.exports.roomUsers = (room) => {
    return users.filter(user => user.room === room).map(user => {
        return {name:user.name, id: user.id}
    });
};