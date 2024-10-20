import React from 'react';
import styled from 'styled-components';
import LogoSVG from './assets/LogoSVG';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <LogoSVG width="80" height="30" /> 
    </HeaderContainer>
  );
};

export default Header;