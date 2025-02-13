import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { MD3Colors, MD3DarkTheme } from 'react-native-paper';
import { UIEstateDocument } from '../features/estate/types';
import AppText from './AppText';
// import EvilIcons from 'react-native-vector-icons/EvilIcons';

const EstateContainer: React.FC<{ items: UIEstateDocument }> = ({ items }) => {
  return (
    <View style={{ flex: 1, alignItems: 'flex-start' }}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Image
            source={require('../assets/user-icon.png')}
            style={{ width: 50, height: 0, borderRadius: 25 }}
            resizeMode='cover'
          />
          <View>
            <AppText title={items.user} />
            <AppText
              style={{
                marginTop: -10,
                color: `${
                  items.user ? MD3Colors.error10 : MD3DarkTheme.colors.primary
                }`,
              }}
              title={'online'}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default EstateContainer;

const styles = StyleSheet.create({});
