import React from 'react';
import { MdShoppingCart, MdPerson, MdRestaurantMenu } from 'react-icons/md';
import { BsCalendarCheck } from 'react-icons/bs';
import logo from '../assets/logo.svg';

interface SidebarProps {
  activeScreen: 'order' | 'invoice' | 'schedule' | 'account';
  setActiveScreen: (screen: 'order' | 'invoice' | 'schedule' | 'account') => void;
}

const StaffSidebar: React.FC<SidebarProps> = ({ activeScreen, setActiveScreen }) => (
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
        onMouseOver={e => {
          if (activeScreen !== 'order') e.currentTarget.style.background = '#FFA07A';
        }}
        onMouseOut={e => {
          if (activeScreen !== 'order') e.currentTarget.style.background = 'transparent';
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
        onMouseOver={e => {
          if (activeScreen !== 'invoice') e.currentTarget.style.background = '#FFA07A';
        }}
        onMouseOut={e => {
          if (activeScreen !== 'invoice') e.currentTarget.style.background = 'transparent';
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
        onMouseOver={e => {
          if (activeScreen !== 'schedule') e.currentTarget.style.background = '#FFA07A';
        }}
        onMouseOut={e => {
          if (activeScreen !== 'schedule') e.currentTarget.style.background = 'transparent';
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
        onMouseOver={e => {
          if (activeScreen !== 'account') e.currentTarget.style.background = '#FFA07A';
        }}
        onMouseOut={e => {
          if (activeScreen !== 'account') e.currentTarget.style.background = 'transparent';
        }}
      >
        <MdPerson size={24} />
        Tài khoản
      </button>
    </div>
  </div>
);

export default StaffSidebar;
