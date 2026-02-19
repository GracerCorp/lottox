export interface VietnamLottoDraw {
  date: string;
  drawNo?: string;
  digit4: string;
  digit3: string;
  digit2: string; // 2 top
  digit2Bottom: string; // 2 bottom
}

export const vietnamLottoData = {
  specific: {
    id: "hanoi-specific",
    time: "16:30",
    key: "specific",
    latest: {
      date: "19 ก.พ. 69",
      drawNo: "#18/2569",
      digit4: "1234",
      digit3: "234",
      digit2: "34",
      digit2Bottom: "56",
    },
    history: [
      {
        date: "19 ก.พ. 69",
        digit4: "1234",
        digit3: "234",
        digit2: "34",
        digit2Bottom: "56",
      },
      {
        date: "18 ก.พ. 69",
        digit4: "5678",
        digit3: "678",
        digit2: "78",
        digit2Bottom: "90",
      },
      {
        date: "17 ก.พ. 69",
        digit4: "9012",
        digit3: "012",
        digit2: "12",
        digit2Bottom: "34",
      },
      {
        date: "16 ก.พ. 69",
        digit4: "3456",
        digit3: "456",
        digit2: "56",
        digit2Bottom: "78",
      },
    ],
  },
  special: {
    id: "hanoi-special",
    time: "17:30",
    key: "special",
    latest: {
      date: "19 ก.พ. 69",
      drawNo: "#18/2569",
      digit4: "8825",
      digit3: "825",
      digit2: "25",
      digit2Bottom: "14",
    },
    history: [
      {
        date: "19 ก.พ. 69",
        digit4: "8825",
        digit3: "825",
        digit2: "25",
        digit2Bottom: "14",
      },
      {
        date: "18 ก.พ. 69",
        digit4: "4721",
        digit3: "721",
        digit2: "21",
        digit2Bottom: "09",
      },
      {
        date: "17 ก.พ. 69",
        digit4: "6503",
        digit3: "503",
        digit2: "03",
        digit2Bottom: "88",
      },
      {
        date: "16 ก.พ. 69",
        digit4: "1198",
        digit3: "198",
        digit2: "98",
        digit2Bottom: "76",
      },
    ],
  },
  normal: {
    id: "hanoi-normal",
    time: "18:30",
    key: "normal",
    latest: {
      date: "19 ก.พ. 69",
      drawNo: "#18/2569",
      digit4: "9988",
      digit3: "988",
      digit2: "88",
      digit2Bottom: "11",
    },
    history: [
      {
        date: "19 ก.พ. 69",
        digit4: "9988",
        digit3: "988",
        digit2: "88",
        digit2Bottom: "11",
      },
      {
        date: "18 ก.พ. 69",
        digit4: "7766",
        digit3: "766",
        digit2: "66",
        digit2Bottom: "22",
      },
      {
        date: "17 ก.พ. 69",
        digit4: "5544",
        digit3: "544",
        digit2: "44",
        digit2Bottom: "33",
      },
      {
        date: "16 ก.พ. 69",
        digit4: "3322",
        digit3: "322",
        digit2: "22",
        digit2Bottom: "55",
      },
    ],
  },
  vip: {
    id: "hanoi-vip",
    time: "19:30",
    key: "vip",
    latest: {
      date: "19 ก.พ. 69",
      drawNo: "#18/2569",
      digit4: "1111",
      digit3: "111",
      digit2: "11",
      digit2Bottom: "99",
    },
    history: [
      {
        date: "19 ก.พ. 69",
        digit4: "1111",
        digit3: "111",
        digit2: "11",
        digit2Bottom: "99",
      },
      {
        date: "18 ก.พ. 69",
        digit4: "2222",
        digit3: "222",
        digit2: "22",
        digit2Bottom: "88",
      },
      {
        date: "17 ก.พ. 69",
        digit4: "3333",
        digit3: "333",
        digit2: "33",
        digit2Bottom: "77",
      },
      {
        date: "16 ก.พ. 69",
        digit4: "4444",
        digit3: "444",
        digit2: "44",
        digit2Bottom: "66",
      },
    ],
  },
};
