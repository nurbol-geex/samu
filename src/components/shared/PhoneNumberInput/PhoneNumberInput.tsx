import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import {colors} from 'src/theme/colors';
import {widthPercentageScale} from 'src/theme/dimensions';

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  ref:any
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChange,
  error,
  ref,
}) => {
  return (
    <View style={styles.container}>
      <PhoneInput
       ref={ref}
        value={value}
        defaultCode="NG"
        onChangeFormattedText={onChange}
        placeholder="Enter phone number"
        containerStyle={{
          width: widthPercentageScale(90),
          backgroundColor: colors.inputBackgroundColor,
          borderRadius:4,
        }}
        textContainerStyle={{  borderRadius:4}}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignSelf:'center'
    
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: 12,
  },
});

export default PhoneNumberInput;
