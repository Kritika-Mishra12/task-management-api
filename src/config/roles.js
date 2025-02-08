const allRoles = {
  user: ['getUser','user', 'twilio', 'scan'],
  admin: ['getUsers', 'getUser', 'manageUsers', 'admin', 'scan', 'createGame', 'getGames', 'check-admin'],
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
