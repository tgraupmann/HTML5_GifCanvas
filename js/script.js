function drawGif(frames) {

  var frameId = 0;

  var drawFrame = function () {
    let ctx = canvasImage.getContext("2d");

    let frame = frames[frameId];

    let dims = frame.dims

    canvasImage.width = dims.width;
    canvasImage.height = dims.height;

    if (frame.disposalType === 2) {
      ctx.clearRect(0, 0, dims.width, dims.height)
    }

    if (!frame.imageData) {
      frame.imageData = ctx.createImageData(dims.width, dims.height);
      frame.imageData.data.set(frame.patch);
    }

    ctx.putImageData(frame.imageData, 0, 0);

    let ctx2 = canvasScaled.getContext("2d");
    ctx2.drawImage(canvasImage, 0, 0, canvasScaled.width, canvasScaled.height);

    frameId = (frameId + 1) % frames.length;

    setTimeout(drawFrame, frame.delay);
  };

  drawFrame();
}

function downloadGif() {
  console.log('Download', imgGif.src);

  let oReq = new XMLHttpRequest();
  oReq.open("GET", imgGif.src, true);
  oReq.responseType = "arraybuffer";

  oReq.onload = function (oEvent) {
    let arrayBuffer = oReq.response; // Note: not oReq.responseText
    if (arrayBuffer) {
      let gif = gifuct.parseGIF(arrayBuffer);
      let frames = gifuct.decompressFrames(gif, true);
      // do something with the frame data
      console.log('gif', gif);
      console.log('frames length', frames.length, 'delay milliseconds=', frames[0].delay);
      drawGif(frames);
    }
  };

  oReq.send(null);
}

downloadGif();
