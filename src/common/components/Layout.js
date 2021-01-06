// in src/MyLayout.js
import React from 'react';
import { Layout } from 'react-admin';
import MyAppBar from './AppBar';
import Menu from './Menu';

const MyLayout = (props) => <Layout {...props} appBar={MyAppBar} menu={Menu} />;

export default MyLayout;
