export interface Product {
  id: number;
  name: string;
  price: number;
  img: string;
  category: 'coffee' | 'snack' | 'juice' | 'tea';
}

export const products: Product[] = [
  // Coffee Category
  {
    id: 1,
    name: 'Cà phê đen',
    price: 29000,
    img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
    category: 'coffee'
  },
  {
    id: 2,
    name: 'Cà phê sữa',
    price: 35000,
    img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772',
    category: 'coffee'
  },
  {
    id: 3,
    name: 'Cappuccino',
    price: 45000,
    img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d',
    category: 'coffee'
  },
  {
    id: 4,
    name: 'Latte',
    price: 49000,
    img: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9c',
    category: 'coffee'
  },
  {
    id: 5,
    name: 'Mocha',
    price: 55000,
    img: 'https://images.unsplash.com/photo-1579888944880-d98341245702',
    category: 'coffee'
  },
  {
    id: 6,
    name: 'Espresso',
    price: 35000,
    img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd',
    category: 'coffee'
  },
  {
    id: 7,
    name: 'Cold Brew',
    price: 55000,
    img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735',
    category: 'coffee'
  },
  {
    id: 8,
    name: 'Caramel Macchiato',
    price: 59000,
    img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e',
    category: 'coffee'
  },
  {
    id: 9,
    name: 'Americano',
    price: 39000,
    img: 'https://images.unsplash.com/photo-1551036663-4c9d2dae9f93',
    category: 'coffee'
  },
  {
    id: 10,
    name: 'Flat White',
    price: 49000,
    img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d',
    category: 'coffee'
  },

  // Snack Category
  {
    id: 11,
    name: 'Bánh Tiramisu',
    price: 35000,
    img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9',
    category: 'snack'
  },
  {
    id: 12,
    name: 'Bánh Chocolate',
    price: 30000,
    img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
    category: 'snack'
  },
  {
    id: 13,
    name: 'Bánh Mousse',
    price: 40000,
    img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb',
    category: 'snack'
  },
  {
    id: 14,
    name: 'Bánh Cheesecake',
    price: 35000,
    img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad',
    category: 'snack'
  },
  {
    id: 15,
    name: 'Bánh Croissant',
    price: 25000,
    img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
    category: 'snack'
  },
  {
    id: 16,
    name: 'Bánh Muffin',
    price: 20000,
    img: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa',
    category: 'snack'
  },
  {
    id: 17,
    name: 'Bánh Donut',
    price: 25000,
    img: 'https://images.unsplash.com/photo-1556911220-bda9f7f7597e',
    category: 'snack'
  },
  {
    id: 18,
    name: 'Bánh Cookie',
    price: 15000,
    img: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e',
    category: 'snack'
  },
  {
    id: 19,
    name: 'Bánh Macaron',
    price: 40000,
    img: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43',
    category: 'snack'
  },
  {
    id: 20,
    name: 'Bánh Tart',
    price: 35000,
    img: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729',
    category: 'snack'
  },

  // Juice Category
  {
    id: 21,
    name: 'Nước cam ép',
    price: 35000,
    img: 'https://images.unsplash.com/photo-1613478223719655c5c1f7d57',
    category: 'juice'
  },
  {
    id: 22,
    name: 'Nước chanh dây',
    price: 40000,
    img: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859',
    category: 'juice'
  },
  {
    id: 23,
    name: 'Nước dưa hấu',
    price: 30000,
    img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b',
    category: 'juice'
  },
  {
    id: 24,
    name: 'Nước táo ép',
    price: 35000,
    img: 'https://images.unsplash.com/photo-1613478223719-655c5c1f7d57',
    category: 'juice'
  },
  {
    id: 25,
    name: 'Nước dừa',
    price: 25000,
    img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b',
    category: 'juice'
  },
  {
    id: 26,
    name: 'Nước ép cà rốt',
    price: 30000,
    img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b',
    category: 'juice'
  },
  {
    id: 27,
    name: 'Nước ép dứa',
    price: 35000,
    img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b',
    category: 'juice'
  },
  {
    id: 28,
    name: 'Nước ép nho',
    price: 40000,
    img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b',
    category: 'juice'
  },
  {
    id: 29,
    name: 'Nước ép dâu',
    price: 40000,
    img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b',
    category: 'juice'
  },
  {
    id: 30,
    name: 'Nước ép xoài',
    price: 35000,
    img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b',
    category: 'juice'
  },

  // Tea Category
  {
    id: 31,
    name: 'Trà đào',
    price: 35000,
    img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9',
    category: 'tea'
  },
  {
    id: 32,
    name: 'Trà vải',
    price: 35000,
    img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9',
    category: 'tea'
  },
  {
    id: 33,
    name: 'Trà sữa trân châu',
    price: 40000,
    img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9',
    category: 'tea'
  },
  {
    id: 34,
    name: 'Trà sữa matcha',
    price: 40000,
    img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9',
    category: 'tea'
  },
  {
    id: 35,
    name: 'Trà sữa thái',
    price: 40000,
    img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9',
    category: 'tea'
  },
  {
    id: 36,
    name: 'Trà sữa khoai môn',
    price: 40000,
    img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9',
    category: 'tea'
  },
  {
    id: 37,
    name: 'Trà sữa chocolate',
    price: 40000,
    img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9',
    category: 'tea'
  },
  {
    id: 38,
    name: 'Trà sữa caramel',
    price: 40000,
    img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9',
    category: 'tea'
  },
  {
    id: 39,
    name: 'Trà sữa trà xanh',
    price: 40000,
    img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9',
    category: 'tea'
  },
  {
    id: 40,
    name: 'Trà sữa hồng trà',
    price: 40000,
    img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9',
    category: 'tea'
  }
]; 