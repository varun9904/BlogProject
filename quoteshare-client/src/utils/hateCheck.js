import axios from "axios";

export const checkHateSpeech = async (text) => {
  try {
    const res = await axios.post("http://localhost:8000/predict", {
      text,
    });
    return res.data; // { cleaned_text, prediction, probabilities }
  } catch (err) {
    console.error("Error checking hate speech:", err);
    return null;
  }
};
