const db = require("_helpers/db");

module.exports = {
  getAll,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  return await db.Role.findAll();
}

async function create(params) {
  console.log("create user service");
  if (
    await db.Role.findOne({
      where: { role: params.role },
    })
  ) {
    throw { message: "already exist" };
  }
  const role = new db.Role({
    expiry: false,
    ...params,
  });
  await role.save();
}

async function update(id, params) {
  const role = await db.Role.findByPk(id);
  if (!role) {
    throw { message: " role not found" };
  }

  Object.assign(role, params);
  await role.save();
  return role;
}

async function _delete(id) {
  const role = await getRole(id);
  await role.destroy();
}

// helper functions

async function getRole(id) {
  const role = await db.Role.findByPk(id);
  if (!role) throw "role not found";
  return role;
}
