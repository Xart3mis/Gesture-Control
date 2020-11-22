var KalmanFilter = require('kalmanjs')

var kf = new KalmanFilter();
console.log(kf.filter(3));
console.log(kf.filter(2));
console.log(kf.filter(1));