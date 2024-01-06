import {
  View,
  Image,
  TouchableOpacity,
  Text,
  ImageBackground,
} from 'react-native';
import React from 'react';
import {COLORS, icons, SIZES} from '../constants';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {createFav, deleteFav, fetchFav} from '../stores/fav/favActions';
import {checkInternetConnection} from '../utils/Utils';

export default function RestaurantItems({restaurants, getCurrentPosition}) {
  const {current} = useSelector(state => state.authReducer);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {favories} = useSelector(state => state.favReducer);
  function fav(id) {
    return favories.some(item => item.id === id);
  }
  const handleAddFav = id => {
    if (fav(id)) {
      let selectedFav = favories.filter(fav => (fav.id = id))[0];

      dispatch(deleteFav({id: selectedFav.favId}));
    } else {
      const data = {
        resId: id,
        userId: current.id,
      };
      dispatch(createFav({data})).then(() =>
        dispatch(fetchFav({data: {id: current.id}})).catch(err =>
          console.log(err),
        ),
      );
    }
  };
  return (
    <View activeOpacity={1} style={{marginBottom: 30}}>
      {restaurants?.map((restaurant, index) => (
        <TouchableOpacity
          onPress={() => {
            if (!restaurant.closed) {
              checkInternetConnection().then(res => {
                if (res) {
                  getCurrentPosition().then(() =>
                    navigation.navigate('ResturantDetails', {
                      resItem: restaurant,
                    }),
                  );
                } else {
                  navigation.navigate('Internet');
                }
              });
            }
          }}
          key={index}
          style={{
            marginTop: 10,
            padding: 15,
            backgroundColor: 'white',
            borderRadius: SIZES.radius,
          }}>
          {restaurant.closed && (
            <Text
              style={{
                color: COLORS.red,
                padding: 6,
                position: 'absolute',
                top: '30%',
                left: '40%',
                fontSize: SIZES.body1,
                fontWeight: '900',
              }}>
              {' '}
              Fermé
            </Text>
          )}
          <ImageBackground
            source={{uri: restaurant.img}}
            style={{
              width: '100%',
              height: 160,
              borderRadius: SIZES.radius,
              opacity: restaurant.closed ? 0.2 : 1,
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 20,
                top: 10,
              }}
              onPress={() => {
                if (current.id) handleAddFav(restaurant.id);
              }}>
              <Image
                source={icons.love}
                style={{
                  height: 25,
                  width: 25,
                  tintColor: fav(restaurant.id) ? COLORS.primary : COLORS.gray3,
                }}
              />
            </TouchableOpacity>

            <Text
              style={{
                backgroundColor: COLORS.white,
                color: COLORS.black,
                padding: 6,
                borderRadius: 20,
                alignSelf: 'flex-end',
                marginBottom: 6,
                marginRight: 20,
              }}>
              {' '}
              30-45 min
            </Text>
          </ImageBackground>
          {/* <RestaurantImage image={restaurant.img} /> */}
          <RestaurantInfo
            name={restaurant.name}
            rate={restaurant.rate}
            desc={restaurant.desc}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const RestaurantInfo = props => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
    }}>
    <View>
      <Text style={{fontSize: 15, fontWeight: 'bold', color: COLORS.black}}>
        {' '}
        {props.name}
      </Text>
      <Text style={{fontSize: 12, color: COLORS.gray}}>
        {'⭐'.repeat(props.rate)}
      </Text>
      <Text style={{fontSize: 11, color: COLORS.gray}}>{props?.desc}</Text>
    </View>
    {/* <View
      style={{
        backgroundColor: '#eee',
        height: 30,
        width: 60,
        alignItems: 'center',
        borderRadius: 15,
        justifyContent: 'center',
        color: COLORS.primary,
      }}>
      <Text style={{color: COLORS.gray}}> {props.rate} ⭐</Text>
    </View> */}
  </View>
);
