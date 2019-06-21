import React from 'react';
import { Alert, SafeAreaView, View } from 'react-native';

import QRCodeReader from '../components/QRCodeReader';
import HathorHeader from '../components/HathorHeader';
import NewHathorButton from '../components/NewHathorButton';
import SimpleButton from '../components/SimpleButton';
import { getTokenLabel, parseQRCode } from '../utils';
import { connect } from 'react-redux';

import hathorLib from '@hathor/wallet-lib';


class SendScanQRCode extends React.Component {
  constructor(props) {
    super(props);

    this.QRCodeReader = null;
  }

  showAlertError = (message) => {
    Alert.alert(
      "Invalid QR code",
      message,
      [
        {text: "OK", onPress: this.QRCodeReader.reactivateQrCodeScanner},
      ],
      {cancelable: false},
    );
  }

  onSuccess = (e) => {
    const qrcode = parseQRCode(e.data);
    if (!qrcode.isValid) {
      this.showAlertError(qrcode.error);
    } else {
      if (qrcode.token && qrcode.amount) {
        if (hathorLib.tokens.tokenExists(qrcode.token.uid) === null) {
          // Wallet does not have the selected token
          this.showAlertError(`You don't have the requested token [${getTokenLabel(qrcode.token)}]`);
        } else {
          const params = {
            address: qrcode.address,
            token: qrcode.token,
            amount: qrcode.amount,
          };
          this.props.navigation.navigate('SendConfirmScreen', params);
        }
      } else {
        const params = {
          address: qrcode.address,
        };
        this.props.navigation.navigate('SendAddressInput', params);
      }
    }
  }

  render() {
    const ManualInfoButton = () => (
      <SimpleButton 
        title='Manual info'
        onPress={() => this.props.navigation.navigate('SendAddressInput')}
      />
    )

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
        <HathorHeader
          title="SEND"
          rightElement={<ManualInfoButton/>}
          wrapperStyle={{borderBottomWidth: 0}}
        />
        <View style={{ flex: 1, margin: 16, alignSelf: 'stretch' }}>
          <QRCodeReader
            ref={(el) => this.QRCodeReader = el}
            onSuccess={this.onSuccess}
            bottomText='Scan the QR code'
            {...this.props} />
        </View>
      </SafeAreaView>
    );
  }
}

export default SendScanQRCode;