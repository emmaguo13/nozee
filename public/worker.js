importScripts("./snarkjs.min.js");
self.addEventListener("message", async (evt) => {
  console.log("web worker recieved message");
  const [input, zkeyFastFile] = evt.data;
  console.log("🚀 ~ self.addEventListener ~ zkeyFastFile", zkeyFastFile);
  console.log("🚀 ~ self.addEventListener ~ zkeyFastFile", typeof zkeyFastFile);
  console.log("🚀 ~ self.addEventListener ~ input", input);
  console.log("🚀 ~ self.addEventListener ~ input", typeof input);
  const result = await snarkjs.groth16.fullProve(
    input,
    "/jwt.wasm",
    zkeyFastFile
  );
  postMessage(result);
});
