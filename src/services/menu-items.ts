import { menuItems } from '../utils/request';

export const getMenuItemsByBranch = async (branchId: number, page = 0, size = 10) => {
  const response = await menuItems.get(`/branch/${branchId}`, {
    params: { page, size },
  });
  return response.data;
};
