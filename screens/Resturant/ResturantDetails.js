import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Button,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {HorizontalFoodCard, IconButton} from '../../components';
import {FONTS, SIZES, COLORS, icons, dummyData, images} from '../../constants';
import {useDispatch, useSelector} from 'react-redux';
import {fetchMenu, selectMenu} from '../../stores/menu/menuActions';
import {fetchProduct} from '../../stores/product/productActions';
import {selectRes} from '../../stores/cart/cartActions';
import {createFav, deleteFav, fetchFav} from '../../stores/fav/favActions';
import Geolocation from '@react-native-community/geolocation';
import {getLocation} from '../../stores/map/mapActions';

const RestoImage = ({title, img, desc, onPress}) => {
  return (
    <View>
      <ImageBackground
        source={{
          uri: img,
        }}
        style={{height: 250, width: '100%', justifyContent: 'space-between'}}>
        <IconButton
          icon={icons.back}
          containerStyle={{
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderRadius: SIZES.radius,
            borderColor: COLORS.gray2,
            margin: 6,
          }}
          iconStyle={{
            width: 20,
            height: 20,
            tintColor: COLORS.gray2,
          }}
          onPress={onPress}
        />
        <View
          style={{
            color: COLORS.black,
            ...FONTS.h2,
            backgroundColor: COLORS.white,
            padding: 12,
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            bordertRadius: 50,
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            backgroundColor: COLORS.whiteSmoke,
            width: SIZES.width,
          }}>
          <Text style={{color: 'black'}}>{title}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const ResturantDetails = props => {
  //location
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const {location} = useSelector(state => state.mapReducer);
  const getLocationWithPermission = () => {
    setIsModalVisible(false);
    Geolocation.getCurrentPosition(
      position => {
        dispatch(getLocation(position));
      },
      error => {
        console.warn(error);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };
  ///////////////////////
  const dispatch = useDispatch();
  const {favories} = useSelector(state => state.favReducer);
  const {current} = useSelector(state => state.authReducer);
  const {loading} = useSelector(state => state.productReducer);
  const [resItem, setResItem] = useState({});
  const [selectedCategoryId, setSelectedCategoryId] = React.useState(1);
  const [selectedMenuType, setSelectedMenuType] = React.useState(1);
  const [popular, setPopular] = React.useState([]);
  const [recommends, setRecommends] = React.useState([]);
  const [menuList, setMenuList] = React.useState([]);
  const menu = useSelector(state => state.menuReducer.menu);
  const menuName = useSelector(state => state.menuReducer.selectedMenuName);
  const product = useSelector(state => state.productReducer.product);

  const navigation = useNavigation();

  // location

  React.useEffect(() => {
    handleChangeCategory(selectedCategoryId, selectedMenuType);
  }, []);

  React.useEffect(() => {
    if (resItem.name) {
      dispatch(fetchMenu({resname: resItem.id}));
    }
  }, [resItem]);
  React.useEffect(() => {
    dispatch(fetchProduct({menuname: menuName}));
  }, [menuName]);
  // Handler

  function handleChangeCategory(categoryId, menuTypeId) {
    // Retrieve the popular menu
    let selectedPopular = dummyData.menu.find(a => a.name == 'Popular');

    // Retrieve the recommended menu
    let selectedRecommend = dummyData.menu.find(a => a.name == 'Recommended');

    // Find the menu based on the menuTypeId
    let selectedMenu = dummyData.menu.find(a => a.id == menuTypeId);

    // Set the popular menu based on the categoryId
    setPopular(
      selectedPopular?.list.filter(a => a.categories.includes(categoryId)),
    );

    // Set the recommended menu based on the categoryId
    setRecommends(
      selectedRecommend?.list.filter(a => a.categories.includes(categoryId)),
    );

    // Set the menu based on the categoryId
    setMenuList(
      selectedMenu?.list.filter(a => a.categories.includes(categoryId)),
    );
  }

  // Render

  function renderFoodCategories() {
    return (
      <FlatList
        data={menu}
        keyExtractor={item => `${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          height: 0,

          backgroundColor: COLORS.whiteSmoke,
        }}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              height: 55,
              marginTop: SIZES.padding,
              marginLeft: index == 0 ? SIZES.padding : SIZES.radius,
              marginRight:
                index == dummyData.categories.length - 1 ? SIZES.padding : 0,
              paddingHorizontal: 8,
              borderRadius: SIZES.radius,

              backgroundColor:
                menuName == item.id ? COLORS.primary : COLORS.lightGray2,
            }}
            onPress={() => {
              dispatch(selectMenu({menuName: item.id}));
            }}>
            <Image
              source={{uri: item.img}}
              style={{
                marginTop: 5,
                height: 30,
                width: 30,
                alignSelf: 'stretch',
                resizeMode: 'contain',
                alignSelf: 'center',
                marginRight: SIZES.base,
              }}
            />

            <Text
              style={{
                alignSelf: 'center',
                marginRight: SIZES.base,
                color: menuName == item.id ? COLORS.white : COLORS.darkGray,
                ...FONTS.h3,
              }}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    );
  }

  React.useEffect(() => {
    let {resItem} = props.route.params;
    setResItem(resItem);
  }, []);
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
  return loading ? (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        width: SIZES.width,
      }}>
      <Text style={{color: COLORS.darkGray, ...FONTS.body2}}>
        Patienter un peu...
      </Text>
      <Image
        source={images.loadingImg}
        style={{
          width: '60%',
          height: '30%',
        }}
      />
    </View>
  ) : (
    <View style={{flex: 1}}>
      <RestoImage
        img={resItem.img}
        title={resItem.name}
        onPress={() => navigation.goBack()}
      />
      <TouchableOpacity
        style={{position: 'absolute', right: 10, top: 10}}
        onPress={() => handleAddFav(resItem.id)}>
        <Image
          source={icons.love}
          style={{
            height: 30,
            width: 30,
            tintColor: fav(resItem.id) ? COLORS.primary : COLORS.gray3,
          }}
        />
      </TouchableOpacity>

      {/* Delivery To */}
      {/* {renderDeliveryTo()} */}
      {/* Sliders */}
      {/* {renderRecommendedSection()} */}
      {/* Food Categories */}
      {renderFoodCategories()}

      {/* Services */}
      {/* {renderPopularSection()} */}

      {/* Menu Type */}
      {/* {renderMenuTypes()} */}

      {/* resturants */}
      {menuName ? (
        <FlatList
          style={{flex: 1, marginTop: -310, backgroundColor: COLORS.whiteSmoke}}
          data={product}
          keyExtractor={item => `${item.id}`}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => (
            <HorizontalFoodCard
              containerStyle={{
                height: 130,
                alignItems: 'center',
                marginHorizontal: SIZES.padding,
                marginBottom: SIZES.radius,
                elevation: 2, // For Android
                shadowColor: '#000', // Shadow color for iOS
                shadowOffset: {width: 0, height: 1}, // Shadow offset for iOS
                shadowOpacity: 0.2, // Shadow opacity for iOS
                shadowRadius: 2, // Shadow radius for iOS
                backgroundColor: 'white', // Set a background color to see the shadow
                borderRadius: 10, // Add border radius if needed
              }}
              imageStyle={{
                marginTop: 20,
                height: 110,
                width: 110,
                alignSelf: 'stretch',
                resizeMode: 'contain',
                marginRight: 10,
              }}
              item={item}
              onPress={() => {
                if (location.coords) {
                  navigation.navigate('FoodDetail', {
                    foodItem: {...item, res: resItem},
                  });
                  dispatch(selectRes({restaurant: resItem}));
                } else {
                  setIsModalVisible(true);
                }
              }}
            />
          )}
        />
      ) : (
        <Text
          style={{
            padding: SIZES.padding,
            textAlign: 'center',
            ...FONTS.body2,
            margin: SIZES.padding,
            color: COLORS.darkGray,
          }}>
          Aucun produit dans le restaurant.{' '}
        </Text>
      )}
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                vérifiez votre position et réessayez
              </Text>
              <Button title="OUI" onPress={getLocationWithPermission} />
              <Button title="NON" onPress={handleCancel} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    height: '30%',
    width: '90%',
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    marginBottom: 10,
    color: 'black',
  },
});
export default ResturantDetails;
