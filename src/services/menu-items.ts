import { menuItems } from '../utils/request';

const getMenuItemsByBranch = async (branchId: number, page = 0, size = 10, categoryId = 0) => {
  const response = await menuItems.get(`/branch/${branchId}/category`, {
    params: { page, size, categoryId },
  });
  return response.data;
};

const getMenuItemsNotInBranch = async (branchId: number, page = 0, size = 10, categoryId = 0) => {
  
}

export { getMenuItemsByBranch };