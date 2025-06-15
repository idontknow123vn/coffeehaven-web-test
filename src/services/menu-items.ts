import { category, menuItems } from '../utils/request';

const getMenuItemsByBranch = async (branchId: number, page = 0, size = 10, categoryId = 0, includeUnavailable: boolean) => {
  const response = await menuItems.get(`/branch/${branchId}/category`, {
    params: { page, size, categoryId, includeUnavailable },
  });
  return response.data;
};

const getMenuItems = async (page = 0, size = 10, categoryId = 0) => {
  const response = await menuItems.get('', {
    params: { page, size, categoryId },
  });
  return response.data;
}

const getMenuItemCategories = async () => {
  const response = await category.get('');
  return response.data;
};

const getMenuItemById = async (id: number) => {
  const response = await menuItems.get(`/${id}`);
  return response.data;
}


export { getMenuItemsByBranch, getMenuItems, getMenuItemCategories, getMenuItemById };