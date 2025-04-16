import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

const widthPercentageScale = (percentageValue: number) =>
  (width / 100) * percentageValue;
const heightPercentageScale = (percentageValue: number) =>
  (height / 100) * percentageValue;

export {widthPercentageScale, heightPercentageScale};
