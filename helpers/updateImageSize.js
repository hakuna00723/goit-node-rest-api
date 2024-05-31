import Jimp from "jimp";

export const updateImageSize = (imgPath) => {
  return Jimp.read(imgPath)
    .then((image) => {
      image.resize(250, 250).writeAsync(imgPath);
    })
    .catch((err) => {
      console.log(err);
    });
};
