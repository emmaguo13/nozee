import localforage from "localforage";

const LOAD_URL = "https://d27ahxc61uj811.cloudfront.net/";
const ZKEY_NAME = "setMembership_final.zkey";

async function downloadFromFilename(filename: string) {
  const link = LOAD_URL + filename;
  try {
    const zkeyResp = await fetch(link, {
      method: "GET",
    });
    console.log("file contents: ", zkeyResp);
    const zkeyBuff = await zkeyResp.arrayBuffer();
    await localforage.setItem(filename, zkeyBuff);
    console.log(`Storage of ${filename} successful!`);
  } catch (e) {
    console.log(
      `Storage of ${filename} unsuccessful, make sure IndexedDB is enabled in your browser.`
    );
  }
}

export const downloadProofFiles = async function (filename: string) {
  const item = await localforage.getItem(`${filename}`);
  if (item) {
    return item;
  }
  return await downloadFromFilename(`${filename}`);
};

export const downloadZKey = async () => {
  await downloadProofFiles(ZKEY_NAME);
};
