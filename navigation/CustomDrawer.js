import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import Animated from 'react-native-reanimated';
import {connect, useDispatch, useSelector} from 'react-redux';
import {setSelectedTab} from '../stores/tab/tabActions';

import {MainLayout} from '../screens';
import {COLORS, FONTS, SIZES, constants, icons, dummyData} from '../constants';
import {logOut} from '../stores/auth/authActions';

const Drawer = createDrawerNavigator();

const CustomDrawerItem = ({label, icon, isFocused, onPress}) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        height: 40,
        marginBottom: SIZES.base,
        alignItems: 'center',
        paddingLeft: SIZES.radius,
        borderRadius: SIZES.base,
        backgroundColor: isFocused ? COLORS.transparentBlack1 : null,
      }}
      onPress={onPress}>
      <Image
        source={icon}
        style={{
          width: 20,
          height: 20,
          tintColor: COLORS.white,
        }}
      />

      <Text
        style={{
          marginLeft: 15,
          color: COLORS.white,
          ...FONTS.h3,
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const CustomDrawerContent = ({navigation, selectedTab, setSelectedTab}) => {
  const {current} = useSelector(state => state.authReducer);
  const login = () => {
    if (current.userName) {
      dispatch(logOut());
    } else {
      navigation.navigate('SignIn');
    }
  };
  const dispatch = useDispatch();
  return (
    <DrawerContentScrollView
      scrollEnabled={true}
      contentContainerStyle={{flex: 1}}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: SIZES.radius,
        }}>
        {/* Close */}
        <View
          style={{
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => navigation.closeDrawer()}>
            <Image
              source={icons.cross}
              style={{
                height: 35,
                width: 35,
                tintColor: COLORS.white,
              }}
            />
          </TouchableOpacity>
        </View>

        {/* Profile */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginTop: SIZES.radius,
            alignItems: 'center',
          }}
          onPress={() => {
            navigation.closeDrawer();
            if (current.userName) {
              navigation.navigate('MyAccount');
            } else {
              navigation.navigate('SignIn');
            }
          }}>
          <Image
            source={dummyData.myProfile?.profile_image}
            style={{
              width: 50,
              height: 50,
              borderRadius: SIZES.radius,
            }}
          />

          <View
            style={{
              marginLeft: SIZES.radius,
            }}>
            <Text style={{color: COLORS.white, ...FONTS.h3}}>
              {current?.userName || 'Connexion'}
            </Text>
            <Text style={{color: COLORS.white, ...FONTS.body4}}>
              {current.userName
                ? 'Voire votre profil'
                : 'connecter pour voire votre profil'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Drawer Items */}
        <View
          style={{
            flex: 1,
            marginTop: SIZES.height > 800 ? SIZES.padding : SIZES.radius,
          }}>
          <CustomDrawerItem
            label={constants.screens.home}
            icon={icons.home}
            isFocused={selectedTab == constants.screens.home}
            onPress={() => {
              setSelectedTab(constants.screens.home);
              navigation.navigate('MainLayout');
            }}
          />

          {/* <CustomDrawerItem
            label={constants.screens.my_wallet}
            icon={icons.wallet}
          /> */}

          <CustomDrawerItem
            label={constants.screens.notification}
            icon={icons.notification}
            isFocused={selectedTab == constants.screens.notification}
            onPress={() => {
              setSelectedTab(constants.screens.notification);
              if (current.userName) {
                navigation.navigate('MainLayout');
              } else {
                navigation.navigate('SignIn');
              }
            }}
          />

          <CustomDrawerItem
            label={constants.screens.favourite}
            icon={icons.favourite}
            isFocused={selectedTab == constants.screens.favourite}
            onPress={() => {
              setSelectedTab(constants.screens.favourite);
              if (current.userName) {
                navigation.navigate('MainLayout');
              } else {
                navigation.navigate('SignIn');
              }
            }}
          />

          {/* Line Divider */}
          <View
            style={{
              height: 1,
              marginVertical: SIZES.height > 800 ? SIZES.radius : 0,
              marginLeft: SIZES.radius,
              backgroundColor: COLORS.lightGray1,
            }}
          />

          {/* <CustomDrawerItem
            label="Suivre votre commande"
            icon={icons.location}
            onPress={() => {
              navigation.closeDrawer();
              navigation.navigate('Map');
            }}
          /> */}

          <CustomDrawerItem
            label="Mes commandes"
            icon={icons.location}
            onPress={() => {
              navigation.closeDrawer();
              if (current.userName) {
                navigation.navigate('Order');
              } else {
                navigation.navigate('SignIn');
              }
            }}
          />

          <CustomDrawerItem
            label="Réglages"
            icon={icons.setting}
            onPress={() => {
              navigation.closeDrawer();
              if (current.userName) {
                navigation.navigate('Settings');
              } else {
                navigation.navigate('SignIn');
              }
            }}
          />
        </View>

        <View
          style={{
            marginBottom: SIZES.height > 800 ? SIZES.padding : 0,
          }}>
          <CustomDrawerItem
            label={current.userName ? 'Déconnecter' : 'Connecter'}
            icon={icons.logout}
            onPress={() => login()}
          />
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const CustomDrawer = ({selectedTab, setSelectedTab}) => {
  const [progress, setProgress] = React.useState(new Animated.Value(0));

  const scale = Animated.interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });

  const borderRadius = Animated.interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [0, 26],
  });

  const animatedStyle = {borderRadius, transform: [{scale}]};

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.primary,
      }}>
      <Drawer.Navigator
        drawerType="slide"
        overlayColor="transparent"
        drawerStyle={{
          flex: 1,
          width: '65%',
          paddingRight: 20,
          backgroundColor: 'transparent',
        }}
        sceneContainerStyle={{
          backgroundColor: 'transparent',
        }}
        initialRouteName="MainLayout"
        drawerContent={props => {
          setTimeout(() => {
            setProgress(props.progress);
          }, 0);

          return (
            <CustomDrawerContent
              navigation={props.navigation}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          );
        }}>
        <Drawer.Screen name="MainLayout">
          {props => (
            <MainLayout {...props} drawerAnimationStyle={animatedStyle} />
          )}
        </Drawer.Screen>
      </Drawer.Navigator>
    </View>
  );
};

function mapStateToProps(state) {
  return {
    selectedTab: state.tabReducer.selectedTab,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setSelectedTab: selectedTab => {
      return dispatch(setSelectedTab(selectedTab));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomDrawer);
