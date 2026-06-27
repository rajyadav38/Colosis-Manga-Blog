const Replicate = require("replicate");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const generateImage = async (prompt) => {
  try {
    console.log("Generating image with Replicate...");

    const output = await replicate.run("black-forest-labs/flux-schnell", {
      input: {
        prompt,
        aspect_ratio: "2:3",
        output_format: "jpg",
        num_outputs: 1,
      },
    });

    console.log("Replicate Output:", output);

    return output[0];
  } catch (error) {
    console.log("Replicate Error:", error);
    throw error;
  }
};

module.exports = generateImage;
