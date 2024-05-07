import SerialPort from "~/assets/serial";

export default defineNuxtPlugin((nuxtApp) => {
  const conf = new SerialPort({ baudRate: 400000 });
  return {
    provide: {
      serialPort: conf,
    },
  };
});
