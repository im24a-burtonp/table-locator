# Table Locator Number

An interactive 3D table-number kiosk inspired by the dine-in ordering experience at Firehouse Subs in Zürich.

<img width="300" height=auto alt="image" src="https://github.com/user-attachments/assets/28a7b717-59fe-4b78-abcc-e9113decc5c6" />

Feel free to test it out yourself [here](https://im24a-burtonp.github.io/table-locator/)!


## The Story

Before this project, I had only made small game demos with Three.js. I wanted to create something more professional, so while ordering lunch at Firehouse Subs, I noticed their table-number input screen and thought I could improve the experience.

I instantly snapped a picture of the screen and of the table marker that I could use as references later.

<img width="200" height=auto alt="C4FB9DCB-46B0-4E39-8BE4-847734CD9C6D" src="https://github.com/user-attachments/assets/28afd137-8d59-4685-beec-39df88e26d4b" />
<img width="200" height=auto alt="IMG_2668" src="https://github.com/user-attachments/assets/32fdbdd9-106c-42ed-90ee-c8992d1c6daa" />

I started by modeling the Table-Locator in Blender. My main priority was keeping it lightweight, so I used a single 1K texture and kept the model to roughly 300 vertices. Once exported, the complete model was only around 100 KB, including its texture.

<img width="400" alt="Table-Locator model in Blender" src="https://www.paul-burton.dev/images/blender.image.png" />

Next, I recreated the input screen using HTML and CSS. I made a few design changes so the entered number could be shown directly on the 3D model instead of using some of the original screen's elements.

<img width="250" alt="Recreated table-number input screen" src="https://www.paul-burton.dev/images/new-screen-no-model.png" />

Finally, I integrated the model using Three.js and `GLTFLoader`. The biggest challenge was displaying the user's input on the model. I solved this by drawing the number onto an HTML canvas, converting the canvas into a Three.js texture, and layering it over the model's existing graphics surface.

You can try the finished project [here](https://im24a-burtonp.github.io/table-locator/).

## How It Works

The project uses [Three.js](https://threejs.org/) to create a WebGL scene containing:

- A perspective camera
- Multiple rectangular area lights
- A GLB 3D model loaded with `GLTFLoader`
- Responsive renderer resizing
- A transparent number overlay mapped onto the model

When the user presses a keypad button, the entered number is drawn onto an HTML canvas. That canvas is converted into a Three.js `CanvasTexture`, which is displayed on the model as a live graphic.

This approach allows the number to update dynamically without modifying the original 3D model.

## Built With

- HTML
- CSS
- JavaScript
- Three.js
- GLB / glTF 3D model format

## Running Locally

Because the project uses JavaScript modules and loads a 3D asset, it should be served through a local web server.

For example:

```bash
npx serve .
```
