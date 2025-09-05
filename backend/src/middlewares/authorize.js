// src/middlewares/authorize.js
module.exports = function(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Non authentifié" });
    if (allowedRoles === 'any') return next();
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (roles.length === 0 || roles.includes(req.user.role)) return next();
    return res.status(403).json({ message: "Accès refusé" });
  };
};
