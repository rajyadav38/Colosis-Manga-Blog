const axios = require("axios");

const generateImage = async (prompt) => {
  try {
    console.log("Calling HuggingFace...");
    const response = await axios({
      url: "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-dev",
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
    console.log("Response received.");

    return Buffer.from(response.data);
  } catch (error) {
    console.log("Flux Error:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = generateImage;
