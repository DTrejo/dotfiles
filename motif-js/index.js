/*
This is a node program which uses canvas to generate a
social media image with the given title, author, author avatar image, and background image.
*/

const { createCanvas, loadImage } = require("canvas")
const fs = require("fs")
const path = require("path")
const sh = require("shelljs")

let DEBUG = process.env.DEBUG
// DEBUG = true

const generateSocialMediaImage = async ({
  title,
  author,
  domain,
  authorAvatar,
  backgroundImage,
}) => {
  // Load the background image
  const background = await loadImage(backgroundImage)

  const canvas = createCanvas(background.width, background.height)
  // p-3 color space does not seem to work in node-canvas :(
  const ctx = canvas.getContext("2d", { colorSpace: "display-p3" })
  ctx.preserveDrawingBuffer = true
  ctx.imageSmoothingEnabled = false
  ctx.imageSmoothingQuality = "high"
  // ctx.colorSpace = "display-p3"
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

  const padding = 16 * 4
  // Write article title
  const fontWeight = "600"
  const fontFamily = `'Avenir Next', sans-serif`
  ctx.font = `${fontWeight} 3rem ${fontFamily}`
  const white = "#dcd9d6"
  ctx.fillStyle = `color: ${white}`
  ctx.fillStyle = white
  ctx.fillText(
    title,
    padding,
    background.height * 0.33,
    background.width - padding * 2
  )

  const secondLineHeight = background.height * 0.75
  ctx.font = `${fontWeight} 2rem ${fontFamily}`
  const avatarDiameter = 16 * 13
  ctx.fillText(`by ${author}`, avatarDiameter + padding * 2, secondLineHeight)
  ctx.fillText(
    domain,
    background.width - ctx.measureText(domain).width - padding,
    secondLineHeight
  )

  // Draw cat with lime helmet
  loadImage(authorAvatar).then((image) => {
    const height = avatarDiameter

    // Set the dimensions for the image and the circle
    const x = padding // x-coordinate of the circle center
    const y = secondLineHeight - avatarDiameter / 2 // y-coordinate of the circle center
    const radius = height / 2 // radius of the circle

    // Start drawing the path for the circular clipping region
    ctx.beginPath()
    ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2)
    ctx.closePath()

    // Clip the area to the circular region
    ctx.clip()

    // Draw the image within the clipped region
    ctx.drawImage(image, x, y, radius * 2, radius * 2)

    generateJPEG(canvas)
    // const src = canvas.toDataURL()
    if (DEBUG) {
      html = generateHtml({ src: "output.jpg", fontWeight, fontFamily })
      fs.writeFileSync("output.html", html)
      sh.exec("open output.html")
    }
  })
}

const generateJPEG = (canvas) => {
  const out = fs.createWriteStream(path.join(__dirname, "output.jpg"))
  const stream = canvas.createJPEGStream({
    quality: 0.95,
    chromaSubsampling: false,
    progressive: true,
  })
  stream.pipe(out)
  if (DEBUG) {
    out.on("finish", () => console.log("The image was created successfully!"))
  }
}

const generateHtml = ({ src, fontWeight, fontFamily }) => `
<body style="margin: 0 auto; margin-top: 1.5rem; padding: 0 3rem; background: #111;">
<h1 style="color: #ccc; font: ${fontWeight} 2rem ${fontFamily}">motif-js • social image generator</h1>
<img src="${src}" style="box-shadow: 0px 0px 1px rgba(255,255,255, .7); x-zoom: .5;"/>
</body>
`

// const generateWebp = (canvas) => {
//   const buf = Buffer.from(src.split(",")[1], "base64")
//   sharp(buf)
//     .webp()
//     .toFile("./output.webp", (err, info) => {
//       if (err) {
//         console.error("generateWebp:", err)
//       } else {
//         console.log("generateWebp:", info)
//       }
//     })
// }

// backgroundURL = "https://images.unsplash.com/photo-1515951834549-4172b316de7e?fit=crop&h=630&w=1200&txt=%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20By%20David%20Trejo%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20DTrejo.com&txtclr=fff&txtsize=40&txtfont=Avenir%20Next%20Demi%20Bold&txtalign=left%2Cbottom&txtpad=150"
if (DEBUG) {
  generateSocialMediaImage({
    title: "How to buy and cook steak",
    author: "David Trejo",
    domain: "DTrejo.com",
    authorAvatar: "images/dtrejo.jpg",
    // authorAvatar: "images/lime-cat.jpg",
    backgroundImage: "images/background.jpeg",
  })
}

module.exports = generateSocialMediaImage
