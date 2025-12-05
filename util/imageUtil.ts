
export default class ImageUtil {

  static applyMask(initialImage, r, g, b, a = 1) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }
    canvas.width = initialImage.width;
    canvas.height = initialImage.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(initialImage, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.floor(r*a + data[i]*(1-a));   // Red
      data[i + 1] = Math.floor(g*a + data[i+1]*(1-a)); // Green
      data[i + 2] = Math.floor(b*a + data[i+2]*(1-a)); // Blue
    }
    ctx.putImageData(imageData, 0, 0);
    const newImage = new Image();
    newImage.src = canvas.toDataURL();
    return newImage;
  }

  static subImage(initialImage, left, top, width, height) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    if (!ctx) {
      throw 'No ctx available';
    }
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(initialImage, left, top, width, height, 0, 0, width, height);
    const newImage = new Image();
    newImage.src = canvas.toDataURL();
    return newImage;
  }

  static distortXFreq(initialImage, amplitude, wavelength) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }
    canvas.width = initialImage.width;
    canvas.height = initialImage.height;
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(initialImage, 0, 0);
  
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const output = new Uint8ClampedArray(data.length); // Separate buffer
  
    for (let i = 0; i < canvas.height; i++) {
      const shiftAmount = Math.trunc(amplitude * Math.sin(i / wavelength));
  
      for (let j = 0; j < canvas.width; j++) {
        const sourceX = j + shiftAmount;
        const destIdx = 4 * (j + i * canvas.width);
  
        if (sourceX < 0 || sourceX >= canvas.width) {
          output[destIdx] = 0;
          output[destIdx + 1] = 0;
          output[destIdx + 2] = 0;
          output[destIdx + 3] = 0;
        } else {
          const srcIdx = 4 * (sourceX + i * canvas.width);
          output[destIdx] = data[srcIdx];
          output[destIdx + 1] = data[srcIdx + 1];
          output[destIdx + 2] = data[srcIdx + 2];
          output[destIdx + 3] = data[srcIdx + 3];
        }
      }
    }
  
    imageData.data.set(output);
    ctx.putImageData(imageData, 0, 0);
  
    const newImage = new Image();
    newImage.src = canvas.toDataURL();
    return newImage;
  }

}