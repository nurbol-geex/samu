const fs = require('fs');
const path = require('path');

const filePath = path.join(
  __dirname,
  'node_modules',
  'react-native-paystack',
  'android',
  'build.gradle',
);

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    return console.log(err);
  }

  let result = data.replace(
    /implementation 'co.paystack.android.design.widget:pinpad:1.0.1'\n\s*implementation 'co.paystack.android:paystack:3.0.12'/g,
    `implementation 'co.paystack.android.design.widget:pinpad:1.0.8'\n    implementation 'co.paystack.android:paystack:3.1.3'`,
  );

  fs.writeFile(filePath, result, 'utf8', err => {
    if (err) return console.log(err);
  });
});
