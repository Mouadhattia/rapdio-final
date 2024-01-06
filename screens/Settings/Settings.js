import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Linking,
  Modal,
  Text,
  Button,
  TouchableWithoutFeedback,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {
  Header,
  IconButton,
  IconLabelButton,
  LineDivider,
} from '../../components';
import {COLORS, SIZES, icons} from '../../constants';
import {logOut, deleteProfile} from '../../stores/auth/authActions';

const Settings = ({navigation}) => {
  const dispatch = useDispatch();
  //

  const {current} = useSelector(state => state.authReducer);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDeleteAccount = () => {
    setIsModalVisible(true);
  };

  const handleConfirmDeleteAccount = () => {
    // Perform the delete account action
    dispatch(deleteProfile(current.id)).then(() => dispatch(logOut()));

    // Close the modal
    setIsModalVisible(false);
  };

  const handleCancelDeleteAccount = () => {
    setIsModalVisible(false);
  };
  const phoneNumber = '23817473';
  const handleCall = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  function renderHeader() {
    return (
      <Header
        title="Réglages"
        containerStyle={{
          height: 50,
          marginHorizontal: SIZES.padding,
          marginTop: 40,
        }}
        leftComponent={
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
            }}
            iconStyle={{
              width: 20,
              height: 20,
              tintColor: COLORS.gray2,
            }}
            onPress={() => navigation.goBack()}
          />
        }
        rightComponent={
          <View
            style={{
              width: 40,
            }}
          />
        }
      />
    );
  }

  function renderSettings() {
    return (
      <View
        style={{
          marginTop: SIZES.radius,
          paddingHorizontal: SIZES.padding,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.lightGray2,
        }}>
        <IconLabelButton
          icon={icons.password}
          label="Changer mot de passe"
          containerStyle={styles.iconLabelContainerStyle}
          iconStyle={styles.iconLabelIconStyle}
          onPress={() => navigation.navigate('ChangePassword')}
        />

        <LineDivider
          lineStyle={{
            backgroundColor: COLORS.lightGray1,
          }}
        />

        {/* <IconLabelButton
          icon={icons.filter}
          label="Préférences"
          containerStyle={styles.iconLabelContainerStyle}
          iconStyle={styles.iconLabelIconStyle}
        /> */}

        <IconLabelButton
          icon={icons.notification}
          label="Notifications"
          containerStyle={styles.iconLabelContainerStyle}
          iconStyle={styles.iconLabelIconStyle}
          onPress={() => navigation.navigate('NotificationSetting')}
        />

        {/* <IconLabelButton
          icon={icons.bar}
          label="Utilisation des données"
          containerStyle={styles.iconLabelContainerStyle}
          iconStyle={styles.iconLabelIconStyle}
        /> */}

        <LineDivider
          lineStyle={{
            backgroundColor: COLORS.lightGray1,
          }}
        />

        {/* <IconLabelButton
          icon={icons.globe}
          label="Langue"
          containerStyle={styles.iconLabelContainerStyle}
          iconStyle={styles.iconLabelIconStyle}
        /> */}

        <IconLabelButton
          icon={icons.update}
          label="Vérifier  mise à jour"
          containerStyle={styles.iconLabelContainerStyle}
          iconStyle={styles.iconLabelIconStyle}
        />

        <LineDivider
          lineStyle={{
            backgroundColor: COLORS.lightGray1,
          }}
        />

        <IconLabelButton
          icon={icons.call}
          label="Nous contacter"
          containerStyle={styles.iconLabelContainerStyle}
          iconStyle={styles.iconLabelIconStyle}
          onPress={handleCall}
        />

        <LineDivider
          lineStyle={{
            backgroundColor: COLORS.lightGray1,
          }}
        />

        {/* <IconLabelButton
          icon={icons.privacy}
          label="Privacy Policy"
          containerStyle={styles.iconLabelContainerStyle}
          iconStyle={styles.iconLabelIconStyle}
        /> */}

        {/* <IconLabelButton
          icon={icons.term}
          label="Terms & Conditions"
          containerStyle={styles.iconLabelContainerStyle}
          iconStyle={styles.iconLabelIconStyle}
        /> */}

        <IconLabelButton
          icon={icons.logout}
          label="Supprimer votre compte"
          containerStyle={styles.iconLabelContainerStyle}
          iconStyle={styles.iconLabelIconStyle}
          onPress={handleDeleteAccount}
        />
        <LineDivider
          lineStyle={{
            backgroundColor: COLORS.lightGray1,
          }}
        />
        <IconLabelButton
          icon={icons.logout}
          label="Se déconnecter"
          containerStyle={styles.iconLabelContainerStyle}
          iconStyle={styles.iconLabelIconStyle}
          onPress={() => dispatch(logOut())}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      {renderHeader()}

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: SIZES.padding,
        }}>
        {renderSettings()}
        <Modal
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  Êtes-vous sûr de vouloir supprimer votre compte ?
                </Text>
                <Button title="OUI" onPress={handleConfirmDeleteAccount} />
                <Button title="NON" onPress={handleCancelDeleteAccount} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
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
  },
  iconLabelContainerStyle: {
    height: 70,
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  iconLabelIconStyle: {
    marginRight: SIZES.radius,
    tintColor: COLORS.primary,
  },
});

export default Settings;
