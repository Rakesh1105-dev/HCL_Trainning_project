export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
      });
    }

    next();
  };
};

export const allowAdmin = authorizeRoles('ADMIN');
export const allowProductRead = authorizeRoles('ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_STAFF', 'ORDER_MANAGER');
export const allowProductManage = authorizeRoles('ADMIN', 'INVENTORY_MANAGER');
export const allowCategoryManage = authorizeRoles('ADMIN', 'INVENTORY_MANAGER');
export const allowWarehouseRead = authorizeRoles('ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_STAFF', 'ORDER_MANAGER');
export const allowInventoryRead = authorizeRoles('ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_STAFF', 'ORDER_MANAGER');
export const allowInventoryWrite = authorizeRoles('ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_STAFF');
export const allowOrderRead = authorizeRoles('ADMIN', 'WAREHOUSE_STAFF', 'ORDER_MANAGER');
export const allowPurchaseRead = authorizeRoles('ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_STAFF');
export const allowPurchaseReceive = authorizeRoles('ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_STAFF');
export const allowInventoryManager = authorizeRoles('ADMIN', 'INVENTORY_MANAGER');
export const allowWarehouseStaff = authorizeRoles('ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_STAFF');
export const allowOrderManager = authorizeRoles('ADMIN', 'ORDER_MANAGER');

export default authorizeRoles;
