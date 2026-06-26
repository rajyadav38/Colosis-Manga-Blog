const axios = require("axios");

const generateImage = async (prompt) => {
  try {
    console.log("Calling HuggingFace...");

    const response = await axios({
      url: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      data: {
        inputs: prompt,
      },
      responseType: "arraybuffer",
    });

    return Buffer.from(response.data);
  } catch (error) {
    console.log("HF Error:", error.response?.data?.toString() || error.message);

    throw error;
  }
};

module.exports = generateImage;
