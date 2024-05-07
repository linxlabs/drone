export default class SerialPort {
  constructor(options, onConnect, onDisconnect) {
    this.onConnect = onConnect;
    this.onDisconnect = onDisconnect;
    this.options = options;
    this.port = null;
    this.isOpened = false;
    this.channels = new Uint16Array(16);
    for (let ch = 0; ch < this.channels.length; ch++) this.channels[ch] = 992;
    console.log(this.channels);
    this.data = new Uint8Array(26);
    this.pack(this.channels);

    this.#setupListeners();
  }

  crc8() {
    let crc = 0;
    for (let i = 2; i < 25; i++) {
      crc ^= this.data[i];
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x80) != 0) crc = (crc << 1) ^ 0xd5;
        else crc = crc << 1;
      }
    }
    return crc & 0xff;
  }

  pack(ch) {
    this.data[0] = 0xc8;
    this.data[1] = 0x18;
    this.data[2] = 0x16;
    this.data[3] = ch[0];
    this.data[4] = (ch[0] >> 8) | (ch[1] << 3);
    this.data[5] = (ch[1] >> 5) | (ch[2] << 6);
    this.data[6] = ch[2] >> 2;
    this.data[7] = (ch[2] >> 10) | (ch[3] << 1);
    this.data[8] = (ch[3] >> 7) | (ch[4] << 4);
    this.data[9] = (ch[4] >> 4) | (ch[5] << 7);
    this.data[10] = ch[5] >> 1;
    this.data[11] = (ch[5] >> 9) | (ch[6] << 2);
    this.data[12] = (ch[6] >> 6) | (ch[7] << 5);
    this.data[13] = ch[7] >> 3;

    this.data[14] = ch[8];
    this.data[15] = (ch[8] >> 8) | (ch[9] << 3);
    this.data[16] = (ch[9] >> 5) | (ch[10] << 6);
    this.data[17] = ch[10] >> 2;
    this.data[18] = (ch[10] >> 10) | (ch[11] << 1);
    this.data[19] = (ch[11] >> 7) | (ch[12] << 4);
    this.data[20] = (ch[12] >> 4) | (ch[13] << 7);
    this.data[21] = ch[13] >> 1;
    this.data[22] = (ch[13] >> 9) | (ch[14] << 2);
    this.data[23] = (ch[14] >> 6) | (ch[15] << 5);
    this.data[24] = ch[15] >> 3;
    this.data[25] = this.crc8();
  }

  async open() {
    try {
      const port = await navigator.serial.requestPort();
      await port.open(this.options);

      this.port = port;
      this.isOpened = true;

      return this.port.getInfo();
    } catch (error) {
      //console.error(error);
      //throw error;
    }
  }

  async close() {
    await this.port.close();
    this.isOpened = false;
  }

  async write() {
    try {
      const writer = this.port.writable.getWriter();
      //const encoded = this.data; //this.encoder.encode(this.data);
      //console.log(encoded);
      await writer.write(this.data);
      writer.releaseLock();
    } catch (error) {}
  }

  async read() {}

  #setupListeners() {}

  tick_to_us(tick) {
    return ((tick - 992) * 5) / 8 + 1500;
  }

  us_to_tick(us) {
    return ((us - 1500) * 8) / 5 + 992;
  }
}
