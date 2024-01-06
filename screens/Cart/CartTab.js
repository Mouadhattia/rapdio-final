import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  Header,
  IconButton,
  CartQuantityButton,
  StepperInput,
  FooterTotal,
} from '../../components';
import {FONTS, SIZES, COLORS, icons} from '../../constants';
import {deleteFromCart, updateCart} from '../../stores/cart/cartActions';
import {calculateCost, distanceInKm, FixdistanceInKm} from '../../utils/Utils';

const CartTab = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cartReducer.cart);
  const restaurant = useSelector(state => state.cartReducer.selectedRes);
  const prices = cart.map(item => item.qty * item.product.price);
  const price = prices.reduce((a, b) => a + b, 0);
  const {location} = useSelector(state => state.mapReducer);
  // Create a Set to store unique restaurant coordinates
  const restaurantCoordinates = new Set();
  let key = location.coords
    ? `${location?.coords.latitude}-${location?.coords.longitude}`
    : '';
  restaurantCoordinates.add(key);

  // Extract latitude and longitude values
  cart.forEach(item => {
    const {location} = item.product.res;
   
    const {lat, long} = location;
    const key = `${lat}-${long}`;

    // Add the key to the Set
    restaurantCoordinates.add(key);
  });

  // Convert Set to an array with the desired format
  const coordinatesArray = Array.from(restaurantCoordinates).map(key => {
    const [lat, long] = key.split('-');
    return [lat, long];
  });

  const distance = FixdistanceInKm(coordinatesArray);

  const fee =
    price === 0
      ? 0
      : Number(calculateCost(distance) + (coordinatesArray.length - 2) * 0.5);
  // Handler

  function updateQuantityHandler(newQty, id) {
    dispatch(updateCart({qty: newQty, id}));
  }

  function removeMyCartHandler(id) {
    dispatch(deleteFromCart({id}));
  }

  // Render

  function renderCartList() {
    return (
      <SwipeListView
        data={cart}
        keyExtractor={item => `${item.id}`}
        contentContainerStyle={{
          marginTop: SIZES.radius,
          paddingHorizontal: SIZES.padding,
          paddingBottom: SIZES.padding * 2,
        }}
        disableRightSwipe={true}
        rightOpenValue={-75}
        renderItem={(data, rowMap) => (
          <View
            key={data?.id}
            style={{
              height: 100,
              backgroundColor: COLORS.lightGray2,
              ...styles.cartItemContainer,
            }}>
            {/* Food Image */}
            <View
              style={{
                width: 90,
                height: 100,
                marginLeft: -10,
              }}>
              <Image
                source={{uri: data?.item.product.img}}
                resizeMode="contain"
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 10,
                }}
              />
            </View>

            {/* Food Info */}
            <View
              style={{
                flex: 1,
              }}>
              <Text style={{...FONTS.body3}}>{data?.item.product.name}</Text>
              <Text style={{color: COLORS.primary, ...FONTS.h3}}>
                {data?.item.product.price} TND
              </Text>
            </View>

            {/* Quantity */}
            <StepperInput
              containerStyle={{
                height: 50,
                width: 125,
                backgroundColor: COLORS.white,
              }}
              value={data.item.qty}
              onAdd={() => {
                updateQuantityHandler(data?.item.qty + 1, data?.item.id);
              }}
              onMinus={() => {
                if (data.item.qty > 1) {
                  updateQuantityHandler(data?.item.qty - 1, data?.item.id);
                }
              }}
            />
          </View>
        )}
        renderHiddenItem={(data, rowMap) => (
          <IconButton
            containerStyle={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: COLORS.primary,
              ...styles.cartItemContainer,
            }}
            icon={icons.delete_icon}
            iconStyle={{
              marginRight: 10,
            }}
            onPress={() => removeMyCartHandler(data.item.id)}
          />
        )}
      />
    );
  }

  function renderFooter() {
    return (
      <FooterTotal
        subTotal={price}
        shippingFee={fee}
        total={price + fee}
        onPress={() => {
          if (price !== 0) {
            navigation.navigate('MyCard');
          }
        }}
        shop={() => navigation.navigate('Home')}
      />
    );
  }

  function renderCartVide() {
    return (
      <Text
        style={{
          padding: SIZES.padding,

          textAlign: 'center',
          ...FONTS.body2,
          margin: SIZES.padding,
          color: COLORS.darkGray,
        }}>
        Votre panier est vide
      </Text>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      {/* {renderHeader()} */}
      {/* cart vide */}
      {cart.length === 0 && renderCartVide()}
      {/* Cart */}
      {renderCartList()}

      {/* Footer */}
      <View style={{height: '60%'}}>{renderFooter()}</View>
    </View>
  );
};
const styles = StyleSheet.create({
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.radius,
    paddingHorizontal: SIZES.radius,
    borderRadius: SIZES.radius,
  },
});
export default CartTab;
