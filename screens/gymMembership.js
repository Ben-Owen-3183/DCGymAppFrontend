import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {StripeProvider} from '@stripe/stripe-react-native/src/components/StripeProvider';
import {CardField, CardForm, useStripe} from '@stripe/stripe-react-native';
import {GlobalColors} from '../styles/dcstyles';
import Settings from '../shared/settings';
import {WebView} from 'react-native-webview';
import {Screen} from 'react-native-screens';

const GymMembership = ({userData, navigation}) => {
  return (
    <StripeProvider
      publishableKey="pk_test_51KeeB0AHMXgRkWrQSsHzBeYg2uBfAZye2WL1L69zIoozvzdEuLuiG3RbH1I7Z5fxYLUO0ELuh9IRkXJguAYFwOV000QjIHfnph"
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      merchantIdentifier="merchant.com.my_app">
      <CheckoutScreen userData={userData} />
    </StripeProvider>
  );
};

function CheckoutScreen({userData}) {
  const {confirmSetupIntent} = useStripe();
  const [cardDetails, setCardDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create a setup intent on the backend
  async function createSetupIntent() {
    const response = await fetch(
      `${Settings.siteUrl}/api/v1/membership/setup_intent`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Token ' + userData.token,
          'Content-type': 'application/json; charset=UTF-8',
        },
      },
    );
    const decoded_response = await response.json();

    console.log(decoded_response);
    const {setupIntent, error} = await confirmSetupIntent(
      decoded_response.data.setup_intent_secret,
      {
        type: 'Card',
      },
    );

    console.log(setupIntent);
    console.log(error);
  }

  return (
    <View>
      <StripeCardField setCardDetails={setCardDetails} />
      <Button
        disabled={cardDetails === null || !cardDetails.complete}
        onPress={createSetupIntent}
        title="Save"
        loading={loading}
      />
    </View>
  );
}

function StripeCardField({setCardDetails}) {
  return (
    <CardField
      postalCodeEnabled={true}
      placeholder={{
        number: '4242 4242 4242 4242',
      }}
      cardStyle={{
        backgroundColor: GlobalColors.dcLightGrey,
        textColor: GlobalColors.dcYellow,
      }}
      style={{
        width: '100%',
        height: 50,
        marginVertical: 30,
      }}
      onCardChange={cardDetails => {
        if (cardDetails.complete) {
          setCardDetails(cardDetails);
        }
      }}
    />
  );
}

function CheckoutScreen2({userData}) {
  const {initPaymentSheet, presentPaymentSheet, initGooglePay} = useStripe();
  const [loading, setLoading] = useState(false);

  async function fetchMembershipStatus() {
    const response = await fetch(
      `${Settings.siteUrl}/api/v1/membership/status`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Token ' + userData.token,
          'Content-type': 'application/json; charset=UTF-8',
        },
      },
    );

    const decoded_response = await response.json();

    return decoded_response.data.stripe_public_key;
  }

  async function fetchPaymentSheetParams() {
    const response = await fetch(
      `${Settings.siteUrl}/api/v1/membership/checkout_details`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Token ' + userData.token,
          'Content-type': 'application/json; charset=UTF-8',
        },
      },
    );
    const decoded_response = await response.json();

    console.log(decoded_response);

    return {
      ephemeral_key_secret: decoded_response.data.ephemeral_key_secret,
      payment_intent_secret: decoded_response.data.payment_intent_secret,
      customer_id: decoded_response.data.customer_id,
    };
  }

  async function initializePaymentSheet() {
    const stripe_public_key = await fetchMembershipStatus();

    const {payment_intent_secret, ephemeral_key_secret, customer_id} =
      await fetchPaymentSheetParams();

    const {error} = await initPaymentSheet({
      style: 'alwaysDark',

      applePay: Platform.OS === 'ios',
      googlePay: Platform.OS === 'android',
      merchantDisplayName: 'Merchant Name',
      merchantCountryCode: 'GB',
      testEnv: Settings.debug,
      customerId: customer_id,
      customerEphemeralKeySecret: ephemeral_key_secret,
      paymentIntentClientSecret: payment_intent_secret,
    });
    if (!error) {
      Alert.alert('Failed to initialise stripe payment.');
    }
  }

  const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <Screen>
      <Button
        variant="primary"
        disabled={!loading}
        title="Checkout"
        onPress={openPaymentSheet}
      />
    </Screen>
  );
}

export default GymMembership;
