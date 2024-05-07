<template>
  <div>
    <q-btn color="primary" label="Open" @click="openPort" />
    <q-btn color="primary" label="Reset" @click="reset" />
    <p></p>
    <div class="row">
      <div class="col-1">Pitch {{ pitch }}</div>
      <div class="col-1">
        <q-btn color="primary" label="^" @click="pitch = value_up(pitch, 1)" />
      </div>
      <div class="col-1">3</div>
      <div class="col-1">Thr {{ throttle }}</div>
      <div class="col-1">
        <q-btn
          color="primary"
          label="^"
          @click="throttle = value_up(throttle, 2)"
        />
      </div>
      <div class="col-1">6</div>
    </div>
    <div class="row">
      <div class="col-1">
        <q-btn color="primary" label="<" @click="roll = value_down(roll, 0)" />
      </div>
      <div class="col-1">2</div>
      <div class="col-1">
        <q-btn color="primary" label=">" @click="roll = value_up(roll, 0)" />
      </div>
      <div class="col-1">
        <q-btn color="primary" label="<" @click="yaw = value_down(yaw, 3)" />
      </div>
      <div class="col-1">5</div>
      <div class="col-1">
        <q-btn color="primary" label=">" @click="yaw = value_up(yaw, 3)" />
      </div>
    </div>
    <div class="row">
      <div class="col-1">Roll {{ roll }}</div>
      <div class="col-1">
        <q-btn
          color="primary"
          label="v"
          @click="pitch = value_down(pitch, 1)"
        />
      </div>
      <div class="col-1">3</div>
      <div class="col-1">Yaw {{ yaw }}</div>
      <div class="col-1">
        <q-btn
          color="primary"
          label="v"
          @click="throttle = value_down(throttle, 2)"
        />
      </div>
      <div class="col-1">6</div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    interval: null,
    min: 900,
    max: 2100,
    pitch: 1500,
    roll: 1500,
    yaw: 1500,
    throttle: 900,
  }),
  methods: {
    async openPort() {
      if (this.$serialPort.isOpened) {
        clearInterval(this.interval);
        console.log(await this.$serialPort.close());
      } else {
        console.log(await this.$serialPort.open());
        if (this.$serialPort.isOpened) {
          this.reset();
          this.interval = setInterval(() => {
            this.$serialPort.write();
          }, 300);
        }
      }
    },
    value_up(value, channel) {
      value += 100;
      if (value > this.max) value = this.max;
      this.$serialPort.channels[channel] = this.$serialPort.us_to_tick(value);
      this.$serialPort.pack(this.$serialPort.channels);
      return value;
    },
    value_down(value, channel) {
      value -= 100;
      if (value < this.min) value = this.min;
      this.$serialPort.channels[channel] = this.$serialPort.us_to_tick(value);
      this.$serialPort.pack(this.$serialPort.channels);
      return value;
    },
    reset() {
      this.roll = 1500;
      this.pitch = 1500;
      this.yaw = 1500;
      this.throttle = 900;
      this.$serialPort.channels[0] = this.$serialPort.us_to_tick(this.roll);
      this.$serialPort.channels[1] = this.$serialPort.us_to_tick(this.pitch);
      this.$serialPort.channels[3] = this.$serialPort.us_to_tick(this.yaw);
      this.$serialPort.channels[2] = this.$serialPort.us_to_tick(this.throttle);
      this.$serialPort.pack(this.$serialPort.channels);
    },
  },
};
</script>
