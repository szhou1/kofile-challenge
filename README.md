# kofile-challenge

## Install
```console
git clone https://github.com/szhou1/kofile-challenge.git
```

## Run Part 1
```console
cd kofile-challenge/part1
node feeCalc.js
```
## Run Part 2
```console
cd kofile-challenge/part2
node distrCalc.js
```
## Run Part 3
```console
cd kofile-challenge/part3
npm install
npm test
npm start
curl -H "Content-Type: application/json" --data @../orders.json http://localhost:3000/order/fees
curl -H "Content-Type: application/json" --data @../orders.json http://localhost:3000/order/distr
```
