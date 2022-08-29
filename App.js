import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import styled from 'styled-components';
import { Quiz } from './screens'

export default function App() {
  return (
    <View>
        <Quiz />
    </View>
  );
}

const Square = styled.View`
    width: 60px;
    height: 60px;
    background-color: ${props => props.color};
`;

