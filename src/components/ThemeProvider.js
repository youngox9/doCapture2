import React from "react";
import { useSelector } from "react-redux";
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
:root {
  ${(props) => props.colors}
}
`;

function ThemeProvider() {
  const colors = useSelector(state => state?.global?.colors || {});
  const Root = React.memo(() => <GlobalStyle colors={colors} />);

  return (
    <Root />
  );
}

export default ThemeProvider;
