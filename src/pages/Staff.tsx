import React, { useEffect, useState } from 'react';
import Product from '../components/Product';
import logo from '../assets/logo.svg';
import { MdShoppingCart, MdPerson, MdRestaurantMenu, MdVisibility, MdDelete } from 'react-icons/md';
import { BsCalendarCheck } from 'react-icons/bs';
import { getMenuItemsByBranch } from '../services/menu-items';
import { useAuth } from '../contexts/AuthContext';
import { createOrder, getOrderByIdBranch } from '../services/staff_order';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  img: string;
  qty: number;
}
const optionsTimeZone = { timeZone: "Asia/Ho_Chi_Minh", hour12: false };
interface Invoice {
  orderId: string;
  orderDate: string;
  totalPrice: number;
  status: 'pending' | 'processing' | 'completed';
}

interface MenuItem {
  id: number;
  name: string;
  price: number;
  img: string;
  category: 'coffee' | 'snack' | 'juice' | 'tea';
}

const Staff: React.FC = () => {
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [activeScreen, setActiveScreen] = useState<'order' | 'invoice' | 'schedule' | 'account'>('order');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const { id: branchId } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FF6347';
      case 'processing':
        return '#FFA07A';
      case 'completed':
        return '#98FF98';
      default:
        return '#8B4513';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang làm';
      case 'completed':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  const addToOrder = (product: { id: number; name: string; price: number; img: string }) => {
    setOrder(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeItem = (id: number) => {
    setOrder(prev => prev.filter(p => p.id !== id));
  };

  const total = order.reduce((sum, item) => sum + item.price * item.qty, 0);

  const _createOrder = async () => {
    const orderData = {
      branchId: branchId,
      status: 'Pending',
      totalPrice: total,
      orderItems: order.map(item => ({
        menuItemId: item.id,
        quantity: item.qty,
        unitPrice: item.price,
      }),)
    }
    console.log('Order data:', orderData);
    try {
      const result = await createOrder(orderData);
      if (result.status === 200) {
        alert('Đặt hàng thành công');
        setOrder([]);
      } else {
        alert('Đặt hàng thất bại');
      }
    }
    catch (error) {
      console.error('Error creating order:', error);
      alert('Đặt hàng thất bại');
    }
  }

  useEffect(() => {
    // Fetch menu items based on the selected page and pageSize
    const fetchMenuItems = async () => {
      try {
        if (branchId !== null) {
          const result = await getMenuItemsByBranch(branchId, page, pageSize, selectedCategory);
          setMenuItems(result.data);
          setTotalPages(result.totalPages);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
    fetchMenuItems();
  }, [branchId, page, pageSize, selectedCategory]);

  useEffect(() => {
    if (activeScreen === 'invoice' && branchId) {
      console.log('Fetching invoices for branch:', branchId);
      // Gọi API lấy danh sách hóa đơn theo chi nhánh
      getOrderByIdBranch(branchId)
        .then(res => {
          console.log('Invoices:', res.data.data);
          setInvoices(res.data.data); 
          // Đảm bảo res.data là mảng hóa đơn từ server
        })
        .catch(err => {
          setInvoices([]);
          console.error('Lỗi lấy danh sách hóa đơn:', err);
        });
    }
  }, [activeScreen, branchId]);

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      fontFamily: 'Roboto, sans-serif',
      position: 'relative'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        minHeight: '100vh',
        background: '#D2B48C',
        color: '#FFFFFF',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'fixed',
        left: 0,
        top: 0
      }}>
        {/* Logo */}
        <div style={{
          width: '180px',
          height: '180px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px'
        }}>
          <img 
            src={logo} 
            alt="Coffee Haven Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Navigation Menu */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px',
          marginTop: '20px'
        }}>
          <button
            onClick={() => setActiveScreen('order')}
            style={{
              padding: '12px 20px',
              background: activeScreen === 'order' ? '#8B4513' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: '#FFFFFF',
              cursor: 'pointer',
              fontSize: '16px',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 'bold',
              textAlign: 'left',
              transition: 'all 0.3s ease',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseOver={(e) => {
              if (activeScreen !== 'order') {
                e.currentTarget.style.background = '#FFA07A';
              }
            }}
            onMouseOut={(e) => {
              if (activeScreen !== 'order') {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <MdRestaurantMenu size={24} />
            Thực đơn
          </button>
          <button
            onClick={() => setActiveScreen('invoice')}
            style={{
              padding: '12px 20px',
              background: activeScreen === 'invoice' ? '#8B4513' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: '#FFFFFF',
              cursor: 'pointer',
              fontSize: '16px',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 'bold',
              textAlign: 'left',
              transition: 'all 0.3s ease',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseOver={(e) => {
              if (activeScreen !== 'invoice') {
                e.currentTarget.style.background = '#FFA07A';
              }
            }}
            onMouseOut={(e) => {
              if (activeScreen !== 'invoice') {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <MdShoppingCart size={24} />
            Đơn hàng
          </button>
          <button
            onClick={() => setActiveScreen('schedule')}
            style={{
              padding: '12px 20px',
              background: activeScreen === 'schedule' ? '#8B4513' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: '#FFFFFF',
              cursor: 'pointer',
              fontSize: '16px',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 'bold',
              textAlign: 'left',
              transition: 'all 0.3s ease',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseOver={(e) => {
              if (activeScreen !== 'schedule') {
                e.currentTarget.style.background = '#FFA07A';
              }
            }}
            onMouseOut={(e) => {
              if (activeScreen !== 'schedule') {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <BsCalendarCheck size={24} />
            Ca làm việc
          </button>
          <button
            onClick={() => setActiveScreen('account')}
            style={{
              padding: '12px 20px',
              background: activeScreen === 'account' ? '#8B4513' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: '#FFFFFF',
              cursor: 'pointer',
              fontSize: '16px',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 'bold',
              textAlign: 'left',
              transition: 'all 0.3s ease',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseOver={(e) => {
              if (activeScreen !== 'account') {
                e.currentTarget.style.background = '#FFA07A';
              }
            }}
            onMouseOut={(e) => {
              if (activeScreen !== 'account') {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <MdPerson size={24} />
            Tài khoản
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        display: 'flex',
        background: '#f8f9fa',
        marginLeft: '250px',
        minHeight: '100vh'
      }}>
        {activeScreen === 'order' ? (
          <>
            {/* Order Content */}
            <div style={{ 
              flex: 1, 
              padding: '40px',
              position: 'relative',
              marginRight: '450px',
              width: 'calc(100vw - 700px)',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Tabs */}
              <div style={{ 
                display: 'flex', 
                gap: 10, 
                marginBottom: 0,
                background: '#f8f9fa',
                padding: '0 0',
                zIndex: 1,
                position: 'sticky',
                top: 0,
                height: '60px'
              }}>
                {[
                  { id: 1, label: 'Cà phê', icon: '☕' },
                  { id: 2, label: 'Đồ ăn nhẹ', icon: '🍪' },
                  { id: 3, label: 'Nước ép', icon: '🥤' },
                  { id: 4, label: 'Trà', icon: '🍵' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (selectedCategory !== tab.id) {
                        setSelectedCategory(tab.id as 0 | 1 | 2 | 3 | 4);
                      } else setSelectedCategory(0);
                      setPage(0);
                    }}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '4px',
                      background: selectedCategory === tab.id ? '#8B4513' : '#e9ecef',
                      color: selectedCategory === tab.id ? 'white' : 'black',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      height: '40px',
                      outline: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Products */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 220px)', 
                gap: '30px',
                padding: '20px',
                height: 'fit-content',
                flex: 1,
                justifyContent: 'center'
              }}>
                {menuItems.map((product) => (
                  <Product
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    img={product.img}
                    category={product.category}
                    onAddToOrder={addToOrder}
                  />
                ))}
              </div>
              {/* Pagination */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  style={{
                    padding: '8px 12px',
                    background: page === 0 ? '#ccc' : '#8B4513',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: page === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Trang trước
                </button>
                <span style={{
                  padding: '8px 12px',
                  background: '#8B4513',
                  color: 'white',
                  borderRadius: '4px',
                  minWidth: '80px',
                  textAlign: 'center'
                }}>
                  Trang {totalPages === 0 ? 0 : page + 1}/{totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  style={{
                    padding: '8px 12px',
                    background: page >= totalPages - 1 ? '#ccc' : '#8B4513',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Trang sau
                </button>
              </div>
            </div>

            {/* Order Summary - Fixed on the right */}
            <div style={{ 
              width: '450px',
              background: '#FFFFFF',
              padding: 20,
              boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
              position: 'fixed',
              right: 0,
              top: 0,
              height: '100vh',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{ 
                marginBottom: 20, 
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#2c3e50',
                padding: '0 10px'
              }}>Đơn hàng hiện tại</h3>
              
              {/* Scrollable table container */}
              <div style={{ 
                flex: 1,
                overflowY: 'auto',
                padding: '0 10px',
                maxHeight: 'calc(100vh - 180px)' // Trừ đi chiều cao của header và footer
              }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  marginBottom: '20px'
                }}>
                  <thead style={{
                    position: 'sticky',
                    top: 0,
                    background: '#FFFFFF',
                    zIndex: 1
                  }}>
                    <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                      <th style={{ textAlign: 'left', padding: '8px', width: '40%' }}>Tên</th>
                      <th style={{ textAlign: 'center', padding: '8px', width: '15%' }}>SL</th>
                      <th style={{ textAlign: 'right', padding: '8px', width: '15%' }}>Giá</th>
                      <th style={{ textAlign: 'right', padding: '8px', width: '30%' }}>Thành tiền</th>
                      <th style={{ padding: '8px', width: '80%' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.map(item => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                        <td style={{ padding: '8px', width: '40%' }}>{item.name}</td>
                        <td style={{ textAlign: 'center', padding: '8px', width: '15%' }}>{item.qty}</td>
                        <td style={{ textAlign: 'right', padding: '8px', width: '15%' }}>
                          {item.price.toLocaleString()}
                        </td>
                        <td style={{ textAlign: 'right', padding: '8px', width: '30%' }}>
                          {(item.qty * item.price).toLocaleString()}
                        </td>
                        <td style={{ padding: '8px', width: '80%' }}>
                          <button 
                            onClick={() => removeItem(item.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#dc3545',
                              outline: 'none'
                            }}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Fixed bottom section */}
              <div style={{ 
                padding: '20px 10px',
                borderTop: '2px solid #dee2e6',
                background: '#FFFFFF',
                position: 'sticky',
                bottom: 0
              }}>
                <h4 style={{ marginBottom: 10, color: '#2c3e50' , fontSize: '20px', fontWeight: 'bold' }}>
                  Tổng tiền: {total.toLocaleString()} VND
                </h4>
                <button 
                  style={{ 
                    width: '100%',
                    padding: '12px',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                  onClick={_createOrder}
                >
                  In hóa đơn
                </button>
              </div>
            </div>
          </>
        ) : activeScreen === 'invoice' ? (
          <div style={{ 
            flex: 1, 
            padding: '20px',
            background: '#F5F5F5',
            height: '100vh'
          }}>
            <h2 style={{ 
              margin: '0 0 20px 0', 
              color: '#8B4513',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              Quản lý đơn hàng Tại quầy
            </h2>

            {/* Toolbar */}
            <div style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '20px',
              alignItems: 'center'
            }}>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  outline: 'none'
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang làm</option>
                <option value="completed">Hoàn thành</option>
              </select>

              <input 
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  outline: 'none'
                }}
              />

              <input 
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  outline: 'none',
                  flex: 1
                }}
              />
            </div>

            {/* Invoice Table */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                    <th style={{ textAlign: 'left', padding: '12px' }}>Mã đơn</th>
                    <th style={{ textAlign: 'left', padding: '12px' }}>Thời gian</th>
                    <th style={{ textAlign: 'right', padding: '12px' }}>Tổng tiền</th>
                    <th style={{ textAlign: 'center', padding: '12px' }}>Trạng thái</th>
                    <th style={{ textAlign: 'center', padding: '12px' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.orderId} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '12px' }}>{invoice.orderId}</td>
                      <td style={{ padding: '12px' }}>{new Date(invoice.orderDate).toLocaleString("vi-VN", optionsTimeZone)}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        {invoice.totalPrice.toString()}VND
                      </td>
                      <td style={{ 
                        padding: '12px', 
                        textAlign: 'center',
                        color: getStatusColor(invoice.status)
                      }}>
                        {getStatusText(invoice.status)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setShowDetailModal(true);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#8B4513'
                            }}
                          >
                            <MdVisibility size={20} />
                          </button>
                          {invoice.status !== 'completed' && (
                            <>
                              <button
                                style={{
                                  background: '#98FF98',
                                  border: 'none',
                                  borderRadius: '4px',
                                  padding: '4px 8px',
                                  cursor: 'pointer',
                                  color: '#000'
                                }}
                              >
                                Thanh toán
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                  setShowCancelModal(true);
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: '#FF6347'
                                }}
                              >
                                <MdDelete size={20} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px',
              gap: '10px'
            }}>
              <button style={{
                padding: '8px 12px',
                background: '#8B4513',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Trang 1/5
              </button>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedInvoice && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}>
                <div style={{
                  background: '#FFFFFF',
                  padding: '20px',
                  borderRadius: '8px',
                  width: '400px',
                  maxHeight: '500px',
                  overflowY: 'auto'
                }}>
                  <h3 style={{ 
                    margin: '0 0 20px 0',
                    color: '#8B4513'
                  }}>
                    Chi tiết đơn hàng {selectedInvoice.id}
                  </h3>
                  <p>Thời gian: {selectedInvoice.time}</p>
                  <p>Trạng thái: {getStatusText(selectedInvoice.status)}</p>
                  <div style={{ margin: '20px 0' }}>
                    <h4>Danh sách món</h4>
                    {/* Add items list here */}
                  </div>
                  <p style={{ 
                    fontWeight: 'bold',
                    color: '#FFA07A'
                  }}>
                    Tổng tiền: {selectedInvoice.total.toLocaleString()}đ
                  </p>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: '#8B4513',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginTop: '20px'
                    }}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}

            {/* Cancel Modal */}
            {showCancelModal && selectedInvoice && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}>
                <div style={{
                  background: '#FFFFFF',
                  padding: '20px',
                  borderRadius: '8px',
                  width: '300px'
                }}>
                  <h3 style={{ 
                    margin: '0 0 20px 0',
                    color: '#8B4513'
                  }}>
                    Xác nhận hủy đơn
                  </h3>
                  <p>Bạn có chắc chắn muốn hủy đơn hàng {selectedInvoice.id}?</p>
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginTop: '20px'
                  }}>
                    <button
                      onClick={() => setShowCancelModal(false)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: '#F5F5F5',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => {
                        // Add cancel logic here
                        setShowCancelModal(false);

                      }}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: '#FF6347',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Xác nhận
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            flex: 1, 
            padding: 20,
            background: 'white',
            minHeight: '100vh'
          }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#2C3E50' }}>Quản lý hóa đơn</h2>
            {/* Thêm nội dung quản lý hóa đơn ở đây */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Staff;

