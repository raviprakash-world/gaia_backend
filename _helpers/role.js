// AcessControl package to define roles
const AccessControl = require("accesscontrol");
const ac = new AccessControl();

module.exports = async function (db) {
  try {
    const Roles = await db.Role.findAll();
    // console.log(Roles);
    Roles.map((_role) => {
      ac.grant(_role.role)
        .createAny(_role.roleResource)
        .readAny(_role.roleResource)
        .updateAny(_role.roleResource)
        .deleteAny(_role.roleResource);
    });
    // console.log("Roles", Roles);
    return ac;
  } catch (e) {
    console.error("role.js. Access Control Error: ", e);
  }
};
